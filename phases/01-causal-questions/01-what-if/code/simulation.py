"""Separate simulator potential outcomes from the analyst's observed records."""

from statistics import mean


def potential_outcomes():
    return [(78 - 48 * severity / 9, 90 - 48 * severity / 9) for severity in range(10)]


def observe(outcomes, treated_indices):
    return [
        (int(i in treated_indices), pair[int(i in treated_indices)])
        for i, pair in enumerate(outcomes)
    ]


def difference_in_means(records):
    treated = [y for a, y in records if a == 1]
    untreated = [y for a, y in records if a == 0]
    if not treated or not untreated:
        raise ValueError("Both treatment groups are required for this comparison.")
    return mean(treated) - mean(untreated)


def main():
    outcomes = potential_outcomes()
    records = observe(outcomes, {2, 6, 7, 8, 9})
    print(f"Simulator mean under no treatment: {mean(y0 for y0, _ in outcomes):.2f}")
    print(f"Simulator mean under treatment:    {mean(y1 for _, y1 in outcomes):.2f}")
    print(
        f"Simulator average effect:         {mean(y1 - y0 for y0, y1 in outcomes):+.2f}"
    )
    print(f"Observed treated-minus-untreated:  {difference_in_means(records):+.2f}")


if __name__ == "__main__":
    main()
