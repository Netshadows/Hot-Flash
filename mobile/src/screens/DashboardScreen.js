import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Text } from 'react-native'; // Removed Svg import to avoid dependency issues if not installed
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { AppText } from '../components/Typography'; // Fixed default import to named
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { Svg, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Mock Data
const MOCK_LOGS = [
    { day: 'M', height: 40 },
    { day: 'T', height: 65 },
    { day: 'W', height: 30 },
    { day: 'T', height: 85 },
    { day: 'F', height: 50 },
    { day: 'S', height: 20 },
    { day: 'S', height: 90 },
];

export const DashboardScreen = ({ navigation }) => {
    const [resonance, setResonance] = useState(85);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(255, 88, 100, 0.08)', 'rgba(255, 182, 193, 0.1)']}
                style={StyleSheet.absoluteFillObject}
            />

            <ScrollView contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <AppText variant="heading1">Good Morning, Jane</AppText>
                    <AppText variant="subtitle">OCTOBER 24, MONDAY</AppText>
                </View>

                {/* Resonance Ring */}
                <View style={styles.resonanceContainer}>
                    <View style={styles.ringWrapper}>
                        <Svg height="200" width="200" viewBox="0 0 180 180">
                            <Circle
                                cx="90"
                                cy="90"
                                r="80"
                                stroke={COLORS.surfaceBorder}
                                strokeWidth="6"
                                fill="none"
                            />
                            <Circle
                                cx="90"
                                cy="90"
                                r="80"
                                stroke={COLORS.primary}
                                strokeWidth="6"
                                fill="none"
                                strokeDasharray="502"
                                strokeDashoffset={502 - (502 * (resonance / 100))}
                                strokeLinecap="round"
                                rotation="-90"
                                origin="90, 90"
                            />
                        </Svg>
                        <View style={styles.resonanceText}>
                            <Text style={styles.score}>{resonance}</Text>
                            <AppText variant="caption">RESONANCE</AppText>
                        </View>
                    </View>
                </View>

                {/* Chart */}
                <Card style={styles.chartCard} glass>
                    <View style={styles.chartHeader}>
                        <AppText variant="heading2" style={{ fontSize: 16 }}>Symptom Intensity</AppText>
                        <AppText variant="caption">LAST 7 DAYS</AppText>
                    </View>

                    <View style={styles.chartContainer}>
                        {MOCK_LOGS.map((item, index) => (
                            <View key={index} style={styles.chartCol}>
                                <View style={[styles.bar, { height: \`\${item.height}%\`, backgroundColor: item.height > 50 ? COLORS.primary : COLORS.secondary }]} />
                                <AppText variant="caption" style={{ marginTop: 8, fontSize: 10 }}>{item.day}</AppText>
                            </View>
                        ))}
                    </View>
                </Card>

                {/* Insight */}
                <Card style={styles.insightCard}>
                    <AppText variant="body" style={styles.insightText}>
                        "Your resonance is high today! Keep prioritizing sleep to maintain this balance."
                    </AppText>
                </Card>

                {/* Action */}
                <Button
                    title="Log Morning Check-in"
                    onPress={() => navigation.navigate('Logging')}
                    style={styles.actionBtn}
                />
            </ScrollView>
        </View>
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
        paddingBottom: 40,
    },
    header: {
        marginBottom: SPACING.xl,
    },
    resonanceContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    ringWrapper: {
        width: 200,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    resonanceText: {
        position: 'absolute',
        alignItems: 'center',
    },
    score: {
        fontSize: 64,
        fontWeight: '800',
        color: COLORS.primary,
        lineHeight: 80,
    },
    chartCard: {
        marginBottom: SPACING.lg,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    chartContainer: {
        flexDirection: 'row',
        height: 120,
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    chartCol: {
        alignItems: 'center',
        height: '100%',
        justifyContent: 'flex-end',
        width: 20,
    },
    bar: {
        width: 8,
        borderRadius: 4,
        opacity: 0.8,
    },
    insightCard: {
        marginBottom: SPACING.xl,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    insightText: {
        fontStyle: 'italic',
    },
    actionBtn: {
        marginBottom: 40,
    }
});
