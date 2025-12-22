# PTN Offline Test Plan
## PORTAL ASTRAL DOCK

This document defines an offline-first test plan for the **PORTAL ASTRAL DOCK** workflow in the PTN ecosystem. The goal is to validate core behavior without network access, prevent secret leakage, and provide repeatable evidence via logs and exported artifacts.

---

## Objectives

- Verify **offline operability** of the Portal dock workflow (no network required).
- Confirm **repository hygiene** expectations: no secrets committed, predictable structure, reproducible outputs.
- Validate **status commands** and local diagnostics for runtime readiness.
- Perform **economy safety checks** (configuration integrity only, no unintended transactions).
- Validate **code/brain overviews** (manifests, module topology, memory summaries) without exposing private data.
- Produce a minimal **test log** suitable for audits and regression tracking.

---

## Prerequisites

### Environment Setup (Offline)

- OS: macOS / Linux
- Tools:
  - `git`
  - `python` (3.10+ recommended)
  - `pip`
- Optional tools (if present):
  - `node` / `npm`
  - `jq`
  - `ollama`

### Local Workspace

- Repository cloned locally and accessible.
- You can run:
  - `git status`
  - `python -V`
  - `pip -V`

### Safety Requirements

- Do **not** commit real secrets:
  - `.env`, `*.pem`, `*.key`, `*.p12`, seed phrases, API keys, private wallet keys.
- Ensure `.gitignore` excludes:
  - `.env`
  - `*.pem` / `*.key` / `*.p12`
  - `**/secrets/**`
  - `**/.ptn_private/**` (if used)

---

## Test Scenarios

### 1) Offline Status Verification

**Steps**
1. Disable network (Airplane mode / unplug Ethernet).
2. Run:
   - `git status -sb`
   - `git log -1 --oneline`
   - `git rev-parse --abbrev-ref HEAD`
   - `git rev-parse HEAD`
   - `git diff --name-only --diff-filter=U`

**Expected Outcomes**
- Commands work offline.
- No unmerged entries.
- Repo is on expected branch (`main` or a designated test branch).

---

### 2) Offline Runtime Readiness

**Commands**
- `python -V`
- `pip -V`
- `git --version`
- Optional:
  - `node -v`
  - `npm -v`
  - `jq --version`
  - `ollama --version`
  - `ollama list`
  - `ollama ps`

**Expected Outcomes**
- Required tools report versions without network calls.
- Optional tools fail gracefully if not installed.

---

### 3) Repo Hygiene Scan (Offline)

**Goal:** identify risky filenames without printing secret values.

**Commands**
- Names only:
  - `find . -maxdepth 6 -type f \( -name ".env" -o -name "*.pem" -o -name "*.key" -o -name "*.p12" -o -iname "*secret*" -o -iname "*token*" -o -iname "*private*" -o -iname "*seed*" \) | head -n 50`
- Ensure secrets are not tracked:
  - `git ls-files | grep -E "(\.env$|\.pem$|\.key$|\.p12$)" || true`

**Expected Outcomes**
- No secret/key material is tracked by git.
- `.gitignore` contains rules to exclude secrets.

---

### 4) Economy Status Checks (Offline Safety)

**Goal:** verify configuration integrity only, no transactions.

**Steps**
1. Locate economy/ledger configs:
   - `find . -maxdepth 6 -type f -iname "*economy*.json" -o -iname "*ledger*.json" -o -iname "*wallet*.json" | head -n 50`
2. Validate JSON structure (no values printed):
   - `python - <<PY\nimport json, glob\npaths = glob.glob(\"**/*economy*.json\", recursive=True) + glob.glob(\"**/*ledger*.json\", recursive=True) + glob.glob(\"**/*wallet*.json\", recursive=True)\nfor p in paths[:200]:\n  try:\n    json.load(open(p, \"r\", encoding=\"utf-8\"))\n    print(\"OK_JSON\", p)\n  except Exception as e:\n    print(\"BAD_JSON\", p, str(e))\nPY`

**Expected Outcomes**
- Economy-related JSON (if any) parses cleanly.
- No transaction commands are executed.
- No secrets are revealed in console logs.

---

### 5) Validate Code/Brain Overviews (Offline)

**Steps**
1. Identify manifests/modules:
   - `find . -maxdepth 6 -type f -iname "*manifest*.json" -o -iname "*manifest*.yml" -o -iname "*manifest*.yaml" -o -iname "*module*.json" | head -n 50`
2. Summarize topology (offline-safe):
   - `python - <<PY\nimport os\ncount=0\nfor d,_,fs in os.walk(.):\n  if /.git/ in d or /node_modules/ in d: continue\n  for f in fs:\n    if f.endswith((.md,.json,.yml,.yaml,.toml,.py,.js,.ts,.html,.css)):\n      count += 1\nprint(TOPOLOGY_FILES, count)\nPY`

**Expected Outcomes**
- Manifest files exist (if expected) and are discoverable.
- Topology output is consistent between runs (within expected diffs).
- No network calls are required for overview generation.

---

## Expected Outcomes

- Offline verification completes without network access.
- Repo has no unmerged files after test.
- Hygiene checks show no secrets tracked by git.
- Economy configuration files (if present) parse correctly.
- Code/brain overview artifacts can be generated locally.
- A log entry exists for traceability.

---

## Simple Log Format


