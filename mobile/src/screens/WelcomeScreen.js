import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { COLORS, SPACING } from '../constants/theme';

export const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#E6E6FA', '#F0F8FF']} // Soft lavender gradient
                style={StyleSheet.absoluteFillObject}
            />

            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../assets/logo_app.png')}
                        style={styles.logoImage}
                    />
                    <AppText variant="heading1" style={styles.title}>Lumina</AppText>
                    <AppText variant="body" style={styles.subtitle}>Your lifecycle, understood.</AppText>
                </View>

                <View style={styles.footer}>
                    {/* Placeholder for Apple Sign-In */}
                    <TouchableOpacity
                        style={styles.appleButton}
                        onPress={() => navigation.navigate('OnboardingHealth')}
                        activeOpacity={0.8}
                    >
                        <AppText variant="buttonText" style={styles.appleButtonText}>
                             Sign in with Apple
                        </AppText>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        padding: SPACING.xl,
        paddingBottom: 60,
        paddingTop: 100,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    logoImage: {
        width: 120,
        height: 120,
        borderRadius: 20,
        marginBottom: SPACING.md,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: SPACING.xs,
        color: '#4A4A6A', // Soft dark tone
    },
    subtitle: {
        color: '#8A8A9D',
        fontSize: 18,
    },
    footer: {
        width: '100%',
    },
    appleButton: {
        backgroundColor: '#000',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    appleButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
    }
});
