import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export const OnboardingInterstitialScreen = ({ navigation, route }) => {
    const { profileData } = route.params || { profileData: {} };

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true })
        ]).start();
    }, []);

    const handleNext = () => {
        navigation.navigate('OnboardingSymptomGrid', { profileData });
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['rgba(255, 88, 100, 0.05)', '#FFFFFF']} style={StyleSheet.absoluteFillObject} />
            <View style={styles.content}>
                <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                    <AppText style={{ fontSize: 48, marginBottom: SPACING.md }}>🤝</AppText>

                    <AppText variant="heading1" style={styles.title}>You are not alone.</AppText>

                    <AppText variant="body" style={styles.bodyText}>
                        <AppText style={{ fontWeight: 'bold', color: COLORS.primary }}>85% of women</AppText> report exactly what you are experiencing.
                    </AppText>

                    <View style={styles.quoteCard}>
                        <AppText style={styles.quoteText}>
                            "The sudden drops in estrogen during late perimenopause cause systemic disruptions that affect your brain, joints, and sleep. This is biological, not psychological."
                        </AppText>
                        <AppText variant="caption" style={{ color: '#999', marginTop: 8 }}>— Clinical Consensus</AppText>
                    </View>
                </Animated.View>
            </View>

            <View style={styles.footer}>
                <Button title="Continue" onPress={handleNext} style={{ width: '100%' }} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { flex: 1, justifyContent: 'center', padding: SPACING.xl },
    title: { color: COLORS.primary, marginBottom: SPACING.md },
    bodyText: { fontSize: 20, color: '#4A4A4A', lineHeight: 30, marginBottom: SPACING.xl * 1.5 },
    quoteCard: {
        backgroundColor: '#F9F9F9', padding: SPACING.lg,
        borderLeftWidth: 4, borderLeftColor: COLORS.primary,
        borderRadius: RADIUS.sm
    },
    quoteText: { fontSize: 16, color: '#666', fontStyle: 'italic', lineHeight: 24 },
    footer: { padding: SPACING.xl, paddingBottom: 40 }
});
