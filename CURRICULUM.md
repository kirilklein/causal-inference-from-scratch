# Curriculum

The core path preserves Causal Sandbox's teaching order. Optional branches deepen a concept after its prerequisites. Phase numbers organize the companion course, not the Sandbox's legacy lesson IDs.

**Available here** means a written chapter, Python lab, exercises, and solutions exist in this repository. **To adapt** means the linked browser lesson exists but the companion chapter has not been written. **Proposed** means new course work, not an available lesson.

## 1. Asking causal questions

**Outcome:** define an average treatment effect and explain why randomization can estimate it without recovering individual counterfactuals.

| Lesson | Status |
| --- | --- |
| [What if?](phases/01-causal-questions/01-what-if/README.md) | Available here |
| [A randomized comparison](phases/01-causal-questions/02-randomization/README.md) | Available here |

## 2. Learning from comparisons

**Outcome:** distinguish bias from sampling variation, then explain two ways to make treatment groups comparable under measured confounding.

| Lesson, in order | Status |
| --- | --- |
| [When treatment selection changes the comparison](phases/02-learning-from-comparisons/01-confounding/README.md) | Available here |
| [How uncertain is this estimate?](https://kirilklein.github.io/causal-sandbox/?lesson=uncertainty) | To adapt |
| [Adjustment with IPW](https://kirilklein.github.io/causal-sandbox/inverse-probability-weighting/) | To adapt |
| [Adjustment with an outcome model](https://kirilklein.github.io/causal-sandbox/?lesson=outcome-regression) | To adapt |

Optional branches: [patient trajectories](https://kirilklein.github.io/causal-sandbox/?lesson=trajectory-landscape) after confounding; [p-values](https://kirilklein.github.io/causal-sandbox/?lesson=p-values) after uncertainty; [propensity scores](https://kirilklein.github.io/causal-sandbox/?lesson=propensity-score) after IPW. All are to adapt.

The confounding chapter ends with a small within-severity comparison. It motivates adjustment; the later chapters teach the estimators and their assumptions in depth.

## 3. Choosing what to adjust for

**Outcome:** justify an adjustment choice using a causal story and a target effect, including when adjustment can introduce bias.

| Lesson, in order | Status |
| --- | --- |
| [A mediator](https://kirilklein.github.io/causal-sandbox/mediator-adjustment/) | To adapt |
| [A collider](https://kirilklein.github.io/causal-sandbox/?lesson=collider) | To adapt |
| [A hidden common cause](https://kirilklein.github.io/causal-sandbox/?lesson=hidden-confounding) | To adapt |

Practice uses the existing [Graph Lab](https://kirilklein.github.io/causal-sandbox/?sandbox=graph-lab). Optional [timing](https://kirilklein.github.io/causal-sandbox/?lesson=timing) follows these causal roles. The companion exercises will distinguish a graph assumed from subject knowledge from relationships visible in observed data.

## 4. Models and their limits

**Outcome:** separate identification assumptions, model specification, and statistical precision. Explain what double robustness does and does not protect against.

| Lesson, in order | Status |
| --- | --- |
| [When a model is too simple](https://kirilklein.github.io/causal-sandbox/?lesson=misspecification) | To adapt |
| [Double robustness and AIPW](https://kirilklein.github.io/causal-sandbox/aipw-double-robustness/) | To adapt |
| [Targeting with TMLE](https://kirilklein.github.io/causal-sandbox/tmle/) | To adapt |
| [Too little overlap](https://kirilklein.github.io/causal-sandbox/?lesson=overlap) | To adapt |

Optional branches: [instrument adjustment](https://kirilklein.github.io/causal-sandbox/?lesson=instrument) after double robustness; [TMLE/IPW model-error experiments](https://kirilklein.github.io/causal-sandbox/docs/tmle-robustness-preview.html) after TMLE; [clipping](https://kirilklein.github.io/causal-sandbox/propensity-score-clipping-trimming/) and then [trimming](https://kirilklein.github.io/causal-sandbox/?lesson=trimming) after overlap. All are to adapt. Instrument adjustment is not an IV estimation lesson.

## 5. More complex causal problems — optional branches

**Outcome:** explain what additional structure permits identification and demonstrate what happens when that structure fails.

| Lesson | Prerequisites | Status |
| --- | --- | --- |
| [Front-door identification](https://kirilklein.github.io/causal-sandbox/?lesson=front-door) | Mediators, hidden confounding, conditional averaging | To adapt |
| [Proxies for hidden confounders](https://kirilklein.github.io/causal-sandbox/?lesson=causal-relevance) | Hidden confounding, adjustment | To adapt |
| [Treatment decisions over time](https://kirilklein.github.io/causal-sandbox/?lesson=time-varying-confounding) | IPW, mediators, timing | To adapt |
| Instrumental-variable estimation | Confounding, instrument assumptions, uncertainty | Proposed |
| Difference-in-differences | Counterfactual trends, confounding, uncertainty | Proposed |
| Regression discontinuity | Assignment mechanisms, local effects, uncertainty | Proposed |

These branches are not prerequisites for the core closing chapter. New designs should each include an assumption-breaking experiment, not just an estimator formula.

## 6. Conducting an analysis

**Outcome:** deliver a defensible causal argument with a clearly stated limit on what the evidence establishes.

| Lesson or project | Status |
| --- | --- |
| [Leaving the sandbox](https://kirilklein.github.io/causal-sandbox/?lesson=leaving-the-sandbox) | To adapt; follows phase 4 on the core route |
| [Making causal assumptions tangible](https://kirilklein.github.io/causal-sandbox/?lesson=assumptions) | To adapt; optional consolidation |
| Turn a research question into a target-trial specification | Proposed |
| Compare IPW and outcome regression in one reproducible analysis | Proposed |
| Test how plausible hidden confounding changes a conclusion | Proposed; extends existing sensitivity discussion |
| Write a causal analysis report with assumptions and limitations | Proposed |

A capstone should contain the population, treatment strategies, outcome and time horizon, estimand, causal graph, adjustment rationale, analysis code, diagnostics, sensitivity analysis, and a conclusion that respects what remains unknown.

## Expansion order

First evaluate these three opening chapters with learners. Then adapt uncertainty through outcome regression, followed by causal roles and model limitations. Add the closing analysis project before broadening to new study designs. Keep the browser, coding, and tutor paths aligned on learning objectives without requiring identical interfaces.

The [course manifest](course.json) lists only material available here. The [reading website](https://kirilklein.github.io/causal-inference-from-scratch/) uses this manifest and these same Markdown sources. Book generation remains a future addition.
