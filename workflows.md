This comprehensive workflow document provides the "Vibe-to-Code" specifications for **Antigravity agents** to build the **MenoCycle** iOS application.

---

# MenoCycle: Detailed User Workflows & UI Specifications

## 1. Onboarding Workflow: "The Soft Entry"

**Goal:** Establish trust and clinical baseline without cognitive overload.

### Screen 1: Welcome Splash

* **Location:** Initial Launch.
* **Visuals:** Soft lavender gradient background. A slow-pulsing MenoCycle logo.
* **Text:** * Title: "MenoCycle"
* Subtitle: "Your lifecycle, understood."


* **Buttons:**
* `SignInWithAppleButton()` (Primary, Center-Bottom).


* **Behavioral Note:** Minimal text to reduce initial "medical anxiety."

### Screen 2: HealthKit Integration (The Silent Partner)

* **Location:** Post-Authentication.
* **Visuals:** Iconography of a heart and a bed.
* **Text:** * Header: "Rest is data."
* Body: "MenoCycle works in the background to see how your body heals while you sleep. We sync with Apple Health to track heart rate and sleep patterns automatically."


* **Buttons:**
* `[Allow Health Sync]` (Center-Bottom, Pill-shaped).


* **Haptics:** `impactOccurred(.light)` on button tap.

### Screen 3: Clinical Grounding

* **Location:** Profile Setup.
* **Visuals:** A horizontal "Lifecycle Slider."
* **Text:** * Question: "Where are you in your journey?"
* Options (displayed below slider): "Perimenopause," "Menopause," "Postmenopause," "I’m not sure."


* **Buttons:**
* `[Next]` (Trailing Bottom).


* **Intelligence Layer:** If "I'm not sure" is selected, trigger a Gemini 3 modal: *"No problem. We’ll help you identify your stage through your daily rituals."*

### Screen 4: Friction Points (The Why)

* **Location:** Goal Setting.
* **Visuals:** A 3x3 grid of "Bubble" buttons.
* **Text:** * Header: "What feels heavy today?"
* Grid Options: `Hot Flashes`, `Brain Fog`, `Joint Pain`, `Mood Swings`, `Sleep Loss`, `Low Energy`.


* **Buttons:**
* `[Finish Setup]` (Bottom, appears only after 3 bubbles are selected).


* **Behavioral Note:** This utilizes **Commitment & Consistency** psychology.

---

## 2. Daily Rituals Workflow: "The Companion UI"

**Goal:** Replace clinical tracking with dopamine-triggering habit stacking.

### Screen 5: The Ritual Dashboard (Home)

* **Location:** Main Tab (Index 0).
* **Visuals:** A central **Ritual Ring** (SwiftUI `ZStack` with `Trim` animation).
* **Text (Top Header):** "Good Morning, [User]. Your body is adapting."
* **The Morning Ritual (State 1):**
* Text: "30-Second Mood Pulse"
* Button: `[Start Ritual]` (Floating inside the ring).


* **The Afternoon Pulse (State 2):**
* Visible only after 12:00 PM.
* Visuals: A "Severity Slider" (1-10) for selected friction points.
* Text: "How is your focus right now?"


* **The Evening Wind-down (State 3):**
* Visible after 8:00 PM.
* Text: "Sleep Prep & Reflection."



### Screen 6: The "Daily Gem" (Variable Reward)

* **Trigger:** Completion of all three daily rings.
* **Visuals:** A shimmering card flip animation.
* **Intelligence Layer:** Gemini 3 fetches a micro-insight from **NotebookLM** based on the user's current stage.
* **Text:** * "ERIC, DID YOU KNOW?"
* Insight: "Your joint pain often spikes 24 hours after a low-activity day. Tomorrow is a great day for a light walk."


* **Haptics:** `notificationOccurred(.success)`—The "Dopamine Hit."

---

## 7. Clinical Data Export: "Physician-Ready PDF"

**Goal:** Empower the user during high-stress medical appointments.

### Screen 7: Profile & Prepare

* **Location:** Profile Tab (Index 2).
* **Visuals:** A large, prominent button with a "Clinical" aesthetic.
* **Button:** `[Prepare for Doctor Visit]` (Leading icon: `doc.text.below.ecg`).
* **Workflow:**
1. User taps button.
2. **Cloud Function Trigger:** Aggregates Firestore `SymptomLog` and HealthKit `CorrelationData`.
3. **Gemini 3 Processing:** Synthesis of the Markdown log (formatted for NotebookLM interpretation).
4. **Loading View:** A progress bar with text: *"Analyzing 90 days of patterns..."*



### Screen 8: The Report Preview

* **Visuals:** A sleek, paginated PDF viewer.
* **Text (Within PDF):**
* **Section 1: Summary.** "Patient Eric J. is experiencing VMS (Vasomotor Symptoms) 4x/week, primarily between 2:00 AM - 4:00 AM."
* **Section 2: HealthKit Overlay.** "Sleep quality is reduced by 32% on days following reported 'Brain Fog'."
* **Section 3: stage Projection.** "Data aligns with Late Perimenopause (Stage -1)."


* **Buttons:**
* `[Share via AirDrop/Email]`
* `[Save to Files]`



---

## 4. Technical Interaction Map for Agents

| Component | Logic Source | Agent Responsibility |
| --- | --- | --- |
| **Ritual Rings** | `CoreGraphics` / `SwiftUI` | **Agent A:** Write the drawing logic and `.onTapGesture` animations. |
| **Symptom Logging** | `Firebase Data Connect` | **Agent B:** Write the GraphQL mutation to log `SymptomLog`. |
| **HealthKit Sync** | `HealthKit Framework` | **Agent A:** Request `HKQuantityTypeIdentifierSleepAnalysis`. |
| **PDF Synthesis** | `Cloud Functions` / `Gemini 3` | **Agent B:** Script the Node.js function to generate the report. |
| **Journal Correlation** | `NotebookLM` | **Agent C:** Provide the Markdown template for the AI to "read" the clinical logs. |

---

## 5. Global Navigation & Rules

* **Tab Bar:** `[Home (Ritual)]`, `[Trends (Insights)]`, `[Support (AI Chat)]`, `[Profile (Export)]`.
* **The "Vibe" Rule:** No red colors for errors (use orange/amber). Menopause management should feel like a transition, not a crisis.
* **Friction Rule:** Every logging action must be completed in **3 taps or fewer**.