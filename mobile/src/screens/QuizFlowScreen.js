import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { QUIZ_DATA } from '../data/QuizData';

export const QuizFlowScreen = ({ navigation, route }) => {
    const { quizId } = route.params;
    const quiz = QUIZ_DATA[quizId];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const handleAnswer = (optionScore) => {
        const newScore = score + optionScore;
        setScore(newScore);

        if (currentIndex < quiz.questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setIsFinished(true);
        }
    };

    const resultTemplate = useMemo(() => {
        if (!isFinished || !quiz) return null;
        // Find the matching result tier based on the score
        return quiz.results.find(r => score >= r.min && score <= r.max) || quiz.results[quiz.results.length - 1]; // Default to highest if out of bounds
    }, [isFinished, score, quiz]);

    if (!quiz) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <AppText>Quiz not found.</AppText>
                <Button title="Go Back" onPress={() => navigation.goBack()} />
            </View>
        );
    }

    if (isFinished) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <AppText variant="heading2">Quiz Complete</AppText>
                </View>
                <ScrollView contentContainerStyle={[styles.content, { flexGrow: 1, justifyContent: 'center' }]}>
                    <View style={styles.resultCard}>
                        <AppText style={styles.scoreText}>Your Result</AppText>
                        <AppText variant="heading1" style={styles.resultTitle}>{resultTemplate?.title}</AppText>
                        <AppText variant="body" style={styles.resultDescription}>{resultTemplate?.description}</AppText>
                    </View>
                </ScrollView>
                <View style={styles.footer}>
                    <Button
                        title="Done"
                        onPress={() => navigation.navigate('Quizzes')}
                    />
                </View>
            </View>
        );
    }

    const currentQuestion = quiz.questions[currentIndex];
    const progress = ((currentIndex) / quiz.questions.length) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <AppText style={styles.backButtonText}>← Exit</AppText>
                </TouchableOpacity>
                <AppText variant="heading2" style={{ flex: 1, textAlign: 'center' }}>{currentIndex + 1} of {quiz.questions.length}</AppText>
                <View style={{ width: 40 }} /> {/* Spacer */}
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <AppText variant="heading1" style={styles.questionText}>
                    {currentQuestion.text}
                </AppText>

                <View style={styles.optionsContainer}>
                    {currentQuestion.options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.optionButton}
                            onPress={() => handleAnswer(option.score)}
                            activeOpacity={0.7}
                        >
                            <AppText variant="body" style={styles.optionText}>{option.text}</AppText>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
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
        paddingHorizontal: SPACING.lg,
        paddingTop: 60,
        paddingBottom: SPACING.md,
        backgroundColor: '#FFFFFF',
    },
    backButton: {
        padding: SPACING.xs,
        width: 60,
    },
    backButtonText: {
        color: '#666',
        fontWeight: '600',
    },
    progressContainer: {
        height: 6,
        backgroundColor: '#F0F0F0',
        width: '100%',
    },
    progressBar: {
        height: '100%',
        backgroundColor: COLORS.primary,
    },
    content: {
        padding: SPACING.lg,
    },
    questionText: {
        color: '#2D2D2D',
        marginBottom: SPACING.xxl,
        marginTop: SPACING.xl,
        textAlign: 'center',
    },
    optionsContainer: {
        gap: SPACING.md,
    },
    optionButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 20,
        paddingHorizontal: SPACING.lg,
        borderRadius: RADIUS.md,
        borderWidth: 1.5,
        borderColor: '#E8E8E8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    optionText: {
        color: '#4A4A4A',
        textAlign: 'center',
        fontWeight: '500',
    },
    resultCard: {
        backgroundColor: '#FFFFFF',
        padding: SPACING.xl,
        borderRadius: RADIUS.lg,
        alignItems: 'center',
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 8,
    },
    scoreText: {
        color: '#888',
        textTransform: 'uppercase',
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: SPACING.sm,
    },
    resultTitle: {
        color: COLORS.primary,
        textAlign: 'center',
        marginBottom: SPACING.lg,
    },
    resultDescription: {
        color: '#4A4A4A',
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        padding: SPACING.lg,
        paddingBottom: 40,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    }
});
