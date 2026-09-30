# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); this project follows
[Semantic Versioning](https://semver.org/) once it reaches 1.0.0 - see
[CONTRIBUTING.md](CONTRIBUTING.md#versioning--breaking-changes) for what that
means before then.

## [0.1.2] - 2026-09-29

### Changed

- Enriched `package.json` metadata: a more specific `description`, added
  accurate keywords (`shopify`, `woocommerce`, `api-client`, `rest-api`), and
  upgraded `author` to the object form with a `url` so it renders as a link
  on the npm package page. No code changes.

## [0.1.1] - 2026-09-29

No functional changes - this release exists to verify the npm Trusted
Publishing (OIDC) pipeline end to end after switching off the stage-only
token model.

## [0.1.0] - 2026-09-29

Initial release.

### Added

- `PredictFlow` client covering 8 resources: stores, products, predictions,
  analytics, pricing, scenarios, alerts, exports.
- Typed error hierarchy (`PredictFlowError` and subclasses), including
  unwrapping FastAPI/Pydantic's array-shaped `detail` on 422s into a
  readable message.
- Automatic retries with backoff on `GET`/`PUT`/`DELETE` for `429`/5xx
  responses; `POST`/`PATCH` don't retry by default since they aren't
  guaranteed idempotent (a caller can opt a specific call in via
  `maxRetries`).
- Zero runtime dependencies.
- Provenance-signed releases via npm Trusted Publishing (OIDC) - no
  long-lived publish token in CI.

Every endpoint this SDK calls was verified against the real backend before
release (see [CONTRIBUTING.md](CONTRIBUTING.md)) - including removing an
entire `webhooks` module from an earlier draft that described a signed
outbound-event system PredictFlow doesn't actually have.
