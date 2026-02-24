import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Animated, Keyboard, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { useScore } from '../context/ScoreContext';
import { useUser } from '../context/UserContext';

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
                { id: 'hydration', label: 'Good Hydration' },
                { id: 'exercise', label: 'Exercise/Movement' },
                { id: 'high_stress', label: 'High Stress' },
                { id: 'supplements', label: 'Took Supplements' }
            ]
        }
    ];

    // selectedData is a map: { [id]: { severity: 'Moderate', notes: '' } }
    const [selectedData, setSelectedData] = useState({});
    const [activeDrillDown, setActiveDrillDown] = useState(null); // { id, label, categoryTitle }
    const [notes, setNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const saveScale = useRef(new Animated.Value(0)).current;
    const saveOpacity = useRef(new Animated.Value(0)).current;

    const handlePillPress = (item, categoryTitle) => {
        // If not selected, initialize default, then open modal
        if (!selectedData[item.id]) {
            setSelectedData(prev => ({ ...prev, [item.id]: { severity: 'Moderate', details: '' } }));
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

                        {activeDrillDown?.categoryTitle === "Symptoms" && (
                            <View style={{ marginBottom: SPACING.lg }}>
                                <AppText variant="body" style={{ marginBottom: SPACING.sm, fontWeight: '600' }}>Severity:</AppText>
                                <View style={styles.severityRow}>
                                    {['Mild', 'Moderate', 'Severe'].map(sev => {
                                        const isSevSelected = selectedData[activeDrillDown?.id]?.severity === sev;
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
                        )}

                        <View style={{ marginBottom: SPACING.xl }}>
                            <AppText variant="body" style={{ marginBottom: SPACING.sm, fontWeight: '600' }}>
                                {activeDrillDown?.categoryTitle === "Positives" ? "What triggered this positive state?" : "Specific notes or triggers:"}
                            </AppText>
                            <TextInput
                                style={[styles.textInput, { minHeight: 80 }]}
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
    }
});
