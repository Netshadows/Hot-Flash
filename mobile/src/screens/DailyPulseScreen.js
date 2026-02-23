import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Animated, Keyboard } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

const AnimatedPill = ({ item, isSelected, onPress }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // Animate bounce when selection toggles
    useEffect(() => {
        if (isSelected) {
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 1.15, duration: 80, useNativeDriver: true }),
                Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 150, useNativeDriver: true })
            ]).start();
        } else {
            Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }).start();
        }
    }, [isSelected]);

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.8}
                style={[styles.pill, isSelected && styles.pillSelected]}
            >
                <AppText style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                    {item.label}
                </AppText>
            </TouchableOpacity>
        </Animated.View>
    );
};

export const DailyPulseScreen = ({ navigation }) => {
    const categories = [
        {
            title: "Positives",
            items: [
                { id: 'mental_clarity', label: 'Mental Clarity' },
                { id: 'high_energy', label: 'High Energy' },
                { id: 'deep_rest', label: 'Deep Rest' },
                { id: 'feeling_balanced', label: 'Feeling Balanced' },
                { id: 'motivated', label: 'Motivated' },
                { id: 'calm', label: 'Calm & Grounded' }
            ]
        },
        {
            title: "Symptoms",
            items: [
                { id: 'hot_flash', label: 'Hot Flashes' },
                { id: 'night_sweats', label: 'Night Sweats' },
                { id: 'brain_fog', label: 'Brain Fog' },
                { id: 'joint_pain', label: 'Joint Pain' },
                { id: 'mood_swings', label: 'Mood Swings' },
                { id: 'headaches', label: 'Headaches' },
                { id: 'low_libido', label: 'Low Libido' }
            ]
        },
        {
            title: "Lifestyle Elements",
            items: [
                { id: 'caffeine', label: 'Caffeine Intake' },
                { id: 'alcohol', label: 'Alcohol Intake' },
                { id: 'hydration', label: 'Good Hydration' },
                { id: 'exercise', label: 'Exercise/Movement' },
                { id: 'high_stress', label: 'High Stress' },
                { id: 'supplements', label: 'Took Supplements' }
            ]
        }
    ];

    const [selectedItems, setSelectedItems] = useState([]);
    const [notes, setNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const saveScale = useRef(new Animated.Value(0)).current;
    const saveOpacity = useRef(new Animated.Value(0)).current;

    const toggleItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(i => i !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const handleSave = () => {
        Keyboard.dismiss();
        setIsSaving(true);

        // Dopamine "Level Up" Animation Sequence
        Animated.parallel([
            Animated.timing(saveOpacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }),
            Animated.spring(saveScale, {
                toValue: 1,
                friction: 5,
                tension: 60,
                delay: 100,
                useNativeDriver: true
            })
        ]).start();

        // Navigate back after delay
        setTimeout(() => {
            navigation.goBack();
        }, 1800);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <AppText variant="heading1" style={styles.header}>Daily Pulse</AppText>
                <AppText variant="body" style={styles.subHeader}>Log your overarching holistic metrics and triggers for today to gather more intel on your trajectory.</AppText>

                {categories.map((category) => (
                    <View key={category.title} style={styles.section}>
                        <AppText variant="heading2" style={styles.sectionTitle}>{category.title}</AppText>
                        <View style={styles.grid}>
                            {category.items.map((item) => {
                                const isSelected = selectedItems.includes(item.id);
                                return (
                                    <AnimatedPill
                                        key={item.id}
                                        item={item}
                                        isSelected={isSelected}
                                        onPress={() => toggleItem(item.id)}
                                    />
                                );
                            })}
                        </View>
                    </View>
                ))}

                <View style={styles.section}>
                    <AppText variant="heading2" style={styles.sectionTitle}>Any additional context?</AppText>
                    <TextInput
                        style={styles.textInput}
                        multiline
                        numberOfLines={4}
                        placeholder="Log any unstructured thoughts, triggers, or severity notes here for the AI to analyze..."
                        placeholderTextColor={COLORS.textMuted}
                        value={notes}
                        onChangeText={setNotes}
                        textAlignVertical="top"
                    />
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <Button title="Save Log" onPress={handleSave} disabled={isSaving} />
            </View>

            {/* Dopamine Celebration Overlay */}
            {isSaving && (
                <Animated.View style={[StyleSheet.absoluteFill, styles.rewardOverlay, { opacity: saveOpacity }]}>
                    <Animated.View style={{ transform: [{ scale: saveScale }], alignItems: 'center' }}>
                        <AppText style={{ fontSize: 80, marginBottom: 20 }}>🎉</AppText>
                        <AppText variant="heading1" style={{ color: COLORS.primary, textAlign: 'center' }}>Pulse Logged!</AppText>

                        <View style={styles.gemBadge}>
                            <AppText style={{ fontSize: 24, marginRight: 8 }}>💎</AppText>
                            <AppText variant="heading2" style={{ color: '#FFB300' }}>+10 Gems</AppText>
                        </View>

                        <AppText variant="body" style={{ color: '#4A4A4A', marginTop: 24, textAlign: 'center' }}>
                            You're building an incredible daily ritual.
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
    header: { fontSize: 28, color: COLORS.textMain, marginBottom: SPACING.xs },
    subHeader: { fontSize: 16, color: COLORS.textMuted, marginBottom: SPACING.xl },
    section: { marginBottom: SPACING.xl },
    sectionTitle: { fontSize: 20, color: COLORS.textMain, marginBottom: SPACING.md },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    pill: {
        paddingHorizontal: SPACING.md,
        paddingVertical: 10,
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#E8E8E8',
    },
    pillSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    pillText: { fontSize: 15, color: COLORS.textMain, fontWeight: '500' },
    pillTextSelected: { color: COLORS.surface, fontWeight: '700' },
    textInput: {
        backgroundColor: COLORS.surface,
        borderWidth: 1.5,
        borderColor: '#E8E8E8',
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        fontSize: 16,
        color: COLORS.textMain,
        minHeight: 120,
    },
    footer: { padding: SPACING.xl, paddingBottom: 40, borderTopWidth: 1, borderTopColor: '#E8E8E8', backgroundColor: COLORS.background },
    rewardOverlay: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        padding: SPACING.xl,
    },
    gemBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF8E1',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#FFE082',
        marginTop: SPACING.lg,
    }
});
