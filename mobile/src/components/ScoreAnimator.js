import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Dimensions, Easing } from 'react-native';
import { AppText } from './Typography';
import { COLORS } from '../constants/theme';
import { Audio } from 'expo-av';

const { height, width } = Dimensions.get('window');

export const ScoreAnimator = ({ points, message }) => {
    const translateY = useRef(new Animated.Value(height / 2)).current;
    const scale = useRef(new Animated.Value(0.2)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Play remote generic success sound
        const playSound = async () => {
            try {
                // Free generic chime from Mixkit
                const { sound } = await Audio.Sound.createAsync(
                    { uri: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3' },
                    { shouldPlay: true }
                );
            } catch (e) {
                console.log("Could not play dopamine sound via URI", e);
            }
        };
        playSound();

        // Sequence: Pop in, float up a bit, hold, disappear
        Animated.sequence([
            Animated.parallel([
                Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
                Animated.spring(scale, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true }),
                Animated.timing(translateY, { toValue: height / 2 - 100, duration: 400, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true })
            ]),
            Animated.delay(1000),
            Animated.parallel([
                Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
                Animated.timing(translateY, { toValue: height / 2 - 200, duration: 400, useNativeDriver: true }),
                Animated.timing(scale, { toValue: 1.5, duration: 400, useNativeDriver: true })
            ])
        ]).start();

    }, []);

    return (
        <Animated.View style={[styles.container, {
            opacity,
            transform: [{ translateY }, { scale }]
        }]}>
            <AppText style={{ fontSize: 50, marginBottom: 8 }}>🔥</AppText>
            <AppText variant="heading1" style={styles.points}>+{points} XP</AppText>
            <AppText variant="heading3" style={styles.message}>{message}</AppText>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999, // Float over everything
        pointerEvents: 'none', // Don't block touches
    },
    points: {
        color: '#FF7F50',
        textShadowColor: 'rgba(255, 127, 80, 0.4)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 10,
        fontSize: 40
    },
    message: {
        color: COLORS.primary,
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        overflow: 'hidden',
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    }
});
