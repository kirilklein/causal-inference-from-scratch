# 1. What if?

**Takeaway:** a causal effect compares the same people under different treatment choices. Observed treatment groups usually contain different people.

Prerequisites: none. [Course contents](../../../README.md)

## The question

A patient receives treatment and their health improves. Did the treatment help? Improvement alone cannot answer that. We need to compare their health at the same follow-up time with what it would have been without treatment.

Our question is: **among these ten fictional patients, how much would treatment change average health at day 12, compared with no treatment?** Higher scores mean better health.

## Predict

Imagine knowing each patient's health under both choices. Could you calculate an average treatment effect? Now hide the outcome under the choice each patient did not receive. What information has disappeared?

Write a sentence before opening the experiment.

## Experiment

Open [What if? in Causal Sandbox](https://kirilklein.github.io/causal-sandbox/?lesson=what-if).

1. Follow the observed patient trajectory to the follow-up time.
2. Reveal the alternative trajectory. Compare outcomes at the **same time**, rather than comparing before with after.
3. Continue to the population view. Compare the same patients under treatment and under no treatment.
4. Continue until only factual outcomes remain. Explain why the two complete population averages are now unknown.

The simulator can show alternatives because it generated them. A real dataset does not gain that ability from drawing two curves.

## Explain

Write a person's health under treatment as `Y(1)` and their health without treatment as `Y(0)`. These are **potential outcomes** for the same person and time horizon. Their individual effect is `Y(1) − Y(0)`.

The average treatment effect in our ten-person population is:

```text
ATE = average of [Y(1) − Y(0)] across all ten people
    = average of Y(1) − average of Y(0) across those same people
```

Treatment received is `A`, either 1 or 0. We observe `Y(1)` if `A = 1` and `Y(0)` if `A = 0`. That connection assumes consistency: the treatment actually received corresponds to the treatment choice we defined. We also assume one patient's treatment does not change another patient's outcome.

The treated-group average and untreated-group average use different subsets. Subtracting them gives an observed comparison. Whether it estimates the ATE depends on how those groups were formed and on the assumptions we can justify.

## Implement

From the repository root:

```bash
python3 phases/01-causal-questions/01-what-if/code/simulation.py
```

The script reproduces the opening's simple day-12 potential outcomes: ten severity levels, an untreated average of 54, a treated average of 66, and an effect of +12 for every patient. It uses an illustrative assignment in which higher-severity patients are more likely to be treated.

Expected output:

```text
Simulator mean under no treatment: 54.00
Simulator mean under treatment:    66.00
Simulator average effect:         +12.00
Observed treated-minus-untreated:  -8.27
```

Read `observe()`: it removes each unobserved outcome. The `difference_in_means()` function receives only treatment and observed health. It cannot consult the hidden alternative.

Change which five patients are treated. The observed comparison changes, while the potential outcomes and ATE stay fixed. That difference between changing a treatment effect and changing the composition of the groups is the bridge to the next chapters.

## Challenge

Complete the [exercises](exercises.md), then compare your reasoning with the [solutions](solutions.md). Your artifact is a short statement of the causal question and the missing comparison.

**Limit:** the constant +12 effect is a teaching choice. Real effects may differ between people, and individual counterfactuals are generally unobserved. This lab calculates simulator truth; it does not recover missing outcomes from real data.

Theory: Hernán and Robins, [*Causal Inference: What If*, chapter 1](https://miguelhernan.org/whatifbook). Simulation provenance: Causal Sandbox's [opening and trajectory model documentation](https://github.com/kirilklein/causal-sandbox/blob/57fd76c6a33e5610bdd7524aecf7da3ee06385ac/docs/education.md#opening-question-and-patient-trajectory-story).

**Next:** [A randomized comparison](../02-randomization/README.md).
