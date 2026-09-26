# Solutions: Confounding

1. More severely ill people are more likely to be treated and would have worse health without treatment. The prognostic difference between groups can outweigh the treatment benefit in the raw comparison.
2. Bias is estimate expectation minus target: `−12 − 12 = −24`. Smaller SD makes the raw estimator more concentrated around a systematically wrong target value. It does not reduce this bias.
3. We asked about the effect in the whole population. Its severity mix is half low and half high. Using the treated group's mix would target that group's severity distribution. The distinction matters when effects vary by severity; constant effects in this toy world hide that consequence numerically.
4. Treatment is randomized within severity, so assignment does not select on potential outcomes within a stratum. Observing a severity variable does not prove this conditional exchangeability in a real study. Other common causes may remain unmeasured.
5. No. There is no observed untreated comparison in the high-severity stratum. Full-population standardization needs support for both treatments in every relevant stratum. A model might extrapolate, but that would introduce additional assumptions rather than create the missing evidence.
6. No. More observations do not remove systematic selection on unmeasured motivation. Randomly assigning the program among eligible workers would address that selection at assignment, subject to the usual follow-up and treatment-definition considerations. The practical feasibility of randomization is a separate question.

An adequate explanation identifies the common cause, separates bias from variability, and names a reason the adjusted comparison is valid in this model.

[Back to the lesson](README.md) · [Continue with uncertainty in Causal Sandbox](https://kirilklein.github.io/causal-sandbox/?lesson=uncertainty)
