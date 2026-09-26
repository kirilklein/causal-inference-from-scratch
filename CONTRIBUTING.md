# Contributing

Read the existing chapter before changing its progression. Each lesson should make the learner able to explain or do one new thing. Introduce prerequisites before using them, and distinguish course material available here from the roadmap.

## Chapter contract

Each path in `course.json` contains `README.md`, `code/simulation.py`, `exercises.md`, and `solutions.md`. Add a completed chapter to the manifest, the root README, and the curriculum together. Keep stable IDs and explicit prerequisites. Use the Sandbox's topic URLs rather than numeric lesson IDs.

The chapter should include a causal question, a prediction, concrete browser actions, an explanation, a runnable command, an interpretation of the output, a limitation, and a transfer exercise. Keep answers separate so the tutor can wait for a learner's response.

For a new visual, first state what the learner should infer and why interaction helps. Prefer an existing Sandbox experiment. A link should say what to do there and what to look for.

## Scientific checks

- State the target population, treatment contrast, outcome, and time horizon.
- Keep simulator truth out of estimators. Pass observed records into analysis functions.
- Distinguish identification, model assumptions, and finite-sample behavior.
- Use repeated assignments or studies to demonstrate distributional claims. Explain what is held fixed and what is redrawn.
- Handle unsupported comparisons explicitly. Missing treatment groups do not have a mean of zero.
- Label simplified models and specify where they differ from the browser implementation.
- Cite primary theoretical sources and the Sandbox revision used for adaptation.

## Validate

From the repository root, using Python 3.10 or newer:

```bash
python3 -m unittest discover -s tests -v
python3 scripts/check_course.py
```

`unittest` checks numerical and scientific invariants. `check_course.py` checks local links, the lesson manifest, prerequisites, and required artifacts, then runs all registered labs. It does not verify external website availability or learner comprehension. No third-party formatter or linter is required by this repository.

Learner progress belongs in ignored `CAUSAL-LEARNING.md`, not in commits. Tutor practice attempts and first answers should remain distinguishable.
