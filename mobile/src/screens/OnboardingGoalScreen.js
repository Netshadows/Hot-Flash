import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, ScrollView } from 'react-native';
import { AppText } from '../components/Typography';
import { ScientificHint } from '../components/ScientificHint';
import { Button } from '../components/Button';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export const OnboardingGoalScreen = ({ navigation, route }) => {
    const { profileData } = route.params || { profileData: {} };
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const [selectedTracks, setSelectedTracks] = useState({});

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 1.15, duration: 2000, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
            ])
        ).start();
    }, [scaleAnim]);

    const toggleTrack = (id) => {
        setSelectedTracks(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleContinue = () => {
        const activeTracks = Object.keys(selectedTracks).filter(k => selectedTracks[k]);
        navigation.navigate('OnboardingBaseline', {
            profileData: { ...profileData, activeTracks }
        });
    };

    const tracks = [
        { id: 'hot_flashes', label: 'Vasomotor (Hot Flashes)', icon: 'flame-outline' },
        { id: 'sleep', label: 'Sleep & Restoration', icon: 'moon-outline' },
        { id: 'weight', label: 'Metabolism & Weight', icon: 'fitness-outline' },
        { id: 'energy', label: 'Energy & Vitality', icon: 'battery-charging-outline' },
        { id: 'mood', label: 'Mental Health & Mood', icon: 'heart-half-outline' },
    ];

    const hasSelection = Object.values(selectedTracks).some(v => v);

    return (
        <View style={styles.container}>
            <View style={styles.animationContainer}>
                <Animated.View style={[styles.circleOuter, { transform: [{ scale: scaleAnim }] }]} />
                <Animated.View style={[styles.circleInner, { transform: [{ scale: scaleAnim }] }]} />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md }}>
                <AppText variant="heading1" style={styles.title}>What areas would you like to focus on?</AppText>
                <View style={{ marginBottom: SPACING.xl, marginLeft: SPACING.xs }}>
                    <ScientificHint title="Targeted Protocols" rationale="Selecting specific focus areas allows our AI to personalize your daily plans, prioritizing the exact nutrients, exercises, and breathing techniques clinically proven to help those specific domains." />
                </View>
            </View>

            <AppText variant="body" style={styles.subtitle}>Select all that apply.</AppText>

            <ScrollView contentContainerStyle={styles.buttonContainer} showsVerticalScrollIndicator={false}>
                {tracks.map((track) => {
                    const isSelected = selectedTracks[track.id];
                    return (
                        <TouchableOpacity
                            key={track.id}
                            style={[styles.trackCard, isSelected && styles.trackCardActive]}
                            activeOpacity={0.8}
                            onPress={() => toggleTrack(track.id)}
                        >
                            <View style={[styles.iconBox, isSelected && styles.iconBoxActive]}>
                                <Ionicons name={track.icon} size={24} color={isSelected ? COLORS.primary : COLORS.textMuted} />
                            </View>
                            <AppText variant="body" style={[styles.goalText, isSelected && styles.goalTextActive]}>
                                {track.label}
                            </AppText>
                            {isSelected && (
                                <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} style={styles.checkIcon} />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title="Continue"
                    onPress={handleContinue}
                    disabled={!hasSelection}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.lg,
        paddingTop: 80,
    },
    animationContainer: {
        height: 120, // Smaller to make room
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.lg,
    },
    circleOuter: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 88, 100, 0.08)',
    },
    circleInner: {
        position: 'absolute',
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255, 88, 100, 0.15)',
    },
    title: {
        flex: 1,
        color: '#2D2D2D',
    },
    subtitle: {
        color: COLORS.textMuted,
        marginBottom: SPACING.xl,
    },
    buttonContainer: {
        width: '100%',
        gap: SPACING.md,
        paddingBottom: 100,
    },
    trackCard: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 14,
        paddingHorizontal: SPACING.md,
        backgroundColor: '#FFFFFF',
        borderRadius: RADIUS.md,
        borderWidth: 1.5,
        borderColor: '#E8E8E8',
        shadowColor: 'rgba(0, 0, 0, 0.05)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
    },
    trackCardActive: {
        borderColor: 'rgba(255, 88, 100, 0.4)',
        backgroundColor: '#FFF0F2',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    iconBoxActive: {
        backgroundColor: '#FFE4E8',
    },
    goalText: {
        flex: 1,
        fontWeight: '500',
        color: '#4A4A4A',
        fontSize: 16,
    },
    goalTextActive: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    checkIcon: {
        marginLeft: SPACING.sm,
    },
    footer: {
        position: 'absolute',
        bottom: SPACING.xl,
        left: SPACING.lg,
        right: SPACING.lg,
        backgroundColor: COLORS.background, // Ensure bottom fade or solid
    }
});
