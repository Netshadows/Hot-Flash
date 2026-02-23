import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Dimensions, ActivityIndicator } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Mock data check
const checkDataSufficiency = async () => {
    // Simulate check: returning true for demo purposes
    return true;
};

export const HealthReportScreen = ({ navigation }) => {
    const [hasEnoughData, setHasEnoughData] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportGenerated, setReportGenerated] = useState(false);

    useEffect(() => {
        checkDataSufficiency().then(res => setHasEnoughData(res));
    }, []);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setReportGenerated(true);
        }, 2000); // Simulate API call to generate PDF
    };

    const handleShare = () => {
        alert("Native Share Sheet: PDF attached");
    };

    if (hasEnoughData === null) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!hasEnoughData) {
        return (
            <View style={styles.centerContainer}>
                <View style={styles.placeholderIcon}><Text style={{ fontSize: 40 }}>📊</Text></View>
                <AppText variant="heading1" style={styles.title}>Keep Logging</AppText>
                <AppText variant="body" style={styles.subtitle}>
                    We need at least 7 days of symptom data to generate a statistically significant clinical report for your doctor.
                </AppText>
                <Button
                    title="Log Symptoms Today"
                    onPress={() => navigation.navigate('Logging')}
                    style={styles.actionButton}
                />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <AppText style={styles.backButtonText}>← Back</AppText>
                </TouchableOpacity>
                <AppText variant="heading1">Clinical Report</AppText>
            </View>

            {reportGenerated ? (
                <View style={styles.generatedContainer}>
                    <View style={styles.pdfPreview}>
                        <LinearGradient
                            colors={['#FFFFFF', '#F9F9F9']}
                            style={styles.pdfPaper}
                        >
                            <AppText variant="caption" style={styles.pdfHeader}>PATIENT HEALTH REPORT</AppText>
                            <View style={styles.pdfDivider} />
                            <AppText variant="heading2" style={styles.pdfTitle}>Jane Doe - Menopause Analysis</AppText>
                            <AppText variant="body">Generated: {new Date().toLocaleDateString()}</AppText>

                            <View style={styles.pdfSection}>
                                <AppText variant="caption" style={{ fontWeight: 'bold' }}>KEY FINDINGS</AppText>
                                <AppText variant="body" style={styles.pdfText}>• Severe hot flashes (3x/day) correlate with poor sleep architectures.</AppText>
                                <AppText variant="body" style={styles.pdfText}>• HRV drops preceded 80% of reported anxiety events.</AppText>
                            </View>
                        </LinearGradient>
                    </View>

                    <Button
                        title="Share with Doctor"
                        onPress={handleShare}
                        style={styles.actionButton}
                    />
                </View>
            ) : (
                <View style={styles.setupContainer}>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoIcon}>🩺</Text>
                        <AppText variant="heading2" style={styles.infoTitle}>Ready for your appointment?</AppText>
                        <AppText variant="body" style={styles.infoText}>
                            Generate a comprehensive PDF report detailing your symptom trends, biometric correlations, and cycle data over the last 30 days.
                        </AppText>
                    </View>

                    <Button
                        title={isGenerating ? "Compiling Data..." : "Generate PDF"}
                        onPress={handleGenerate}
                        disabled={isGenerating}
                        style={styles.actionButton}
                    />
                    {isGenerating && <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: SPACING.md }} />}
                </View>
            )}
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
    centerContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xl,
    },
    placeholderIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 88, 100, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.lg,
    },
    title: {
        marginBottom: SPACING.sm,
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
        color: '#757575',
        marginBottom: SPACING.xl,
    },
    actionButton: {
        width: '100%',
        marginTop: SPACING.lg,
    },
    header: {
        marginBottom: SPACING.xl,
    },
    backButton: {
        marginBottom: SPACING.md,
    },
    backButtonText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 16,
    },
    setupContainer: {
        alignItems: 'center',
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: RADIUS.md,
        padding: SPACING.xl,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E8E8E8',
        marginBottom: SPACING.xl,
        width: '100%',
    },
    infoIcon: {
        fontSize: 48,
        marginBottom: SPACING.md,
    },
    infoTitle: {
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    infoText: {
        textAlign: 'center',
        color: '#757575',
    },
    generatedContainer: {
        alignItems: 'center',
    },
    pdfPreview: {
        width: '100%',
        aspectRatio: 1 / 1.414, // A4 aspect ratio approximation
        backgroundColor: '#FFFFFF',
        borderRadius: RADIUS.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 10,
        marginBottom: SPACING.xl,
        overflow: 'hidden',
    },
    pdfPaper: {
        flex: 1,
        padding: SPACING.xl,
    },
    pdfHeader: {
        color: '#8A8A9D',
        letterSpacing: 2,
    },
    pdfDivider: {
        height: 2,
        backgroundColor: COLORS.primary,
        width: 60,
        marginVertical: SPACING.md,
    },
    pdfTitle: {
        marginBottom: SPACING.xs,
    },
    pdfSection: {
        marginTop: SPACING.xl,
    },
    pdfText: {
        marginTop: SPACING.sm,
        lineHeight: 24,
    }
});
