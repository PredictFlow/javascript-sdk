# Contributing to @predictflow/sdk

Thanks for taking the time to contribute. This is a thin, typed client over the real PredictFlow API - the most valuable thing you can bring to a PR is confidence that what you wrote actually matches what the backend does.

## Ground rule: verify against the real API

Every method in this SDK should correspond to a real, working PredictFlow endpoint. Don't add or change a call based on what seems plausible - check it against the actual API surface (the backend's `openapi.json`, or a request against a real/staging PredictFlow instance) before opening a PR. The PR template has a checkbox for this; it's there because it's already caught a real problem once.

If you're proposing a resource or method for a capability you *think* PredictFlow should have but haven't confirmed exists, open an issue first rather than a PR - it's a product conversation, not a code review.

## Getting set up

```bash
git clone https://github.com/PredictFlow/javascript-sdk.git
cd javascript-sdk
npm install
```

```bash
npm run typecheck   # tsc --noEmit
npm test             # vitest run
npm run test:watch   # vitest, watch mode
npm run build         # dual ESM/CJS bundles + .d.ts via tsup
```

All four should be clean before you open a PR - CI runs the first three (typecheck, test, build) on Node 18, 20, and 22, and it's a required check.

## Making a change

1. Branch from `main`.
2. Keep the diff focused - one logical change per PR. A new resource method, a bug fix, and a docs tweak are three PRs, not one.
3. If you're adding or changing a resource method:
   - Match the existing pattern in `src/resources/*.ts` (thin wrapper around `this.http.get/post/put/patch/delete`, typed request/response via `src/types/*.types.ts`).
   - Add or update a test in `tests/unit/` or `tests/integration/`.
   - Update the README if it's something a consumer would reasonably look for there.
4. This package ships **zero runtime dependencies** on purpose - that's a real feature, not an accident. Don't add one without opening an issue to discuss it first; there's almost always a way to do it with the platform `fetch`/`URL`/`FormData` primitives already in use.
5. Commit messages: a plain, present-tense description of what changed and why is enough (e.g. `Fix retry behavior for non-idempotent requests`). No enforced format.
6. Open the PR against `main` and fill in the template - the test-plan and API-verification checkboxes aren't decoration, they're what a reviewer actually checks first.

## Review & merge

PRs require a passing CI run and a code owner review before merging (see `.github/CODEOWNERS`) - `main` is protected, so nobody, including maintainers, merges without going through this. Don't take a merge delay personally; it's the same gate for everyone.

## Reporting a bug vs. reporting a vulnerability

Regular bugs (wrong types, a broken example, a method that doesn't match the API) → open a GitHub issue.

Anything security-related (a way to leak an API key, bypass signature/auth handling, etc.) → see [SECURITY.md](SECURITY.md) instead of opening a public issue.

## Code of conduct

Be respectful, assume good faith, keep disagreements about the code and not the person. Maintainers may close issues or PRs that don't meet this bar without much ceremony.
