# Copilot Instructions

## UI/UX Skill Source

For any UI/UX-related request in this repository, always follow the rules and workflow defined in:

- `.gemini/skills/ui-ux-pro-max/SKILL.md`

## Required Workflow

1. Analyze requirement context (product type, style keywords, industry, stack).
2. Start with design-system generation (required):
   - `python3 .gemini/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system -p "<Project Name>"`
3. Add domain searches when needed (`style`, `ux`, `typography`, `color`, `landing`, `chart`).
4. Apply stack-specific guidance (`--stack vue` for this project unless request specifies otherwise).
5. Implement only after synthesizing results from the skill outputs.

## Quality Guardrails (Must Apply)

- Use SVG icon sets; do not use emojis as UI icons.
- Ensure interactive elements provide clear hover/focus feedback.
- Keep light/dark contrast and border visibility readable.
- Preserve responsive behavior (mobile to desktop) and avoid layout shift.
- Respect accessibility basics (labels, alt text, keyboard focus visibility).

## Scope Discipline

- Keep changes minimal and aligned with existing design system and Tailwind tokens.
- Do not introduce extra pages/components/features unless explicitly requested.
- If requirements are ambiguous, choose the simplest valid interpretation.
