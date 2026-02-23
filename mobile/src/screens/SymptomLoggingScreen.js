import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SymptomDefinitions, SymptomCategory } from '../models/SymptomData';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

const SeveritySelector = ({ value, min, max, onChange, label }) => {
    // Generate an array of possible values [0, 1, 2, 3] etc.
    const levels = Array.from({ length: max - min + 1 }, (_, i) => min + i);

    // Simple descriptive labels for a 0-3 scale (assuming 4 levels is common)
    const getLabel = (val) => {
        if (max === 3) {
            return ['None', 'Mild', 'Mod', 'Sev'][val];
        }
        return val.toString();
    };

    return (
        <View style={styles.selectorContainer}>
            <Text style={styles.selectorLabel}>{label}</Text>
            <View style={styles.pillRow}>
                {levels.map(level => {
                    const isSelected = value === level;
                    return (
                        <TouchableOpacity
                            key={level}
                            style={[styles.pill, isSelected && styles.pillSelected]}
                            onPress={() => onChange(level)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                                {getLabel(level)}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

export const SymptomLoggingScreen = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [symptomScores, setSymptomScores] = useState({});

    const handleScoreChange = (symptomId, newScore) => {
        setSymptomScores(prev => ({
            ...prev,
            [symptomId]: newScore
        }));
    };

    const handleSave = () => {
        console.log("Saving Symptom Logs:", symptomScores);
        // In a real app, this would save to local storage or Firebase
        navigation.goBack();
    };

    const renderSymptomInput = (symptom) => {
        const currentScore = symptomScores[symptom.id] || 0;

        return (
            <Card key={symptom.id} style={styles.symptomCard}>
                <Typography variant="h3">{symptom.name}</Typography>
                <Typography variant="body2" color="secondary">
                    Scale: {symptom.scale.name} ({symptom.scale.min}-{symptom.scale.max})
                </Typography>
                <Typography variant="caption" style={styles.description}>
                    {symptom.description}
                </Typography>

                <SeveritySelector
                    value={currentScore}
                    min={symptom.scale.min}
                    max={symptom.scale.max}
                    onChange={(val) => handleScoreChange(symptom.id, val)}
                    label="Severity"
                />
            </Card>
        );
    };

    const categories = Object.values(SymptomCategory);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Typography variant="h1" style={styles.title}>Log Symptoms</Typography>

            {!selectedCategory ? (
                <View style={styles.categorySelection}>
                    <Typography variant="h2" style={styles.subtitle}>Select Category</Typography>
                    {categories.map(category => (
                        <Button
                            key={category}
                            title={category}
                            onPress={() => setSelectedCategory(category)}
                            style={styles.categoryButton}
                            variant="secondary"
                        />
                    ))}
                </View>
            ) : (
                <View style={styles.loggingForm}>
                    <Button title="← Back to Categories" onPress={() => setSelectedCategory(null)} variant="ghost" style={styles.backButton} />
                    <Typography variant="h2" style={styles.subtitle}>{selectedCategory}</Typography>

                    {SymptomDefinitions
                        .filter(s => s.category === selectedCategory)
                        .map(renderSymptomInput)}

                    <Button title="Save Logs" onPress={handleSave} style={styles.saveButton} />
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF9FA', // Light pinkish background
    },
    content: {
        padding: 24,
        paddingBottom: 48,
        paddingTop: 60,
    },
    title: {
        marginBottom: 32,
        color: '#2D2D2D',
    },
    subtitle: {
        marginBottom: 24,
        color: '#2D2D2D',
    },
    categoryButton: {
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
        borderColor: 'rgba(255, 88, 100, 0.1)',
        borderWidth: 1.5,
        shadowColor: 'rgba(255, 88, 100, 0.15)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 4,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: 16,
        marginLeft: -16,
    },
    symptomCard: {
        marginBottom: 24,
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#E8E8E8',
        shadowColor: 'rgba(255, 88, 100, 0.15)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 4,
    },
    description: {
        marginTop: 8,
        marginBottom: 16,
        fontStyle: 'normal', // Removed italic for cleaner look
        color: '#757575',
    },
    selectorContainer: {
        marginTop: 12,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    selectorLabel: {
        color: '#757575',
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 12,
    },
    pillRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    pill: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    pillSelected: {
        backgroundColor: '#FF5864', // Primary pink
        borderColor: '#FF5864',
    },
    pillText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#757575',
    },
    pillTextSelected: {
        color: '#FFFFFF',
    },
    saveButton: {
        marginTop: 32,
        backgroundColor: '#FF5864',
    }
});
