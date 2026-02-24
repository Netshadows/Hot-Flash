import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { AppText } from '../components/Typography';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';

const NUTRITION_GOALS = [
    {
        id: 'phyto',
        title: 'Add Phytoestrogens',
        icon: 'leaf-outline',
        color: '#E8F5E9',
        iconColor: '#4CAF50',
        examples: 'Flaxseeds, Edamame, Tofu, Sesame Seeds'
    },
    {
        id: 'calcium',
        title: 'Boost Calcium',
        icon: 'water-outline',
        color: '#E3F2FD',
        iconColor: '#2196F3',
        examples: 'Yogurt, Cheese, Almonds, Leafy Greens'
    },
    {
        id: 'omega',
        title: 'Omega-3 Fatty Acids',
        icon: 'fish-outline',
        color: '#FFF3E0',
        iconColor: '#FF9800',
        examples: 'Salmon, Chia Seeds, Walnuts, Sardines'
    },
    {
        id: 'fiber',
        title: 'Increase Fiber',
        icon: 'nutrition-outline',
        color: '#F3E5F5',
        iconColor: '#9C27B0',
        examples: 'Oats, Beans, Lentils, Berries'
    }
];

export const NutritionActivityScreen = ({ navigation }) => {
    const [selectedGoals, setSelectedGoals] = useState([]);

    const toggleGoal = (id) => {
        if (selectedGoals.includes(id)) {
            setSelectedGoals(selectedGoals.filter(goalId => goalId !== id));
        } else {
            setSelectedGoals([...selectedGoals, id]);
        }
    };

    const renderGoalCard = (goal) => {
        const isSelected = selectedGoals.includes(goal.id);
        return (
            <TouchableOpacity
                key={goal.id}
                style={[styles.goalCard, isSelected && styles.goalCardSelected]}
                onPress={() => toggleGoal(goal.id)}
                activeOpacity={0.8}
            >
                <View style={[styles.iconContainer, { backgroundColor: goal.color }]}>
                    <Ionicons name={goal.icon} size={28} color={goal.iconColor} />
                </View>
                <View style={styles.cardContent}>
                    <AppText style={styles.cardTitle}>{goal.title}</AppText>
                    <AppText style={styles.cardExamples}>{goal.examples}</AppText>
                </View>
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected && <Ionicons name="checkmark" size={16} color="#FFF" />}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#FFF5F6', COLORS.background]} style={StyleSheet.absoluteFillObject} />
            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="close" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                    <AppText variant="heading2" style={{ color: COLORS.textMain }}>Nutrition log</AppText>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.illustrationContainer}>
                    <View style={styles.illustrationCircle}>
                        <Ionicons name="restaurant-outline" size={60} color="#FF7F50" />
                    </View>
                </View>

                <AppText variant="heading1" style={styles.title}>What did you focus on today?</AppText>
                <AppText style={styles.subtitle}>
                    Log your healthy eating choices. Nutrition plays a vital role in balancing hormones and managing symptoms.
                </AppText>

                <View style={styles.listContainer}>
                    {NUTRITION_GOALS.map(renderGoalCard)}
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title={selectedGoals.length > 0 ? `Log ${selectedGoals.length} Choices` : "Skip for now"}
                    onPress={() => navigation.goBack()}
                    style={{ width: '100%', backgroundColor: selectedGoals.length > 0 ? COLORS.primary : '#E0E0E0' }}
                    textStyle={{ color: selectedGoals.length > 0 ? '#FFF' : COLORS.textMuted }}
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
    illustrationContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    illustrationCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FFE4E8',
        alignItems: 'center',
        justifyContent: 'center',
        ...COLORS.shadowSoft,
    },
    title: { color: COLORS.textMain, marginBottom: SPACING.sm, textAlign: 'center' },
    subtitle: { color: COLORS.textMuted, fontSize: 16, lineHeight: 24, marginBottom: SPACING.xl, textAlign: 'center', paddingHorizontal: SPACING.md },
    listContainer: {
        gap: SPACING.md,
    },
    goalCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        borderWidth: 2,
        borderColor: 'transparent',
        ...COLORS.shadowSoft,
    },
    goalCardSelected: {
        borderColor: '#FF7F50',
        backgroundColor: '#FFF5F6',
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
        paddingRight: SPACING.sm,
    },
    cardTitle: {
        fontWeight: '700',
        fontSize: 16,
        color: COLORS.textMain,
    },
    cardExamples: {
        color: COLORS.textMuted,
        marginTop: 4,
        fontSize: 13,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxSelected: {
        backgroundColor: '#FF7F50',
        borderColor: '#FF7F50',
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
