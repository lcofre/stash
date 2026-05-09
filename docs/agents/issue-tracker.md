# Issue Tracker: GitHub Issues

## Overview

Issues for this repo live in **GitHub Issues**. The `triage`, `to-issues`, `to-prd`, and other engineering skills read from and write to GitHub Issues using the `gh` CLI.

## How skills use it

- **`triage`** — reads incoming issues, applies labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`), and updates state
- **`to-issues`** — breaks a plan or spec into independent issues on the tracker
- **`to-prd`** — publishes a PRD as a GitHub issue (or links to an existing one)
- **`review`** — creates issues for feedback and suggested improvements

## Setup

No special setup needed — the skills use the `gh` CLI, which respects your existing GitHub auth and the current repo's remote.

If you want to customize issue behavior (e.g., default assignee, milestone, or label mappings), edit this file or `CLAUDE.md`.

## Workflow

When a skill creates an issue, it includes:
- **Title** — one line, imperative form ("Add dark mode toggle", not "Dark mode")
- **Body** — markdown with context, acceptance criteria, or reasoning
- **Labels** — triage labels applied during creation (usually `ready-for-human` or `ready-for-agent`)

Maintainers then triage by applying `needs-info` if the issue is underspecified, or `wontfix` if it's out of scope.
