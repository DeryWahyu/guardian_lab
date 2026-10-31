# TEST READY — Guardian Lab E2E Test Suite (Tiers 1–4)

> **Document:** `/home/alfiang/Projects/guardian-lab/TEST_READY.md`  
> **Status:** VERIFIED & READY  
> **Test Framework:** `bun:test` (Bun 1.3.1)  
> **Total Test Count:** 86 tests (78 E2E tests + 8 baseline unit tests) across 6 test files  
> **Pass Rate:** 100% (86 pass, 0 fail, 286 assertions)  
> **Execution Duration:** ~140ms

---

## 1. Test Suite Architecture & 4-Tier Methodology

The Guardian Lab E2E test suite adheres to the 4-Tier Test Design Methodology specified in the Master Project Plan (`PROJECT.md`):

| Tier       | File Path                                  | Focus & Coverage                                                                                                                                                                                           | Test Count | Status |
| :--------- | :----------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :----- |
| **Tier 1** | `tests/e2e/tier1-features.test.ts`         | **Feature Coverage:** Happy path testing across all 28 features in `PROJECT.md` Feature Inventory (M1 to M5).                                                                                              | 44 tests   | PASS   |
| **Tier 2** | `tests/e2e/tier2-boundary.test.ts`         | **Boundary & Corner Cases:** Extreme inputs, oversized payloads, corrupt QR/APKs, SQLi/XSS/SSRF/Path Traversal injections, PII boundary stress, auth cookie tampering.                                     | 26 tests   | PASS   |
| **Tier 3** | `tests/e2e/tier3-integration.test.ts`      | **Cross-Feature Combinations:** 4 multi-module user journeys (Phishing to Share Card, Quishing to Browser Sandbox, APK X-Ray to Community Replay, Guest Interception to Academy Level Up).                 | 4 tests    | PASS   |
| **Tier 4** | `tests/e2e/tier4-scenarios.test.ts`        | **Real-World Scenarios:** Concrete simulations of prevalent Indonesian cybercrime campaigns (Fake courier J&T/Undangan Nikah APK, Bank BCA typosquatting, Quishing QRIS, OJK IASC 2026 multi-layer fraud). | 4 tests    | PASS   |
| **Unit**   | `lib/routes.test.ts` & `lib/utils.test.ts` | Centralized routes verification & Tailwind CSS utility merging.                                                                                                                                            | 8 tests    | PASS   |

---

## 2. Test Execution Commands

### Run Full Test Suite:

```bash
bun test
```

### Run Individual Tiers:

```bash
# Tier 1: All 28 Features Happy Path
bun test tests/e2e/tier1-features.test.ts

# Tier 2: Boundary, Injection & Stress Cases
bun test tests/e2e/tier2-boundary.test.ts

# Tier 3: Cross-Feature Integration Journeys
bun test tests/e2e/tier3-integration.test.ts

# Tier 4: Real-World Indonesian Cybercrime Scenarios
bun test tests/e2e/tier4-scenarios.test.ts
```

### Code Style & Linter Checks:

```bash
# Biome Linter
bun x @biomejs/biome check tests/e2e

# Prettier Formatter
bun x prettier --check tests/
```

---

## 3. Test Fixtures & Data Assets

The test suite includes dedicated datasets matching Indonesian threat telemetry:

- **Phishing URLs (`tests/e2e/fixtures/phishing-urls.ts`):** Real-world typosquatting targets (`klikbca-verifikasi-otp.top`, `resi-posindonesia-lacak-paket.buzz`, `dana-kaget-saldo-gratis.xyz`), legitimate banking domains, and adversarial boundary URLs (12,000+ chars, SQLi, XSS, SSRF, Punycode).
- **Malware Samples (`tests/e2e/fixtures/malware-samples.ts`):** Trojanized APK metadata simulating Indonesian courier APK scams, dangerous permissions (`RECEIVE_SMS`, `READ_SMS`, `FOREGROUND_SERVICE`), hardcoded Telegram bot tokens, and corrupted APK headers.
- **QR Codes & Quishing (`tests/e2e/fixtures/qr-codes.ts`):** Fraudulent QRIS payment portals, base64 images, and corrupted non-image buffers.
- **User Accounts & Roles (`tests/e2e/fixtures/user-fixtures.ts`):** Admin credentials, standard user accounts, registration inputs, tampered JWT cookies, and expired tokens.
- **Academy Quizzes (`tests/e2e/fixtures/quiz-fixtures.ts`):** Spot-the-Phish, Social Engineering Breakdown, and Dangerous Permissions questions, EXP milestones, and rank tiers.
- **Test Harness & Oracles (`tests/e2e/helpers/test-harness.ts`):** Zod schemas validating contracts (`ThreatAnalysisResultSchema`, `UserSessionSchema`, `SandboxSessionStartSchema`, `CommunityReplaySchema`), mathematical Shannon entropy calculator, Levenshtein distance calculator, and progressive test dispatcher.

---

## 4. Key Engineering Discoveries & Escalations for Implementers

1. **Telegram Bot Token Regex Word Boundary Nuance:**
   - _Observation:_ When an APK or URL contains `https://api.telegram.org/bot<TOKEN>`, the token directly follows `bot`. Since `t` and digits are both word characters (`\w`), a standard `\b[0-9]{9,10}:...` boundary fails to match `bot123456789:...`.
   - _Recommendation:_ Implementers should use `/(?:\b|(?<=bot))[0-9]{9,10}:[a-zA-Z0-9_-]{35}\b/g` to capture tokens embedded in standard Telegram bot API URL endpoints.

2. **Harmonization of Risk Level Enums:**
   - _Observation:_ `PROJECT.md` specifies `riskLevel: "SAFE" | "WARNING" | "DANGEROUS" | "PHISHING" | "MALWARE"`, while `ai-agent-docs/api-and-prompts.md` specifies `"risk_level": "CRITICAL | HIGH | MEDIUM | LOW"`.
   - _Recommendation:_ The test harness accepts both sets of enums (`SAFE`, `WARNING`, `DANGEROUS`, `PHISHING`, `MALWARE`, `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) to maintain 100% interoperability across documentation specifications.
