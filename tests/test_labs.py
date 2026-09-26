import importlib.util
import itertools
import random
import unittest
from math import sqrt
from pathlib import Path
from statistics import mean, stdev

ROOT = Path(__file__).resolve().parents[1]


def load_lab(path):
    spec = importlib.util.spec_from_file_location(
        "lab", ROOT / path / "code/simulation.py"
    )
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


what_if = load_lab("phases/01-causal-questions/01-what-if")
randomization = load_lab("phases/01-causal-questions/02-randomization")
confounding = load_lab("phases/02-learning-from-comparisons/01-confounding")


class PotentialOutcomeTests(unittest.TestCase):
    def test_opening_matches_documented_population(self):
        outcomes = what_if.potential_outcomes()
        self.assertAlmostEqual(mean(y0 for y0, _ in outcomes), 54)
        self.assertAlmostEqual(mean(y1 for _, y1 in outcomes), 66)
        for y0, y1 in outcomes:
            self.assertAlmostEqual(y1 - y0, 12)

    def test_factual_records_contain_only_assigned_outcome(self):
        outcomes = what_if.potential_outcomes()
        records = what_if.observe(outcomes, {2, 6, 7, 8, 9})
        for pair, (a, y) in zip(outcomes, records):
            self.assertEqual(y, pair[a])
        self.assertAlmostEqual(what_if.difference_in_means(records), -8.2666666667)
        alternative = what_if.observe(outcomes, {0, 1, 2, 3, 4})
        self.assertAlmostEqual(what_if.difference_in_means(alternative), 38.6666666667)

    def test_missing_group_is_not_a_zero_mean(self):
        with self.assertRaises(ValueError):
            what_if.difference_in_means([(1, 70), (1, 80)])


class RandomizationTests(unittest.TestCase):
    def test_exact_expectation_over_all_assignments(self):
        outcomes = randomization.population(10)
        estimates = []
        for treated in itertools.combinations(range(10), 5):
            records = [
                (int(i in treated), pair[int(i in treated)])
                for i, pair in enumerate(outcomes)
            ]
            estimates.append(randomization.difference_in_means(records))
        self.assertAlmostEqual(mean(estimates), 12)
        self.assertGreater(stdev(estimates), 0)

    def test_complete_randomization_and_reproducibility(self):
        outcomes = randomization.population(20)
        records = randomization.assign(outcomes, random.Random(7))
        self.assertEqual(sum(a for a, _ in records), 10)
        self.assertEqual(records, randomization.assign(outcomes, random.Random(7)))
        self.assertNotEqual(records, randomization.assign(outcomes, random.Random(8)))
        for pair, (a, y) in zip(outcomes, records):
            self.assertEqual(y, pair[a])

    def test_repeated_assignments_match_expectation_and_precision(self):
        small = randomization.repeat(20, 2000, 73)
        large = randomization.repeat(200, 2000, 73)
        for estimates in (small, large):
            self.assertLess(
                abs(mean(estimates) - 12), 5 * stdev(estimates) / sqrt(2000)
            )
        self.assertLess(stdev(large), stdev(small) / 2)

    def test_invalid_design_is_rejected(self):
        with self.assertRaises(ValueError):
            randomization.population(11)
        with self.assertRaises(ValueError):
            randomization.repeat(20, 1, 1)
        with self.assertRaises(ValueError):
            randomization.difference_in_means([])


class ConfoundingTests(unittest.TestCase):
    def test_exact_bias_and_adjustment_over_all_small_assignments(self):
        people = confounding.population(10)
        raw, adjusted = [], []
        for low in itertools.combinations(range(5), 1):
            for high in itertools.combinations(range(5, 10), 4):
                treated = set(low + high)
                records = [
                    (c, int(i in treated), y1 if i in treated else y0)
                    for i, (c, y0, y1) in enumerate(people)
                ]
                raw.append(confounding.difference_in_means(records))
                adjusted.append(confounding.standardized_difference(records))
        self.assertAlmostEqual(mean(raw), -12)
        self.assertAlmostEqual(mean(adjusted), 12)
        self.assertAlmostEqual(mean(y1 - y0 for _, y0, y1 in people), 12)

    def test_assignment_proportions_and_factual_outcomes(self):
        people = confounding.population(100)
        records = confounding.assign(people, random.Random(7))
        self.assertEqual(sum(a for c, a, _ in records if c == 0), 10)
        self.assertEqual(sum(a for c, a, _ in records if c == 1), 40)
        for (c, y0, y1), (observed_c, a, y) in zip(people, records):
            self.assertEqual(observed_c, c)
            self.assertEqual(y, y1 if a else y0)

    def test_standardization_uses_target_mix_when_effects_differ(self):
        # Low severity: 4 people, effect 2. High severity: 2 people, effect 10.
        # Target ATE = (4 * 2 + 2 * 10) / 6, not the unweighted stratum mean 6.
        records = [
            (0, 0, 10),
            (0, 0, 10),
            (0, 0, 10),
            (0, 1, 12),
            (1, 0, 20),
            (1, 1, 30),
        ]
        self.assertAlmostEqual(confounding.standardized_difference(records), 28 / 6)

    def test_more_people_reduce_spread_without_removing_raw_bias(self):
        small_raw, _ = confounding.repeat(100, 1000, 73)
        large_raw, large_adjusted = confounding.repeat(1000, 1000, 73)
        self.assertLess(stdev(large_raw), stdev(small_raw) / 2)
        self.assertLess(abs(mean(large_raw) + 12), 5 * stdev(large_raw) / sqrt(1000))
        self.assertLess(
            abs(mean(large_adjusted) - 12), 5 * stdev(large_adjusted) / sqrt(1000)
        )

    def test_unsupported_stratum_cannot_be_silently_filled(self):
        with self.assertRaises(ValueError):
            confounding.standardized_difference([(0, 0, 70), (0, 1, 82), (1, 1, 42)])
        with self.assertRaises(ValueError):
            confounding.standardized_difference([])
        with self.assertRaises(ValueError):
            confounding.population(11)


if __name__ == "__main__":
    unittest.main()
