# Causal Inference from Scratch

**Ask a causal question. Predict the result. Change the world. Explain what happened.**

Learn causal inference through written lessons, interactive experiments, and small Python implementations. [Causal Sandbox](https://kirilklein.github.io/causal-sandbox/) is the browser lab. This repository is its companion course.

Inspired by Rohit Ghumare's **[AI Engineering from Scratch](https://github.com/rohitg00/ai-engineering-from-scratch)**, this course brings its phased, hands-on learning format to causal inference, with guided Causal Sandbox experiments at the center of each lesson.

**[Start reading](phases/01-causal-questions/01-what-if/README.md) · [Open the interactive lab](https://kirilklein.github.io/causal-sandbox/?lesson=what-if) · [See the curriculum](CURRICULUM.md)**

## Three ways to learn

| Read and experiment | Build it yourself | Study with a tutor |
| --- | --- | --- |
| Read a chapter and open its browser experiment. No installation. | Run its Python lab, inspect the calculation, and change an assumption. | Give a coding assistant the [learn-causal skill](skills/learn-causal/SKILL.md). It guides one step at a time and can save your progress. |

Start with everyday reasoning about averages. The opening lessons introduce their own notation. Basic Python helps on the coding path but is not needed for the browser path.

## Available chapters

**Initial release: three chapters**, each with a written lesson, a runnable Python lab, exercises, and worked solutions. The rest of the [curriculum](CURRICULUM.md) is a roadmap that distinguishes existing Sandbox lessons awaiting adaptation from proposed additions.

| Chapter | The question you will answer | Experiment |
| --- | --- | --- |
| [1. What if?](phases/01-causal-questions/01-what-if/README.md) | What exactly would treatment change, and which comparison is missing? | [Two possible futures](https://kirilklein.github.io/causal-sandbox/?lesson=what-if) |
| [2. A randomized comparison](phases/01-causal-questions/02-randomization/README.md) | Why can randomization estimate an average effect without revealing individual effects? | [Randomized studies](https://kirilklein.github.io/causal-sandbox/?lesson=randomization) |
| [3. When treatment selection changes the comparison](phases/02-learning-from-comparisons/01-confounding/README.md) | Can a helpful treatment look harmful, even in a large study? | [A common cause](https://kirilklein.github.io/causal-sandbox/?lesson=confounding) |

## The lesson loop

1. **Question:** define the causal comparison before choosing a method.
2. **Predict:** commit to an explanation before seeing the result.
3. **Experiment:** change one part of the world or analysis in Causal Sandbox.
4. **Explain:** connect the result to the mechanism and its assumptions.
5. **Implement:** reproduce the central calculation in readable Python.
6. **Challenge:** apply the idea to a different situation and defend your answer.

Each chapter includes exercises and separate worked solutions. You leave with a causal argument as well as a numerical result.

## Run the first lab

Python 3.10 or newer is sufficient. There are no third-party dependencies. Clone the course and run the opening lab:

```bash
git clone https://github.com/kirilklein/causal-inference-from-scratch.git
cd causal-inference-from-scratch
python3 phases/01-causal-questions/01-what-if/code/simulation.py
```

Continue with the randomization and confounding labs:

```bash
python3 phases/01-causal-questions/02-randomization/code/simulation.py
python3 phases/02-learning-from-comparisons/01-confounding/code/simulation.py
```

The Python labs are small teaching models. They explain the same ideas as the browser lessons, but do not reproduce every browser setting or dataset. All people and outcomes are fictional. Health scores are illustrative units, not clinical measurements.

## Use the optional tutor

In a coding assistant that can read this checkout, ask:

> Use `skills/learn-causal/SKILL.md` to teach me this course. Start with the first lesson and wait for my predictions.

This works as a local instruction file without installing anything. For automatic skill discovery, copy the `skills/learn-causal` folder into your assistant's supported skill directory. The tutor requires access to this course checkout; a standalone copy of the skill does not contain the chapters.

The tutor reads [course.json](course.json), uses the chapter exercises, and records progress in an ignored `CAUSAL-LEARNING.md` file when you want to save it. Browser progress and tutor progress are separate. Neither opening a page nor running a script establishes understanding.

## Why the simulator knows more than the analyst

The simulator can retain both potential outcomes for each person. An analyst sees only the outcome under the treatment actually received. Labs keep these roles separate: simulator truth is a benchmark, never a missing value supplied to an estimator. A correct result in a toy world does not establish that its assumptions hold in your study.

## Sources and acknowledgments

- The course builds on [Causal Sandbox](https://github.com/kirilklein/causal-sandbox). The initial curriculum mapping uses published `main` revision [`57fd76c`](https://github.com/kirilklein/causal-sandbox/tree/57fd76c6a33e5610bdd7524aecf7da3ee06385ac). Live browser lessons may change.
- The repository format is inspired by Rohit Ghumare's [AI Engineering from Scratch](https://github.com/rohitg00/ai-engineering-from-scratch): phased lessons, runnable labs, exercises, and an optional tutor. The prose and tutor instructions here are newly written.
- For the underlying theory, see Hernán and Robins, [*Causal Inference: What If*](https://miguelhernan.org/whatifbook), especially chapters 1–3 for this opening sequence.

See [CONTRIBUTING.md](CONTRIBUTING.md) for authoring and validation. Licensed under [MIT](LICENSE).
