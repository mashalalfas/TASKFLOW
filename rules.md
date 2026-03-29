# Rules

## General Rules

- Follow all guidelines and best practices
- Maintain consistency across the project
- Document all changes and decisions

## Code Quality

- Write clean, readable code
- Use meaningful variable and function names
- Add comments for complex logic
- Follow the project's code style guide

## Documentation

- Keep documentation up-to-date
- Use clear and concise language
- Include examples where applicable
- Update README for any major changes

## Version Control

- Write descriptive commit messages
- Create branches for new features
- Review changes before committing
- Keep commit history clean

## Testing

- Write tests for new features
- Maintain test coverage above 80%
- Run all tests before pushing
- Fix failing tests immediately

## Collaboration

- Communicate clearly with team members
- Review code thoroughly
- Provide constructive feedback
- Respect deadlines and timelines

# EFFICIENCY & TOKEN CONSTRAINTS
- **Response Style:** Be extremely concise. Avoid "I'll do that," "Done," or "Here is the code" filler. Output only the requested code or a 1-sentence summary.
- **200-Line Limit:** NEVER generate or suggest a file exceeding 200 lines. If a task requires more, automatically propose a directory structure with sub-components.
- **SVG Isolation:** Never inline SVGs. Always create a separate `.svg` or a clean React/Vue component file for each graphic.
- **Context Management:** Do not scan the entire workspace unless explicitly asked. Focus only on files I mention.

# TECHNICAL STANDARDS
- **Environment:** Vite + JavaScript/ESM.
- **Architecture:** Modular and functional. Move utility logic to `utils/` and hooks to `hooks/` to keep UI components lean.
- **No Refactoring Bloat:** When editing, only output the changed code blocks rather than rewriting the entire file unless requested.

