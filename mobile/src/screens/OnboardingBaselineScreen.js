import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Picker } from '@react-native-picker/picker'; // We will need to add this dependency, or use standard RN components if not available

export const OnboardingBaselineScreen = ({ navigation, route }) => {
    // Scaffold UI for now
    const handleNext = () => {
        navigation.navigate('OnboardingSymptomGrid'); // the next screen in the plan
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <AppText variant="heading1" style={styles.title}>Let's get your baseline</AppText>

            <AppText variant="body" style={styles.prompt}>
                When was your last period?
            </AppText>
            {/* Placeholder for Wheel Picker */}
            <View style={styles.pickerPlaceholder}>
                <AppText variant="caption">[ Date Picker Widget ]</AppText>
            </View>

            <AppText variant="body" style={styles.prompt}>
                How old are you?
            </AppText>
            {/* Placeholder for Wheel Picker */}
            <View style={styles.pickerPlaceholder}>
                <AppText variant="caption">[ Age Picker Widget ]</AppText>
            </View>

            <Button
                title="Next"
                onPress={handleNext}
                style={styles.nextButton}
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
    prompt: {
        fontWeight: '600',
        marginBottom: SPACING.sm,
        color: '#4A4A4A'
    },
    pickerPlaceholder: {
        height: 150,
        backgroundColor: '#F5F5F5',
        borderRadius: RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xl,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderStyle: 'dashed',
    },
    nextButton: {
        marginTop: SPACING.md,
    }
});
