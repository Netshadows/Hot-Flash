import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

export const OnboardingSymptomGridScreen = ({ navigation }) => {
    const [selected, setSelected] = useState({});

    const handleNext = () => {
        navigation.navigate('OnboardingAnalysis');
    }

    const toggleSymptom = (sym) => {
        setSelected(prev => ({ ...prev, [sym]: !prev[sym] }));
    }

    const symptoms = [
        'Hot flashes', 'Night sweats', 'Joint pain',
        'Mood swings', 'Anxiety', 'Irritability',
        'Brain fog', 'Memory lapses', 'Low libido'
    ];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <AppText variant="heading1" style={styles.title}>What symptoms are you experiencing?</AppText>

            <View style={styles.grid}>
                {symptoms.map(sym => (
                    <TouchableOpacity
                        key={sym}
                        style={[styles.gridItem, selected[sym] && styles.gridItemSelected]}
                        onPress={() => toggleSymptom(sym)}
                    >
                        {/* Placeholder for icon */}
                        <View style={styles.iconPlaceholder} />
                        <AppText variant="caption" style={selected[sym] ? styles.textSelected : styles.text}>
                            {sym}
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
    },
    title: {
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
    iconPlaceholder: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F0F0F0',
        marginBottom: 8,
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
        marginTop: SPACING.xl,
    }
});
