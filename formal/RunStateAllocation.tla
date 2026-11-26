---- MODULE RunStateAllocation ----
EXTENDS Naturals, FiniteSets

CONSTANTS Actors, MaxId

VARIABLES
  phase,       \* [Actors -> {"idle", "reserved", "implementing", "done"}]
  locks,       \* [1..MaxId -> Actors \cup {"none"}]
  committed,   \* SUBSET (1..MaxId)
  checkoutOwner \* Actors \cup {"none"} (models single-checkout lock in evaluateWorktreeGuard)

vars == <<phase, locks, committed, checkoutOwner>>

Ids == 1..MaxId
None == "none"

MaxCommitted ==
  IF committed = {} THEN 0
  ELSE CHOOSE m \in committed : \A x \in committed : m >= x

TypeOK ==
  /\ phase \in [Actors -> {"idle", "reserved", "implementing", "done"}]
  /\ locks \in [Ids -> Actors \cup {None}]
  /\ committed \subseteq Ids
  /\ checkoutOwner \in Actors \cup {None}

Init ==
  /\ phase = [a \in Actors |-> "idle"]
  /\ locks = [i \in Ids |-> None]
  /\ committed = {}
  /\ checkoutOwner = None

\* reserveNextRunningId: atomic wx lock on lowest unheld candidateId > MaxCommitted
ReserveId(a, id) ==
  /\ phase[a] = "idle"
  /\ id \in Ids
  /\ id > MaxCommitted
  /\ id \notin committed
  /\ locks[id] = None
  /\ locks' = [locks EXCEPT ![id] = a]
  /\ phase' = [phase EXCEPT ![a] = "reserved"]
  /\ UNCHANGED <<committed, checkoutOwner>>

\* evaluateWorktreeGuard: allow implementing in main checkout only when checkoutOwner = None
EnterMainCheckout(a) ==
  /\ phase[a] = "reserved"
  /\ checkoutOwner = None
  /\ \E id \in Ids : locks[id] = a
  /\ LET heldId == CHOOSE id \in Ids : locks[id] = a
     IN /\ committed' = committed \cup {heldId}
        /\ locks' = [locks EXCEPT ![heldId] = None]
  /\ checkoutOwner' = a
  /\ phase' = [phase EXCEPT ![a] = "implementing"]

\* Separate linked worktree: commit run context without claiming main checkout
EnterIsolatedWorktree(a) ==
  /\ phase[a] = "reserved"
  /\ \E id \in Ids : locks[id] = a
  /\ LET heldId == CHOOSE id \in Ids : locks[id] = a
     IN /\ committed' = committed \cup {heldId}
        /\ locks' = [locks EXCEPT ![heldId] = None]
  /\ phase' = [phase EXCEPT ![a] = "done"]
  /\ UNCHANGED checkoutOwner

CompleteMainRun(a) ==
  /\ phase[a] = "implementing"
  /\ checkoutOwner = a
  /\ checkoutOwner' = None
  /\ phase' = [phase EXCEPT ![a] = "done"]
  /\ UNCHANGED <<locks, committed>>

Done ==
  /\ \A a \in Actors : phase[a] = "done"
  /\ UNCHANGED vars

Next ==
  \/ (\E a \in Actors, id \in Ids : ReserveId(a, id))
  \/ (\E a \in Actors : EnterMainCheckout(a))
  \/ (\E a \in Actors : EnterIsolatedWorktree(a))
  \/ (\E a \in Actors : CompleteMainRun(a))
  \/ Done

NoDuplicateLock ==
  \A a1, a2 \in Actors, i1, i2 \in Ids :
    (locks[i1] = a1 /\ locks[i2] = a2 /\ a1 /= a2) => i1 /= i2

NoSharedMainCheckout ==
  Cardinality({a \in Actors : phase[a] = "implementing"}) <= 1

Spec == Init /\ [][Next]_vars
====
