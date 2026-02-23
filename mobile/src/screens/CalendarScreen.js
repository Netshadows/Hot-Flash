import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AppText } from '../components/Typography';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Button } from '../components/Button';

export const CalendarScreen = ({ navigation }) => {
    // Generate mock calendar days for visual representation
    const days = Array.from({ length: 30 }, (_, i) => i + 1);

    // Mock tracked days with some status
    const trackedDays = [2, 3, 5, 8, 12, 14, 15, 18, 22, 23, 27];

    const [selectedDay, setSelectedDay] = useState(null);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <AppText variant="heading1" style={styles.header}>Your Timeline</AppText>
                <AppText variant="body" style={styles.subHeader}>Review past rituals or backfill missed logging days.</AppText>

                <View style={styles.calendarContainer}>
                    <View style={styles.weekDaysRow}>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                            <AppText key={d} style={styles.weekDayText}>{d}</AppText>
                        ))}
                    </View>
                    <View style={styles.daysGrid}>
                        {days.map(day => {
                            const isTracked = trackedDays.includes(day);
                            const isSelected = selectedDay === day;

                            return (
                                <TouchableOpacity
                                    key={day}
                                    style={[
                                        styles.dayCell,
                                        isTracked && styles.dayTracked,
                                        isSelected && styles.daySelected
                                    ]}
                                    onPress={() => setSelectedDay(day)}
                                >
                                    <AppText style={[
                                        styles.dayText,
                                        isTracked && styles.dayTextTracked,
                                        isSelected && styles.dayTextSelected
                                    ]}>
                                        {day}
                                    </AppText>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>

                {selectedDay && (
                    <View style={styles.actionPanel}>
                        <AppText variant="heading3" style={styles.actionHeader}>
                            {trackedDays.includes(selectedDay) ? `Review Day ${selectedDay}` : `Backfill Day ${selectedDay}`}
                        </AppText>
                        <Button
                            title={trackedDays.includes(selectedDay) ? "View Insights" : "Log Missing Data"}
                            onPress={() => navigation.navigate('DailyPulse')}
                        />
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACING.xl, paddingTop: 60, paddingBottom: 100 },
    header: { fontSize: 28, color: COLORS.textMain, marginBottom: SPACING.xs },
    subHeader: { fontSize: 16, color: COLORS.textMuted, marginBottom: SPACING.xl },
    calendarContainer: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 2,
    },
    weekDaysRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: SPACING.sm,
    },
    weekDayText: {
        color: COLORS.textMuted,
        fontWeight: 'bold',
        width: 30,
        textAlign: 'center'
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    dayCell: {
        width: '14.28%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
    },
    dayTracked: {
        backgroundColor: 'rgba(255, 88, 100, 0.1)',
        borderRadius: 20,
    },
    daySelected: {
        backgroundColor: COLORS.primary,
        borderRadius: 20,
    },
    dayText: {
        fontSize: 16,
        color: COLORS.textMain,
    },
    dayTextTracked: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    dayTextSelected: {
        color: COLORS.surface,
        fontWeight: 'bold',
    },
    actionPanel: {
        marginTop: SPACING.xl,
        padding: SPACING.lg,
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    actionHeader: {
        marginBottom: SPACING.md,
        fontSize: 18,
    }
});
