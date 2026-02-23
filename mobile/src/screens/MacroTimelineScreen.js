import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AppText } from '../components/Typography';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export const MacroTimelineScreen = ({ navigation }) => {
    // Mock multi-year transition data representing the big-picture journey
    const timelineData = [
        { year: 2024, score: 72, phase: "Perimenopause", notes: "Irregular cycles began. Hot flashes mild." },
        { year: 2025, score: 58, phase: "Perimenopause", notes: "Symptom peak. High fatigue logged." },
        { year: 2026, score: 85, phase: "Late Perimenopause", notes: "Current. Rituals established. Symptoms stabilizing." }
    ];

    return (
        <View style={styles.container}>
            <View style={styles.headerArea}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <AppText style={{ fontSize: 28, fontWeight: '800', color: COLORS.textMain }}>←</AppText>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <AppText variant="heading1" style={styles.header}>Macro-Timeline</AppText>
                <AppText variant="body" style={styles.subHeader}>
                    Your Perimenopause Score over time, consolidating all holistic symptom severity into a single trajectory metric.
                </AppText>

                <View style={styles.chartContainer}>
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
                            <AppText style={styles.notesText}>{data.notes}</AppText>
                            {index < timelineData.length - 1 && <View style={styles.divider} />}
                        </View>
                    ))}
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    headerArea: { paddingHorizontal: SPACING.xl, paddingTop: 60, paddingBottom: 10 },
    backButton: { width: 50, height: 50, justifyContent: 'center' },
    content: { padding: SPACING.xl, paddingBottom: 100 },
    header: { fontSize: 28, color: COLORS.textMain, marginBottom: SPACING.xs },
    subHeader: { fontSize: 16, color: COLORS.textMuted, marginBottom: SPACING.xl },
    chartContainer: { backgroundColor: COLORS.surface, padding: SPACING.xl, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: '#E8E8E8' },
    barWrapper: { marginBottom: SPACING.lg },
    barLabelContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
    yearText: { fontWeight: '800', fontSize: 18, color: COLORS.textMain },
    phaseText: { color: COLORS.primary, fontWeight: '600' },
    barBackground: { height: 24, backgroundColor: '#F5F5F5', borderRadius: 12, overflow: 'hidden', marginBottom: SPACING.xs },
    barFill: { height: '100%', borderRadius: 12 },
    scoreText: { textAlign: 'right', fontWeight: 'bold', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xs },
    notesText: { fontSize: 14, color: '#666', fontStyle: 'italic' },
    divider: { height: 1, backgroundColor: '#EEE', marginVertical: SPACING.lg }
});
