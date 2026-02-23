import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AppText } from '../components/Typography';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

const QUIZZES = [
    {
        id: '1',
        title: 'Am I in menopause?',
        description: 'Take this short quiz to see where you are in your lifecycle based on your symptoms.',
        category: 'Assessment',
        color: '#FFB6C1', // Light Pink
        icon: '🔍',
    },
    {
        id: '2',
        title: 'Period quiz',
        description: 'How much do you know about your own menstrual cycle? Assess your knowledge.',
        category: 'Education',
        color: '#87CEFA', // Light Blue
        icon: '🩸',
    },
    {
        id: '3',
        title: 'PCOS quiz',
        description: 'How much do you know about polycystic ovary syndrome? Find out now.',
        category: 'Education',
        color: '#98FB98', // Pale Green
        icon: '🧬',
    },
    {
        id: '4',
        title: 'Birth control quiz',
        description: 'Test your knowledge about the different types of contraception available.',
        category: 'Insight',
        color: '#DDA0DD', // Plum
        icon: '💊',
    },
];

export const QuizzesScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <AppText style={styles.backButtonText}>← Back</AppText>
                </TouchableOpacity>
                <AppText variant="heading1">Health Quizzes</AppText>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <AppText variant="body" style={styles.subtitle}>
                    Learn more about your body and your lifecycle with our scientifically-backed quizzes.
                </AppText>

                {QUIZZES.map(quiz => (
                    <TouchableOpacity
                        key={quiz.id}
                        style={styles.quizCard}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('QuizFlow', { quizId: quiz.id })}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: quiz.color }]}>
                            <AppText style={styles.quizIcon}>{quiz.icon}</AppText>
                        </View>
                        <View style={styles.quizInfo}>
                            <AppText variant="caption" style={[styles.category, { color: COLORS.primary }]}>{quiz.category}</AppText>
                            <AppText variant="heading2" style={styles.quizTitle}>{quiz.title}</AppText>
                            <AppText variant="caption" style={styles.quizDescription}>{quiz.description}</AppText>
                        </View>
                    </TouchableOpacity>
                ))}
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
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingTop: 60,
        paddingBottom: SPACING.md,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        padding: SPACING.xs,
    },
    backButtonText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 16,
    },
    content: {
        padding: SPACING.lg,
        paddingBottom: 60,
    },
    subtitle: {
        color: '#4A4A4A',
        marginBottom: SPACING.xl,
        lineHeight: 24,
    },
    quizCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: RADIUS.md,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F5F5F5',
        alignItems: 'center',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    quizIcon: {
        fontSize: 28,
    },
    quizInfo: {
        flex: 1,
    },
    category: {
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: 4,
        fontSize: 10,
    },
    quizTitle: {
        color: '#2D2D2D',
        marginBottom: 4,
    },
    quizDescription: {
        color: '#757575',
        lineHeight: 18,
    },
});
