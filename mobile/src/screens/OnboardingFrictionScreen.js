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

                <View style={styles.grid}>
                    {frictions.map((f, idx) => {
                        const isSelected = selected.includes(idx);
                        return (
                            <TouchableOpacity
                                key={idx}
                                style={[
                                    styles.bubble,
                                    isSelected && styles.bubbleSelected
                                ]}
                                onPress={() => toggleBubble(idx)}
                                activeOpacity={0.8}
                            >
                                <AppText
                                    style={[
                                        styles.bubbleText,
                                        isSelected && styles.bubbleTextSelected
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
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
    },
    bubble: {
        width: '46%', // 2 columns roughly
        aspectRatio: 1, // Make them square/circles
        borderRadius: 100,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.md,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    bubbleSelected: {
        backgroundColor: 'rgba(255, 88, 100, 0.1)',
        borderColor: COLORS.primary,
    },
    bubbleText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textMain,
        textAlign: 'center',
    },
    bubbleTextSelected: {
        color: COLORS.primary,
        fontWeight: '800',
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
