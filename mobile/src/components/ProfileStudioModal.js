import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Image, ScrollView, Alert } from 'react-native';
import { AppText } from './Typography';
import { Button } from './Button';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

const AI_EFFECTS = [
    { id: 'none', label: 'Original', color: '#FFF' },
    { id: 'ethereal', label: 'Ethereal', color: '#FCE4EC', overlay: 'rgba(255, 255, 255, 0.2)' },
    { id: 'radiance', label: 'Radiance', color: '#FFF9C4', overlay: 'rgba(255, 215, 0, 0.1)' },
    { id: 'bloom', label: 'Soft Bloom', color: '#F8BBD0', overlay: 'rgba(240, 98, 146, 0.1)' },
    { id: 'crystal', label: 'Crystal', color: '#E1F5FE', overlay: 'rgba(3, 169, 244, 0.05)' },
];

export const ProfileStudioModal = ({ visible, onClose }) => {
    const { profileImage, updateProfileImage } = useUser();
    const [selectedEffect, setSelectedEffect] = useState('none');
    const [tempImage, setTempImage] = useState(profileImage);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setTempImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Camera access is required to take a photo.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setTempImage(result.assets[0].uri);
        }
    };

    const handleSave = () => {
        updateProfileImage(tempImage);
        onClose();
    };

    const currentEffect = AI_EFFECTS.find(e => e.id === selectedEffect);

    return (
        <Modal visible={visible} transparent animationType="slide">
            <BlurView intensity={30} style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <AppText variant="heading2" style={{ color: COLORS.primary }}>Profile Studio</AppText>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.previewContainer}>
                        <Image source={{ uri: tempImage }} style={styles.previewImage} />
                        {selectedEffect !== 'none' && (
                            <View
                                style={[
                                    styles.effectOverlay,
                                    { backgroundColor: currentEffect.overlay }
                                ]}
                            />
                        )}
                        <TouchableOpacity style={styles.cameraTrigger} onPress={takePhoto}>
                            <Ionicons name="camera" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.actionRow}>
                        <Button
                            title="Choose from Library"
                            type="secondary"
                            style={styles.actionButton}
                            onPress={pickImage}
                            leftIcon={<Ionicons name="images-outline" size={20} color={COLORS.primary} />}
                        />
                    </View>

                    <AppText variant="caption" style={styles.sectionTitle}>AI AVATAR EFFECTS</AppText>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.effectsTray}
                    >
                        {AI_EFFECTS.map(effect => (
                            <TouchableOpacity
                                key={effect.id}
                                style={[
                                    styles.effectItem,
                                    selectedEffect === effect.id && styles.activeEffect
                                ]}
                                onPress={() => setSelectedEffect(effect.id)}
                            >
                                <View style={[styles.effectThumb, { backgroundColor: effect.color }]} />
                                <AppText style={[
                                    styles.effectLabel,
                                    selectedEffect === effect.id && { color: COLORS.primary, fontWeight: '700' }
                                ]}>{effect.label}</AppText>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <Button
                        title="Update Profile"
                        onPress={handleSave}
                        style={styles.saveButton}
                    />
                </View>
            </BlurView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-end' },
    content: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: RADIUS.xl,
        borderTopRightRadius: RADIUS.xl,
        padding: SPACING.xl,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    closeButton: {
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center'
    },
    previewContainer: {
        alignSelf: 'center',
        width: 180,
        height: 180,
        borderRadius: 90,
        overflow: 'hidden',
        ...COLORS.shadowSoft,
        marginBottom: SPACING.xl,
    },
    previewImage: { width: '100%', height: '100%' },
    effectOverlay: { ...StyleSheet.absoluteFillObject },
    cameraTrigger: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: COLORS.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#FFF'
    },
    sectionTitle: { color: '#999', marginBottom: SPACING.md, letterSpacing: 1 },
    actionRow: { marginBottom: SPACING.xl },
    actionButton: { width: '100%' },
    effectsTray: { gap: SPACING.md, paddingBottom: SPACING.md },
    effectItem: {
        alignItems: 'center',
        gap: 8,
        padding: 4,
    },
    effectThumb: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#EEE'
    },
    activeEffect: {
        transform: [{ scale: 1.1 }]
    },
    effectLabel: { fontSize: 11, color: '#666' },
    saveButton: { width: '100%', marginTop: SPACING.xl },
});
