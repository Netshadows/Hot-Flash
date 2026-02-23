import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

export const OnboardingFrictionScreen = ({ navigation }) => {
    const frictions = [
        'Hot Flashes', 'Brain Fog', 'Joint Pain',
        'Mood Swings', 'Sleep Loss', 'Low Energy'
    ];

    // Track selected indices
    const [selected, setSelected] = useState([]);

    const toggleBubble = (idx) => {
        if (selected.includes(idx)) {
            setSelected(selected.filter(i => i !== idx));
        } else {
            if (selected.length < 3) {
                setSelected([...selected, idx]);
            }
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <AppText variant="heading1" style={styles.title}>What feels heavy today?</AppText>
                <AppText variant="body" style={styles.subtitle}>Select up to 3 to personalize your daily rituals.</AppText>

                <View style={styles.list}>
                    {frictions.map((f, idx) => {
                        const isSelected = selected.includes(idx);
                        return (
                            <TouchableOpacity
                                key={idx}
                                style={[
                                    styles.card,
                                    isSelected && styles.cardSelected
                                ]}
                                onPress={() => toggleBubble(idx)}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                                    {isSelected && <View style={styles.radioInner} />}
                                </View>
                                <AppText
                                    style={[
                                        styles.cardText,
                                        isSelected && styles.cardTextSelected
                                    ]}
                                >
                                    {f}
                                </AppText>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                {selected.length === 3 ? (
                    <Button
                        title="Finish Setup"
                        onPress={() => navigation.navigate('MainTabs')}
                    />
                ) : (
                    <AppText style={styles.instruction}>
                        Select {3 - selected.length} more.
                    </AppText>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: {
        padding: SPACING.xl,
        paddingTop: 80,
    },
    title: {
        fontSize: 28,
        color: COLORS.textMain,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textMuted,
        marginBottom: SPACING.xl,
        marginTop: SPACING.sm,
    },
    list: {
        flexDirection: 'column',
        gap: 12,
    },
    card: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#E8E8E8', // Soft gray border
    },
    cardSelected: {
        backgroundColor: 'rgba(255, 88, 100, 0.05)', // Very light pink fill
        borderColor: COLORS.primary,
    },
    radio: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#D1D1D1',
        marginRight: SPACING.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioSelected: {
        borderColor: COLORS.primary,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.primary,
    },
    cardText: {
        fontSize: 17,
        fontWeight: '500',
        color: COLORS.textMain,
    },
    cardTextSelected: {
        fontWeight: '700',
    },
    footer: {
        padding: SPACING.xl,
        paddingBottom: 60,
        minHeight: 120,
        justifyContent: 'center',
    },
    instruction: {
        textAlign: 'center',
        color: COLORS.textMuted,
        fontWeight: '600',
        fontSize: 16,
    }
});
