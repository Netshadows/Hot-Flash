# Hot Flash - Product Requirements Document (MVP)

## 1. Overview
"Hot Flash" is a menopause symptom tracking and management application designed to help users log symptoms, view correlations, and access educational resources. The design emphasizes a premium, dark-mode (OLED) aesthetic with high contrast and calming visuals.

## 2. Design System
- **Theme**: Dark Mode (OLED optimized).
- **Primary Color**: `#3d20df` (Deep Violet/Blue).
- **Typography**: Inter (Modern, clean sans-serif).
- **Shape Language**: "Round Eight" (Soft, rounded corners).
- **Visuals**: Glassmorphism, smooth gradients, vibrant accents.

## 3. Core Features (The "Basics" for MVP)

### 3.1 Symptom Logging (Priority: High)
- **Goal**: Allow users to quickly log symptoms.
- **Screen Ref**: `Symptom Logging Interface`, `Night-time Symptom Log`.
- **Functionality**:
    - Select symptom types (Hot Flash, Night Sweat, Mood, etc.).
    - Rate severity/intensity.
    - Timestamp logging.
    - specialized "Night-time" mode for low-light usage.

### 3.2 Dashboard & Insights (Priority: High)
- **Goal**: Visualize logged data to show trends.
- **Screen Ref**: `Daily Resonance Dashboard`, `Biometric Correlation Trends`.
- **Functionality**:
    - View daily summary of symptoms.
    - "Resonance" score or aggregate health metric.
    - Simple charts/graphs showing frequency over time.

### 3.3 Education & Resources (Priority: Medium)
- **Goal**: Provide helpful information.
- **Screen Ref**: `Resource Library Hub`, `Article Detail View`.
- **Functionality**:
    - List of articles/tips.
    - Read interface for content.

### 3.4 Data Management (Priority: Low for MVP)
- **Screen Ref**: `Health Data Integration`, `Clinician Report Export`, `Data Permissions Detail`.
- **Functionality**: Export data to PDF/CSV (Stretch goal).

## 3. Clinical Framework & Architecture
- **STRAW+10 Compliance**: UI must adapt to Reproductive, Transition, and Post-Menopause stages.
- **Symptom Domains**:
    - **Vasomotor**: Hot Flash Index (Frequency x Severity).
    - **Psychological**: Greene Climacteric Scale (Anxiety, Depression, Brain Fog).
    - **Urogenital**: GSM tracking (Dryness, Libido).
    - **Somatic**: Pain, Fatigue.
- **Accessibility**: "Brain Fog" compliant design. High contrast, large targets (>48px), calming colors (Lavender/Sage).
- **Data Architecture**:
    - **Local-First**: Object-oriented data model (simulating Realm DB).

    - **Privacy**: Contextual Consent patterns (ask for permission only when needed).

## 4. Technical Constraints
- **Platform**: Web Application (Responsive Mobile-First).
- **Stack**: HTML5, Vanilla CSS (Custom Design System), JavaScript (ES6+).
- **Data**: LocalStorage (for MVP) or simple mock backend.
