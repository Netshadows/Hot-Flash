import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { AppText } from './Typography';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export const ScientificHint = ({ title = "Clinical Evidence", rationale }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setIsVisible(true)} style={styles.iconButton}>
                <AppText style={styles.iconText}>ⓘ</AppText>
            </TouchableOpacity>

            <Modal visible={isVisible} transparent={true} animationType="slide" onRequestClose={() => setIsVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <LinearGradient colors={['rgba(255, 88, 100, 0.1)', 'transparent']} style={StyleSheet.absoluteFillObject} />

                        <View style={styles.header}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <AppText style={{ fontSize: 24, marginRight: 8, color: COLORS.primary }}>🔬</AppText>
                                <AppText variant="heading2" style={{ color: COLORS.primary }}>{title}</AppText>
                            </View>
                            <TouchableOpacity onPress={() => setIsVisible(false)} style={styles.closeButton}>
                                <AppText style={styles.closeText}>✕</AppText>
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <AppText variant="body" style={styles.rationaleText}>
                                {rationale}
                            </AppText>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconButton: {
        padding: 4,
        marginLeft: 6,
    },
    iconText: {
        fontSize: 18,
        color: COLORS.primary,
        opacity: 0.7,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.background,
        borderTopLeftRadius: RADIUS.xl,
        borderTopRightRadius: RADIUS.xl,
        padding: SPACING.xl,
        paddingBottom: 40,
        minHeight: 250,
        maxHeight: '60%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        elevation: 10,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    closeButton: {
        padding: SPACING.sm,
    },
    closeText: {
        fontSize: 20,
        fontWeight: '800',
        color: '#4A4A4A',
    },
    rationaleText: {
        color: '#2D2D2D',
        lineHeight: 26,
        fontSize: 16,
    }
});
