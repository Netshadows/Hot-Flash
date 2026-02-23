This `blueprint.md` is optimized for **Antigravity’s** multi-agent environment. It provides the structured context needed for agents to utilize **Google Stitch** for UI generation and **GitHub MCP** for repository orchestration, ensuring the final iOS application aligns with both scientific rigor and behavioral psychology.

# Blueprint: MenoCycle – A Wellness Companion for the Menopause Lifecycle

## 1. Project Vision & "The Why"

**Mission:** To transform the menopause transition from a confusing medical burden into a manageable, empowering wellness journey.
**Objective:** Replace high-friction medical tracking with "Daily Rituals" that use behavioral psychology (dopamine-based engagement) to ensure long-term symptom management and evidence-based support. Providing overarching macro-metrics (like Timeline and Score) to contextualize the transition without offering direct medical advice.

---

## 2. Technical Stack & Intelligence Layer

### 2.1 Frontend (iOS Native / React Native)

* **Framework:** React Native / Expo (with SwiftUI hooks where necessary for rapid agent-driven UI synthesis and fluid animations).
* **Local Data:** HealthKit (Automatic syncing of sleep, heart rate, and activity).
* **Haptics:** CoreHaptics (Dopamine-triggering sensory feedback for task completion).
* **Accessibility:** WCAG 2.2 AA compliant, large touch targets (48px+), high-contrast text, avoiding complex gestures, using clear "skeuomorphic" icons for aging demographics.

### 2.2 Backend (Firebase Studio)

* **Authentication:** Firebase Auth + Sign-In with Apple. Option for **Anonymous Mode** (Oblivious HTTP integration).
* **Database:** **Firebase Data Connect (PostgreSQL) with Vertex AI Vector Search**. Relational structure required to map complex correlations between daily symptoms, cycle stages, and long-term trends, with semantic vector matching for unstructured logs.
* **Serverless:** Cloud Functions for Firebase (Node.js/TypeScript) for FHIR API export and notification scheduling.
* **Compliance:** "Security by design"—immutable audit trails and AES-256 encryption. Preparedness for EU MDR/FDA Software as a Medical Device (SaMD) classifications (for data routing only, not providing medical advice).

### 2.3 Intelligence Layer

* **Research Engine:** NotebookLM (Primary source for evidence-based grounding and correlating with medical journals).
* **User Interface AI:** Vertex AI for Firebase (Gemini 3) for the "Empathy Companion" chatbot and "Vibe-to-Code" UI adjustments.

---

## 3. Data Schema & Architecture

The app's schema is designed to produce a "Semantic Log" that can be ingested by Vertex AI to generate vector embeddings, allowing cosine similarity matching across medical and lifestyle terms.

### 3.1 Firebase Data Connect Schema (GraphQL/PostgreSQL)

```graphql
type User @table {
  id: ID!
  menopausePhase: String! # Perimenopause, Menopause, Postmenopause
  onboardingDate: Date!
  dailyGoal: Int!
  perimenopauseScore: Float # Macro-level impact score calculated periodically
}

type DailyLog @table {
  id: ID!
  userId: String!
  timestamp: Timestamp!
  logType: String! # Positive State, Symptom, Lifestyle
  attributes: [String!]! # Multi-select (e.g., ["Hot Flash", "Brain Fog", "High Energy", "Drank Water"])
  severity: Int # 1-10 for negative symptoms. 0 or absent for positive states.
  correlationData: String # Auto-pulled from HealthKit (e.g., "Poor Sleep", "Low Activity")
}

type CycleTracking @table {
  id: ID!
  userId: String!
  timestamp: Timestamp!
  menstruationStatus: String! # For tracking hormonal changes explicitly versus somatic symptoms
}

type DailyRitual @table {
  id: ID!
  userId: String!
  completedAt: Timestamp!
  ritualType: String! # e.g., Mindfulness, Hydration, Supplement
  streakCount: Int!
}

```

### 3.2 Interoperability & Intelligence Workflow

1. **Export Path:** Cloud Functions trigger a weekly export of `DailyLog` data structured into valid **HL7 FHIR** resources to natively integrate with provider EHR systems without data silos.
2. **Ingestion:** Anonymized logs are compared against "Medical Journals" via NotebookLM to uncover deep insights (e.g., "User's joint pain peaks 48 hours after poor REM sleep").

---

## 4. Onboarding & Daily Rituals (UX Flow)

### 4.1 High-Value Intentional Onboarding

* **The "Vibe":** Soft aesthetics, conversational, creating psychological commitment without giving medical advice.
* **Step 1:** Sign-in with Apple (with Anonymous Mode option).
* **Step 2:** HealthKit Permission (Focus on "Why": *To track how your body heals while you sleep*).
* **Step 3:** Detailed Symptom & Lifestyle Heatmap. Expanding beyond a simple checklist to capture lifestyle baseline, cycle history, and wellness goals.
* **Step 4:** Time-to-Value: Present user with their initial overarching "Perimenopause Score" immediately after onboarding.

### 4.2 The "Daily Ritual" Dashboard

Instead of a "Tracker," the home screen features a **Ritual Ring** and contextual macro-metrics (Menopause Timeline).

* **The Morning Ritual:** 30-second mood check-in + supplement reminder.
* **The Afternoon Pulse (Multi-Symptom & Positive Tracking):** Interactive logging allowing MULTIPLE selections at once.
  * *Positives:* "Mental Clarity," "High Energy," "Deep Rest," "Feeling Balanced."
  * *Symptoms:* "Hot Flashes," "Brain Fog," "Joint Pain."
  * *Lifestyle:* "Caffeine Intake," "Hydration."
* **Retrospective Calendar View:** A visual monthly calendar allowing users to look back at past symptom trends, view data easily, and backfill any days or logs they forgot to enter.
* **Safeguards Against Hyper-Vigilance:** App dynamically limits the frequency of "check-in" prompts if user displays high health-anxiety tracking patterns. Emphasizes "catch and release" mindfulness.
* **The Evening Wind-down:** Visualization of HealthKit data (e.g., heart rate variability) translated into an empathetic summary.

---

## 5. Behavioral Design & Community

* **Variable Rewards:** Completing a ritual unlocks a "Daily Gem"—a micro-insight from NotebookLM or an unexpected wellness tip.
* **Habit Stacking:** Trigger symptom logging immediately after a successful "Mindfulness Ritual" to lower resistance.
* **Anonymous Community Space ("Secret Chats"):** A pre-moderated, secure space where users (with randomly generated avatars) can discuss taboo or sensitive health transitions.

---

## 6. Provider Interoperability

### 6.1 The "Provider-Ready" EHR Workflow

* **Trigger:** "Prepare for Visit" button.
* **Engine:** Cloud Functions parse the last 90 days of logs into FHIR standard observations.
* **Output:** A professional readout natively compatible with standard EHRs, containing:
  * Overarching Perimenopause Score.
  * Cycle correlations vs Lifestyle Triggers.
  * Lifecycle Projection (Menopause Timeline estimate).

---

## 7. Antigravity Implementation Instructions

### Agent A (Mission Control/Swift UI Architect)

* **Task:** Build the `RitualView`, `DailyPulse`, and `Calendar` UI.
* **Constraint:** Ensure all symptom inputs are large-target, multi-select buttons. Ensure positive options exist alongside negative.
* **Logic:** Integrate `HealthKit` manager.

### Agent B (Infrastructure/Firebase Studio)

* **Task:** Configure **Firebase Data Connect** with the PostgreSQL schema defined in Section 3.1. Ensure vector embedding pipelines.
* **Security:** Ensure HIPAA-compliant data handling in Firestore security rules.

### Agent C (Flow/GitHub MCP)

* **Task:** Maintain `repo-map.md`. Update `README.md` with instructions.