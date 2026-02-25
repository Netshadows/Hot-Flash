import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { ProfileStudioModal } from '../components/ProfileStudioModal';

export const PreferencesScreen = ({ navigation }) => {
    const { activeTracks, toggleTrack, logout } = useUser();
    const [studioVisible, setStudioVisible] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Welcome' }],
        });
    };

    const tracks = [
        { id: 'hot_flashes', label: 'Vasomotor (Hot Flashes)', icon: 'flame-outline' },
        { id: 'sleep', label: 'Sleep & Restoration', icon: 'moon-outline' },
        { id: 'weight', label: 'Metabolism & Weight', icon: 'fitness-outline' },
        { id: 'energy', label: 'Energy & Vitality', icon: 'battery-charging-outline' },
        { id: 'mood', label: 'Mental Health & Mood', icon: 'heart-half-outline' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={28} color={COLORS.textMain} />
                </TouchableOpacity>
                <AppText variant="heading1" style={styles.title}>Preferences</AppText>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <AppText variant="heading2" style={styles.sectionTitle}>Active Focus Tracks</AppText>
                <AppText variant="body" style={styles.sectionDesc}>
                    Tailor your dashboard and daily plans by selecting the areas you want to focus on most.
                </AppText>

                <View style={styles.tracksContainer}>
                    {tracks.map(track => {
                        const isActive = activeTracks[track.id];
                        return (
                            <TouchableOpacity
                                key={track.id}
                                style={[styles.trackCard, isActive && styles.trackCardActive]}
                                onPress={() => toggleTrack(track.id)}
                            >
                                <View style={styles.trackIconContainer}>
                                    <Ionicons name={track.icon} size={24} color={isActive ? COLORS.primary : COLORS.textMuted} />
                                </View>
                                <AppText style={[styles.trackLabel, isActive && styles.trackLabelActive]}>
                                    {track.label}
                                </AppText>
                                <View style={[styles.toggleBase, isActive && styles.toggleActive]}>
                                    <View style={[styles.toggleThumb, isActive && styles.toggleThumbActive]} />
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={[styles.actionSection, { marginBottom: SPACING.lg }]}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('OnboardingData')}
                    >
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="clipboard-outline" size={24} color={COLORS.primary} />
                            <AppText style={styles.menuItemText}>Onboarding Data</AppText>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('HealthReport')}
                    >
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="document-text-outline" size={24} color={COLORS.primary} />
                            <AppText style={styles.menuItemText}>Clinical Health Report</AppText>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>
                </View>

                <View style={styles.actionSection}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('Integrations')}
                    >
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="link-outline" size={24} color={COLORS.textMain} />
                            <AppText style={styles.menuItemText}>Connected Apps & Devices</AppText>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => setStudioVisible(true)}
                    >
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="camera-outline" size={24} color={COLORS.primary} />
                            <AppText style={styles.menuItemText}>Profile Studio</AppText>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('NotificationSettings')}
                    >
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="notifications-outline" size={24} color={COLORS.textMain} />
                            <AppText style={styles.menuItemText}>Notification Settings</AppText>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="person-outline" size={24} color={COLORS.textMain} />
                            <AppText style={styles.menuItemText}>Account Details</AppText>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.actionSection, styles.logoutButton, { marginTop: SPACING.xxl }]}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={24} color="#FF5252" />
                    <AppText style={styles.logoutText}>Log Out</AppText>
                </TouchableOpacity>
            </ScrollView>

            <ProfileStudioModal
                visible={studioVisible}
                onClose={() => setStudioVisible(false)}
            />
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
    sectionTitle: { marginBottom: SPACING.xs, color: '#2D2D2D' },
    sectionDesc: { color: COLORS.textMuted, marginBottom: SPACING.xl, lineHeight: 22 },
    tracksContainer: { gap: SPACING.md, marginBottom: SPACING.xxl },
    trackCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    trackCardActive: {
        borderColor: 'rgba(255, 182, 193, 0.5)',
        backgroundColor: '#FFF0F2',
    },
    trackIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    trackLabel: { flex: 1, fontSize: 16, color: COLORS.textMain, fontWeight: '500' },
    trackLabelActive: { color: COLORS.primary, fontWeight: '600' },
    toggleBase: {
        width: 44,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#D1D5DB',
        justifyContent: 'center',
        paddingHorizontal: 2,
    },
    toggleActive: { backgroundColor: COLORS.primary },
    toggleThumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    toggleThumbActive: { transform: [{ translateX: 20 }] },
    actionSection: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
    menuItemText: { marginLeft: SPACING.md, fontSize: 16, color: COLORS.textMain, fontWeight: '500' },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.lg,
        borderColor: '#FF5252',
    },
    logoutText: {
        marginLeft: SPACING.sm,
        fontSize: 16,
        color: '#FF5252',
        fontWeight: '700',
    },
});
