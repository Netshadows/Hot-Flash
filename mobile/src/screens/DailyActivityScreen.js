import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { saveDailyActivity } from '../services/firebase';
import { useScore } from '../context/ScoreContext';

export const DailyActivityScreen = ({ route, navigation }) => {
    // Requires a route param: { activity: { title, color, icon, description, completed } }
    const { activity } = route.params;
    const [isComplete, setIsComplete] = useState(activity.completed);

    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;

    const { triggerDopamine } = useScore();

    const handleComplete = () => {
        setIsComplete(true);
        activity.completed = true; // Mutating mock data for demo visual sync

        // Record to database
        saveDailyActivity(activity.id);

        // Dopamine sequence hook
        triggerDopamine(25, "Activity Completed!");

        // Local visual pop
        Animated.parallel([
            Animated.timing(scaleAnim, { toValue: 1.1, duration: 200, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 0, duration: 400, useNativeDriver: true })
        ]).start(() => { });

        setTimeout(() => { navigation.goBack(); }, 1800);
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(255, 255, 255, 0.9)', `${activity.color}30`]}
                style={StyleSheet.absoluteFillObject}
            />

            <ScrollView contentContainerStyle={styles.content}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <AppText style={{ fontSize: 24, fontWeight: '800' }}>✕</AppText>
                </TouchableOpacity>

                <View style={[styles.iconContainer, { backgroundColor: activity.color }]}>
                    <Ionicons name={activity.icon} size={50} color="#FFF" />
                </View>

                <AppText variant="heading1" style={styles.title}>{activity.title}</AppText>
                <AppText variant="body" style={styles.description}>{activity.description}</AppText>

                <View style={styles.interactiveArea}>
                    <AppText variant="heading3" style={{ textAlign: 'center', marginBottom: SPACING.md, color: COLORS.primary }}>
                        Your Active Plan
                    </AppText>
                    <View style={styles.contentBox}>
                        <AppText style={{ textAlign: 'center', color: '#666' }}>
                            {activity.title === 'Nutrition' ? "Loading Recipes & Macros..." :
                                activity.title === 'Mindfulness' ? "Loading 2-Minute Breathing Exercise..." :
                                    "Loading Stretching Guide..."}
                        </AppText>
                    </View>
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title={isComplete ? "Complete Again ✔" : "Mark as Complete"}
                    variant={isComplete ? "secondary" : "primary"}
                    onPress={handleComplete}
                />
            </View>

            {/* Dopamine Celebration Overlay */}
            {isComplete && !activity.completed && (
                <Animated.View style={[StyleSheet.absoluteFill, styles.rewardOverlay, { opacity: saveOpacity }]}>
                    <Animated.View style={{ transform: [{ scale: saveScale }], alignItems: 'center' }}>
                        <AppText style={{ fontSize: 80, marginBottom: 20 }}>🔥</AppText>
                        <AppText variant="heading1" style={{ color: COLORS.primary, textAlign: 'center' }}>Daily Plan Crushed!</AppText>

                        <View style={styles.gemBadge}>
                            <AppText style={{ fontSize: 24, marginRight: 8 }}>💎</AppText>
                            <AppText variant="heading2" style={{ color: '#FFB300' }}>+20 Gems</AppText>
                        </View>

                        <AppText variant="body" style={{ color: '#4A4A4A', marginTop: 24, textAlign: 'center' }}>
                            Your Ritual Ring is growing.
                        </AppText>
                    </Animated.View>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACING.xl, paddingTop: 60, paddingBottom: 100 },
    backButton: { marginBottom: SPACING.xl },
    iconContainer: {
        width: 100, height: 100, borderRadius: 50,
        alignItems: 'center', justifyContent: 'center',
        alignSelf: 'center', marginBottom: SPACING.xl,
        shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4
    },
    icon: { fontSize: 50 },
    title: { textAlign: 'center', marginBottom: SPACING.md },
    description: { textAlign: 'center', color: '#666', fontSize: 18, lineHeight: 26, marginBottom: SPACING.xl * 2 },
    interactiveArea: { marginTop: SPACING.xl },
    contentBox: {
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderWidth: 1, borderColor: '#E8E8E8',
        borderRadius: RADIUS.lg, padding: SPACING.xl,
        height: 200, justifyContent: 'center'
    },
    footer: { padding: SPACING.xl, paddingBottom: 40, borderTopWidth: 1, borderTopColor: '#E8E8E8', backgroundColor: COLORS.background },
    rewardOverlay: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)', justifyContent: 'center', alignItems: 'center', zIndex: 999, padding: SPACING.xl,
    },
    gemBadge: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF8E1', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30, borderWidth: 2, borderColor: '#FFE082', marginTop: SPACING.lg,
    }
});
