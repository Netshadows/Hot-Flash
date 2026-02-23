import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

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

    const toggleItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(i => i !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const handleSave = () => {
        console.log("Saving Daily Pulse Data:", { items: selectedItems, notes });
        navigation.goBack();
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
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => toggleItem(item.id)}
                                        style={[styles.pill, isSelected && styles.pillSelected]}
                                    >
                                        <AppText style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                                            {item.label}
                                        </AppText>
                                    </TouchableOpacity>
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
                <Button title="Save Log" onPress={handleSave} />
            </View>
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
    footer: { padding: SPACING.xl, paddingBottom: 40, borderTopWidth: 1, borderTopColor: '#E8E8E8', backgroundColor: COLORS.background }
});
