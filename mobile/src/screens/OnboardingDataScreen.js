import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { AppText } from '../components/Typography';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { Button } from '../components/Button';

export const OnboardingDataScreen = ({ navigation }) => {
    const { onboardingData } = useUser();

    const SYMPTOM_LABELS = {
        hot_flashes: 'Hot Flashes',
        night_sweats: 'Night Sweats',
        palpitations: 'Heart Palpitations',
        insomnia: 'Insomnia',
        waking_early: 'Waking Early',
        fatigue: 'Fatigue',
        weight_gain: 'Weight Gain',
        bloating: 'Bloating',
        metabolism: 'Metabolism Shift',
        low_energy: 'Low Energy',
        joint_pain: 'Joint Pain',
        stiffness: 'Muscle Stiffness',
        mood_swings: 'Mood Swings',
        anxiety: 'Anxiety',
        irritability: 'Irritability',
        brain_fog: 'Brain Fog',
        memory: 'Memory Lapses',
        low_libido: 'Low Libido',
    };

    const GOAL_LABELS = {
        hot_flashes: 'Vasomotor (Hot Flashes)',
        sleep: 'Sleep & Restoration',
        weight: 'Metabolism & Weight',
        energy: 'Energy & Vitality',
        mood: 'Mental Health & Mood',
    };

    const FRICTION_LABELS = {
        energy: 'More Energy',
        sleep: 'Better Sleep',
        clarity: 'Mental Clarity',
        hot_flashes: 'Manage Hot Flashes',
        joint_pain: 'Reduce Joint Pain',
        mood: 'Balance Mood',
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={28} color={COLORS.textMain} />
                </TouchableOpacity>
                <AppText variant="heading1" style={styles.title}>Onboarding Data</AppText>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <AppText variant="heading2" style={styles.sectionTitle}>Journey Stage</AppText>
                    <AppText variant="body" style={styles.valueText}>{onboardingData.stage || 'Not set'}</AppText>
                </View>

                <View style={styles.section}>
                    <AppText variant="heading2" style={styles.sectionTitle}>Friction Points</AppText>
                    <View style={styles.tagContainer}>
                        {onboardingData.frictionPoints.length > 0 ? onboardingData.frictionPoints.map((point, index) => (
                            <View key={index} style={styles.tag}>
                                <AppText style={styles.tagText}>{FRICTION_LABELS[point] || point}</AppText>
                            </View>
                        )) : <AppText variant="body" style={styles.valueText}>None selected</AppText>}
                    </View>
                </View>

                <View style={styles.section}>
                    <AppText variant="heading2" style={styles.sectionTitle}>Symptoms</AppText>
                    <View style={styles.tagContainer}>
                        {onboardingData.symptoms.length > 0 ? onboardingData.symptoms.map((symptom, index) => (
                            <View key={index} style={[styles.tag, { backgroundColor: '#FFE4E8' }]}>
                                <AppText style={[styles.tagText, { color: COLORS.primary }]}>
                                    {SYMPTOM_LABELS[symptom] || symptom}
                                </AppText>
                            </View>
                        )) : <AppText variant="body" style={styles.valueText}>None selected</AppText>}
                    </View>
                </View>

                <View style={styles.section}>
                    <AppText variant="heading2" style={styles.sectionTitle}>Goals</AppText>
                    <View style={styles.tagContainer}>
                        {onboardingData.goals.length > 0 ? onboardingData.goals.map((goal, index) => (
                            <View key={index} style={[styles.tag, { backgroundColor: '#E0F2F1' }]}>
                                <AppText style={[styles.tagText, { color: '#00796B' }]}>
                                    {GOAL_LABELS[goal] || goal}
                                </AppText>
                            </View>
                        )) : <AppText variant="body" style={styles.valueText}>None selected</AppText>}
                    </View>
                </View>

                <View style={styles.section}>
                    <AppText variant="heading2" style={styles.sectionTitle}>Commitment Level</AppText>
                    <AppText variant="body" style={styles.valueText}>{onboardingData.commitment || 'Not set'}</AppText>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button title="Edit in Onboarding Flow" onPress={() => navigation.navigate('OnboardingSDOH')} variant="secondary" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
        paddingTop: 60,
        paddingBottom: SPACING.md,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
    },
    backBtn: { marginRight: SPACING.md },
    title: { fontSize: 24, flex: 1 },
    content: { padding: SPACING.xl, paddingBottom: 100 },
    section: { marginBottom: SPACING.xl },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textMain, marginBottom: SPACING.xs },
    valueText: { fontSize: 16, color: COLORS.textMuted },
    tagContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
    },
    tagText: { fontSize: 14, color: '#4B5563', fontWeight: '500' },
    footer: { padding: SPACING.xl, paddingBottom: 40, borderTopWidth: 1, borderTopColor: '#E8E8E8' }
});
