# Security Policy

## Supported versions

This package is pre-1.0 and moving fast. Only the **latest published version on npm** is supported with security fixes - if you're on an older version, please upgrade before reporting an issue that may already be fixed.

## Reporting a vulnerability

**Please do not open a public GitHub issue for a security vulnerability.**

Use GitHub's private vulnerability reporting instead:

1. Go to the [Security tab](https://github.com/PredictFlow/javascript-sdk/security) of this repository.
2. Click **Report a vulnerability**.
3. Describe the issue, including steps to reproduce and, if you have one, a suggested fix.

This opens a private advisory visible only to maintainers and you - it does not create a public issue, and it lets us coordinate a fix and a disclosure timeline before anything is public.

We'll acknowledge a report within 5 business days and aim to have a fix (or a clear remediation plan) within 30 days for confirmed vulnerabilities, sooner for anything actively exploitable.

## What counts as a security issue here

This SDK is a thin HTTP client - its attack surface is narrow, but a few things are genuinely security-relevant:

- Anything that could leak an API key (e.g. logging headers, including credentials in an error message, sending the key somewhere it shouldn't go).
- A way to make a request bypass `Authorization` entirely and still succeed.
- A retry or caching behavior that could replay a request with stale/wrong credentials or send one request's data to the wrong recipient.
- A dependency-supply-chain issue - though this package deliberately ships zero runtime dependencies specifically to minimize this surface.

Things that are **not** security issues, just bugs: a wrong TypeScript type, a method that calls the wrong endpoint, a broken example. Please file those as regular issues instead.

## What we do on our end

- Secret scanning and push protection are enabled on this repository.
- Dependabot security updates are enabled for devDependencies.
- `main` is a protected branch - every change goes through CI and a code owner review before merging, including changes from maintainers.
