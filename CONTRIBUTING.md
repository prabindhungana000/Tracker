# Contributing to FoodJourney

We're excited that you want to contribute to FoodJourney! This document provides guidelines and instructions for making contributions.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** to your local machine
3. **Create a feature branch** from `main`
4. **Make your changes** following the development guide
5. **Commit with clear messages**
6. **Push to your fork** and create a pull request

## Contribution Types

### Bug Reports
- Use the bug report template
- Include reproduction steps
- Provide error messages/logs
- Specify your environment

### Feature Requests
- Use the feature request template
- Explain the use case
- Discuss implementation ideas
- Consider impact on design

### Documentation
- Improve README, guides, or code comments
- Fix typos and clarity
- Add examples
- Update outdated information

### Code Contributions
- Follow the coding standards
- Add tests for new functionality
- Update documentation
- Ensure backward compatibility

## Coding Standards

### TypeScript
- Strict mode enabled
- Proper type annotations
- No `any` types (use `unknown` if needed)
- Meaningful variable names

### Style
- 2-space indentation
- Single quotes for strings
- Semicolons required
- Use Prettier for formatting

### Patterns
- Functional components (React)
- Custom hooks for logic
- Immutable data updates
- Error handling everywhere

### Comments
- JSDoc for functions
- Explain why, not what
- Keep comments concise
- Update comments with code

## Testing

- Write tests for new features
- Cover edge cases
- Maintain >80% coverage
- Use descriptive test names

```typescript
describe('calculateFlavorScore', () => {
  it('should calculate correct score with all inputs', () => {
    const score = calculateFlavorScore(80, 75, 90);
    expect(score).toBe(expectedValue);
  });
});
```

## Pull Request Process

1. **Create clear PR title**: `feat: add meal logging` not `updates`

2. **Write descriptive description**:
   ```
   ## Description
   Add meal logging functionality with AI recognition
   
   ## Changes
   - Created meal creation API endpoint
   - Integrated Google Vision API
   - Added meal history pagination
   
   ## Testing
   - Added tests for meal creation
   - Tested with sample images
   - Verified pagination limits
   
   ## Checklist
   - [x] Tests added
   - [x] Documentation updated
   - [x] No breaking changes
   ```

3. **Link related issues**: `Closes #123`

4. **Request reviews** from maintainers

5. **Address feedback** and make updates

6. **Squash commits** if requested

## Review Comments

- Respond constructively to feedback
- Ask for clarification if needed
- Make requested changes promptly
- Suggest alternatives if you disagree
- Thank reviewers for their time

## Merge Approval

Once approved:
- All tests must pass
- No merge conflicts
- Code review approved
- Documentation complete

## After Merge

- Delete your feature branch
- Celebrate your contribution! 🎉
- Watch for issues the PR might cause
- Help with related follow-up work

##Project-Specific Guidelines

### FoodJourney Features

**Before implementing a feature**:
1. Check if it aligns with project vision
2. Discuss with maintainers if major
3. Review existing similar features
4. Plan the database schema

**For gamification features**:
- Maintain balance and fairness
- Consider difficulty progression
- Test achievement unlock conditions
- Document point allocation

**For AI features**:
- Test with diverse food images
- Handle recognition failures gracefully
- Cache results for performance
- Ensure privacy compliance

**For social features**:
- Design for inclusivity
- Consider user privacy
- Implement moderation tools
- Test scaling with many users

## Questions?

- **Issues**: Use GitHub Issues for questions
- **Discussions**: Use GitHub Discussions for ideas
- **Email**: [maintainer email]

Thank you for contributing to FoodJourney! 🌍
