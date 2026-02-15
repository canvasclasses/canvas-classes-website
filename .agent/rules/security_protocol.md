# Security Protocol: Zero Secrets in Version Control

## Rule: Never Commit Secrets
Any agent or human collaborator MUST NOT commit, push, or stage any file containing sensitive information (API keys, Database URIs, Passwords, Tokens) to version control (Git/GitHub).

## Critical Files to Protect
The following files and patterns are strictly forbidden from being tracked by Git:
- `.env`
- `.env.local`
- `.local` files
- `*.pem`, `*.key`
- Files containing hardcoded strings like `mongodb+srv://`, `AIza...`, `sk-...`, etc.

## Mandatory Checks Before Any Git Action
Before running `git add`, `git commit`, or `git push`, the agent must:
1.  **Check `.gitignore`**: Ensure that the files being modified or created are not intended to be secret.
2.  **Scan for Hardcoded Keys**: Perform a quick scan of the code for any sensitive strings if new files are being added.
3.  **Use Environment Variables**: Always prefer `process.env[VARIABLE_NAME]` over hardcoding strings. If a key is needed for a script, instruct the user to add it to their `.env.local` file.

## Response Strategy
If an agent detects a hardcoded key in the codebase:
- **Redact It**: Immediately move the key to an environment variable in `.env.local`.
- **Inform the User**: Let the user know exactly what was moved and why.
- **Git Cleanup**: If a key was accidentally committed, use `git rm --cached` and advise the user to rotate the key immediately.
