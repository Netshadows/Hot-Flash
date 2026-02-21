This `blueprint.md` is optimized for **Antigravity’s** multi-agent environment. It provides the structured context needed for agents to utilize **Google Stitch** for UI generation and **GitHub MCP** for repository orchestration, ensuring the final iOS application aligns with both clinical rigor and behavioral psychology.

# Blueprint: MenoCycle – A Wellness Companion for the Menopause Lifecycle

## 1. Project Vision & "The Why"

**Mission:** To transform the menopause transition from a clinical burden into a manageable, empowering wellness journey.
**Objective:** Replace high-friction medical tracking with "Daily Rituals" that use behavioral psychology (dopamine-based engagement) to ensure long-term symptom management and data-backed clinical support.

---

## 2. Technical Stack & Intelligence Layer

### 2.1 Frontend (iOS Native)

* **Framework:** SwiftUI (for rapid agent-driven UI synthesis and fluid animations).
* **Local Data:** HealthKit (Automatic syncing of sleep, heart rate, and activity).
* **Haptics:** CoreHaptics (Dopamine-triggering sensory feedback for task completion).

### 2.2 Backend (Firebase Studio)

* **Authentication:** Firebase Auth + Sign-In with Apple.
* **Database:** **Firebase Data Connect (PostgreSQL)**. Relational structure is required to map complex correlations between daily symptoms, cycle stages, and long-term trends.
* **Serverless:** Cloud Functions for Firebase (Node.js/TypeScript) for PDF generation and notification scheduling.

### 2.3 Intelligence Layer

* **Clinical Brain:** NotebookLM (Primary source for clinical grounding/journal correlations).
* **User Interface AI:** Vertex AI for Firebase (Gemini 3) for the "Empathy Companion" chatbot and "Vibe-to-Code" UI adjustments.

---

## 3. Data Schema & NotebookLM Bridge

The app's schema is designed to produce a "Semantic Log" that can be ingested by NotebookLM to generate insights.

### 3.1 Firebase Data Connect Schema (GraphQL/PostgreSQL)

```graphql
type User @table {
  id: ID!
  menopausePhase: String! # Perimenopause, Menopause, Postmenopause
  onboardingDate: Date!
  dailyGoal: Int!
}

type SymptomLog @table {
  id: ID!
  userId: String!
  timestamp: Timestamp!
  symptomType: String! # e.g., Hot Flash, Brain Fog, Joint Pain
  severity: Int! # 1-10
  correlationData: String # Auto-pulled from HealthKit (e.g., "Poor Sleep", "Low Activity")
}

type DailyRitual @table {
  id: ID!
  userId: String!
  completedAt: Timestamp!
  ritualType: String! # e.g., Mindfulness, Hydration, Supplement
  streakCount: Int!
}

```

### 3.2 NotebookLM Integration Workflow

1. **Export Path:** Cloud Functions trigger a weekly export of `SymptomLog` + `CorrelationData` in Markdown format.
2. **Ingestion:** This file is fed into the "User Logs" source in NotebookLM.
3. **Synthesis:** NotebookLM compares user logs against the "Clinical Journals" source (provided in the prompt's reference layer) to identify "Greater Details" (e.g., "User's joint pain peaks 48 hours after poor REM sleep").

---

## 4. Onboarding & Daily Rituals (UX Flow)

### 4.1 Frictionless Onboarding

* **The "Vibe":** Soft aesthetics, reduced cognitive load, conversational.
* **Step 1:** Sign-in with Apple.
* **Step 2:** HealthKit Permission (Focus on "Why": *To track how your body heals while you sleep*).
* **Step 3:** Symptom "Heatmap" (User selects the top 3 friction points in their life).

### 4.2 The "Daily Ritual" Dashboard

Instead of a "Tracker," the home screen features a **Ritual Ring**.

* **The Morning Ritual:** 30-second mood check-in + supplement reminder.
* **The Afternoon Pulse:** Interactive symptom logging (Drag-and-drop UI).
* **The Evening Wind-down:** Visualization of HealthKit data (e.g., heart rate variability) translated into an empathetic summary.

---

## 5. Behavioral Design (Dopamine Hooks)

To ensure retention, agents must implement the following via SwiftUI:

* **Variable Rewards:** Completing a ritual doesn't just fill a ring; it unlocks a "Daily Gem"—a micro-insight from NotebookLM or an unexpected wellness tip.
* **Habit Stacking:** Trigger symptom logging immediately after a successful "Mindfulness Ritual" to lower resistance.
* **Micro-Animations:** Use `withAnimation(.spring())` for checkmark interactions to provide instant gratification.
* **Haptic Milestones:** Distinct haptic patterns for "Ritual Complete" vs. "Streak Milestone."

---

## 6. Clinical Data Export (Physician-Ready PDF)

### 6.1 The "Physician-Ready" Workflow

* **Trigger:** A dedicated "Prepare for Visit" button in the Profile tab.
* **Engine:** Cloud Functions fetch the last 90 days of logs.
* **Context:** The function sends a prompt to Gemini 3: *"Analyze these symptom logs and highlight trends specifically relevant for HRT eligibility or dosage adjustment based on perimenopause correlations found in the reference material."*
* **Output:** A professional PDF containing:
* **Executive Summary:** Top 3 recurring symptoms.
* **HealthKit Correlations:** Sleep disturbances vs. Hot flash frequency.
* **Lifecycle Projection:** Data-backed estimate of the current menopause stage.



---

## 7. Antigravity Implementation Instructions

### Agent A (Mission Control/Swift Architect)

* **Task:** Build the `RitualView.swift` using Stitch-inspired UI code.
* **Constraint:** Ensure all symptom inputs are large-target buttons (designing for varying motor control/stress levels).
* **Logic:** Integrate `HealthKit` manager to sync data in the background.

### Agent B (Infrastructure/Firebase Studio)

* **Task:** Configure **Firebase Data Connect** with the PostgreSQL schema defined in Section 3.1.
* **Task:** Write the `generateMedicalReport` Cloud Function in TypeScript.
* **Security:** Ensure HIPAA-compliant data handling in Firestore security rules.

### Agent C (Flow/GitHub MCP)

* **Task:** Maintain `repo-map.md` to ensure Agent A and Agent B remain aligned on the `SymptomLog` data structure.
* **Task:** Update the `README.md` with instructions for the NotebookLM manual ingestion process until an automated API bridge is enabled.