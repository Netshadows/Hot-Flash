import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { AppText } from '../components/Typography';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';

const ACTIVITIES = [
    {
        id: 'yoga',
        title: 'Restorative Yoga',
        duration: '15 Min',
        icon: 'body-outline',
        color: '#E0FFFF',
        description: 'Gentle stretching to relieve joint stiffness and improve sleep quality.'
    },
    {
        id: 'walk',
        title: 'Brisk Walk',
        duration: '20 Min',
        icon: 'walk-outline',
        color: '#F0FFF0',
        description: 'Light cardio to help regulate your autonomic nervous system and reduce hot flashes.'
    },
    {
        id: 'strength',
        title: 'Light Strength',
        duration: '10 Min',
        icon: 'barbell-outline',
        color: '#FFE4E1',
        description: 'Maintain muscle mass and bone density with simple bodyweight exercises.'
    },
    {
        id: 'stretch',
        title: 'Morning Flex',
        duration: '5 Min',
        icon: 'accessibility-outline',
        color: '#FFFACD',
        description: 'Quick routine to combat morning stiffness and energize your day.'
    }
];

export const MovementActivityScreen = ({ navigation }) => {
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [isStarted, setIsStarted] = useState(false);

    const renderActivityCard = (activity) => {
        const isSelected = selectedActivity?.id === activity.id;
        return (
            <TouchableOpacity
                key={activity.id}
                style={[styles.activityCard, isSelected && styles.activityCardSelected]}
                onPress={() => setSelectedActivity(activity)}
                activeOpacity={0.8}
            >
                <View style={[styles.iconContainer, { backgroundColor: activity.color }]}>
                    <Ionicons name={activity.icon} size={28} color={COLORS.textMain} />
                </View>
                <View style={styles.cardContent}>
                    <AppText style={styles.cardTitle}>{activity.title}</AppText>
                    <AppText style={styles.cardDuration}>{activity.duration}</AppText>
                </View>
                {isSelected && (
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                )}
            </TouchableOpacity>
        );
    };

    if (isStarted && selectedActivity) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={['#E0FFFF', COLORS.background]} style={StyleSheet.absoluteFillObject} />
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setIsStarted(false)} style={styles.backButton}>
                        <Ionicons name="close" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                    <AppText variant="heading2" style={{ color: COLORS.textMain }}>{selectedActivity.title}</AppText>
                    <View style={{ width: 40 }} />
                </View>
                <View style={styles.activeContent}>
                    {/* Placeholder for actual exercise video/timer */}
                    <View style={styles.videoPlaceholder}>
                        <Ionicons name="play-circle-outline" size={80} color={COLORS.textMuted} />
                        <AppText style={{ color: COLORS.textMuted, marginTop: SPACING.md }}>Video Content Here</AppText>
                    </View>
                    <AppText variant="heading2" style={{ marginBottom: SPACING.md }}>Current: Cat-Cow Stretch</AppText>
                    <AppText style={{ color: COLORS.textMuted, textAlign: 'center', paddingHorizontal: SPACING.xl }}>
                        Breathe in as you arch your back, exhale as you round your spine.
                    </AppText>
                </View>

                <View style={styles.footer}>
                    <Button title="Finish Routine" onPress={() => navigation.goBack()} style={{ width: '100%' }} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={[COLORS.background, '#F8F9FA']} style={StyleSheet.absoluteFillObject} />
            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                </View>

                <AppText variant="heading1" style={styles.title}>Movement Goals</AppText>
                <AppText style={styles.subtitle}>
                    Consistent, moderate movement is proven to mitigate vasomotor symptoms and protect bone health during the transition.
                </AppText>

                <View style={styles.listContainer}>
                    {ACTIVITIES.map(renderActivityCard)}
                </View>

                {selectedActivity && (
                    <View style={styles.detailsContainer}>
                        <AppText variant="heading2" style={{ marginBottom: SPACING.xs }}>Why this helps</AppText>
                        <AppText style={{ color: COLORS.textMuted, lineHeight: 22 }}>
                            {selectedActivity.description}
                        </AppText>
                    </View>
                )}

            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title={selectedActivity ? `Start ${selectedActivity.title}` : "Select a Routine"}
                    onPress={() => selectedActivity && setIsStarted(true)}
                    style={{ width: '100%', opacity: selectedActivity ? 1 : 0.5 }}
                    disabled={!selectedActivity}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACING.lg, paddingTop: 60, paddingBottom: 100 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.xl,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center',
        ...COLORS.shadowSoft,
    },
    title: { color: COLORS.textMain, marginBottom: SPACING.sm },
    subtitle: { color: COLORS.textMuted, fontSize: 16, lineHeight: 24, marginBottom: SPACING.xl },
    listContainer: {
        gap: SPACING.md,
        marginBottom: SPACING.xl,
    },
    activityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        borderWidth: 2,
        borderColor: 'transparent',
        ...COLORS.shadowSoft,
    },
    activityCardSelected: {
        borderColor: COLORS.primary,
        backgroundColor: '#F5F7FF',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontWeight: '700',
        fontSize: 16,
        color: COLORS.textMain,
    },
    cardDuration: {
        color: COLORS.textMuted,
        marginTop: 4,
    },
    detailsContainer: {
        backgroundColor: '#FFF',
        padding: SPACING.lg,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.surfaceBorder,
    },
    activeContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xl,
    },
    videoPlaceholder: {
        width: '100%',
        height: 250,
        backgroundColor: '#E0E0E0',
        borderRadius: RADIUS.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xl,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: SPACING.xl,
        paddingBottom: 40,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderTopWidth: 1,
        borderTopColor: '#E8E8E8',
    }
});
