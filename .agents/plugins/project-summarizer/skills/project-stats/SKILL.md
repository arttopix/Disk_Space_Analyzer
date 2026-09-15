---
name: project-stats
description: >-
  Analyzes, counts, and summarizes codebase statistics including total files,
  lines of code (LOC), and breakdown by file extension. Use when the user asks
  for code statistics, line counts, or project size summaries.
---

# Project Code Statistics Skill

This skill provides an automated workflow to calculate and summarize codebase metrics for the project, excluding dependencies (`node_modules`, `venv`) and build/cache files.

## Workflow

1. **Execute Statistics Script**:
   Run the Python helper script located in the `scripts/` directory:
   ```bash
   python .agents/plugins/project-summarizer/skills/project-stats/scripts/project_stats.py
   ```
   *(Or if running from `.gemini`: `python .gemini/plugins/project-summarizer/skills/project-stats/scripts/project_stats.py`)*

2. **Analyze Output**:
   The script outputs:
   - **Target Root**: Verified root path of the project.
   - **Total Tracked Files**: Count of relevant source code files (`.py`, `.jsx`, `.js`, `.css`, `.html`).
   - **Total Lines of Code**: Sum of lines across tracked source files.
   - **Breakdown by File Type**: Line counts organized by file extension.

3. **Present Summary**:
   Format and present the findings to the user with actionable context or tables as needed.
