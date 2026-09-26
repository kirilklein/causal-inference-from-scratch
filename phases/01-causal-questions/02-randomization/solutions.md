# Solutions: A randomized comparison

1. No. Chance imbalance produces variation even under correct randomization. Unbiasedness concerns an average over assignments, not exact equality in one study.
2. Increasing study size typically improves the precision of an individual estimate in this setup. Increasing repetitions improves how well the simulation approximates the distribution of estimates. It does not change the variability inherent in a study of fixed size.
3. Under complete random assignment, each group represents its corresponding potential outcomes in expectation over assignments. We estimate population averages by group means; we do not reconstruct each person's unobserved outcome.
4. The effect of being offered tutoring, under the study's other assumptions. Attendance is not itself randomized. An effect of attendance requires additional assumptions or design information.
5. The repeated-assignment means should be near +12, with lower SD at n=200 than n=20. Finite Monte Carlo means and SDs differ by seed. The mean's reported Monte Carlo SE helps assess simulation noise; it is not the standard error for a single study's treatment estimate.

An adequate explanation distinguishes assignment balance in expectation from exact balance in a realized study.

[Back to the lesson](README.md) · [Next chapter](../../02-learning-from-comparisons/01-confounding/README.md)
