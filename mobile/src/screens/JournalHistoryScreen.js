import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { AppText } from '../components/Typography';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { getJournalEntries } from '../services/firebase';
import { useUser } from '../context/UserContext';

const SIGNIFIER_COLORS = {
    'thought': COLORS.insightBlue,
    'task': COLORS.insightPurple,
    'memory': COLORS.primary,
    'symptom': COLORS.insightYellow,
};

const SIGNIFIER_ACCENTS = {
    'thought': COLORS.accentBlue,
    'task': COLORS.accentPurple,
    'memory': COLORS.accentPink,
    'symptom': COLORS.accentYellow,
};

const SIGNIFIER_ICONS = {
    'thought': 'chatbubble-ellipses',
    'task': 'checkbox',
    'memory': 'heart',
    'symptom': 'medical',
};

export const JournalHistoryScreen = ({ navigation }) => {
    const { user } = useUser();
    const [entries, setEntries] = useState([]);
    const [filter, setFilter] = useState(null); // null = all, or signifier id

    useEffect(() => {
        const loadEntries = async () => {
            const data = await getJournalEntries(user?.uid || 'anonymous');
            setEntries(data);
        };
        loadEntries();
    }, [user]);

    const filteredEntries = filter ? entries.filter(e => e.signifier === filter) : entries;

    const renderEntry = (entry, index) => {
        const date = new Date(entry.createdAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
        const time = new Date(entry.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

        return (
            <View key={entry.id || index} style={styles.entryThread}>
                <View style={styles.threadTimeline}>
                    <View style={[styles.threadDot, { backgroundColor: SIGNIFIER_COLORS[entry.signifier] || COLORS.primary }]} />
                    {index < filteredEntries.length - 1 && <View style={styles.threadLine} />}
                </View>

                <View style={styles.entryCard}>
                    <View style={styles.entryHeader}>
                        <AppText variant="caption" style={styles.dateText}>{date} • {time}</AppText>
                        <Ionicons name={SIGNIFIER_ICONS[entry.signifier] || 'document'} size={18} color={SIGNIFIER_COLORS[entry.signifier] || COLORS.textMuted} />
                    </View>

                    {entry.prompt && (
                        <AppText variant="caption" style={styles.promptText}>Q: {entry.prompt}</AppText>
                    )}

                    {entry.text && <AppText variant="body" style={styles.entryText}>{entry.text}</AppText>}

                    {entry.photoUri && (
                        <Image source={{ uri: entry.photoUri }} style={styles.entryImage} />
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={COLORS.textMain} />
                </TouchableOpacity>
                <AppText variant="heading2">Journal History</AppText>
                <View style={{ width: 28 }} />
            </View>

            {/* Filter / Threading Options */}
            <View style={styles.filterScroller}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
                    <TouchableOpacity
                        style={[styles.filterChip, filter === null ? styles.filterChipActive : { backgroundColor: COLORS.surface, borderColor: '#E8E8E8' }]}
                        onPress={() => setFilter(null)}
                        activeOpacity={0.8}
                    >
                        <AppText style={[styles.filterText, filter === null ? styles.filterTextActive : { color: COLORS.textMuted }]}>All</AppText>
                    </TouchableOpacity>
                    {Object.keys(SIGNIFIER_COLORS).map(sig => (
                        <TouchableOpacity
                            key={sig}
                            style={[
                                styles.filterChip,
                                filter === sig
                                    ? { backgroundColor: SIGNIFIER_COLORS[sig], borderColor: SIGNIFIER_COLORS[sig] }
                                    : { backgroundColor: SIGNIFIER_ACCENTS[sig], borderColor: SIGNIFIER_ACCENTS[sig] }
                            ]}
                            onPress={() => setFilter(sig === filter ? null : sig)}
                            activeOpacity={0.8}
                        >
                            <AppText style={[styles.filterText, filter === sig ? { color: '#FFF' } : { color: SIGNIFIER_COLORS[sig] }]}>{sig}</AppText>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {filteredEntries.map(renderEntry)}

                {filteredEntries.length > 0 && (
                    <View style={styles.retrospectiveCard}>
                        <AppText variant="heading2" style={styles.retroTitle}>Review & Reflect</AppText>
                        <AppText variant="body" style={styles.retroPrompt}>
                            As you look back, I notice a pattern of...
                        </AppText>
                        <TouchableOpacity style={styles.retroButton}>
                            <AppText style={{ color: COLORS.primary, fontWeight: '600' }}>Add Reflection</AppText>
                        </TouchableOpacity>
                    </View>
                )}

                {filteredEntries.length === 0 && (
                    <View style={styles.emptyState}>
                        <AppText variant="body" style={{ color: COLORS.textMuted, textAlign: 'center' }}>
                            No entries found for this category.
                        </AppText>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingTop: 60,
        paddingBottom: SPACING.md,
        backgroundColor: COLORS.surface,
    },
    backButton: {
        padding: SPACING.xs,
        marginLeft: -SPACING.xs,
    },
    filterScroller: {
        backgroundColor: COLORS.surface,
        paddingBottom: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    filterContainer: {
        paddingHorizontal: SPACING.lg,
        gap: SPACING.sm,
    },
    filterChip: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: RADIUS.full,
        borderWidth: 1,
    },
    filterChipActive: {
        backgroundColor: COLORS.textMain,
        borderColor: COLORS.textMain,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    filterTextActive: {
        color: '#FFF',
    },
    content: {
        padding: SPACING.lg,
        paddingBottom: 100,
    },
    entryThread: {
        flexDirection: 'row',
        marginBottom: SPACING.lg,
    },
    threadTimeline: {
        width: 24,
        alignItems: 'center',
        marginRight: SPACING.sm,
    },
    threadDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginTop: 6,
    },
    threadLine: {
        width: 2,
        flex: 1,
        backgroundColor: '#E8E8E8',
        marginTop: 4,
        marginBottom: -SPACING.lg, // Bridge the gap to the next entry
    },
    entryCard: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 2,
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    dateText: {
        color: COLORS.textMuted,
        fontWeight: '600',
    },
    promptText: {
        color: '#FF7F50',
        fontStyle: 'italic',
        marginBottom: SPACING.sm,
    },
    entryText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#2D2D2D',
    },
    entryImage: {
        width: '100%',
        height: 150,
        borderRadius: RADIUS.sm,
        marginTop: SPACING.sm,
        resizeMode: 'cover',
    },
    retrospectiveCard: {
        backgroundColor: '#FFF5EE',
        borderRadius: RADIUS.md,
        padding: SPACING.lg,
        marginTop: SPACING.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFDAB9',
    },
    retroTitle: {
        color: '#FF7F50',
        marginBottom: SPACING.xs,
    },
    retroPrompt: {
        textAlign: 'center',
        color: '#4A4A4A',
        fontStyle: 'italic',
        marginBottom: SPACING.md,
    },
    retroButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
        borderRadius: RADIUS.full,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    emptyState: {
        marginTop: 100,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
