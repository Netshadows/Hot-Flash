import React, { useState } from 'react';
import { View, StyleSheet, TextInput, KeyboardAvoidingView, ScrollView, Platform, TouchableOpacity, Image } from 'react-native';
import { AppText } from '../components/Typography';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { saveJournalEntry } from '../services/firebase';
import { useUser } from '../context/UserContext';

const SIGNIFIERS = [
    { id: 'thought', icon: 'chatbubble-ellipses-outline', color: COLORS.insightBlue, accent: COLORS.accentBlue, label: 'Thought' },
    { id: 'task', icon: 'checkbox-outline', color: COLORS.insightPurple, accent: COLORS.accentPurple, label: 'Action' },
    { id: 'memory', icon: 'heart-outline', color: COLORS.primary, accent: COLORS.primaryGlare, label: 'Memory' },
    { id: 'symptom', icon: 'medical-outline', color: COLORS.insightYellow, accent: COLORS.accentYellow, label: 'Symptom' },
];

const DAILY_PROMPTS = [
    "What gave you energy today?",
    "What is something you learned about your body today?",
    "Describe a moment of friction and how you handled it.",
    "What are you grateful for right now?"
];

export const DailyJournalScreen = ({ navigation }) => {
    const { user } = useUser();
    const [entryText, setEntryText] = useState('');
    const [selectedSignifier, setSelectedSignifier] = useState(SIGNIFIERS[0]);
    const [photoUri, setPhotoUri] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Pick a random prompt for the day
    const [dailyPrompt] = useState(DAILY_PROMPTS[Math.floor(Math.random() * DAILY_PROMPTS.length)]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setPhotoUri(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!entryText.trim() && !photoUri) return;

        setIsSaving(true);
        const entryData = {
            text: entryText,
            signifier: selectedSignifier.id,
            photoUri,
            prompt: dailyPrompt,
            createdAt: new Date().toISOString()
        };

        await saveJournalEntry(user?.uid || 'anonymous', entryData);
        setIsSaving(false);
        navigation.goBack();
        // Alternatively, navigate directly to JournalHistory
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="close" size={28} color={COLORS.textMain} />
                </TouchableOpacity>
                <AppText variant="heading2">Daily Journal</AppText>
                <TouchableOpacity onPress={() => navigation.navigate('JournalHistory')} style={styles.historyButton}>
                    <Ionicons name="journal-outline" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Prompt Section */}
                <View style={styles.promptCard}>
                    <AppText variant="caption" style={styles.promptLabel}>Today's Prompt</AppText>
                    <AppText variant="body" style={styles.promptText}>{dailyPrompt}</AppText>
                </View>

                {/* Signifiers */}
                <AppText variant="caption" style={styles.sectionTitle}>Tag your entry:</AppText>
                <View style={styles.signifierRow}>
                    {SIGNIFIERS.map(sig => (
                        <TouchableOpacity
                            key={sig.id}
                            style={[
                                styles.signifierChip,
                                selectedSignifier.id === sig.id
                                    ? { backgroundColor: sig.color, borderColor: sig.color }
                                    : { backgroundColor: sig.accent, borderColor: sig.accent }
                            ]}
                            onPress={() => setSelectedSignifier(sig)}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name={sig.icon}
                                size={18}
                                color={selectedSignifier.id === sig.id ? '#FFF' : sig.color}
                            />
                            <AppText
                                style={[
                                    styles.signifierLabel,
                                    selectedSignifier.id === sig.id ? { color: '#FFF' } : { color: sig.color }
                                ]}
                            >
                                {sig.label}
                            </AppText>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Photo Attachment (Rich Media) */}
                {photoUri ? (
                    <View style={styles.photoContainer}>
                        <Image source={{ uri: photoUri }} style={styles.photo} />
                        <TouchableOpacity style={styles.removePhoto} onPress={() => setPhotoUri(null)}>
                            <Ionicons name="close-circle" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
                        <Ionicons name="camera-outline" size={24} color={COLORS.textMuted} />
                        <AppText style={styles.addPhotoText}>Add a Photo</AppText>
                    </TouchableOpacity>
                )}

                {/* Main Input - Low barrier Line a Day style */}
                <View style={[styles.inputContainer, { borderColor: selectedSignifier.color, backgroundColor: selectedSignifier.accent }]}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Write a line, a thought, or a whole page..."
                        placeholderTextColor={selectedSignifier.color}
                        multiline
                        textAlignVertical="top"
                        value={entryText}
                        onChangeText={setEntryText}
                        autoFocus={true}
                        selectionColor={selectedSignifier.color}
                    />
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.saveButton, (!entryText.trim() && !photoUri) && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={isSaving || (!entryText.trim() && !photoUri)}
                >
                    <AppText variant="heading2" style={{ color: '#FFF' }}>
                        {isSaving ? 'Saving...' : 'Save Entry'}
                    </AppText>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingTop: 60,
        paddingBottom: SPACING.md,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        padding: SPACING.xs,
    },
    historyButton: {
        padding: SPACING.xs,
    },
    content: {
        padding: SPACING.lg,
    },
    promptCard: {
        backgroundColor: '#FFF5EE',
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.xl,
        borderLeftWidth: 4,
        borderLeftColor: '#FFDAB9',
    },
    promptLabel: {
        color: '#FF7F50',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    promptText: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#4A4A4A',
    },
    sectionTitle: {
        marginBottom: SPACING.sm,
        color: COLORS.textMuted,
    },
    signifierRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
        marginBottom: SPACING.xl,
    },
    signifierChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: RADIUS.full,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        backgroundColor: COLORS.surface,
    },
    signifierLabel: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.textMuted,
    },
    addPhotoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.md,
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderStyle: 'dashed',
        marginBottom: SPACING.md,
    },
    addPhotoText: {
        marginLeft: SPACING.sm,
        color: COLORS.textMuted,
        fontWeight: '500',
    },
    photoContainer: {
        marginBottom: SPACING.lg,
        borderRadius: RADIUS.md,
        overflow: 'hidden',
        position: 'relative',
    },
    photo: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    removePhoto: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 12,
    },
    inputContainer: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        minHeight: 200,
        padding: SPACING.md,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 2,
    },
    textInput: {
        flex: 1,
        fontSize: 18,
        color: COLORS.textMain,
        lineHeight: 26,
    },
    footer: {
        padding: SPACING.lg,
        paddingBottom: 40,
        backgroundColor: COLORS.surface,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: RADIUS.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonDisabled: {
        backgroundColor: '#FFB6C1',
        opacity: 0.7,
    }
});
