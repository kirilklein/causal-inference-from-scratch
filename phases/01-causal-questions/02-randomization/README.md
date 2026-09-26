# 2. A randomized comparison

**Takeaway:** random assignment makes the difference in group means correct on average over assignments. A single randomized study can still be imbalanced.

Prerequisite: [What if?](../01-what-if/README.md). [Course contents](../../../README.md)

## The question

We still want the average effect on day-12 health. We still cannot observe both potential outcomes for one person. Can the treatment-assignment mechanism nevertheless give us a useful comparison?

Suppose we choose exactly half the participants uniformly at random to receive treatment. Each person has the same chance of being selected, regardless of severity or potential outcomes.

## Predict

Will the treated and untreated groups have exactly equal severity in every study? Will their observed difference equal +12 every time? What should happen if we repeat the assignment many times?

## Experiment

Open [A randomized experiment](https://kirilklein.github.io/causal-sandbox/?lesson=randomization).

1. Make the lesson's prediction before revealing the estimate.
2. Open [Repeated studies](https://kirilklein.github.io/causal-sandbox/?lesson=randomization#repeated-studies).
3. Compare the spread of estimates with where the estimates are centered.
4. Explain why a result above or below the true effect is compatible with successful randomization.

The browser and Python lab use different small teaching setups. Focus on the relationship between assignment, variation, and the average effect.

## Explain

Randomization prevents systematic treatment selection according to prognosis. It does not force the realized groups to have identical characteristics.

In our experiment, exactly half the fixed population is treated. Averaged over all possible assignments, the treated group's observed mean equals the population mean of `Y(1)`. The untreated group's observed mean similarly equals the population mean of `Y(0)`. Their difference therefore has expectation equal to the finite-population ATE.

The gap in one particular study is an **estimate**. Its variation over repeated assignments is **randomization variability**. This does not require changing anyone's potential outcomes.

Randomization addresses assignment. Interpreting this as an effect of the specified treatment still requires that treatment is well defined, observed outcomes correspond to the assigned treatment in this model, and there is no interference. Nonadherence, missing outcomes, and generalization to other populations require further reasoning.

## Implement

```bash
python3 phases/01-causal-questions/02-randomization/code/simulation.py
```

The lab constructs a fixed population with severity levels 0–9 and an individual effect of +12, then randomly assigns exactly half to treatment. The default repeats this 2,000 times for populations of 20 and 200 people.

Read `assign()`: each repetition changes the treated indices. Read `repeat()`: the population remains fixed within each repeated-assignment experiment. The analysis receives only treatment and observed health.

Look for three results:

- A single estimate need not equal +12.
- The mean estimate over many assignments is close to +12.
- The standard deviation of estimates is smaller in the larger, similarly composed population.

Run a different sequence of assignments:

```bash
python3 phases/01-causal-questions/02-randomization/code/simulation.py --seed 73 --repetitions 4000
```

The reported **SD** describes variability between study estimates. The **Monte Carlo SE** is `SD / sqrt(repetitions)` and describes uncertainty in our simulated average. More repetitions improve that simulated summary; they do not make any individual study larger.

## Challenge

Complete the [exercises](exercises.md) before reading the [solutions](solutions.md). Keep a short explanation distinguishing one estimate, its repeated-assignment average, and its variability.

**Limit:** this model randomizes treatment in a fixed population with complete adherence and observation. It does not automatically represent random sampling from a wider population or recover individual treatment effects.

Theory: Hernán and Robins, [*Causal Inference: What If*, chapter 2](https://miguelhernan.org/whatifbook).

**Next:** [When treatment selection changes the comparison](../../02-learning-from-comparisons/01-confounding/README.md).
