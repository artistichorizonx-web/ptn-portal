# Offline/PTN Portal Astral Dock Test Plan

## Objectives
- Validate that the PORTAL ASTRAL DOCK offline environment operates correctly without network access.
- Ensure offline commands correctly report system health, economy status, and code/brain module information.
- Provide operators with a checklist to verify offline readiness and diagnose issues.
- Document expected outcomes for each test scenario.

## Prerequisites
- **Environment:** A local machine or server with the PORTAL ASTRAL DOCK application installed. Ensure all dependencies (e.g., Python 3.x, NodeJS, Docker) are installed.
- **Repository clone:** Clone the PTN portal repository locally and check out the `main` branch.
- **Offline mode:** Disconnect from external networks or configure firewall rules to block external connections.
- **Credentials:** Ensure any necessary API keys or tokens for offline mode are configured via environment variables.
- **Tools:** Access to CLI tools (e.g., `ptnctl` or equivalent) and log viewer.

## Test Scenarios

### 1. Environment Setup Verification
| Test | Steps | Expected Result |
|---|---|---|
| Env‑1 | Verify installation by running `ptnctl version`. | Command returns the installed version and indicates no missing dependencies. |
| Env‑2 | Start the offline server using `ptnctl start --offline`. | Server starts locally (e.g., `http://127.0.0.1:8787/`) and logs show “Offline mode enabled”. |
| Env‑3 | Attempt to access external network while in offline mode. | Access is blocked; system should remain offline and provide a warning. |

### 2. Offline Commands – Status Verification
| Test | Steps | Expected Result |
|---|---|---|
| Cmd‑1 | Run `ptnctl status`. | Displays current server status, uptime, memory usage, and confirms offline mode. |
| Cmd‑2 | Run `ptnctl sync‑status --offline`. | Reports synchronization status with local data stores; no external sync attempts. |
| Cmd‑3 | Run `ptnctl healthcheck`. | All subsystems show “OK”; no internet dependency errors. |

### 3. Economy Status Checks
| Test | Steps | Expected Result |
|---|---|---|
| Eco‑1 | Run `ptnctl economy status`. | Returns current token supply, balance and any pending offline transactions. |
| Eco‑2 | Run `ptnctl economy simulate --offline`. | Simulation runs using local economy module and outputs success message. |
| Eco‑3 | Verify that no network calls are made during economy commands. | Network monitoring shows zero external connections. |

### 4. Code/Brain Overview Validation
| Test | Steps | Expected Result |
|---|---|---|
| Brain‑1 | Run `ptnctl code list`. | Lists available code modules and versions. |
| Brain‑2 | Run `ptnctl brain overview`. | Provides summary of loaded AI/brain modules, memory footprint, and status. |
| Brain‑3 | Run `ptnctl brain validate`. | Confirms that brain models are intact, checksums match, and outputs “Validation OK”. |

### 5. Shutdown and Cleanup
| Test | Steps | Expected Result |
|---|---|---|
| Shutdown‑1 | Run `ptnctl stop`. | Stops the offline server gracefully and cleans temporary files. |
| Shutdown‑2 | Run `ptnctl purge‑cache`. | Cleans cached data; command completes without errors. |

## Expected Outcomes
- All commands should complete without requiring internet connectivity.
- Status and economy commands should return data from local storage.
- Code/brain overview commands should validate integrity and version of modules.
- Any errors encountered should be logged with clear messages to aid troubleshooting.

## Simple Log Format
Test operators should log each step in a simple structured format:

| Timestamp | Test ID | Result | Notes |
|---|---|---|---|
| 2025-12-22 14:00 | Env‑1 | Pass | Version 1.0.3, dependencies OK |
| 2025-12-22 14:05 | Cmd‑1 | Pass | Status: Running, offline mode |

Use ISO 8601 timestamps and short notes describing observations. Retain logs for audit and regression analysis.

## References
This test plan draws on general principles of test planning: establishing clear objectives and scope, defining testing activities, and designing detailed steps and expected results ([Explaining the Duty Statuses in E-Logs Mobile App - T3 Help Center](https://help.estrack.com/en/articles/3687882-explaining-the-duty-statuses-in-e-logs-mobile-app#:~:text=When%20conducting%20a%20penetration%20test,Test%20Plan%20in%2011%20Steps), [[PDF] System Testing in the Avionics Domain](https://d-nb.info/987607650/34#:~:text=on%20the%20preceeding%20SUT%20outputs,fly%20test%20data%20generation)).
