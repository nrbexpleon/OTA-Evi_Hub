# OTA Evidence Hub

Evidence-based release assurance for automotive OTA/FOTA campaigns.

OTA Evidence Hub helps OEM and Tier-1 teams assemble a release manifest, map affected vehicle variants, verify cybersecurity and validation gates, assess rollout and rollback readiness, and record accountable human release decisions.

## MVP capabilities

- OTA campaign and release-manifest definition
- Software package, ECU, dependency, checksum, and signature metadata
- Target vehicle-cohort and variant tracking
- Evidence register for SIL/HIL/vehicle tests, cybersecurity, safety, compliance, and operations
- Transparent release-gate evaluation
- Rollout-ring planning and minimum sample checks
- Rollback package and recovery-readiness checks
- Blocking findings, remediation actions, and human approval workflow
- Append-style audit events and downloadable JSON evidence pack
- REST API, responsive UI, tests, Docker, and Azure deployment assets

## Important limitation

This MVP provides engineering decision support only. It does not deploy software to vehicles, prove legal or regulatory compliance, or replace programme release authority. Evidence and thresholds must be approved for each vehicle programme.

## Run

Requires Node.js 20+.

```bash
npm test
npm start
```

Open http://localhost:3000.

## API

- `GET /api/health`
- `GET|POST /api/campaigns`
- `GET /api/campaigns/:id`
- `POST /api/campaigns/:id/packages`
- `POST /api/campaigns/:id/cohorts`
- `POST /api/campaigns/:id/evidence`
- `POST /api/campaigns/:id/gates`
- `POST /api/campaigns/:id/reviews`
- `GET /api/campaigns/:id/report`

See `docs/methodology.md` for the release-gate model.
