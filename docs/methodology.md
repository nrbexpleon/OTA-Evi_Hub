# Release-gate methodology

OTA Evidence Hub uses deterministic completeness rules. It does not use an opaque model to approve releases.

## Evidence thread

`Campaign → Release manifest → Packages → Target cohorts → Validation evidence → Release gates → Human decision`

## Base required evidence

- SIL test
- HIL test
- Vehicle test
- Cybersecurity review
- Rollback test
- Release notes

Safety-relevant campaigns additionally require a safety review. Regulated-market campaigns require a compliance review. Campaigns affecting personal data require a privacy review.

Only evidence marked `APPROVED` and not expired counts toward coverage.

## Blocking conditions

- Empty manifest
- Unsigned package
- Missing rollback version
- Missing/incomplete rollout cohorts or no pilot ring
- Missing or expired required evidence
- Failed or open release gates

The tool can identify completeness gaps but cannot judge the technical adequacy of supplied evidence.

## Production backlog

1. Entra/OIDC authentication, RBAC, tenant isolation, and segregation of duties.
2. PostgreSQL/Azure SQL and signed append-only audit records.
3. Secure evidence file upload, malware scan, SHA-256 verification, and provenance.
4. SBOM, vulnerability, VariantGuard, CyberEvidence, ALM, test, CI/CD, and OTA-platform integrations.
5. Cryptographic package/signature verification and dependency-graph validation.
6. Telemetry guardrails, staged-rollout monitoring, stop rules, and rollback triggers.
7. Configurable OEM release policies, regulatory markets, and approval matrices.
8. Signed PDF evidence pack and marketplace APIs.
