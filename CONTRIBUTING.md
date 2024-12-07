# Contributing to Customer Management System

Thank you for your interest in contributing to our project! This guide will help you get started with contributing to the Customer Management System.

## Development Setup

1. Fork and Clone
```bash
git clone <your-fork-url>
cd customer-management-system
```

2. Install Dependencies
```bash
npm install
```

3. Set up Environment Variables
Create a `.env` file with the required configuration (see README.md for details).

4. Start Development Server
```bash
npm run dev
```

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing code formatting patterns
- Use meaningful variable and function names
- Add comments for complex logic

### Git Workflow
1. Create a feature branch
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes
3. Commit with clear messages
```bash
git commit -m "feat: add new customer validation"
```

4. Push to your fork
5. Submit a Pull Request

### Pull Request Process
1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Request review from maintainers

### Testing
- Write unit tests for new features
- Update existing tests when modifying features
- Run tests locally before submitting PR
```bash
npm test
```

## Code Review Guidelines

### For Contributors
- Keep PRs focused and atomic
- Respond to review feedback promptly
- Update PR based on feedback

### For Reviewers
- Be respectful and constructive
- Review code within 48 hours
- Provide specific feedback
- Approve only when satisfied

## Development Tools

### Recommended VSCode Extensions
- ESLint
- Prettier
- TypeScript and JavaScript Language Features

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run linter

## Getting Help
- Check existing issues
- Join our community chat
- Ask questions in PR discussions

## Code of Conduct
Please note that this project follows our Code of Conduct. Be respectful and professional in all interactions.

## License
By contributing, you agree that your contributions will be licensed under the project's license.
