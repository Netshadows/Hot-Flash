import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

export const OnboardingFrictionScreen = ({ navigation }) => {
    const goalsAndFrictions = [
        { id: 'energy', label: 'More Energy', type: 'positive' },
        { id: 'sleep', label: 'Better Sleep', type: 'positive' },
        { id: 'clarity', label: 'Mental Clarity', type: 'positive' },
        { id: 'hot_flashes', label: 'Manage Hot Flashes', type: 'symptom' },
        { id: 'joint_pain', label: 'Reduce Joint Pain', type: 'symptom' },
        { id: 'mood', label: 'Balance Mood', type: 'symptom' }
    ];

    const [selected, setSelected] = useState([]);

    const toggleItem = (id) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(i => i !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <AppText variant="heading1" style={styles.title}>What are your goals?</AppText>
                <AppText variant="body" style={styles.subtitle}>Select the areas you'd like to focus on for your daily rituals.</AppText>

                <View style={styles.list}>
                    {goalsAndFrictions.map((item) => {
                        const isSelected = selected.includes(item.id);
                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.card,
                                    isSelected && styles.cardSelected,
                                    item.type === 'positive' && isSelected && styles.cardPositiveSelected
                                ]}
                                onPress={() => toggleItem(item.id)}
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
                                    {item.label}
                                </AppText>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title="Finish Setup"
                    onPress={() => navigation.navigate('MainTabs')}
                    disabled={selected.length === 0}
                    style={{ opacity: selected.length === 0 ? 0.5 : 1 }}
                />
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
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between'
    },
    card: {
        width: '48%',
        flexDirection: 'column',
        alignItems: 'center',
        padding: SPACING.lg,
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#E8E8E8',
        marginBottom: SPACING.sm,
    },
    cardSelected: {
        backgroundColor: 'rgba(255, 88, 100, 0.05)',
        borderColor: COLORS.primary,
    },
    cardPositiveSelected: {
        backgroundColor: 'rgba(76, 175, 80, 0.05)',
        borderColor: '#4CAF50',
    },
    radio: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#D1D1D1',
        marginBottom: SPACING.md,
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
        fontSize: 15,
        fontWeight: '500',
        color: COLORS.textMain,
        textAlign: 'center'
    },
    cardTextSelected: {
        fontWeight: '700',
    },
    footer: {
        padding: SPACING.xl,
        paddingBottom: 60,
    }
});
