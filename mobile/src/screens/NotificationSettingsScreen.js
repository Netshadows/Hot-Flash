import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AppText } from '../components/Typography';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

export const NotificationSettingsScreen = ({ navigation }) => {
    const { notifications, updateNotifications } = useUser();

    const workflows = [
        { id: 'Morning Only', label: 'Morning Only', icon: 'sunny-outline', description: 'Interventions delivered when you wake up.' },
        { id: 'Evening Only', label: 'Evening Only', icon: 'moon-outline', description: 'Wind down with evening therapy guides.' },
        { id: 'Event-based', label: 'Event-based', icon: 'flash-outline', description: 'Triggered by symptom spikes or biometric alerts.' },
        { id: 'No push notifications', label: 'Pause All', icon: 'notifications-off-outline', description: 'Manually check your dashboard instead.' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={28} color={COLORS.textMain} />
                </TouchableOpacity>
                <AppText variant="heading1" style={styles.title}>Notifications</AppText>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.mainToggleCard}>
                    <View style={styles.toggleInfo}>
                        <AppText variant="heading3">Push Notifications</AppText>
                        <AppText style={styles.toggleDesc}>
                            Receive clinical alerts, daily tips, and symptom reminders.
                        </AppText>
                    </View>
                    <TouchableOpacity
                        onPress={() => updateNotifications({ enabled: !notifications.enabled })}
                        style={[styles.toggleBase, notifications.enabled && styles.toggleActive]}
                    >
                        <View style={[styles.toggleThumb, notifications.enabled && styles.toggleThumbActive]} />
                    </TouchableOpacity>
                </View>

                {notifications.enabled && (
                    <View style={styles.workflowSection}>
                        <AppText variant="heading2" style={styles.sectionTitle}>Delivery Model (BIT)</AppText>
                        <AppText style={styles.sectionDesc}>
                            Align our Behavioral Intervention Technologies with your daily rhythms for maximum efficacy.
                        </AppText>

                        {workflows.map(item => {
                            const isSelected = notifications.workflow === item.id;
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[styles.workflowCard, isSelected && styles.workflowCardActive]}
                                    onPress={() => updateNotifications({ workflow: item.id })}
                                >
                                    <View style={styles.iconBox}>
                                        <Ionicons
                                            name={item.icon}
                                            size={24}
                                            color={isSelected ? COLORS.primary : COLORS.textMuted}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <AppText style={[styles.workflowLabel, isSelected && styles.workflowLabelActive]}>
                                            {item.label}
                                        </AppText>
                                        <AppText style={styles.workflowDesc}>{item.description}</AppText>
                                    </View>
                                    {isSelected && (
                                        <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                <View style={styles.infoCard}>
                    <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.primary} style={{ marginBottom: 8 }} />
                    <AppText style={styles.infoText}>
                        Lumina follows high-frequency BIT protocols. We only notify you when clinical data suggests an intervention is necessary.
                    </AppText>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
        paddingTop: 60,
        paddingBottom: SPACING.md,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
    },
    backBtn: { marginRight: SPACING.md },
    title: { fontSize: 24, flex: 1 },
    content: { padding: SPACING.xl, paddingBottom: 100 },
    mainToggleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.xl,
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        marginBottom: SPACING.xxl,
    },
    toggleInfo: { flex: 1, marginRight: SPACING.md },
    toggleDesc: { color: COLORS.textMuted, fontSize: 13, marginTop: 4, lineHeight: 18 },
    toggleBase: {
        width: 52,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        paddingHorizontal: 2,
    },
    toggleActive: { backgroundColor: COLORS.primary },
    toggleThumb: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    toggleThumbActive: { transform: [{ translateX: 22 }] },
    sectionTitle: { marginBottom: SPACING.xs, color: '#2D2D2D' },
    sectionDesc: { color: COLORS.textMuted, marginBottom: SPACING.xl, lineHeight: 20, fontSize: 14 },
    workflowCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        marginBottom: SPACING.md,
    },
    workflowCardActive: {
        borderColor: COLORS.primary,
        backgroundColor: 'rgba(255, 182, 193, 0.05)',
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    workflowLabel: { fontSize: 16, color: COLORS.textMain, fontWeight: '600' },
    workflowLabelActive: { color: COLORS.primary },
    workflowDesc: { color: COLORS.textMuted, fontSize: 13, marginTop: 2 },
    infoCard: {
        marginTop: SPACING.xl,
        padding: SPACING.lg,
        backgroundColor: '#F9FAFB',
        borderRadius: RADIUS.md,
        alignItems: 'center',
    },
    infoText: {
        textAlign: 'center',
        fontSize: 13,
        color: COLORS.textMuted,
        lineHeight: 18,
    }
});
