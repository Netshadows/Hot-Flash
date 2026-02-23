export const SymptomCategory = {
    PSYCHOLOGICAL: 'Psychological/Mental Health',
    VASOMOTOR: 'Vasomotor Symptoms (VMS)',
    NEUROLOGICAL: 'Neurological/Cognitive',
    SLEEP: 'Sleep/Neurological',
    ENDOCRINE: 'Endocrine',
    MUSCULOSKELETAL: 'Musculoskeletal / Bone Health',
    PHYSIOLOGICAL: 'Physiological',
    GENERAL: 'Physical, Psychological, and Autonomic',
    COMPREHENSIVE: 'Physical, Psychological, and Psychosomatic',
    PSYCHOLOGICAL_FACTOR: 'Psychological Factor',
    BEHAVIORAL: 'Behavioral/Cognitive',
};

export const ClinicalScale = {
    PHQ9: { name: 'PHQ-9', min: 0, max: 27, type: 'numerical' },
    GAD7: { name: 'GAD-7', min: 0, max: 21, type: 'numerical' },
    VMS: { name: 'VMS Frequency Scale', min: 0, max: 100, type: 'numerical' },
    KMI: { name: 'Kupperman Menopause Index (KMI)', min: 0, max: 51, type: 'weighted' },
    MSI: { name: 'Midlife Women’s Symptom Index (MSI)', min: 1, max: 5, type: 'likert' },
};

export const SymptomDefinitions = [
    {
        id: 'depression',
        name: 'Depression',
        category: SymptomCategory.PSYCHOLOGICAL,
        scale: ClinicalScale.PHQ9,
        description: 'Assess severity of depressive symptoms.',
    },
    {
        id: 'anxiety',
        name: 'Anxiety',
        category: SymptomCategory.PSYCHOLOGICAL,
        scale: ClinicalScale.GAD7,
        description: 'Assess severity of anxiety, nervousness, or irritability.',
    },
    {
        id: 'hot_flashes',
        name: 'Hot Flashes / Night Sweats',
        category: SymptomCategory.VASOMOTOR,
        scale: ClinicalScale.VMS,
        description: 'Severity and frequency of vasomotor symptoms.',
    },
    {
        id: 'brain_fog',
        name: 'Cognitive Changes (Brain Fog)',
        category: SymptomCategory.NEUROLOGICAL,
        scale: ClinicalScale.VMS, // Simplify for tracking purposes
        description: 'Assess memory and reaction time issues.',
    },
    {
        id: 'insomnia',
        name: 'Insomnia / Sleep Problems',
        category: SymptomCategory.SLEEP,
        scale: ClinicalScale.VMS, // Simplify for tracking purposes
        description: 'Assess sleep quality and insomnia severity.',
    }
];

export class SymptomLogEntry {
    constructor(symptomId, severityScore, notes = '') {
        this.id = Math.random().toString(36).substring(2, 9);
        this.symptomId = symptomId;
        this.severityScore = severityScore; // Numerical value based on the scale used
        this.timestamp = new Date().toISOString();
        this.notes = notes;

        // Auto-populate the definition reference
        this.definition = SymptomDefinitions.find(s => s.id === symptomId);
    }
}
