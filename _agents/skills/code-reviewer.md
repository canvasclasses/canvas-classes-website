# Code Reviewer Skill

## Overview
This skill provides comprehensive code review capabilities for the Next.js full-stack application, focusing on code quality, best practices, performance, and maintainability.

## Scope
- **Frontend**: React components, Next.js pages, API routes, client-side logic
- **Backend**: API routes, server actions, database operations, middleware
- **Full-stack**: TypeScript usage, state management, data flow, architecture

## Review Checklist

### 1. Code Quality & Standards
- [ ] **TypeScript Usage**: Proper typing, no `any` types without justification, interfaces/types defined
- [ ] **Naming Conventions**: Clear, descriptive variable/function names following camelCase/PascalCase
- [ ] **Code Structure**: Logical organization, single responsibility principle
- [ ] **DRY Principle**: No unnecessary code duplication
- [ ] **Comments**: Complex logic explained, no redundant comments
- [ ] **Formatting**: Consistent indentation, spacing, and code style

### 2. Next.js Best Practices
- [ ] **App Router**: Proper use of Server/Client Components
- [ ] **Data Fetching**: Appropriate use of `fetch`, caching strategies, revalidation
- [ ] **Routing**: Correct file structure, dynamic routes, route groups
- [ ] **Metadata**: SEO optimization with proper metadata exports
- [ ] **Image Optimization**: Using `next/image` for images
- [ ] **Font Optimization**: Using `next/font` for custom fonts
- [ ] **API Routes**: Proper HTTP methods, error handling, response formats

### 3. React Best Practices
- [ ] **Component Design**: Proper component composition, reusability
- [ ] **Hooks Usage**: Correct use of useState, useEffect, custom hooks
- [ ] **Props**: Proper prop typing, destructuring, default values
- [ ] **Key Props**: Unique keys in lists
- [ ] **Event Handlers**: Proper event handling, no inline functions in JSX when avoidable
- [ ] **Conditional Rendering**: Clean and readable conditional logic
- [ ] **Client Components**: `'use client'` directive only when necessary

### 4. Performance
- [ ] **Bundle Size**: Minimize client-side JavaScript, code splitting
- [ ] **Lazy Loading**: Dynamic imports for heavy components
- [ ] **Memoization**: useMemo, useCallback for expensive operations
- [ ] **Database Queries**: Efficient queries, proper indexing, avoid N+1 problems
- [ ] **Caching**: Appropriate use of Next.js caching mechanisms
- [ ] **Image Optimization**: Proper sizing, formats (WebP), lazy loading
- [ ] **API Calls**: Minimize redundant requests, implement pagination

### 5. Security (Basic)
- [ ] **Input Validation**: All user inputs validated and sanitized
- [ ] **XSS Prevention**: Proper escaping of user-generated content
- [ ] **API Security**: Authentication/authorization checks in API routes
- [ ] **Environment Variables**: Sensitive data in env vars, not hardcoded
- [ ] **HTTPS**: Secure connections for production
- [ ] **Dependencies**: No known vulnerable packages

### 6. Error Handling
- [ ] **Try-Catch**: Proper error boundaries and try-catch blocks
- [ ] **User Feedback**: Clear error messages for users
- [ ] **Logging**: Appropriate error logging for debugging
- [ ] **Fallbacks**: Graceful degradation, loading states, error states
- [ ] **API Errors**: Proper HTTP status codes and error responses

### 7. Database & Data Management
- [ ] **MongoDB/Mongoose**: Proper schema design, validation
- [ ] **Data Validation**: Zod schemas for runtime validation
- [ ] **Transactions**: Use transactions for multi-document operations
- [ ] **Connection Management**: Proper connection pooling, cleanup
- [ ] **Data Sanitization**: Clean data before database operations

### 8. Testing Considerations
- [ ] **Testability**: Code structured for easy testing
- [ ] **Edge Cases**: Handling of edge cases and boundary conditions
- [ ] **Mock Data**: Test data structures match production schemas

### 9. Accessibility
- [ ] **Semantic HTML**: Proper use of HTML5 elements
- [ ] **ARIA Labels**: Accessibility attributes where needed
- [ ] **Keyboard Navigation**: Interactive elements keyboard accessible
- [ ] **Color Contrast**: Sufficient contrast for readability

### 10. Documentation
- [ ] **JSDoc**: Complex functions documented
- [ ] **README**: Component usage documented if reusable
- [ ] **Type Definitions**: Exported types documented

## Review Process

### Step 1: Initial Assessment
1. Identify the type of change (feature, bug fix, refactor)
2. Understand the context and requirements
3. Review related files and dependencies

### Step 2: Code Analysis
1. Check code against the review checklist
2. Identify potential issues, bugs, or improvements
3. Verify TypeScript types and interfaces
4. Check for proper error handling

### Step 3: Architecture Review
1. Assess if the change follows existing patterns
2. Check for proper separation of concerns
3. Verify data flow and state management
4. Review API design and contracts

### Step 4: Performance Review
1. Identify potential performance bottlenecks
2. Check for unnecessary re-renders
3. Review database query efficiency
4. Assess bundle size impact

### Step 5: Provide Feedback
1. Categorize findings: Critical, Important, Suggestion
2. Provide specific, actionable feedback
3. Suggest improvements with code examples
4. Highlight positive aspects of the code

## Output Format

### Critical Issues
- Issues that must be fixed (security, bugs, breaking changes)

### Important Issues
- Issues that should be addressed (performance, maintainability)

### Suggestions
- Nice-to-have improvements (code style, optimization opportunities)

### Positive Highlights
- Well-implemented features or patterns worth noting

## Example Review Template

```markdown
## Code Review Summary

**File(s)**: [list of files reviewed]
**Type**: [Feature/Bug Fix/Refactor]

### Critical Issues
1. **[Issue Title]**
   - Location: `file.ts:line`
   - Problem: [description]
   - Fix: [suggested solution]

### Important Issues
1. **[Issue Title]**
   - Location: `file.ts:line`
   - Problem: [description]
   - Suggestion: [improvement]

### Suggestions
1. **[Suggestion Title]**
   - Location: `file.ts:line`
   - Current: [current implementation]
   - Suggested: [better approach]

### Positive Highlights
- [Well-implemented feature or pattern]

### Overall Assessment
[Summary of code quality and readiness]
```

## Context-Specific Guidelines

### For API Routes (`app/api/**/route.ts`)
- Validate all inputs with Zod schemas
- Use proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- Implement authentication/authorization checks
- Handle errors gracefully with try-catch
- Return consistent response formats
- Use TypeScript for request/response types

### For React Components (`components/**/*.tsx`)
- Use TypeScript interfaces for props
- Implement proper loading and error states
- Optimize re-renders with memo/useMemo/useCallback
- Use semantic HTML and accessibility attributes
- Follow the project's component structure

### For Server Components
- Keep server-only code on the server
- Use async/await for data fetching
- Implement proper error boundaries
- Optimize for streaming and suspense

### For Database Operations
- Use Mongoose schemas with proper validation
- Implement proper error handling
- Use transactions for critical operations
- Optimize queries with proper indexing
- Sanitize inputs before database operations

## Tools & Resources
- **TypeScript**: Leverage strict type checking
- **ESLint**: Follow configured linting rules
- **Next.js Docs**: Reference official documentation
- **React DevTools**: Profile component performance
- **MongoDB Compass**: Analyze query performance
