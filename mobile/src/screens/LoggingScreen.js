import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Slider, Switch, TextInput } from 'react-native'; // Note: Slider extracted from react-native core in newer versions, assuming @react-native-community/slider available or standard shim
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { BlurView } from 'expo-blur';

export const LoggingScreen = ({ navigation }) => {
    const [vasoSeverity, setVasoSeverity] = useState(0);

    const renderSlider = (label) => (
        <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
                <AppText variant="subtitle">{label}</AppText>
                <AppText variant="heading2" style={{ color: COLORS.primary }}>{vasoSeverity}</AppText>
            </View>
            {/* Mock Slider for visual representation */}
            <View style={styles.sliderTrack}>
                <View style={[styles.sliderFill, { width: \`\${(vasoSeverity / 4) * 100}%\` }]} />
                <View style={[styles.sliderThumb, { left: \`\${(vasoSeverity / 4) * 95}%\` }]} />
            </View>
            <View style={styles.sliderLabels}>
                <AppText variant="caption">None</AppText>
                <AppText variant="caption">Extreme</AppText>
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <AppText variant="heading1" style={styles.header}>Log Symptom</AppText>

            <View style={styles.card}>
                <AppText variant="caption" style={{ marginBottom: 12 }}>VASOMOTOR (HOT FLASH)</AppText>
                {renderSlider('Severity')}
                <TextInput
                    placeholder="Notes (e.g. triggers)"
                    placeholderTextColor={COLORS.textMuted}
                    style={styles.textInput}
                    multiline
                />
            </View>

            <AppText variant="caption" style={styles.sectionTitle}>PSYCHOLOGICAL</AppText>
            {['Anxiety', 'Brain Fog', 'Irritability'].map(item => (
                <View key={item} style={styles.row}>
                    <AppText variant="body">{item}</AppText>
                    <Switch trackColor={{ false: "#eee", true: COLORS.primary }} />
                </View>
            ))}

            <Button
                title="Save Entry"
                onPress={() => navigation.goBack()}
                style={{ marginTop: SPACING.xl }}
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
    header: {
        marginBottom: SPACING.lg,
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 4,
    },
    inputGroup: {
        marginBottom: SPACING.lg,
    },
    inputHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    sliderTrack: {
        height: 6,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 3,
        position: 'relative',
        marginVertical: 10,
    },
    sliderFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 3,
    },
    sliderThumb: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.surface,
        borderWidth: 2,
        borderColor: COLORS.primary,
        position: 'absolute',
        top: -9,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textInput: {
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: RADIUS.sm,
        padding: SPACING.md,
        height: 80,
        textAlignVertical: 'top',
    },
    sectionTitle: {
        marginBottom: SPACING.md,
        marginTop: SPACING.md,
    },
    row: {
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: RADIUS.sm,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xs,
        borderWidth: 1,
        borderColor: COLORS.surfaceBorder,
    }
});
