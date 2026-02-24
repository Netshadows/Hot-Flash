import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { SelectGroup } from '../components/SelectGroup';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export const MacroTimelineScreen = ({ navigation }) => {
    const [showOverrideModal, setShowOverrideModal] = useState(false);
    const [overridePhase, setOverridePhase] = useState('');
    const [overrideNotes, setOverrideNotes] = useState('');

    // Mock multi-year transition data representing the big-picture journey
    const timelineData = [
        { year: 2024, score: 72, phase: "Perimenopause", notes: "Irregular cycles began. Hot flashes mild." },
        { year: 2025, score: 58, phase: "Perimenopause", notes: "Symptom peak. High fatigue logged." },
        { year: 2026, score: 85, phase: "Late Perimenopause", notes: "Current. Rituals established. Symptoms stabilizing." }
    ];

    const handleOverrideSubmit = () => {
        console.log("Algorithm Override Logged:", { phase: overridePhase, notes: overrideNotes });
        setShowOverrideModal(false);
        // In a real app, this would dispatch to backend to retrain model
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerArea}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textMain} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <AppText variant="heading1" style={styles.header}>The Lifecycle Project</AppText>
                <AppText variant="body" style={styles.subHeader}>
                    Our algorithm analyzes your cycles, symptoms, and biomarkers to estimate your current phase in the menopause transition.
                </AppText>

                <View style={styles.algorithmCard}>
                    <View style={styles.algHeader}>
                        <Ionicons name="hardware-chip-outline" size={24} color={COLORS.primary} />
                        <AppText variant="heading3" style={{ color: COLORS.primary, marginLeft: SPACING.sm }}>Algorithm Output</AppText>
                    </View>

                    <View style={styles.algDataRow}>
                        <AppText style={styles.algLabel}>Current Estimation:</AppText>
                        <AppText variant="heading2" style={styles.algValue}>Late Perimenopause</AppText>
                    </View>

                    <View style={styles.algFactors}>
                        <AppText style={styles.algFactorTitle}>Contributing Factors:</AppText>
                        <AppText style={styles.algFactorItem}>• Cycle length variance > 7 days (last 6 months)</AppText>
                        <AppText style={styles.algFactorItem}>• High frequency of vasomotor symptoms</AppText>
                        <AppText style={styles.algFactorItem}>• Age and demographic baselines</AppText>
                    </View>
                </View>

                <View style={styles.chartContainer}>
                    <AppText variant="heading3" style={{ marginBottom: SPACING.lg, color: COLORS.textMain }}>Trajectory</AppText>
                    {timelineData.map((data, index) => (
                        <View key={index} style={styles.barWrapper}>
                            <View style={styles.barLabelContainer}>
                                <AppText style={styles.yearText}>{data.year}</AppText>
                                <AppText style={styles.phaseText}>{data.phase}</AppText>
                            </View>
                            <View style={styles.barBackground}>
                                <LinearGradient
                                    colors={[COLORS.primary, '#FFD1DC']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={[styles.barFill, { width: `${data.score}%` }]}
                                />
                            </View>
                            <AppText style={styles.scoreText}>{data.score} / 100</AppText>
                            {index < timelineData.length - 1 && <View style={styles.divider} />}
                        </View>
                    ))}
                </View>

                <View style={styles.feedbackContainer}>
                    <AppText variant="heading3" style={{ marginBottom: SPACING.xs }}>Don't Agree?</AppText>
                    <AppText style={{ color: COLORS.textMuted, marginBottom: SPACING.md, lineHeight: 20 }}>
                        Machine learning isn't perfect. If you feel this estimation is incorrect based on your doctor's advice or your own intuition, tell us. Your feedback trains the model.
                    </AppText>
                    <Button
                        title="Suggest a Correction"
                        variant="secondary"
                        onPress={() => setShowOverrideModal(true)}
                    />
                </View>

            </ScrollView>

            <Modal visible={showOverrideModal} animationType="slide" transparent={true}>
                <KeyboardAvoidingView
                    style={styles.modalOverlay}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <AppText variant="heading2">Algorithm Feedback</AppText>
                            <TouchableOpacity onPress={() => setShowOverrideModal(false)}>
                                <Ionicons name="close" size={24} color={COLORS.textMain} />
                            </TouchableOpacity>
                        </View>

                        <AppText style={{ marginBottom: SPACING.sm, color: COLORS.textMain, fontWeight: '600' }}>
                            What phase do you believe you are in?
                        </AppText>
                        <SelectGroup
                            options={["Premenopause", "Early Perimenopause", "Late Perimenopause", "Menopause", "Postmenopause"]}
                            selected={overridePhase}
                            onSelect={setOverridePhase}
                        />

                        <AppText style={{ marginTop: SPACING.lg, marginBottom: SPACING.sm, color: COLORS.textMain, fontWeight: '600' }}>
                            Why? (Optional but helpful)
                        </AppText>
                        <TextInput
                            style={styles.textInput}
                            multiline
                            placeholder="E.g., My doctor recently ran a hormone panel..."
                            placeholderTextColor={COLORS.textMuted}
                            value={overrideNotes}
                            onChangeText={setOverrideNotes}
                            textAlignVertical="top"
                        />

                        <Button
                            title="Save Correction"
                            onPress={handleOverrideSubmit}
                            style={{ width: '100%', marginTop: SPACING.xl }}
                            disabled={!overridePhase}
                        />
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    headerArea: { paddingHorizontal: SPACING.xl, paddingTop: 60, paddingBottom: 10 },
    backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 20, ...COLORS.shadowSoft },
    content: { padding: SPACING.xl, paddingBottom: 100 },
    header: { fontSize: 28, color: COLORS.textMain, marginBottom: SPACING.xs },
    subHeader: { fontSize: 16, color: COLORS.textMuted, marginBottom: SPACING.xl, lineHeight: 24 },

    algorithmCard: {
        backgroundColor: '#F5F7FF',
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: '#D0DCFF',
        marginBottom: SPACING.xl,
    },
    algHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    algDataRow: {
        backgroundColor: '#FFF',
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.md,
    },
    algLabel: {
        color: COLORS.textMuted,
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    algValue: {
        color: COLORS.primary,
    },
    algFactors: {
        paddingHorizontal: SPACING.xs,
    },
    algFactorTitle: {
        fontWeight: '600',
        color: COLORS.textMain,
        marginBottom: 8,
    },
    algFactorItem: {
        color: '#555',
        marginBottom: 4,
        fontSize: 14,
    },

    chartContainer: { backgroundColor: COLORS.surface, padding: SPACING.xl, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: '#E8E8E8', marginBottom: SPACING.xl },
    barWrapper: { marginBottom: SPACING.lg },
    barLabelContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
    yearText: { fontWeight: '800', fontSize: 18, color: COLORS.textMain },
    phaseText: { color: COLORS.primary, fontWeight: '600' },
    barBackground: { height: 24, backgroundColor: '#F5F5F5', borderRadius: 12, overflow: 'hidden', marginBottom: SPACING.xs },
    barFill: { height: '100%', borderRadius: 12 },
    scoreText: { textAlign: 'right', fontWeight: 'bold', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xs },
    divider: { height: 1, backgroundColor: '#EEE', marginVertical: SPACING.lg },

    feedbackContainer: {
        backgroundColor: '#FFF9F9',
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: '#FFE4E4',
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
        paddingBottom: 50,
        minHeight: 400,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    textInput: {
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        minHeight: 100,
        fontSize: 16,
    }
});
