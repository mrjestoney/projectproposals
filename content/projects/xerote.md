## Summary

**Xerote is an AI engineer that sits between you and your coding AI.**
It interviews you about every detail of the software you want, turns your answers into a locked plan, and then **instructs your coding AI step by step** — giving it precise prompts, reading its reports, checking the real code, and refusing to drift from what you agreed.

You stop being the person who writes prompts and babysits the AI. You become the person who decides.

> **Promise:** *"Tell it what you want once. It makes sure the AI builds exactly that."*

## The problem

AI coding tools (Claude Code, Codex, Cursor and others) can build real software — but working with them is hard:

1. **Drift.** Over many sessions the AI forgets earlier decisions, adds things nobody asked for, changes structure, or quietly breaks what worked.
2. **Missing details.** People start with a vague idea. The AI fills the gaps with guesses — different guesses each time.
3. **The human becomes the bottleneck.** You must write good prompts, remember all context, read every result, and check the AI's claims. That is a full-time engineering-manager job most people can't do.
4. **"It says it's done" ≠ done.** AI agents often report success when features are partial or missing.

This is why vibecoded projects so often become messes nobody understands — the problem the industry now calls **comprehension debt**.

## What already exists — and the gap

**Spec-driven development** (write a detailed specification first, then let AI code from it) has become a major trend. GitHub's open-source **Spec Kit** passed 115,000 stars by mid-2026, and Amazon built the **Kiro** IDE around the idea; tools such as Tessl, OpenSpec and Task Master AI also exist ([InfoWorld, 2026](https://infoworld.com/article/4171332/four-cutting-edge-tools-for-spec-driven-development.html)).

The gap:
- These tools are **built for developers** — text files and commands inside coding tools.
- They help *write* a spec, but rarely **enforce** it across a whole build.
- They mostly **trust the agent's report** instead of verifying the real code.

**Xerote's difference:**
1. A **deep interview** that a non-engineer can complete — the AI asks until there are no gaps.
2. A **locked plan** with strict scope control (changes require your approval).
3. An active **build loop**: prompt → agent works → report → **verification against plan and real code** → next prompt.
4. Works with the coding AI you already use.

## How it works

### Step 1 — The interview
Xerote interviews you like a senior consultant. It covers:
- **Purpose & users:** who uses it, what problem it solves, user roles and permissions.
- **Features:** each feature, what "done" means, edge cases ("what if the payment fails?").
- **Data:** what is stored, relationships, privacy.
- **Screens & design:** pages, flows, look and feel (it can show rough sketches for approval).
- **Rules & constraints:** business rules, limits, languages, devices, performance.
- **Tech & tools:** which coding AI you use (Claude Code, Codex…), hosting, existing code.

It detects **gaps and contradictions**: *"You said parents can edit marks, but also that marks are locked after approval — which one?"* The interview isn't finished until the plan is complete.

### Step 2 — The locked plan
Your answers become a structured plan:
- A clear **specification** (features, rules, data, screens, constraints).
- A list of **small numbered tasks**, each with acceptance checks ("done when…").
- A **scope lock**: anything not in the plan is out of scope until approved.

### Step 3 — The build loop
For each task:

```
 Xerote ──prompt──► Coding AI ──builds──► Code
    ▲                                  │
    └──── report + real code check ◄───┘
```

1. Xerote gives a **precise prompt** containing only the context this task needs + the acceptance checks + a required **report format**.
2. The coding AI builds and returns a **structured report**.
3. Xerote **verifies**: does the report satisfy the checks? Do the real code changes match (via GitHub)? Did anything out of scope appear?
4. Result: ✅ next task · 🔧 a fix prompt · ⚠️ a **change request** for you to approve or reject.

### Step 4 — Progress you can understand
A dashboard shows: tasks done/remaining, current task, open change requests, warnings, and the system diagram so far — in plain language.

## Three levels of automation

| Level | How the coding AI and Xerote talk | Your job |
|------|-----------------------------------|----------|
| **1 · Copy-paste** | You copy Xerote's prompt into your coding AI and paste the report back | Copy, paste, approve |
| **2 · Connected** | The coding AI connects to Xerote through **MCP** (the standard way coding agents use outside tools): it asks Xerote "what's my next task?" and submits its report itself | Type "continue", approve |
| **3 · Autopilot** | Xerote runs the coding agent directly and only stops for your approvals | Approve key decisions |

Launch with Level 1 (works with any AI tool), add Level 2 quickly (the magic moment), Level 3 later.

## How drift is prevented

1. **The plan is the single source of truth** — every prompt is generated from it.
2. **Small tasks** with explicit "done when…" checks.
3. **Context per task** — the agent gets exactly the relevant parts of the plan, every time (it never has to "remember").
4. **Required report format** — the agent must list files changed, checks passed, deviations, questions.
5. **Real code verification** — Xerote reads the actual changes (GitHub), not just the report.
6. **Scope lock** — anything new becomes a change request; nothing enters the plan without your approval.

## Who it is for

| User | Benefit |
|------|--------|
| Founders & domain experts (teachers, doctors, business owners) who build with AI | Get real software without being engineers |
| Developers who use AI agents | Stop babysitting; get consistent, verified output |
| Small agencies | Repeatable process for client projects |
| Students | Learn how software is planned and built properly |

## Relationship to Build Replay

Xerote and Build Replay are partners:
- **Xerote** controls what *should* be built, *while* it is built.
- **Build Replay** shows what *was* built, *after* it is built.
Because Xerote records every step and its reason, a project built with Xerote gets a perfect replay for free.

## How it would be built (real version)

| Part | Approach |
|------|---------|
| Interview | Language model with a structured question tree + gap/contradiction checker |
| Plan | Structured spec (JSON) rendered as readable cards; task generator with acceptance checks |
| Prompts | Templates filled from the plan per task |
| Level 2 | Xerote as an MCP server exposing tools like `get_next_task`, `submit_report`, `request_change` |
| Verification | GitHub integration: read diffs; model checks diffs against acceptance checks and scope |
| Web app | Next.js dashboard, per-project storage |

## Doability

**Doable — yes.** Level 1 is straightforward; Level 2 uses an existing open standard (MCP); verification uses GitHub's API and language models.

Hardest parts:
- **Interview quality** — knowing which questions matter for each kind of app.
- **Smart, not noisy, verification** — catching real problems without nagging.

## Risks

| Risk | Mitigation |
|-----|-----------|
| Crowded "spec-driven" space | Focus on non-engineers, enforcement and verification — not just writing specs |
| Coding tools add similar features | Stay tool-agnostic; work with all agents |
| Interview feels long | Smart defaults, skip what's obvious, save and resume |

## Roadmap

| Phase | Deliverable |
|------|-------------|
| 0 | Clickable prototype with mock data *(this app)* |
| 1 | Interview → plan → Level 1 copy-paste loop with report checking |
| 2 | GitHub verification; change requests |
| 3 | Level 2 via MCP |
| 4 | Level 3 autopilot; Build Replay export |

## About the prototype

The prototype walks through building a made-up **School Results App** with Claude Code. You can go through the interview (answers pre-filled), see gaps detected, view the locked plan and task list, run the build loop (copy a prompt, paste a sample report, see verification), handle a change request, and switch between automation levels. All data is mock data.

> *Fun fact: this very web app was built with the Xerote method — a spec, numbered tasks, prompts, and a strict report after every task.*
