## Summary

<!-- What does this PR change, and why? -->

## Type of change

- [ ] Bug fix
- [ ] New feature / new resource or method
- [ ] Breaking change (anything that changes an existing public method's signature or behavior)
- [ ] Docs only

## Verified against the real API

<!--
This SDK wraps the real PredictFlow backend - every endpoint it calls should
correspond to a real one. If you added or changed a call, confirm it against
the backend's openapi.json (or the running API) rather than assuming a path.
-->

- [ ] Every new/changed HTTP call matches a real backend endpoint (method, path, and response shape)
- [ ] No new required runtime dependency was introduced (this package ships zero runtime deps)

## Test plan

- [ ] `npm run typecheck` passes
- [ ] `npm test` passes, and I added/updated tests covering this change
- [ ] `npm run build` succeeds

## Linked issue

Closes #
