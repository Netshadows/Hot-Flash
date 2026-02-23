import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { ScientificHint } from '../components/ScientificHint';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export const OnboardingCommitmentScreen = ({ navigation }) => {
    // Initialize empty profileData object to pass through the funnel
    const handleCommit = () => {
        navigation.navigate('OnboardingGoal', { profileData: {} });
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#FFFFFF', 'rgba(255, 88, 100, 0.05)']} style={StyleSheet.absoluteFillObject} />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                <View style={styles.badge}>
                    <AppText style={{ fontSize: 50 }}>🩺</AppText>
                </View>

                <View style={styles.headerRow}>
                    <AppText variant="heading1" style={styles.title}>Clinical Protocol</AppText>
                    <ScientificHint
                        title="Clinical Foundation"
                        rationale="Lumina's underlying protocols are built on verified ACOG and NAMS guidelines for managing the menopause transition. High baseline commitment significantly increases symptom reduction efficacy over 30 days."
                    />
                </View>

                <AppText variant="body" style={styles.bodyText}>
                    You are about to build a clinical-grade menopause transition plan tailored entirely to your specific hormonal and symptom profile.
                </AppText>

                <View style={styles.card}>
                    <AppText style={{ fontSize: 32, marginBottom: 12 }}>⏱️</AppText>
                    <AppText variant="heading2" style={{ color: COLORS.primary, marginBottom: 8 }}>5-Minute Daily Commitment</AppText>
                    <AppText variant="body" style={{ color: '#4A4A4A', lineHeight: 22 }}>
                        Reversing menopausal symptoms requires data. We ask for 5 minutes a day to track your vital pulses and complete micro-habits.
                    </AppText>
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <Button title="I'm ready to commit" onPress={handleCommit} style={{ width: '100%' }} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACING.xl, paddingTop: 100 },
    badge: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xl,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 4,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    title: { color: COLORS.textMain },
    bodyText: {
        fontSize: 18,
        color: '#4A4A4A',
        lineHeight: 28,
        marginBottom: SPACING.xl,
    },
    card: {
        backgroundColor: '#FFF5EE',
        padding: SPACING.xl,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        borderColor: '#FFDAB9',
        marginTop: SPACING.md,
    },
    footer: {
        padding: SPACING.xl,
        paddingBottom: 40,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderTopWidth: 1,
        borderTopColor: '#E8E8E8',
    }
});
