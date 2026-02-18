# RECOVERY AWARENESS ADDITIONS FOR CODER.MD

## Add to STEP 1 (Line 37):

```bash
# 10. CHECK ATTEMPT HISTORY (Recovery Context)
echo -e "\n=== RECOVERY CONTEXT ==="
if [ -f memory/attempt_history.md ]; then
  echo "Attempt History (for retry awareness):"
  cat memory/attempt_history.md

  # Show stuck subtasks if any
  echo "Checking for stuck subtasks in attempt_history.md..."
  grep "Status: stuck" memory/attempt_history.md
else
  echo "No attempt history yet (all subtasks are first attempts)"
fi
echo "=== END RECOVERY CONTEXT ==="
```

## Add to STEP 5 (Before 5.1):

### 5.0: Check Recovery History for This Subtask (CRITICAL - DO THIS FIRST)

```bash
# Check if this subtask was attempted before
SUBTASK_ID="your-subtask-id"  # Replace with actual subtask ID from implementation_plan.md

echo "=== CHECKING ATTEMPT HISTORY FOR $SUBTASK_ID ==="

if [ -f memory/attempt_history.md ]; then
  # Check if this subtask has attempts
  subtask_data=$(grep -A 5 "### $SUBTASK_ID" memory/attempt_history.md 2>/dev/null)

  if [ -n "$subtask_data" ]; then
    echo "⚠️⚠️⚠️ THIS SUBTASK HAS BEEN ATTEMPTED BEFORE! ⚠️⚠️⚠️"
    echo ""
    echo "Previous attempts (see attempt_history.md for details):"
    echo "$subtask_data"
    echo ""
    echo "CRITICAL REQUIREMENT: You MUST try a DIFFERENT approach!"
    echo "Review what was tried above and explicitly choose a different strategy."
    echo ""

    if [ "$attempt_count" -ge 2 ]; then
      echo ""
      echo "⚠️  HIGH RISK: Multiple attempts already. Consider:"
      echo "  - Using a completely different library or pattern"
      echo "  - Simplifying the approach"
      echo "  - Checking if requirements are feasible"
    fi
  else
    echo "✓ First attempt at this subtask - no recovery context needed"
  fi
else
  echo "✓ No attempt history file - this is a fresh start"
fi

echo "=== END ATTEMPT HISTORY CHECK ==="
echo ""
```

**WHAT THIS MEANS:**
- If you see previous attempts, you are RETRYING this subtask
- Previous attempts FAILED for a reason
- You MUST read what was tried and explicitly choose something different
- Repeating the same approach will trigger circular fix detection

## Add to STEP 6 (After marking in_progress):

### Record Your Approach (Recovery Tracking)

**IMPORTANT: Before you write any code, document your approach.**

```python
# Record your implementation approach for recovery tracking
import datetime

subtask_id = "your-subtask-id"  # Your current subtask ID
approach_description = """
Describe your approach here in 2-3 sentences.
"""

# This will be used to detect circular fixes
approach_file = "memory/current_approach.txt"
with open(approach_file, "a") as f:
    f.write(f"\n--- {subtask_id} at {datetime.datetime.now().isoformat()} ---\n")
    f.write(approach_description.strip())
    f.write("\n")

print(f"Approach recorded for {subtask_id}")
```

**Why this matters:**
- If your attempt fails, the recovery system will read this
- It helps detect if next attempt tries the same thing (circular fix)
- It creates a record of what was attempted for human review

## Add to STEP 7 (After verification section):

### If Verification Fails - Recovery Process

```python
# If verification failed, record the attempt in attempt_history.md
with open("memory/attempt_history.md", "a") as f:
    f.write(f"\n### {subtask_id}\n")
    f.write(f"- **Timestamp**: {datetime.datetime.now().isoformat()}\n")
    f.write(f"- **Approach**: {approach}\n")
    f.write(f"- **Status**: failed\n")
    f.write(f"- **Error**: {error_message}\n")
```

## Add NEW STEP between 9 and 10:

## STEP 9B: RECORD SUCCESSFUL ATTEMPT (If verification passed)

```python
# Record successful completion in attempt_history.md
with open("memory/attempt_history.md", "a") as f:
    f.write(f"\n### {subtask_id}\n")
    f.write(f"- **Timestamp**: {datetime.datetime.now().isoformat()}\n")
    f.write(f"- **Approach**: {approach}\n")
    f.write(f"- **Status**: completed\n")

# Also record as good commit
with open("memory/build_commits.md", "a") as f:
    f.write(f"- **Commit**: {commit_hash} ({subtask_id})\n")
```

## KEY RECOVERY PRINCIPLES TO ADD:

### The Recovery Loop

```
1. Start subtask
2. Check attempt_history.md for this subtask
3. If previous attempts exist:
   a. READ what was tried
   b. READ what failed
   c. Choose DIFFERENT approach
4. Record your approach
5. Implement
6. Verify
7. If SUCCESS: Record attempt, record good commit, mark complete
8. If FAILURE: Record attempt with error, check if stuck (3+ attempts)
```

### When to Mark as Stuck

A subtask should be marked as stuck if:
- 3+ attempts with different approaches all failed
- Circular fix detected (same approach tried multiple times)
- Requirements appear infeasible
- External blocker (missing dependency, etc.)

```python
# Mark subtask as stuck in attempt_history.md
with open("memory/attempt_history.md", "a") as f:
    f.write(f"\n### {subtask_id}\n")
    f.write(f"- **Status**: stuck\n")
    f.write(f"- **Reason**: {reason}\n")

# Also update implementation_plan.md status to "blocked"
```
