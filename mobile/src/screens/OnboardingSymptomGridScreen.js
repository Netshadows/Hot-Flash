import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { ScientificHint } from '../components/ScientificHint';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { useUser } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons';

// Mapping tracks to their specific symptoms
const TRACK_SYMPTOMS = {
    hot_flashes: [
        { id: 'hot_flashes', label: 'Hot Flashes', icon: 'flame-outline' },
        { id: 'night_sweats', label: 'Night Sweats', icon: 'water-outline' },
        { id: 'palpitations', label: 'Heart Palpitations', icon: 'heart-outline' },
    ],
    sleep: [
        { id: 'insomnia', label: 'Insomnia', icon: 'moon-outline' },
        { id: 'waking_early', label: 'Waking Early', icon: 'alarm-outline' },
        { id: 'night_sweats', label: 'Night Sweats', icon: 'water-outline' },
        { id: 'fatigue', label: 'Fatigue', icon: 'battery-dead-outline' },
    ],
    weight: [
        { id: 'weight_gain', label: 'Weight Gain', icon: 'scale-outline' },
        { id: 'bloating', label: 'Bloating', icon: 'balloon-outline' },
        { id: 'metabolism', label: 'Metabolism Shift', icon: 'fast-food-outline' },
    ],
    energy: [
        { id: 'low_energy', label: 'Low Energy', icon: 'battery-dead-outline' },
        { id: 'joint_pain', label: 'Joint Pain', icon: 'body-outline' },
        { id: 'stiffness', label: 'Muscle Stiffness', icon: 'fitness-outline' },
    ],
    mood: [
        { id: 'mood_swings', label: 'Mood Swings', icon: 'happy-outline' },
        { id: 'anxiety', label: 'Anxiety', icon: 'pulse-outline' },
        { id: 'irritability', label: 'Irritability', icon: 'flash-outline' },
        { id: 'brain_fog', label: 'Brain Fog', icon: 'cloud-outline' },
        { id: 'memory', label: 'Memory Lapses', icon: 'documents-outline' },
        { id: 'low_libido', label: 'Low Libido', icon: 'heart-disagree-outline' },
    ],
};

const DEFAULT_SYMPTOMS = [
    { id: 'hot_flashes', label: 'Hot Flashes', icon: 'flame-outline' },
    { id: 'night_sweats', label: 'Night Sweats', icon: 'water-outline' },
    { id: 'joint_pain', label: 'Joint Pain', icon: 'body-outline' },
    { id: 'mood_swings', label: 'Mood Swings', icon: 'happy-outline' },
    { id: 'brain_fog', label: 'Brain Fog', icon: 'cloud-outline' },
    { id: 'low_libido', label: 'Low Libido', icon: 'heart-disagree-outline' },
];

export const OnboardingSymptomGridScreen = ({ navigation, route }) => {
    const { updateOnboardingData } = useUser();
    const { profileData } = route.params || { profileData: {} };
    const [selected, setSelected] = useState({});

    // Derive the symptom grid dynamically based on the active tracks requested in the previous screen
    const displaySymptoms = useMemo(() => {
        if (!profileData.activeTracks || profileData.activeTracks.length === 0) {
            return DEFAULT_SYMPTOMS;
        }

        const combined = [];
        const seenIds = new Set();

        profileData.activeTracks.forEach(track => {
            if (TRACK_SYMPTOMS[track]) {
                TRACK_SYMPTOMS[track].forEach(sym => {
                    if (!seenIds.has(sym.id)) {
                        seenIds.add(sym.id);
                        combined.push(sym);
                    }
                });
            }
        });

        // Add a few generic ones if the list is too small
        if (combined.length < 6) {
            DEFAULT_SYMPTOMS.forEach(ds => {
                if (!seenIds.has(ds.id)) {
                    seenIds.add(ds.id);
                    combined.push(ds);
                }
            });
        }

        return combined;
    }, [profileData.activeTracks]);

    const handleNext = () => {
        const activeSymptoms = Object.keys(selected).filter(sym => selected[sym]);
        updateOnboardingData({ symptoms: activeSymptoms });
        navigation.navigate('OnboardingAnalysis', {
            profileData: { ...profileData, symptoms: activeSymptoms }
        });
    }

    const toggleSymptom = (symId) => {
        setSelected(prev => ({ ...prev, [symId]: !prev[symId] }));
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACING.xl }}>
                <AppText variant="heading1" style={styles.title}>Based on your focus tracks, which of these apply?</AppText>
                <View style={{ marginBottom: SPACING.xl, marginLeft: SPACING.sm, marginTop: 4 }}>
                    <ScientificHint title="Symptom Clustering" rationale="We use a modified Greene Climacteric Scale. Grouping your symptoms helps us identify if your primary imbalance is Vasomotor (physical heat), Psychological, or Somatic." />
                </View>
            </View>

            <View style={styles.grid}>
                {displaySymptoms.map(sym => (
                    <TouchableOpacity
                        key={sym.id}
                        style={[styles.gridItem, selected[sym.id] && styles.gridItemSelected]}
                        onPress={() => toggleSymptom(sym.id)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.iconContainer, selected[sym.id] && styles.iconContainerSelected]}>
                            <Ionicons name={sym.icon} size={28} color={selected[sym.id] ? COLORS.primary : COLORS.textMuted} />
                        </View>
                        <AppText variant="caption" style={selected[sym.id] ? styles.textSelected : styles.text}>
                            {sym.label}
                        </AppText>
                    </TouchableOpacity>
                ))}
            </View>

            <Button
                title="Next"
                onPress={handleNext}
                style={styles.nextButton}
                disabled={Object.values(selected).filter(Boolean).length === 0}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: SPACING.lg,
        paddingTop: 60,
        paddingBottom: 100,
    },
    title: {
        flex: 1,
        marginBottom: SPACING.xl,
        color: '#2D2D2D',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    gridItem: {
        width: '30%',
        aspectRatio: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: RADIUS.md,
        borderWidth: 1.5,
        borderColor: '#E8E8E8',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        shadowColor: 'rgba(255, 88, 100, 0.05)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        elevation: 1,
    },
    gridItemSelected: {
        borderColor: COLORS.primary,
        backgroundColor: 'rgba(255, 88, 100, 0.05)',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    iconContainerSelected: {
        backgroundColor: '#FFE4E8',
    },
    text: {
        textAlign: 'center',
        color: '#4A4A4A',
    },
    textSelected: {
        textAlign: 'center',
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    nextButton: {
        marginTop: SPACING.xxl,
    }
});
