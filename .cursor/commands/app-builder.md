# 🏗️ App Builder (New Project Initialization)

## Usage: `/app-builder [project description]`

This command acts as a specialized orchestrator specifically for **Setting Up a Brand New Application from Scratch**. It bootstraps the file structure and tech stack before handing off to the standard PRPs lifecycle commands (`/01-Task`, `/02-Plan`, etc.).

---

## 🛠️ Internal Process

### Step 1: Request Deep Analysis
- Analyze what the user wants to build based on the provided `[project description]`.
- If information is missing, **ask clarifying questions** (What type of application? Basic features? Target audience?).
- Apply the **Socratic Gate**: Always ask about edge cases and trade-offs before starting construction.

### Step 2: Architecture & Setup
- Determine the optimal Tech Stack based on requirements.
- Bootstrap the core file structure and configurations (e.g., using framework CLIs like `npx create-next-app` via terminal if approved, or writing base files directly).
- Scaffold essential configurations (e.g., `package.json`, `tsconfig.json`, `docker-compose.yml`).

### Step 3: Handoff to PRPs Framework
- Once the initial codebase skeleton and stack are ready, automatically instruct the user to initialize the project context using `/00-Init`.
- Guide the user to start tackling specific features using `/01-Task` for standard PRPs tracking.

---

## 📋 Example Usage

```
/app-builder e-commerce app with product listing and cart
/app-builder internal crm system with customer management
/app-builder blog site using FastAPI
```

📌 **Next Step**: Once bootstrapping is complete, the AI will instruct the user to run `/00-Init` to sync the new workspace context, followed by `/01-Task` to begin building the first feature systematically.
