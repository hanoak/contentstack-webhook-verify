# Contributing to contentstack-webhook-verify

Thank you for your interest in contributing to `contentstack-webhook-verify`! This document provides guidelines and instructions for setting up the development environment and contributing to the project.

## Table of Contents

- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## Development Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **Git**

### Getting Started

1. **Fork and Clone the Repository**

   ```bash
   # Fork the repository on GitHub, then clone your fork
   git clone https://github.com/hanoak/contentstack-webhook-verify.git
   cd contentstack-webhook-verify
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Build the Project**

   ```bash
   npm run build
   ```

4. **Verify Setup**

   ```bash
   # Check if TypeScript compilation works
   npm run build

   # Run linting
   npm run lint:fix

   # Format code
   npm run prettify
   ```

### Environment Configuration

This project uses the following configuration files:

- **TypeScript**: `tsconfig.json`
- **ESLint**: `eslint.config.js`
- **Prettier**: `.prettierrc` (if exists) or default configuration
- **Git Hooks**: `.lintstagedrc.json` for pre-commit hooks
- **Husky**: Pre-commit hooks configuration in `package.json`

## Project Structure

```text
contentstack-webhook-verify/
├── src/                    # Source code
│   ├── index.ts           # Main entry point
│   ├── config/            # Default configuration
│   │   └── index.ts
│   ├── constants/         # Constants and regions
│   │   └── index.ts
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   └── utils/             # Utility functions
│       ├── error.ts       # Custom error class
│       ├── replay-verify.ts
│       ├── request.ts     # HTTP request handling
│       ├── signature-verify.ts
│       └── validate.ts    # Input validation
├── dist/                  # Compiled JavaScript (generated)
├── .lintstagedrc.json    # Lint-staged configuration
├── eslint.config.js      # ESLint configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Project configuration
└── README.md             # Project documentation
```

## Development Workflow

### Branch Naming Convention

Use descriptive branch names with the following prefixes:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Testing improvements

Examples:

```bash
git checkout -b feature/add-custom-headers-support
git checkout -b fix/signature-validation-edge-case
git checkout -b docs/update-api-reference
```

### Available Scripts

| Script              | Description                            |
| ------------------- | -------------------------------------- |
| `npm run build`     | Compile TypeScript to JavaScript       |
| `npm run prepare`   | Automatic build before publishing      |
| `npm run lint:fix`  | Run ESLint and fix auto-fixable issues |
| `npm run prettify`  | Format code with Prettier              |
| `npm run precommit` | Run pre-commit checks                  |

### Making Changes

1. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write code following the established patterns
   - Add TypeScript types for any new interfaces
   - Update documentation if needed

3. **Test Your Changes**

   ```bash
   # Build the project
   npm run build

   # Run linting
   npm run lint:fix

   # Format code
   npm run prettify
   ```

4. **Commit Your Changes**

   The project uses Husky for pre-commit hooks that will automatically:
   - Run Prettier on all files
   - Run ESLint on TypeScript files
   - Ensure code quality before commits

   ```bash
   git add .
   git commit -m "feat: add support for custom headers"
   ```

## Code Standards

### TypeScript Guidelines

- Use strict TypeScript configuration
- Define explicit types for all function parameters and return values
- Use interfaces for object shapes
- Prefer `const` assertions where appropriate
- Use meaningful variable and function names

### Code Style

The project uses:

- **Prettier** for code formatting
- **ESLint** for code quality and consistency
- **TypeScript** strict mode

Key style preferences:

- Use double quotes for strings
- Use semicolons
- 2-space indentation
- Trailing commas in multiline structures

### File Naming

- Use kebab-case for file names: `signature-verify.ts`
- Use PascalCase for class names: `WebhookError`
- Use camelCase for function and variable names: `verifySignature`
- Use SCREAMING_SNAKE_CASE for constants: `CS_REGIONS`

### Documentation

- Use JSDoc comments for all public functions
- Include parameter descriptions and return types
- Add usage examples for complex functions
- Keep README.md updated with any changes

Example JSDoc:

```typescript
/**
 * Verifies the authenticity of a webhook request signature.
 *
 * @param headerSignature - The signature from the webhook header
 * @param publicKey - The public key for verification
 * @param requestBody - The webhook request body
 * @throws {WebhookError} When signature verification fails
 */
```

### Error Handling

- Use the custom `WebhookError` class for all webhook-related errors
- Provide descriptive error messages
- Include context in error messages when helpful
- Handle edge cases gracefully

## Testing

### Manual Testing

For now, the project relies on manual testing:

1. **Build the project** to ensure TypeScript compilation works
2. **Run linting** to catch potential issues
3. **Test with real webhook payloads** if possible

### Future Testing Plans

We welcome contributions to add:

- Unit tests with Jest or similar
- Integration tests
- Mock webhook payload testing
- Automated CI/CD pipeline

## Submitting Changes

### Pull Request Process

1. **Ensure Your Fork is Up to Date**

   ```bash
   git remote add upstream https://github.com/hanoak/contentstack-webhook-verify.git
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Push Your Changes**

   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request**
   - Go to GitHub and create a pull request
   - Use a descriptive title and description
   - Reference any related issues
   - Include testing instructions if applicable

### Pull Request Guidelines

- **Title**: Use conventional commit format: `feat:`, `fix:`, `docs:`, etc.
- **Description**: Explain what changes were made and why
- **Testing**: Describe how to test the changes
- **Breaking Changes**: Clearly mark any breaking changes

Example PR description:

```markdown
## Description

Adds support for custom HTTP headers in webhook verification requests.

## Changes

- Added `customHeaders` option to `ConfigOptions`
- Updated request utility to include custom headers
- Added TypeScript types for new option
- Updated documentation with usage examples

## Testing

- Built project successfully
- Tested with custom headers in development environment
- All existing functionality remains unchanged

## Breaking Changes

None - this is a backward-compatible addition.
```

### Code Review Process

1. All pull requests require review before merging
2. Address any feedback from reviewers
3. Ensure all checks pass (linting, building)
4. I will merge approved PRs

## Release Process

### Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality
- **PATCH** version for backwards-compatible bug fixes

### Release Steps

1. Update version in `package.json`
2. Update `CHANGELOG.md` (if exists)
3. Create a git tag
4. Publish to npm registry

## Development Tips

### IDE Setup

**VS Code Extensions** (recommended):

- TypeScript and JavaScript Language Features
- ESLint
- Prettier - Code formatter
- Auto Import - ES6, TS, JSX, TSX

### Debugging

- Use `console.log` for debugging during development
- Remove debug logs before committing
- Use TypeScript's strict mode to catch potential issues early

### Performance Considerations

- Keep the library lightweight with no runtime dependencies
- Optimize for common use cases
- Consider memory usage in long-running applications

## Getting Help

### Communication Channels

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Pull Request Comments**: For code-specific discussions

### Common Issues

**Build Failures:**

- Ensure Node.js version is compatible
- Clear `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check TypeScript compilation errors

**Linting Errors:**

- Run `npm run lint:fix` to auto-fix issues
- Check ESLint configuration if new rules are needed

**Pre-commit Hook Failures:**

- Fix linting and formatting issues
- Ensure all files are properly staged
- Check Husky configuration if hooks aren't running

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain a professional environment

### Reporting Issues

If you encounter any behavior that violates our standards, please report it by:

- Opening a GitHub issue
- Contacting the project maintainers directly

## Recognition

Contributors will be recognized in:

- GitHub contributor list
- Release notes for significant contributions
- Special mentions for outstanding contributions

---

Thank you for contributing to `contentstack-webhook-verify`! Your contributions help make webhook security more accessible to the developer community.
