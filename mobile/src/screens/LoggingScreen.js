import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Dimensions, Animated } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import * as Haptics from 'expo-haptics';

const { height } = Dimensions.get('window');

const categories = [
    { id: '1', name: 'Mood', icon: '🧠' },
    { id: '2', name: 'Physical', icon: '🔥' },
    { id: '3', name: 'Sleep', icon: '😴' },
    { id: '4', name: 'Digestion', icon: '🥗' },
];

const symptomsMap = {
    '1': ['Irritated', 'Anxious', 'Sad', 'Brain Fog', 'Mood Swings'],
    '2': ['Hot Flashes', 'Night Sweats', 'Headache', 'Joint Pain'],
    '3': ['Insomnia', 'Waking Up', 'Vivid Dreams'],
    '4': ['Bloating', 'Nausea', 'Cramps'],
};

const emojis = ['😃', '🙂', '😐', '🙁', '😫'];

export const LoggingScreen = ({ navigation }) => {
    // 0: Category, 1: Symptom, 2: Intensity
    const [step, setStep] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSymptom, setSelectedSymptom] = useState(null);
    const [intensity, setIntensity] = useState(2); // 0-4

    // Toast state
    const [showToast, setShowToast] = useState(false);
    const toastTranslateY = React.useRef(new Animated.Value(-100)).current;

    const handleSelectCategory = (categoryId) => {
        setSelectedCategory(categoryId);
        setStep(1);
    };

    const handleSelectSymptom = (symptom) => {
        setSelectedSymptom(symptom);
        setStep(2);
    };

    const triggerToast = () => {
        setShowToast(true);
        Animated.sequence([
            Animated.timing(toastTranslateY, {
                toValue: 20,
                duration: 300,
                easing: Animated.Easing.out(Animated.Easing.back(1.5)),
                useNativeDriver: true,
            }),
            Animated.delay(3000),
            Animated.timing(toastTranslateY, {
                toValue: -100,
                duration: 300,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            })
        ]).start(() => {
            setShowToast(false);
            navigation.goBack();
        });
    }

    const handleSave = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => { });
        // Simulate Firebase Save
        triggerToast();
    };

    return (
        <View style={styles.container}>
            {/* Custom Toast Notification */}
            {showToast && (
                <Animated.View style={[styles.toastContainer, { transform: [{ translateY: toastTranslateY }] }]}>
                    <Text style={styles.toastEmoji}>💡</Text>
                    <View style={styles.toastTextContainer}>
                        <AppText variant="caption" style={styles.toastTitle}>Daily Tip</AppText>
                        <AppText variant="body" style={styles.toastMessage}>
                            Logging '{selectedSymptom}' often correlates with low sleep. Check your evening ritual.
                        </AppText>
                    </View>
                </Animated.View>
            )}

            <ScrollView contentContainerStyle={styles.content}>

                {/* Header with back button logic */}
                <View style={styles.headerRow}>
                    {step > 0 ? (
                        <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.backButton}>
                            <AppText style={styles.backButtonText}>← Back</AppText>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <AppText style={styles.backButtonText}>✕ Close</AppText>
                        </TouchableOpacity>
                    )}
                    <AppText variant="heading2" style={styles.header}>Log Symptom</AppText>
                    <View style={{ width: 60 }} /> {/* Spacer */}
                </View>

                {/* Step 1: Category */}
                {step === 0 && (
                    <View style={styles.stepContainer}>
                        <AppText variant="caption" style={styles.sectionTitle}>TAP 1: SELECT CATEGORY</AppText>
                        <View style={styles.list}>
                            {categories.map(cat => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={styles.listItem}
                                    onPress={() => handleSelectCategory(cat.id)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.listIcon}>{cat.icon}</Text>
                                    <AppText variant="body" style={styles.listText}>{cat.name}</AppText>
                                    <AppText style={styles.chevron}>›</AppText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Step 2: Symptom */}
                {step === 1 && selectedCategory && (
                    <View style={styles.stepContainer}>
                        <AppText variant="caption" style={styles.sectionTitle}>TAP 2: WHAT EXACTLY?</AppText>
                        <View style={styles.list}>
                            {symptomsMap[selectedCategory].map(sym => (
                                <TouchableOpacity
                                    key={sym}
                                    style={styles.listItem}
                                    onPress={() => handleSelectSymptom(sym)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.radioOutline} />
                                    <AppText variant="body" style={styles.listText}>{sym}</AppText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Step 3: Intensity */}
                {step === 2 && selectedSymptom && (
                    <View style={styles.stepContainer}>
                        <AppText variant="caption" style={styles.sectionTitle}>TAP 3: HOW INTENSE IS YOUR {selectedSymptom.toUpperCase()}?</AppText>

                        <View style={styles.intensityContainer}>
                            <Text style={styles.mainEmoji}>{emojis[intensity]}</Text>

                            <View style={styles.emojiRow}>
                                {emojis.map((emoji, idx) => (
                                    <TouchableOpacity
                                        key={idx}
                                        style={[styles.emojiButton, intensity === idx && styles.emojiButtonActive]}
                                        onPress={() => setIntensity(idx)}
                                    >
                                        <Text style={styles.smallEmoji}>{emoji}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.intensityLabels}>
                                <AppText variant="caption">Mild</AppText>
                                <AppText variant="caption">Severe</AppText>
                            </View>
                        </View>

                        <Button
                            title="Save"
                            onPress={handleSave}
                            style={styles.saveAction}
                        />
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    toastContainer: {
        position: 'absolute',
        top: 0,
        left: SPACING.lg,
        right: SPACING.lg,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        shadowColor: 'rgba(255, 88, 100, 0.15)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 10,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
        zIndex: 100,
    },
    toastEmoji: {
        fontSize: 24,
        marginRight: SPACING.md,
    },
    toastTextContainer: {
        flex: 1,
    },
    toastTitle: {
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 2,
    },
    toastMessage: {
        fontSize: 14,
        lineHeight: 20,
        color: '#4A4A4A',
    },
    content: {
        padding: SPACING.lg,
        paddingTop: 40,
        paddingBottom: 60,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.xl,
    },
    backButton: {
        padding: SPACING.xs,
    },
    backButtonText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 16,
    },
    header: {
        color: '#2D2D2D',
    },
    stepContainer: {
        marginTop: SPACING.sm,
    },
    sectionTitle: {
        color: '#8A8A9D',
        fontWeight: '700',
        marginBottom: SPACING.lg,
        letterSpacing: 1,
    },
    list: {
        backgroundColor: '#FFFFFF',
        borderRadius: RADIUS.md,
        borderWidth: 1.5,
        borderColor: '#E8E8E8',
        overflow: 'hidden',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.lg,
        paddingHorizontal: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    listIcon: {
        fontSize: 24,
        marginRight: SPACING.md,
    },
    listText: {
        flex: 1,
        fontSize: 18,
        color: '#2D2D2D',
        fontWeight: '500',
    },
    chevron: {
        fontSize: 24,
        color: '#C0C0C0',
    },
    radioOutline: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#C0C0C0',
        marginRight: SPACING.md,
    },
    intensityContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: RADIUS.md,
        padding: SPACING.xl,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E8E8E8',
        shadowColor: 'rgba(255, 88, 100, 0.05)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 2,
    },
    mainEmoji: {
        fontSize: 100,
        marginBottom: SPACING.xl,
    },
    emojiRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: '#F5F5F5',
        borderRadius: 30,
        padding: 4,
        marginBottom: SPACING.sm,
    },
    emojiButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emojiButtonActive: {
        backgroundColor: '#FFFFFF',
        shadowColor: 'rgba(255, 88, 100, 0.15)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
    },
    smallEmoji: {
        fontSize: 28,
    },
    intensityLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: SPACING.sm,
    },
    saveAction: {
        marginTop: SPACING.xl * 2,
        backgroundColor: COLORS.primary,
        paddingVertical: 18,
        borderRadius: 30,
    }
});
