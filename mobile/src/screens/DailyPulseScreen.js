import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Animated, Keyboard, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { SelectGroup } from '../components/SelectGroup';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { useScore } from '../context/ScoreContext';
import { useUser } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons';

const AnimatedPill = ({ item, isSelected, onPress }) => {
    const scaleAnim = useRef(new Animated.Value(isSelected ? 1.05 : 1)).current;

    useEffect(() => {
        if (isSelected) {
            Animated.spring(scaleAnim, { toValue: 1.05, friction: 4, tension: 150, useNativeDriver: true }).start();
        } else {
            Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }).start();
        }
    }, [isSelected]);

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.8}
                style={[styles.pill, isSelected && styles.pillSelected]}
            >
                <AppText style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                    {item.label}
                </AppText>
            </TouchableOpacity>
        </Animated.View>
    );
};

// Supplement Library Data
const SUPPLEMENT_LIBRARY = [
    "Vitamin D3", "Magnesium Glycinate", "Black Cohosh", "Evening Primrose Oil",
    "Omega-3s / Fish Oil", "Ashwagandha", "Maca Root", "Probiotics", "B-Complex",
    "Melatonin", "DIM (Diindolylmethane)", "Calcium", "Zinc", "Iron"
];

const TRACK_SYMPTOMS = {
    hot_flashes: [
        { id: 'hot_flashes', label: 'Hot Flashes' },
        { id: 'night_sweats', label: 'Night Sweats' },
        { id: 'palpitations', label: 'Heart Palpitations' },
    ],
    sleep: [
        { id: 'insomnia', label: 'Insomnia' },
        { id: 'waking_early', label: 'Waking Early' },
        { id: 'night_sweats', label: 'Night Sweats' },
        { id: 'fatigue', label: 'Fatigue' },
    ],
    weight: [
        { id: 'weight_gain', label: 'Weight Gain' },
        { id: 'bloating', label: 'Bloating' },
        { id: 'metabolism', label: 'Metabolism Shift' },
    ],
    energy: [
        { id: 'low_energy', label: 'Low Energy' },
        { id: 'joint_pain', label: 'Joint Pain' },
        { id: 'stiffness', label: 'Muscle Stiffness' },
    ],
    mood: [
        { id: 'mood_swings', label: 'Mood Swings' },
        { id: 'anxiety', label: 'Anxiety' },
        { id: 'irritability', label: 'Irritability' },
        { id: 'brain_fog', label: 'Brain Fog' },
        { id: 'memory', label: 'Memory Lapses' },
        { id: 'low_libido', label: 'Low Libido' },
    ],
};

const DEFAULT_SYMPTOMS = [
    { id: 'hot_flashes', label: 'Hot Flashes' },
    { id: 'night_sweats', label: 'Night Sweats' },
    { id: 'joint_pain', label: 'Joint Pain' },
    { id: 'mood_swings', label: 'Mood Swings' },
    { id: 'brain_fog', label: 'Brain Fog' },
    { id: 'low_libido', label: 'Low Libido' },
];

export const DailyPulseScreen = ({ navigation }) => {
    const { triggerDopamine } = useScore();
    const { activeTracks } = useUser();

    const displaySymptoms = useMemo(() => {
        if (!activeTracks) return DEFAULT_SYMPTOMS;

        const combined = [];
        const seenIds = new Set();

        Object.keys(activeTracks).forEach(track => {
            if (activeTracks[track] && TRACK_SYMPTOMS[track]) {
                TRACK_SYMPTOMS[track].forEach(sym => {
                    if (!seenIds.has(sym.id)) {
                        seenIds.add(sym.id);
                        combined.push(sym);
                    }
                });
            }
        });

        if (combined.length < 4) {
            DEFAULT_SYMPTOMS.forEach(ds => {
                if (!seenIds.has(ds.id)) {
                    seenIds.add(ds.id);
                    combined.push(ds);
                }
            });
        }

        return combined;
    }, [activeTracks]);

    const categories = [
        {
            title: "Positives",
            items: [
                { id: 'mental_clarity', label: 'Mental Clarity' },
                { id: 'high_energy', label: 'High Energy' },
                { id: 'deep_rest', label: 'Deep Rest' },
                { id: 'feeling_balanced', label: 'Feeling Balanced' },
                { id: 'motivated', label: 'Motivated' },
                { id: 'calm', label: 'Calm & Grounded' }
            ]
        },
        {
            title: "Symptoms",
            items: displaySymptoms
        },
        {
            title: "Lifestyle Elements",
            items: [
                { id: 'caffeine', label: 'Caffeine Intake' },
                { id: 'alcohol', label: 'Alcohol Intake' },
                { id: 'hydration', label: 'Water Intake' },
                { id: 'exercise', label: 'Exercise/Movement' },
                { id: 'high_stress', label: 'High Stress' },
                { id: 'supplements', label: 'Took Supplements' }
            ]
        }
    ];

    // selectedData is a map: { [id]: { severity|count|supplements: val, details: '', timeOfDay: '' } }
    const [selectedData, setSelectedData] = useState({});
    const [activeDrillDown, setActiveDrillDown] = useState(null); // { id, label, categoryTitle }
    const [notes, setNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const saveScale = useRef(new Animated.Value(0)).current;
    const saveOpacity = useRef(new Animated.Value(0)).current;

    const handlePillPress = (item, categoryTitle) => {
        if (!selectedData[item.id]) {
            const defaultData = { details: '' };
            if (categoryTitle === 'Symptoms') {
                defaultData.severity = 'Moderate';
                defaultData.timeOfDay = 'Afternoon';
            } else if (['caffeine', 'alcohol', 'hydration'].includes(item.id)) {
                defaultData.count = 1;
            } else if (item.id === 'supplements') {
                defaultData.supplements = [];
            }
            setSelectedData(prev => ({ ...prev, [item.id]: defaultData }));
        }
        setActiveDrillDown({ ...item, categoryTitle });
    };

    const updateDrillData = (field, value) => {
        if (!activeDrillDown) return;
        setSelectedData(prev => ({
            ...prev,
            [activeDrillDown.id]: {
                ...prev[activeDrillDown.id],
                [field]: value
            }
        }));
    };

    const handleDrillClose = () => setActiveDrillDown(null);
    const handleDrillRemove = () => {
        const newData = { ...selectedData };
        delete newData[activeDrillDown.id];
        setSelectedData(newData);
        setActiveDrillDown(null);
    };

    const handleSave = () => {
        Keyboard.dismiss();
        setIsSaving(true);
        console.log("Saving pulse data: ", selectedData);
        triggerDopamine(10, "Pulse Logged!");

        Animated.parallel([
            Animated.timing(saveOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
            Animated.spring(saveScale, { toValue: 1, friction: 5, tension: 60, delay: 100, useNativeDriver: true })
        ]).start();

        setTimeout(() => { navigation.goBack(); }, 1800);
    };

    // --- Render Helpers for Drill Down Modal ---

    const renderSymptomDrillDown = () => (
        <>
            <View style={{ marginBottom: SPACING.lg }}>
                <AppText variant="body" style={styles.drillLabel}>Severity:</AppText>
                <View style={styles.severityRow}>
                    {['Mild', 'Moderate', 'Severe'].map(sev => {
                        const isSevSelected = selectedData[activeDrillDown.id]?.severity === sev;
                        return (
                            <TouchableOpacity
                                key={sev}
                                style={[styles.sevButton, isSevSelected && styles.sevButtonSelected]}
                                onPress={() => updateDrillData('severity', sev)}
                            >
                                <AppText style={[styles.sevButtonText, isSevSelected && styles.sevButtonTextSelected]}>{sev}</AppText>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
            <View style={{ marginBottom: SPACING.lg }}>
                <AppText variant="body" style={styles.drillLabel}>Approximate Time of Day:</AppText>
                <SelectGroup
                    options={["Morning", "Afternoon", "Evening", "Night"]}
                    selected={selectedData[activeDrillDown.id]?.timeOfDay || 'Afternoon'}
                    onSelect={(val) => updateDrillData('timeOfDay', val)}
                />
            </View>
        </>
    );

    const renderCounterDrillDown = () => {
        const count = selectedData[activeDrillDown.id]?.count || 1;
        let unitText = 'portions';
        if (activeDrillDown.id === 'hydration') unitText = 'glasses (8oz)';
        if (activeDrillDown.id === 'caffeine') unitText = 'cups';
        if (activeDrillDown.id === 'alcohol') unitText = 'drinks';

        return (
            <View style={styles.counterContainer}>
                <AppText variant="body" style={styles.drillLabel}>Amount ({unitText}):</AppText>
                <View style={styles.stepperWrap}>
                    <TouchableOpacity
                        style={styles.stepperBtn}
                        onPress={() => updateDrillData('count', Math.max(0, count - 1))}
                    >
                        <Ionicons name="remove" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                    <AppText style={styles.stepperValue}>{count}</AppText>
                    <TouchableOpacity
                        style={styles.stepperBtn}
                        onPress={() => updateDrillData('count', count + 1)}
                    >
                        <Ionicons name="add" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderSupplementsDrillDown = () => {
        const selectedSupps = selectedData[activeDrillDown.id]?.supplements || [];
        return (
            <View style={{ marginBottom: SPACING.lg }}>
                <AppText variant="body" style={styles.drillLabel}>Select Supplements Taken:</AppText>
                <ScrollView style={{ maxHeight: 200, borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 8 }}>
                    {SUPPLEMENT_LIBRARY.map(supp => {
                        const isSel = selectedSupps.includes(supp);
                        return (
                            <TouchableOpacity
                                key={supp}
                                style={[styles.suppItem, isSel && styles.suppItemSelected]}
                                onPress={() => {
                                    if (isSel) {
                                        updateDrillData('supplements', selectedSupps.filter(s => s !== supp));
                                    } else {
                                        updateDrillData('supplements', [...selectedSupps, supp]);
                                    }
                                }}
                            >
                                <AppText style={{ color: isSel ? COLORS.primary : COLORS.textMain, fontWeight: isSel ? '700' : '400' }}>{supp}</AppText>
                                <View style={[styles.checkbox, isSel && styles.checkboxSelected]}>
                                    {isSel && <Ionicons name="checkmark" size={14} color="#FFF" />}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <AppText variant="heading1" style={styles.header}>Daily Pulse</AppText>
                <AppText variant="body" style={styles.subHeader}>Log your overarching holistic metrics and triggers for today to gather more intel on your trajectory.</AppText>

                {categories.map((category) => (
                    <View key={category.title} style={styles.section}>
                        <AppText variant="heading2" style={styles.sectionTitle}>{category.title}</AppText>
                        <View style={styles.grid}>
                            {category.items.map((item) => {
                                const isSelected = !!selectedData[item.id];
                                return (
                                    <AnimatedPill
                                        key={item.id}
                                        item={item}
                                        isSelected={isSelected}
                                        onPress={() => handlePillPress(item, category.title)}
                                    />
                                );
                            })}
                        </View>
                    </View>
                ))}

                <View style={styles.section}>
                    <AppText variant="heading2" style={styles.sectionTitle}>Any additional context?</AppText>
                    <TextInput
                        style={styles.textInput}
                        multiline
                        numberOfLines={4}
                        placeholder="Log any unstructured thoughts, triggers, or severity notes here for the AI to analyze..."
                        placeholderTextColor={COLORS.textMuted}
                        value={notes}
                        onChangeText={setNotes}
                        textAlignVertical="top"
                    />
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button title={isSaving ? "Generating Semantic Embeddings..." : "Save Log"} onPress={handleSave} disabled={isSaving} />
            </View>

            {/* Drill-Down Modal */}
            <Modal visible={!!activeDrillDown} animationType="slide" transparent={true}>
                <KeyboardAvoidingView
                    style={styles.modalOverlay}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <View style={styles.modalContent}>
                        <AppText variant="heading2" style={{ marginBottom: SPACING.md }}>{activeDrillDown?.label}</AppText>

                        {/* Conditional Rendering based on tag type */}
                        {activeDrillDown?.categoryTitle === "Symptoms" && renderSymptomDrillDown()}

                        {['caffeine', 'alcohol', 'hydration'].includes(activeDrillDown?.id) && renderCounterDrillDown()}

                        {activeDrillDown?.id === 'supplements' && renderSupplementsDrillDown()}


                        <View style={{ marginBottom: SPACING.xl, marginTop: ['caffeine', 'alcohol', 'hydration', 'supplements'].includes(activeDrillDown?.id) ? 10 : 0 }}>
                            <AppText variant="body" style={styles.drillLabel}>
                                {activeDrillDown?.categoryTitle === "Positives" ? "What triggered this positive state?" : "Specific context or triggers:"}
                            </AppText>
                            <TextInput
                                style={[styles.textInput, { minHeight: 60 }]}
                                multiline
                                placeholder="Add context..."
                                placeholderTextColor={COLORS.textMuted}
                                value={selectedData[activeDrillDown?.id]?.details || ''}
                                onChangeText={(val) => updateDrillData('details', val)}
                                textAlignVertical="top"
                            />
                        </View>

                        <View style={{ gap: SPACING.sm }}>
                            <Button title="Done" onPress={handleDrillClose} />
                            <TouchableOpacity style={styles.removeBtn} onPress={handleDrillRemove}>
                                <AppText style={styles.removeBtnText}>Remove from Log</AppText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Dopamine Celebration Overlay */}
            {isSaving && (
                <Animated.View style={[StyleSheet.absoluteFill, styles.rewardOverlay, { opacity: saveOpacity }]}>
                    <Animated.View style={{ transform: [{ scale: saveScale }], alignItems: 'center' }}>
                        <AppText style={{ fontSize: 80, marginBottom: 20 }}>🎉</AppText>
                        <AppText variant="heading1" style={{ color: COLORS.primary, textAlign: 'center' }}>Pulse Logged!</AppText>

                        <View style={styles.gemBadge}>
                            <AppText style={{ fontSize: 24, marginRight: 8 }}>💎</AppText>
                            <AppText variant="heading2" style={{ color: '#FFB300' }}>+10 Gems</AppText>
                        </View>
                    </Animated.View>
                </Animated.View>
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACING.xl, paddingTop: 60, paddingBottom: 100 },
    header: { fontSize: 28, color: COLORS.textMain, marginBottom: SPACING.xs },
    subHeader: { fontSize: 16, color: COLORS.textMuted, marginBottom: SPACING.xl },
    section: { marginBottom: SPACING.xl },
    sectionTitle: { fontSize: 20, color: COLORS.textMain, marginBottom: SPACING.md },
    drillLabel: { marginBottom: SPACING.sm, fontWeight: '600' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    pill: {
        paddingHorizontal: SPACING.md,
        paddingVertical: 10,
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#E8E8E8',
    },
    pillSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    pillText: { fontSize: 15, color: COLORS.textMain, fontWeight: '500' },
    pillTextSelected: { color: COLORS.surface, fontWeight: '700' },
    textInput: {
        backgroundColor: COLORS.surface,
        borderWidth: 1.5,
        borderColor: '#E8E8E8',
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        fontSize: 16,
        color: COLORS.textMain,
        minHeight: 120,
    },
    footer: { padding: SPACING.xl, paddingBottom: 40, borderTopWidth: 1, borderTopColor: '#E8E8E8', backgroundColor: COLORS.background },
    rewardOverlay: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        padding: SPACING.xl,
    },
    gemBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF8E1',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#FFE082',
        marginTop: SPACING.lg,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: RADIUS.xl,
        borderTopRightRadius: RADIUS.xl,
        padding: SPACING.xl,
        paddingBottom: 40,
        minHeight: 300,
        maxHeight: '90%'
    },
    severityRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    sevButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        alignItems: 'center',
    },
    sevButtonSelected: {
        backgroundColor: '#FFE082',
        borderColor: '#FFB300',
    },
    sevButtonText: {
        color: COLORS.textMain,
        fontWeight: '500',
    },
    sevButtonTextSelected: {
        color: '#B27D00',
        fontWeight: '700',
    },
    removeBtn: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    removeBtnText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '600',
    },

    // Counter Styles
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.lg,
        padding: SPACING.md,
        backgroundColor: '#F8F9FA',
        borderRadius: RADIUS.md
    },
    stepperWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E8E8E8'
    },
    stepperBtn: {
        padding: 8,
    },
    stepperValue: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.textMain,
        minWidth: 40,
        textAlign: 'center'
    },

    // Supplement Styles
    suppItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0'
    },
    suppItemSelected: {
        backgroundColor: '#F8FBFF',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#CCC',
        alignItems: 'center',
        justifyContent: 'center'
    },
    checkboxSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    }
});
