# Contributing to AstroAlert

Thank you for considering contributing to AstroAlert! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue tracker to avoid duplicates. When creating a bug report, include as many details as possible:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs. actual behavior
- Screenshots if applicable
- Environment details (OS, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- A clear and descriptive title
- Detailed explanation of the proposed functionality
- Any potential implementation approach
- Why this enhancement would be useful

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests to ensure your changes don't break existing functionality
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

### Backend

```bash
cd backend
python -m venv .venv
# On Windows
.venv\Scripts\activate
# On macOS/Linux
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Coding Guidelines

### Python

- Follow PEP 8 style guide
- Write docstrings for all functions, classes, and modules
- Use type hints where appropriate
- Write unit tests for new functionality

### JavaScript/TypeScript

- Follow the ESLint configuration
- Use TypeScript for type safety
- Write JSDoc comments for functions and components
- Follow React best practices

## Commit Messages

Use clear and meaningful commit messages that explain what changes were made and why.

Format: `type(scope): description`

Types:
- feat: A new feature
- fix: A bug fix
- docs: Documentation changes
- style: Code style changes (formatting, etc.)
- refactor: Code changes that neither fix bugs nor add features
- test: Adding or modifying tests
- chore: Changes to the build process or auxiliary tools

Example: `feat(dashboard): add space debris visualization component`

## License

By contributing to AstroAlert, you agree that your contributions will be licensed under the project's MIT License.