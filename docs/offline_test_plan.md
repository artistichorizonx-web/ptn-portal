# Offline/PTN Portal Astral Dock Test Plan  
## Objectives  
- Validate the PORTAL ASTRAL DOCK offline environment operates correctly without network connectivity.  
- Ensure offline commands accurately report system health, economy metrics, and code/brain module summaries.  
- Verify that the economic status subsystem maintains integrity and that code/brain introspection commands return valid overviews.  
- Provide a repeatable procedure for operators to test offline readiness before deployment or audits.  
  
## Prerequisites  
- **Environment Setup:** a local machine or test server with the PTN Portal and Astral Dock components installed. All dependencies (Python, Node.js, container runtime, database) should be present. The system must be configured to run in offline mode (air‑gapped or firewall rules blocking external network calls).  
- **Repository Access:** clone or pull the latest `main` branch of the PTN portal repository. The docs folder should be writeable for logging.  
- **Authentication:** ensure you have necessary credentials or offline tokens to execute internal CLI commands.  
- **Backup:** optionally back up any existing offline state or configuration before running tests.  
  
## Test Scenarios  
  
### 1. Environment Initialization  
**Steps:**  
1. Start the PORTAL ASTRAL DOCK service in offline mode using the startup script (e.g., `./run_offline.sh`).  
2. Check that all required services (web UI, API, database) initialize without contacting external endpoints.  
3. Observe the service logs for errors.  
  
**Expected Outcome:**  
- Services start successfully, and logs indicate offline mode is active with no network errors.  
  
### 2. Offline Status Command  
**Steps:**  
1. Run the offline status command:  
   ```  
   ptn-cli status --offline  
   ```  
2. Review the status summary displayed.  
  
**Expected Outcome:**  
- The command returns a summary of core subsystem statuses (e.g., API, database, worker queue) showing "OK" or "Offline-Ready".  
- No external connectivity checks are attempted.  
  
### 3. Economy Status Check  
**Steps:**  
1. Execute the economy status command to inspect the local economic subsystem:  
   ```  
   ptn-cli economy status --offline  
   ```  
2. Verify the returned metrics (token supply, transaction counts, pending queues).  
  
**Expected Outcome:**  
- The command reports current offline economy metrics (e.g., token supply, local ledger height).  
- All values are within expected ranges and consistent with previous snapshots.  
  
### 4. Code Overview Validation  
**Steps:**  
1. Execute the code overview command:  
   ```  
   ptn-cli code overview --offline  
   ```  
2. Examine the output for details on code modules, versions, and checksums.  
  
**Expected Outcome:**  
- The tool lists all key modules with version numbers and hash digests.  
- Hashes match the expected values recorded in the repository (e.g., via integration.json).  
  
### 5. Brain Overview Validation  
**Steps:**  
1. Execute the brain overview command:  
   ```  
   ptn-cli brain overview --offline  
   ```  
2. Review the summary of AI or ML models loaded into the offline environment.  
  
**Expected Outcome:**  
- The command returns information about the brain models (names, versions, last training date).  
- All required models are loaded and flagged as "Ready".  
  
### 6. Simulate Economy Update  
**Steps:**  
1. Use the CLI to perform a dry-run economy update:  
   ```  
   ptn-cli economy simulate-update --offline  
   ```  
2. Confirm that simulation does not attempt to contact external networks and updates internal ledgers.  
  
**Expected Outcome:**  
- The simulation completes without errors.  
- Economic metrics reflect the simulated update in local state only.  
  
### 7. Log Generation and Review  
**Steps:**  
1. Collect logs generated during the above tests from the logs directory.  
2. Verify that log entries include timestamps, command names, and status.  
  
**Expected Outcome:**  
- Logs are stored in the designated offline log folder.  
- Each entry follows the log format described below.  
  
## Expected Outcomes  
For each scenario above, the expected outcome is provided. In general, commands should succeed without external calls, return structured summaries of system components, and update local state as appropriate. Any deviation (errors, missing modules, mismatched checksums, or network requests) should be recorded as failures.  
  
## Simple Log Format  
Operators should log each test step in a simple, structured format to facilitate auditing. An example log entry format is:  
  
```  
Date/Time: 2025-12-22 14:30 CET  
Scenario: Offline Status Command  
Command: ptn-cli status --offline  
Expected Outcome: Core subsystems report OK/offline-ready  
Actual Outcome: [enter actual result]  
Result: [Pass/Fail]  
Notes: [any additional notes]  
```  
  
Repeat this format for each test scenario. Ensure timestamps are in local time (Europe/Berlin).
