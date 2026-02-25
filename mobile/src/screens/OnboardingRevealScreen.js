import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop, Circle } from 'react-native-svg';

const TrajectoryChart = () => {
    return (
        <View style={styles.chartContainer}>
            <Svg height="120" width="100%" viewBox="0 0 300 120">
                <Defs>
                    <SvgGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor={COLORS.primary} stopOpacity="0.3" />
                        <Stop offset="1" stopColor={COLORS.primary} stopOpacity="0" />
                    </SvgGradient>
                </Defs>

                {/* Horizontal Baseline */}
                <Path d="M 0 100 L 300 100" stroke="#E8E8E8" strokeWidth="1" strokeDasharray="4 4" />

                {/* Area under the curve */}
                <Path
                    d="M 0 80 Q 75 90 150 40 T 300 10 L 300 100 L 0 100 Z"
                    fill="url(#grad)"
                />

                {/* Improvement Curve (The Trajectory) */}
                <Path
                    d="M 0 80 Q 75 90 150 40 T 300 10"
                    fill="none"
                    stroke={COLORS.primary}
                    strokeWidth="4"
                    strokeLinecap="round"
                />

                {/* Milestone Markers */}
                <Circle cx="0" cy="80" r="4" fill={COLORS.primary} />
                <Circle cx="150" cy="40" r="4" fill={COLORS.primary} />
                <Circle cx="300" cy="10" r="4" fill={COLORS.primary} />
            </Svg>

            <View style={styles.chartLabels}>
                <AppText style={styles.chartLabel}>Day 1</AppText>
                <AppText style={styles.chartLabel}>Day 15</AppText>
                <AppText style={styles.chartLabel}>Day 30</AppText>
            </View>

            <View style={styles.overlayText}>
                <AppText variant="heading3" style={{ color: COLORS.primary, fontSize: 14 }}>Predicted Wellness Trajectory</AppText>
                <AppText variant="caption" style={{ color: '#666' }}>Personalized focus: Hot Flashes & Sleep</AppText>
            </View>
        </View>
    );
};

export const OnboardingRevealScreen = ({ navigation, route }) => {
    const { profileData } = route.params || { profileData: {} };

    const handleUnlock = () => {
        // Navigate to Register wall to actually lock in the profile creation
        navigation.navigate('Register', { profileData });
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#FFFFFF', '#FCE4EC']} style={StyleSheet.absoluteFillObject} />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                <AppText variant="heading1" style={styles.title}>Your exact 30-day protocol is ready.</AppText>

                <AppText variant="body" style={styles.subtitle}>
                    Created for your unique rhythm, based on your body's current needs and wellness markers.
                </AppText>

                <View style={styles.card}>
                    <TrajectoryChart />

                    <View style={styles.benefitList}>
                        <AppText style={styles.benefitItem}>✔️ Nurturing nutrition guide</AppText>
                        <AppText style={styles.benefitItem}>✔️ Restorative sleep rituals</AppText>
                        <AppText style={styles.benefitItem}>✔️ Gentle movement practices</AppText>
                    </View>
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title="Unlock Your Plan"
                    onPress={handleUnlock}
                    style={{ width: '100%', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 10, marginBottom: SPACING.md }}
                />

                <TouchableOpacity onPress={handleUnlock} style={styles.freeLink}>
                    <AppText style={styles.freeLinkText}>Continue for free</AppText>
                </TouchableOpacity>
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
        shadowOpacity: 1, shadowRadius: 20, elevation: 8, overflow: 'hidden'
    },
    chartContainer: {
        height: 200,
        backgroundColor: '#F9FAFB',
        paddingTop: 30,
        paddingHorizontal: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6'
    },
    chartLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    chartLabel: {
        fontSize: 10,
        color: '#999',
        fontWeight: '700'
    },
    overlayText: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: SPACING.md,
        alignItems: 'center',
    },
    benefitList: { padding: SPACING.xl, gap: SPACING.md },
    benefitItem: { fontSize: 16, color: '#4A4A4A', fontWeight: '500' },
    footer: { padding: SPACING.xl, paddingBottom: 40, borderTopWidth: 1, borderTopColor: '#E8E8E8', backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center' },
    freeLink: { paddingVertical: SPACING.sm },
    freeLinkText: { color: COLORS.textMuted, fontSize: 14, fontWeight: '600', textDecorationLine: 'underline' }
});
