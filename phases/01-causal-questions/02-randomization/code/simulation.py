"""Repeat complete random assignment within a fixed fictional population."""

import argparse
import random
from math import sqrt
from statistics import mean, stdev


def population(n):
    if n < 10 or n % 10:
        raise ValueError("Population size must be a positive multiple of 10.")
    return [(78 - 48 * (i % 10) / 9, 90 - 48 * (i % 10) / 9) for i in range(n)]


def assign(outcomes, rng):
    treated = set(rng.sample(range(len(outcomes)), len(outcomes) // 2))
    return [
        (int(i in treated), pair[int(i in treated)]) for i, pair in enumerate(outcomes)
    ]


def difference_in_means(records):
    treated = [y for a, y in records if a == 1]
    untreated = [y for a, y in records if a == 0]
    if not treated or not untreated:
        raise ValueError("Both treatment groups are required for this comparison.")
    return mean(treated) - mean(untreated)


def repeat(n, repetitions, seed):
    if repetitions < 2:
        raise ValueError("At least two repetitions are needed to estimate variability.")
    outcomes = population(n)
    rng = random.Random(seed)
    return [difference_in_means(assign(outcomes, rng)) for _ in range(repetitions)]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--seed", type=int, default=4217)
    parser.add_argument("--repetitions", type=int, default=2000)
    args = parser.parse_args()
    if args.repetitions < 2:
        parser.error("--repetitions must be at least 2")

    print(
        "Simulator ATE: +12.00 health units; population fixed within each experiment."
    )
    for n in (20, 200):
        estimates = repeat(n, args.repetitions, args.seed)
        sd = stdev(estimates)
        print(
            f"n={n}: first={estimates[0]:+.2f}, mean={mean(estimates):+.2f}, "
            f"SD={sd:.2f}, Monte Carlo SE={sd / sqrt(args.repetitions):.3f}"
        )


if __name__ == "__main__":
    main()
