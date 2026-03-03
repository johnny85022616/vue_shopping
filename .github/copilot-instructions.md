# Copilot Instructions

## Core Standards (Priority 1)
For all tasks in this repository, first refer to the project's general guidelines, coding style, and architecture defined in:
- `gemini.md`

## UI/UX Specialization (Priority 2)
For any UI/UX-related request, frontend styling, or component development, strictly follow the specialized rules and workflow defined in:
- `.gemini/skills/ui-ux-pro-max/SKILL.md`

## Required Workflow
1. **Context Analysis**: Analyze requirement context (product type, style keywords, industry, stack) based on `gemini.md`.
2. **Design-System Generation (Required)**: 
   - Run: `python3 .gemini/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system -p "<Project Name>"`
3. **Domain Research**: Add domain searches when needed (`style`, `ux`, `typography`, `color`, `landing`, `chart`).
4. **Stack Synthesis**: Apply stack-specific guidance (`--stack vue` for this project).
5. **Implementation**: Implement only after synthesizing results from both `gemini.md` (logic/structure) and `SKILL.md` (design/UX).

## Quality Guardrails (Must Apply)
- **Icons**: Use SVG icon sets (e.g., Lucide, Heroicons); **strictly no emojis** as UI icons.
- **Feedback**: Ensure interactive elements provide clear hover/focus feedback (transitions 150-300ms).
- **Accessibility & Contrast**: Maintain WCAG 2.1 contrast ratios; ensure border visibility and keyboard focus states.
- **Responsive**: Preserve responsive behavior (375px to 1440px) and prevent Layout Shift (CLS).
- **Project Alignment**: Ensure code patterns match the examples found in `gemini.md`.

## Scope Discipline
- Keep changes minimal and aligned with existing design system and Tailwind tokens.
- Do not introduce extra pages/components/features unless explicitly requested.
- If requirements are ambiguous, prioritize the "Simplicity" principle in `gemini.md`.