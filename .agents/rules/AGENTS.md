# Agent Guidelines & Project Rules

## 🛡️ Git Safety & Sensitive Data Protection
- **Explicit Permission Required**: DO NOT execute `git commit`, `git push`, create branches, or switch branches unless explicitly requested by the user.
- **Sensitive Data Inspection (Mandatory)**: 
  - Before running `git commit` or `git push` (even when explicitly instructed by the user), ALWAYS inspect the staged files and diffs for sensitive information.
  - Sensitive data includes, but is not limited to:
    - API keys, access tokens, secret keys, credentials, and passwords.
    - Private keys, certificates, or `.env` files with actual secrets.
    - Personal identifiable information (PII) or confidential local environment credentials.
  - If any sensitive information is detected or suspected, **IMMEDIATELY STOP and WARN the user** with details of the affected files/lines, and wait for explicit confirmation before proceeding.

## 🏗️ Project Architecture & Workflow
- **Roadmap Alignment**: Always refer to [README.md](file:///c:/Environment_Dev/Disk_Space_Analyzer/README.md) for current features, architecture conventions, and the planned roadmap (e.g., depth precision, non-blocking I/O, direct folder opening).
- **Backend (Python / FastAPI)**:
  - Keep code modular, type-annotated, and maintainable.
  - Always handle exceptions (e.g., `PermissionError`, `OSError`) gracefully when interacting with disk I/O.
- **Frontend (React 19 / Vite)**:
  - Maintain the existing Glassmorphism dark-slate design system in `index.css`.
  - Use Vanilla CSS and Lucide React icons. DO NOT introduce TailwindCSS unless explicitly requested.

## 🧩 Antigravity Skills & Customizations Standard
- **Strict Compliance with Skills Guide**: All workspace skills and plugins must strictly follow the official Antigravity Customizations standard:
  - **Location**: Placed under `.agents/skills/<skill_name>/` or `.agents/plugins/<plugin_name>/skills/<skill_name>/`.
  - **Required `SKILL.md`**: Every skill MUST have a `SKILL.md` file starting with YAML frontmatter containing `name` and `description` (written in third-person, explaining what the skill does and when to use it).
  - **Helper Scripts Separation**: Any executable scripts or utilities must reside in a `scripts/` subdirectory within the respective skill folder.
  - **Progressive Disclosure**: Keep `SKILL.md` concise with clear step-by-step procedures; use `references/` for extensive manuals to preserve agent context.

## 💬 Communication
- **Language**: Always communicate, explain, and respond to the user in Thai (unless the user explicitly requests otherwise).
- **Formatting**: Keep explanations structured, clear, and concise. Provide clickable markdown file links (`[name](file:///path)`) whenever referencing files.
