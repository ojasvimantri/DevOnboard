# DevOnboard

**DevOnboard** is a developer productivity tool built for the IBM Bob 2.0 Hackathon.

It uses IBM Bob's custom modes, skills, and slash commands to automatically analyze an
unfamiliar codebase and generate a structured, polished first-day onboarding guide.

---

## Project Structure

```
DevOnboard/
├── .bob/
│   ├── custom_modes.yaml          ← The "new-dev" Bob mode definition
│   ├── rules/
│   │   └── onboarding-rules.md   ← Always-on rules for the onboarding mode
│   ├── skills/
│   │   └── onboarding/
│   │       ├── SKILL.md          ← Core analysis skill (3-phase workflow)
│   │       ├── report-template.md ← 10-section report structure
│   │       └── analysis-checklist.md ← Stack detection lookup table
│   └── commands/
│       └── onboard.md            ← /onboard slash command
├── sample-project/               ← Demo project for Bob to analyze
├── viewer/
│   └── index.html                ← Static web report viewer
├── docs/
│   └── ONBOARDING.md             ← Bob writes the generated report here
├── AGENTS.md                     ← This file
└── README.md                     ← Hackathon README
```

---

## Bob Configuration

### Mode: `new-dev`
- **Slug:** `new-dev`
- **Tools:** `read`, `skill`, `edit` (restricted to `*.md` files only)
- **Role:** Expert staff engineer focused on codebase analysis and onboarding

### Skill: `onboarding`
- **Location:** `.bob/skills/onboarding/SKILL.md`
- **Trigger:** Activated by the `/onboard` command or manually via `use_skill`
- **Workflow:** 3 phases — Discovery → Analysis → Output

### Command: `/onboard`
- **File:** `.bob/commands/onboard.md`
- **Action:** Triggers the full onboarding pipeline and writes `docs/ONBOARDING.md`

---

## Demo Workflow

1. Open DevOnboard in Bob IDE
2. Switch to **🧭 New Dev Onboarding** mode
3. Navigate to (or open) the `sample-project/` folder
4. Type `/onboard` in the chat
5. Bob reads the project, analyzes it, and writes `docs/ONBOARDING.md`
6. Open `viewer/index.html` in a browser to see the polished report

---

## Key Conventions

- The report is always written to `docs/ONBOARDING.md`
- Section headings must match the template exactly (the web viewer parses them)
- Bob never modifies source files in this mode — read and Markdown-write only
- Missing information is explicitly noted, never fabricated
