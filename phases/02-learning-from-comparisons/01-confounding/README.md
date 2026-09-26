# 3. When treatment selection changes the comparison

**Takeaway:** a larger study can estimate a confounded comparison more precisely. It does not remove the systematic difference between the groups.

Prerequisite: [A randomized comparison](../../01-causal-questions/02-randomization/README.md). [Course contents](../../../README.md)

## The question

A treatment improves every patient's day-12 health by 12 units. Patients with more severe illness are more likely to receive it. Could the treated group nevertheless end up less healthy than the untreated group?

We want the effect of treating everyone versus treating nobody in a population with equal numbers of low- and high-severity patients. We observe treatment and day-12 health for each person, plus their severity measured before treatment.

## Predict

If the raw comparison makes treatment look harmful, will recruiting ten times as many patients fix its direction? What if we compare treated and untreated patients within each severity group first?

## Experiment

Open [A common cause](https://kirilklein.github.io/causal-sandbox/?lesson=confounding).

1. Follow how the common cause affects both treatment assignment and outcome.
2. Predict the observed treatment-group difference before revealing the result.
3. Open [Repeated studies: confounding bias](https://kirilklein.github.io/causal-sandbox/?lesson=confounding#repeated-studies).
4. Compare where the estimates cluster with the simulator's true effect. Explain why variation between estimates and systematic error are different problems.

## Explain

Severity does two jobs: it influences who receives treatment, and it influences health even without treatment. This makes the groups differ in their underlying prognosis.

The raw difference mixes treatment benefit with that prognostic difference. Random sampling error varies between studies. Confounding can keep pushing the comparison in the same direction.

Our Python lab simplifies severity to two groups. Half the population has low severity and half has high severity. Their mean untreated health is 70 and 30, respectively. Treatment adds 12 in both groups. Exactly 20% of the low-severity group and 80% of the high-severity group receive treatment, chosen randomly within severity.

Consequently, the treated group is 80% high severity, while the untreated group is only 20% high severity. Averaged over repeated assignments:

```text
Treated mean:   0.2 × (70 + 12) + 0.8 × (30 + 12) = 50
Untreated mean: 0.8 × 70        + 0.2 × 30        = 62
Raw difference: 50 − 62 = −12
```

The true effect is +12. The raw comparison's bias for that target is therefore `−12 − (+12) = −24` health units.

Compare within severity instead, then average those differences using the target population's severity proportions:

```text
Adjusted comparison = 0.5 × low-severity difference
                    + 0.5 × high-severity difference
```

This is a simple form of **standardization**. It puts both comparisons on the same severity distribution. Its repeated-assignment average is +12 in this model because assignment is random within severity, both treatments occur in both strata, outcomes are consistent with the treatment definition, and there is no interference.

Measuring severity before treatment is not, by itself, enough to justify adjustment. Here we know the mechanism. In real studies, deciding whether a variable is a confounder requires a causal argument.

## Implement

```bash
python3 phases/02-learning-from-comparisons/01-confounding/code/simulation.py
```

The code keeps individual prognostic differences within each severity group. It repeatedly assigns treatment within a fixed population, using the unequal treatment proportions above. The analysis functions see only severity, treatment, and observed health.

For n=100 and n=1,000, inspect the repeated-study means and SDs. The raw mean stays near −12; its SD gets smaller. The standardized mean stays near +12. Neither estimate has to equal its repeated-assignment average in one study.

```bash
python3 phases/02-learning-from-comparisons/01-confounding/code/simulation.py --seed 73 --repetitions 4000
```

Read `standardized_difference()`. It raises an error if a severity group lacks treated or untreated observations. A missing comparison cannot be filled with zero or with simulator truth.

## Challenge

Complete the [exercises](exercises.md) before checking the [solutions](solutions.md). Keep a short argument explaining the source of bias, why more data does not fix it, and which assumptions support adjustment here.

**Limit:** the lab deliberately makes severity sufficient to control confounding. It does not show that recorded severity is sufficient in a real study. More flexible prediction or a balanced measured variable cannot establish the absence of hidden confounding.

Theory: Hernán and Robins, [*Causal Inference: What If*, chapter 3](https://miguelhernan.org/whatifbook).

**Continue in the browser:** [How uncertain is this estimate?](https://kirilklein.github.io/causal-sandbox/?lesson=uncertainty). Its companion chapter is not written yet. [See the remaining curriculum](../../../CURRICULUM.md).
