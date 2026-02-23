import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { AppText } from '../components/Typography';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

const MOCK_POSTS = [
    {
        id: '1',
        avatar: '🦊',
        username: 'Anonymous Fox',
        badge: 'Late Perimenopause',
        time: '2h ago',
        content: 'Has anyone else experienced sudden heart palpitations? I had them twice today and it is really scary.',
        likes: 12,
        comments: 4
    },
    {
        id: '2',
        avatar: '🦉',
        username: 'Wise Owl',
        badge: 'Postmenopause',
        time: '5h ago',
        content: 'Just wanted to share a win: adding 20 mins of yoga to my evening ritual has completely erased my night sweats this week. Highly recommend!',
        likes: 45,
        comments: 14
    },
    {
        id: '3',
        avatar: '🐨',
        username: 'Sleepy Koala',
        badge: 'Early Perimenopause',
        time: '1d ago',
        content: 'My brain fog is so bad today I forgot my own zip code at the pharmacy. Tell me it gets better.',
        likes: 89,
        comments: 32
    }
];

export const CommunityScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <AppText style={styles.backButtonText}>← Back</AppText>
                </TouchableOpacity>
                <AppText variant="heading1">Secret Chats</AppText>
                <TouchableOpacity style={styles.newPostButton}>
                    <Text style={styles.newPostIcon}>✏️</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.rulesCard}>
                    <Text style={styles.rulesIcon}>🤫</Text>
                    <View style={{ flex: 1 }}>
                        <AppText variant="heading2" style={{ marginBottom: 4 }}>Safe Space</AppText>
                        <AppText variant="caption" style={{ color: '#757575' }}>
                            You are fully anonymous. Avatars are randomized. Empathy is required.
                        </AppText>
                    </View>
                </View>

                {MOCK_POSTS.map(post => (
                    <View key={post.id} style={styles.postCard}>
                        <View style={styles.postHeader}>
                            <View style={styles.avatarContainer}>
                                <Text style={styles.avatarEmoji}>{post.avatar}</Text>
                            </View>
                            <View style={styles.postMeta}>
                                <AppText variant="body" style={styles.username}>{post.username}</AppText>
                                <View style={styles.badgeRow}>
                                    <View style={styles.badge}>
                                        <AppText variant="caption" style={styles.badgeText}>{post.badge}</AppText>
                                    </View>
                                    <AppText variant="caption" style={styles.timeText}> • {post.time}</AppText>
                                </View>
                            </View>
                        </View>

                        <AppText variant="body" style={styles.postContent}>{post.content}</AppText>

                        <View style={styles.postActions}>
                            <TouchableOpacity style={styles.actionButton}>
                                <Text style={styles.actionIcon}>❤️</Text>
                                <AppText variant="caption" style={styles.actionText}>{post.likes}</AppText>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <Text style={styles.actionIcon}>💬</Text>
                                <AppText variant="caption" style={styles.actionText}>{post.comments} Replies</AppText>
                            </TouchableOpacity>
                        </View>
                    </View>
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
    newPostButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 88, 100, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    newPostIcon: {
        fontSize: 18,
    },
    content: {
        padding: SPACING.lg,
        paddingBottom: 60,
    },
    rulesCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF9FA',
        padding: SPACING.lg,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.xl,
        borderWidth: 1,
        borderColor: 'rgba(255, 88, 100, 0.2)',
    },
    rulesIcon: {
        fontSize: 32,
        marginRight: SPACING.md,
    },
    postCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: RADIUS.md,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F5F5F5',
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    avatarEmoji: {
        fontSize: 24,
    },
    postMeta: {
        flex: 1,
    },
    username: {
        fontWeight: 'bold',
        color: '#2D2D2D',
        marginBottom: 2,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badge: {
        backgroundColor: 'rgba(255, 88, 100, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    badgeText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 10,
        textTransform: 'uppercase',
    },
    timeText: {
        color: '#C0C0C0',
    },
    postContent: {
        color: '#4A4A4A',
        lineHeight: 24,
        marginBottom: SPACING.lg,
    },
    postActions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
        paddingTop: SPACING.md,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: SPACING.xl,
    },
    actionIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    actionText: {
        color: '#757575',
        fontWeight: '500',
    }
});
