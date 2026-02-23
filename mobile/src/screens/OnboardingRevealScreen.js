import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export const OnboardingRevealScreen = ({ navigation, route }) => {
    const { profileData } = route.params || { profileData: {} };

    const handleUnlock = () => {
        // Navigate to Login wall to actually lock in the profile creation
        navigation.navigate('Login', { profileData });
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#FFFFFF', '#FCE4EC']} style={StyleSheet.absoluteFillObject} />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                <AppText variant="heading1" style={styles.title}>Your exact 30-day protocol is ready.</AppText>

                <AppText variant="body" style={styles.subtitle}>
                    Based on your hormonal markers, stress levels, and specific symptom clustering.
                </AppText>

                <View style={styles.card}>
                    {/* Fake blurred graph / timeline area */}
                    <View style={styles.blurContainer}>
                        <LinearGradient colors={['rgba(255,255,255,0.7)', 'rgba(255,255,255,0.95)']} style={StyleSheet.absoluteFillObject} />
                        <AppText style={{ fontSize: 40, opacity: 0.3 }}>📈</AppText>
                        <AppText variant="heading3" style={{ color: '#999', textAlign: 'center', marginTop: 8 }}>
                            Perimenopause Trajectory
                        </AppText>
                        <AppText variant="caption" style={{ color: '#CCC', textAlign: 'center', marginTop: 4 }}>
                            Sign up to reveal your timeline
                        </AppText>
                    </View>

                    <View style={styles.benefitList}>
                        <AppText style={styles.benefitItem}>✔️ Custom nutrition regimen</AppText>
                        <AppText style={styles.benefitItem}>✔️ Sleep architecture repair</AppText>
                        <AppText style={styles.benefitItem}>✔️ Joint & Mobility sequences</AppText>
                    </View>
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title="Unlock Your Plan"
                    onPress={handleUnlock}
                    style={{ width: '100%', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 10 }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACING.xl, paddingTop: 80, paddingBottom: 40 },
    title: { color: COLORS.primary, marginBottom: SPACING.sm },
    subtitle: { color: '#666', lineHeight: 22, fontSize: 16, marginBottom: SPACING.xl },
    card: {
        backgroundColor: '#FFF', borderRadius: RADIUS.lg,
        shadowColor: 'rgba(255, 88, 100, 0.1)', shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1, shadowRadius: 20, elevation: 8, overflow: 'hidden', padding: 2
    },
    blurContainer: {
        height: 200, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center',
        borderTopLeftRadius: RADIUS.lg, borderTopRightRadius: RADIUS.lg,
    },
    benefitList: { padding: SPACING.xl, gap: SPACING.md },
    benefitItem: { fontSize: 16, color: '#4A4A4A', fontWeight: '500' },
    footer: { padding: SPACING.xl, paddingBottom: 40, borderTopWidth: 1, borderTopColor: '#E8E8E8', backgroundColor: 'rgba(255,255,255,0.9)' }
});
