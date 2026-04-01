# Security Auditor Skill

## Overview
This skill provides comprehensive security auditing capabilities for the Next.js full-stack application, focusing on identifying vulnerabilities, security misconfigurations, and implementing security best practices.

## Scope
- **Authentication & Authorization**: User authentication, role-based access control (RBAC)
- **API Security**: API route protection, input validation, rate limiting
- **Data Security**: Database security, data encryption, sensitive data handling
- **Frontend Security**: XSS prevention, CSRF protection, secure client-side code
- **Infrastructure**: Environment variables, secrets management, deployment security

## Security Audit Checklist

### 1. Authentication & Authorization

#### Authentication
- [ ] **Secure Authentication**: Using Supabase Auth or equivalent secure solution
- [ ] **Password Security**: Strong password requirements, hashing (bcrypt/argon2)
- [ ] **Session Management**: Secure session tokens, proper expiration
- [ ] **Token Storage**: Tokens stored securely (httpOnly cookies, not localStorage for sensitive tokens)
- [ ] **Multi-Factor Authentication**: MFA implementation where applicable
- [ ] **Account Lockout**: Brute force protection mechanisms

#### Authorization
- [ ] **RBAC Implementation**: Proper role-based access control
- [ ] **Permission Checks**: Authorization checks on all protected routes/APIs
- [ ] **Principle of Least Privilege**: Users have minimum necessary permissions
- [ ] **Server-Side Validation**: Authorization enforced on server, not just client
- [ ] **Resource Ownership**: Users can only access their own resources
- [ ] **Admin Routes**: Admin functionality properly protected

### 2. API Security

#### Input Validation
- [ ] **Schema Validation**: All inputs validated with Zod or similar
- [ ] **Type Safety**: TypeScript types enforced at runtime
- [ ] **Sanitization**: User inputs sanitized to prevent injection attacks
- [ ] **File Upload Validation**: File types, sizes, content validated
- [ ] **Query Parameters**: URL parameters validated and sanitized
- [ ] **Request Body**: POST/PUT/PATCH body data validated

#### API Route Protection
- [ ] **Authentication Required**: Protected routes check authentication
- [ ] **Authorization Checks**: Role/permission verification on sensitive endpoints
- [ ] **Rate Limiting**: API rate limiting implemented to prevent abuse
- [ ] **CORS Configuration**: Proper CORS headers, restricted origins
- [ ] **HTTP Methods**: Only allowed HTTP methods accepted
- [ ] **API Versioning**: Versioned APIs for backward compatibility

#### Error Handling
- [ ] **No Sensitive Data Leakage**: Error messages don't expose system details
- [ ] **Generic Error Messages**: User-facing errors are generic
- [ ] **Proper Status Codes**: Correct HTTP status codes used
- [ ] **Error Logging**: Errors logged securely for debugging
- [ ] **Stack Traces**: No stack traces exposed in production

### 3. Data Security

#### Database Security
- [ ] **Connection Security**: MongoDB connection uses TLS/SSL
- [ ] **Authentication**: Database requires authentication
- [ ] **Least Privilege**: Database user has minimal required permissions
- [ ] **Injection Prevention**: Parameterized queries, no string concatenation
- [ ] **Data Validation**: Schema-level validation in MongoDB/Mongoose
- [ ] **Backup Security**: Database backups encrypted and secured

#### Sensitive Data Handling
- [ ] **Encryption at Rest**: Sensitive data encrypted in database
- [ ] **Encryption in Transit**: HTTPS/TLS for all communications
- [ ] **PII Protection**: Personal Identifiable Information properly handled
- [ ] **Data Minimization**: Only necessary data collected and stored
- [ ] **Secure Deletion**: Sensitive data securely deleted when no longer needed
- [ ] **No Hardcoded Secrets**: No API keys, passwords in source code

#### Data Exposure
- [ ] **API Responses**: No sensitive data in API responses
- [ ] **Logging**: No sensitive data logged (passwords, tokens, PII)
- [ ] **Client-Side**: No sensitive data exposed to client
- [ ] **Database Queries**: Proper field selection, no over-fetching

### 4. Frontend Security

#### XSS Prevention
- [ ] **React Escaping**: Leveraging React's built-in XSS protection
- [ ] **dangerouslySetInnerHTML**: Avoided or properly sanitized
- [ ] **User-Generated Content**: All UGC sanitized before rendering
- [ ] **External Scripts**: No untrusted external scripts loaded
- [ ] **Content Security Policy**: CSP headers configured

#### CSRF Protection
- [ ] **CSRF Tokens**: Anti-CSRF tokens for state-changing operations
- [ ] **SameSite Cookies**: Cookies use SameSite attribute
- [ ] **Origin Validation**: Request origin validated for sensitive operations

#### Client-Side Security
- [ ] **No Sensitive Logic**: Business logic on server, not client
- [ ] **API Keys**: No API keys exposed in client-side code
- [ ] **Local Storage**: No sensitive data in localStorage/sessionStorage
- [ ] **Third-Party Libraries**: Dependencies scanned for vulnerabilities
- [ ] **Subresource Integrity**: SRI for external resources

### 5. Environment & Configuration

#### Environment Variables
- [ ] **Secrets Management**: All secrets in environment variables
- [ ] **No Committed Secrets**: `.env` files in `.gitignore`
- [ ] **Production Secrets**: Different secrets for dev/staging/prod
- [ ] **Variable Naming**: Clear distinction between public/private vars (NEXT_PUBLIC_*)
- [ ] **Secret Rotation**: Process for rotating secrets/keys

#### Next.js Configuration
- [ ] **Security Headers**: Proper security headers in `next.config.ts`
  - X-Frame-Options
  - X-Content-Type-Options
  - Referrer-Policy
  - Permissions-Policy
- [ ] **HTTPS Enforcement**: HTTPS redirect in production
- [ ] **Image Domains**: Restricted image domains configured
- [ ] **API Routes**: Protected from unauthorized access

### 6. Dependencies & Supply Chain

#### Package Security
- [ ] **Vulnerability Scanning**: Regular `npm audit` or equivalent
- [ ] **Dependency Updates**: Dependencies kept up-to-date
- [ ] **Minimal Dependencies**: Only necessary packages installed
- [ ] **Package Verification**: Packages from trusted sources
- [ ] **Lock Files**: `package-lock.json` committed for reproducibility
- [ ] **Deprecated Packages**: No deprecated or unmaintained packages

### 7. Session & Cookie Security

#### Cookie Configuration
- [ ] **HttpOnly Flag**: Sensitive cookies marked httpOnly
- [ ] **Secure Flag**: Cookies marked secure in production
- [ ] **SameSite**: SameSite attribute set appropriately
- [ ] **Cookie Expiration**: Proper expiration times set
- [ ] **Cookie Scope**: Domain and path properly restricted

#### Session Management
- [ ] **Session Expiration**: Sessions expire after inactivity
- [ ] **Session Invalidation**: Logout properly invalidates sessions
- [ ] **Concurrent Sessions**: Handling of multiple sessions
- [ ] **Session Fixation**: Protection against session fixation attacks

### 8. File Upload Security

- [ ] **File Type Validation**: Whitelist of allowed file types
- [ ] **File Size Limits**: Maximum file size enforced
- [ ] **Content Validation**: File content matches extension
- [ ] **Malware Scanning**: Files scanned for malware if applicable
- [ ] **Storage Security**: Uploaded files stored securely (S3/R2)
- [ ] **Access Control**: File access properly controlled
- [ ] **Filename Sanitization**: Filenames sanitized to prevent path traversal

### 9. Logging & Monitoring

#### Security Logging
- [ ] **Authentication Events**: Login attempts, failures logged
- [ ] **Authorization Failures**: Access denials logged
- [ ] **Suspicious Activity**: Unusual patterns detected and logged
- [ ] **Audit Trail**: Critical operations logged for audit
- [ ] **Log Security**: Logs protected from tampering
- [ ] **No Sensitive Data**: Logs don't contain passwords, tokens, PII

#### Monitoring
- [ ] **Error Monitoring**: Production errors monitored
- [ ] **Performance Monitoring**: Unusual performance patterns detected
- [ ] **Security Alerts**: Alerts for security-relevant events

### 10. Deployment & Infrastructure

#### Production Security
- [ ] **Environment Separation**: Dev/staging/prod properly isolated
- [ ] **HTTPS Only**: All production traffic over HTTPS
- [ ] **Security Headers**: All security headers configured
- [ ] **Error Pages**: Custom error pages, no sensitive info
- [ ] **Source Maps**: Source maps not exposed in production
- [ ] **Debug Mode**: Debug mode disabled in production

#### Vercel/Deployment Platform
- [ ] **Environment Variables**: Secrets configured in platform
- [ ] **Access Control**: Deployment access restricted
- [ ] **Preview Deployments**: Preview environments secured
- [ ] **Domain Security**: Custom domains properly configured

## Security Audit Process

### Step 1: Reconnaissance
1. Identify the scope of changes
2. Map data flow and trust boundaries
3. Identify sensitive operations and data
4. Review authentication/authorization requirements

### Step 2: Threat Modeling
1. Identify potential threat actors
2. List possible attack vectors
3. Assess impact of potential vulnerabilities
4. Prioritize security concerns

### Step 3: Code Analysis
1. Review code against security checklist
2. Identify input validation gaps
3. Check authentication/authorization implementation
4. Verify secure data handling
5. Review error handling and logging

### Step 4: Configuration Review
1. Check environment variable usage
2. Review Next.js security configuration
3. Verify security headers
4. Check dependency vulnerabilities

### Step 5: Testing Recommendations
1. Suggest security test cases
2. Identify areas for penetration testing
3. Recommend automated security scanning

### Step 6: Report Findings
1. Categorize by severity: Critical, High, Medium, Low
2. Provide exploitation scenarios
3. Suggest remediation steps
4. Estimate risk and impact

## Severity Levels

### Critical
- Remote code execution vulnerabilities
- SQL/NoSQL injection vulnerabilities
- Authentication bypass
- Exposed secrets or credentials
- Unrestricted file upload allowing code execution

### High
- XSS vulnerabilities
- CSRF vulnerabilities
- Authorization bypass
- Sensitive data exposure
- Insecure direct object references

### Medium
- Missing security headers
- Weak session management
- Information disclosure
- Insufficient logging
- Outdated dependencies with known vulnerabilities

### Low
- Missing rate limiting
- Verbose error messages
- Minor configuration issues
- Best practice violations

## Output Format

```markdown
## Security Audit Report

**Date**: [audit date]
**Scope**: [files/features audited]
**Auditor**: Security Auditor Skill

### Executive Summary
[Brief overview of findings and overall security posture]

### Critical Vulnerabilities
1. **[Vulnerability Title]** - CVSS: [score]
   - **Location**: `file.ts:line`
   - **Description**: [detailed description]
   - **Exploitation**: [how it can be exploited]
   - **Impact**: [potential damage]
   - **Remediation**: [specific fix steps]
   - **Priority**: IMMEDIATE

### High Severity Issues
[Same format as Critical]

### Medium Severity Issues
[Same format as Critical]

### Low Severity Issues
[Same format as Critical]

### Security Best Practices
- [Recommendations for improving security posture]

### Compliance Notes
- [Any compliance-related observations]

### Positive Security Controls
- [Well-implemented security measures]

### Recommendations
1. [Prioritized list of security improvements]
```

## Common Vulnerability Patterns

### MongoDB Injection
```typescript
// ❌ Vulnerable
const user = await User.findOne({ username: req.body.username });

// ✅ Secure
const schema = z.object({ username: z.string() });
const { username } = schema.parse(req.body);
const user = await User.findOne({ username });
```

### XSS via dangerouslySetInnerHTML
```typescript
// ❌ Vulnerable
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ Secure
import DOMPurify from 'isomorphic-dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />
```

### Exposed API Keys
```typescript
// ❌ Vulnerable
const apiKey = "sk_live_abc123";

// ✅ Secure
const apiKey = process.env.API_KEY;
```

### Missing Authorization
```typescript
// ❌ Vulnerable
export async function DELETE(req: Request) {
  const { id } = await req.json();
  await deleteResource(id);
}

// ✅ Secure
export async function DELETE(req: Request) {
  const session = await getSession(req);
  if (!session) return new Response('Unauthorized', { status: 401 });
  
  const { id } = await req.json();
  const resource = await getResource(id);
  
  if (resource.userId !== session.userId) {
    return new Response('Forbidden', { status: 403 });
  }
  
  await deleteResource(id);
}
```

## Security Testing Checklist

- [ ] Test authentication bypass attempts
- [ ] Test authorization with different user roles
- [ ] Test input validation with malicious payloads
- [ ] Test file upload with various file types
- [ ] Test API rate limiting
- [ ] Test CSRF protection
- [ ] Test XSS prevention
- [ ] Test session management
- [ ] Run `npm audit` for dependency vulnerabilities
- [ ] Review all API routes for security

## Tools & Resources

- **npm audit**: Check for vulnerable dependencies
- **Zod**: Runtime type validation
- **Supabase Auth**: Secure authentication solution
- **OWASP Top 10**: Reference for common vulnerabilities
- **Next.js Security Headers**: Configure in `next.config.ts`
- **MongoDB Security Checklist**: Database security best practices
- **Vercel Security**: Platform-specific security features

## Compliance Considerations

- **GDPR**: Data privacy, user consent, right to deletion
- **CCPA**: California Consumer Privacy Act compliance
- **PCI DSS**: If handling payment card data
- **HIPAA**: If handling health information
- **SOC 2**: Security, availability, confidentiality controls
