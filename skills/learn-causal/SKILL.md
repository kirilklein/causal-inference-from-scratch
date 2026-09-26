---
name: learn-causal
description: Guide a learner through the Causal Inference from Scratch companion course using its written chapters, Causal Sandbox experiments, Python labs, and exercises. Use for starting, resuming, or reviewing this course.
---

# Learn causal inference

Locate the course checkout by its `course.json` title, `Causal Inference from Scratch`. The skill can live inside the checkout or be installed separately. If the checkout cannot be found, ask for its location. Do not invent remote course URLs or treat `CURRICULUM.md` roadmap entries as completed chapters.

Read `course.json` and, if present, `CAUSAL-LEARNING.md` at the course root. The manifest order is the default route. Honor an explicitly requested topic; explain any missing prerequisite briefly. If a topic is only on the roadmap, offer the linked existing Sandbox lesson while making its companion chapter's status clear.

For a new learner, ask whether they prefer browser experiments alone or browser plus Python, and what they hope to understand. Begin with the first chapter unless their answer supports a different entry. Avoid making setup a prerequisite for reading.

## Teach one step at a time

Read the selected chapter and its exercises. Frame its causal question, then ask for the prediction and **wait for the learner's answer**. Give concrete actions and the exact experiment link from the chapter. Afterward, ask what they observed and why. Distinguish observations the learner reports from browser actions or code you actually executed.

Use the chapter's explanation to address their reasoning. Keep simulator-known potential outcomes separate from observed data and distinguish the target effect from the estimator. Do not imply that simulation success validates assumptions in a real study.

On the Python path, inspect and run the chapter's actual `code/simulation.py` when execution is available. Show a relevant output and ask the learner to interpret or predict a change. Label a hand calculation as such if execution is unavailable. Never fabricate execution or browser results.

Ask the exercise questions individually and wait for answers. Use `solutions.md` as a rubric after the response; accept equivalent correct reasoning. Do not reveal the answer in hints or reply-format examples. Give one focused correction for each misconception, then a chance to explain it again. Preserve the distinction between a first answer and a practice retry.

## Save and resume

If the learner wants progress saved, create or update ignored `CAUSAL-LEARNING.md` at the course root. Preserve unrelated content and existing entries. Record:

- Preferred path and learning objective.
- Current lesson ID and current step, so an interrupted session can resume.
- For each attempted exercise: first-answer assessment, a short reasoning note, and any retry separately.
- Experiments reported by the learner, code actually run, and unavailable activities separately.
- Topics needing review and the next intended step.

Do not log a step as completed just because you displayed it or supplied its solution. Mark a lesson reviewed only after the learner has attempted its exercises and discussed the key reasoning. This is study progress, not validated mastery. If saving is declined, teach without persistent state.

On resume, continue the saved step and use one brief recall question when useful. At the end of a chapter, state what the learner can now explain and point to the next available chapter. After the last local chapter, offer the existing Sandbox uncertainty lesson or review; do not claim the full roadmap is complete. Browser progress does not synchronize with this file.
