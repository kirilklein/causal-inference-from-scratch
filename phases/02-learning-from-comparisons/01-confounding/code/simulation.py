"""Compare raw and standardized estimates under known severity confounding."""

import argparse
import random
from math import sqrt
from statistics import mean, stdev


def population(n):
    if n < 10 or n % 10:
        raise ValueError("Population size must be a positive multiple of 10.")
    per_stratum = n // 2
    people = []
    for severity, baseline in ((0, 70), (1, 30)):
        for i in range(per_stratum):
            prognosis = -8 + 16 * i / (per_stratum - 1)
            y0 = baseline + prognosis
            people.append((severity, y0, y0 + 12))
    return people


def assign(people, rng):
    treated = set()
    for severity in (0, 1):
        indices = [i for i, person in enumerate(people) if person[0] == severity]
        count = len(indices) // 5 if severity == 0 else 4 * len(indices) // 5
        treated.update(rng.sample(indices, count))
    return [
        (severity, int(i in treated), y1 if i in treated else y0)
        for i, (severity, y0, y1) in enumerate(people)
    ]


def difference_in_means(records):
    treated = [y for _, a, y in records if a == 1]
    untreated = [y for _, a, y in records if a == 0]
    if not treated or not untreated:
        raise ValueError("Both treatment groups are required for this comparison.")
    return mean(treated) - mean(untreated)


def standardized_difference(records):
    if not records:
        raise ValueError("An observed population is required.")
    estimate = 0.0
    for severity in (0, 1):
        stratum = [row for row in records if row[0] == severity]
        # Weight by the target population mix, not either treatment group's mix.
        estimate += len(stratum) / len(records) * difference_in_means(stratum)
    return estimate


def repeat(n, repetitions, seed):
    if repetitions < 2:
        raise ValueError("At least two repetitions are needed to estimate variability.")
    people = population(n)
    rng = random.Random(seed)
    raw, adjusted = [], []
    for _ in range(repetitions):
        records = assign(people, rng)
        raw.append(difference_in_means(records))
        adjusted.append(standardized_difference(records))
    return raw, adjusted


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--seed", type=int, default=4217)
    parser.add_argument("--repetitions", type=int, default=2000)
    args = parser.parse_args()
    if args.repetitions < 2:
        parser.error("--repetitions must be at least 2")

    print("Simulator ATE: +12.00; expected raw difference: -12.00; raw bias: -24.00.")
    print("Population fixed within each experiment; assignment varies within severity.")
    for n in (100, 1000):
        raw, adjusted = repeat(n, args.repetitions, args.seed)
        for label, estimates in (("raw", raw), ("standardized", adjusted)):
            sd = stdev(estimates)
            print(
                f"n={n} {label}: mean={mean(estimates):+.2f}, SD={sd:.2f}, "
                f"Monte Carlo SE={sd / sqrt(args.repetitions):.3f}"
            )


if __name__ == "__main__":
    main()
