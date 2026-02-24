import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { AppText } from '../components/Typography';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Button } from '../components/Button';
import { auth, saveCalendarData, getCalendarData, removeCalendarData } from '../services/firebase';

export const CalendarScreen = ({ navigation }) => {
    // Generate actual JS Dates for the current month
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDay = today.getDate();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday

    const emptyCells = Array.from({ length: startDayOfWeek }, () => null);
    const realDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const calendarGrid = [...emptyCells, ...realDays];

    const [selectedDay, setSelectedDay] = useState(null);
    const [flowData, setFlowData] = useState({}); // Example: { 14: 'Medium', 15: 'Spotting' }

    React.useEffect(() => {
        const loadData = async () => {
            const userId = auth.currentUser?.uid || 'anonymous';
            const data = await getCalendarData(userId, currentMonth, currentYear);
            setFlowData(data);
        };
        loadData();
    }, [currentMonth, currentYear]);

    const openLoggingModal = (day) => {
        if (day) setSelectedDay(day);
    };

    const handleLogFlow = async (level) => {
        const userId = auth.currentUser?.uid || 'anonymous';
        await saveCalendarData(userId, selectedDay, currentMonth, currentYear, { flow: level });
        setFlowData(prev => ({ ...prev, [selectedDay]: level }));
        setSelectedDay(null); // Close modal after logging
    };

    const handleRemoveRitual = async () => {
        const userId = auth.currentUser?.uid || 'anonymous';
        await removeCalendarData(userId, selectedDay, currentMonth, currentYear);
        setFlowData(prev => {
            const newData = { ...prev };
            delete newData[selectedDay];
            return newData;
        });
        setSelectedDay(null);
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerArea}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <AppText style={{ fontSize: 28, fontWeight: '800', color: COLORS.textMain }}>←</AppText>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <AppText variant="heading1" style={styles.header}>Your Timeline</AppText>
                <AppText variant="body" style={styles.subHeader}>
                    Review past rituals or log your menstrual flow (THE key transitioning metric).
                </AppText>

                <View style={styles.calendarContainer}>
                    <AppText variant="heading2" style={{ textAlign: 'center', marginBottom: SPACING.md }}>
                        {monthNames[currentMonth]} {currentYear}
                    </AppText>

                    <View style={styles.weekDaysRow}>
                        {weekDays.map(d => (
                            <AppText key={d} style={styles.weekDayText}>{d}</AppText>
                        ))}
                    </View>

                    <View style={styles.daysGrid}>
                        {calendarGrid.map((day, index) => {
                            if (!day) {
                                return <View key={`empty-${index}`} style={styles.dayCell} />;
                            }

                            const isToday = day === currentDay;
                            const flowStatus = flowData[day];

                            return (
                                <TouchableOpacity
                                    key={day}
                                    style={[
                                        styles.dayCell,
                                        isToday && styles.dayToday,
                                        flowStatus && styles.dayTracked
                                    ]}
                                    onPress={() => openLoggingModal(day)}
                                >
                                    <AppText style={[
                                        styles.dayText,
                                        isToday && styles.dayTextToday,
                                        flowStatus && styles.dayTextTracked
                                    ]}>
                                        {day}
                                    </AppText>
                                    {flowStatus && (
                                        <View style={styles.flowIndicator} />
                                    )}
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>

                <View style={styles.actionPanel}>
                    <AppText variant="heading3" style={{ marginBottom: SPACING.md }}>View Trajectory</AppText>
                    <Button
                        title="View Multi-Year Macro-Timeline"
                        onPress={() => navigation.navigate('MacroTimeline')}
                        variant="secondary"
                    />
                </View>
            </ScrollView>

            {/* Menstrual Flow & Backfill Modal */}
            <Modal visible={!!selectedDay} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <AppText variant="heading2" style={{ marginBottom: SPACING.md }}>
                            {monthNames[currentMonth]} {selectedDay}
                        </AppText>

                        <AppText variant="body" style={{ fontWeight: '600', marginBottom: SPACING.sm }}>
                            Log Menstrual Flow:
                        </AppText>
                        <View style={styles.flowRow}>
                            {['Spotting', 'Light', 'Medium', 'Heavy'].map(flow => (
                                <TouchableOpacity
                                    key={flow}
                                    style={[styles.flowBtn, flowData[selectedDay] === flow && styles.flowBtnSelected]}
                                    onPress={() => handleLogFlow(flow)}
                                >
                                    <AppText style={flowData[selectedDay] === flow ? styles.flowTextSelected : null}>{flow}</AppText>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={{ height: 1, backgroundColor: '#E8E8E8', my: SPACING.xl, marginTop: SPACING.xl }} />

                        <AppText variant="body" style={{ fontWeight: '600', marginVertical: SPACING.md }}>
                            Holistic Transition Metrics:
                        </AppText>
                        <Button
                            title="Log Daily Pulse for this day"
                            onPress={() => {
                                setSelectedDay(null);
                                navigation.navigate('DailyPulse');
                            }}
                            style={{ marginBottom: SPACING.md }}
                        />

                        <Button
                            title="Cancel"
                            variant="secondary"
                            onPress={() => setSelectedDay(null)}
                            style={{ marginTop: SPACING.lg }}
                        />

                        {flowData[selectedDay] && (
                            <TouchableOpacity
                                style={styles.removeBtn}
                                onPress={handleRemoveRitual}
                            >
                                <AppText style={styles.removeBtnText}>Remove Ritual Information</AppText>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    headerArea: { paddingHorizontal: SPACING.xl, paddingTop: 60, paddingBottom: 10 },
    backButton: { width: 50, height: 50, justifyContent: 'center' },
    content: { padding: SPACING.xl, paddingBottom: 100 },
    header: { fontSize: 28, color: COLORS.textMain, marginBottom: SPACING.xs },
    subHeader: { fontSize: 16, color: COLORS.textMuted, marginBottom: SPACING.xl },
    calendarContainer: {
        backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md,
        shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 4, elevation: 2,
    },
    weekDaysRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: SPACING.sm },
    weekDayText: { color: COLORS.textMuted, fontWeight: 'bold', width: '14.28%', textAlign: 'center' },
    daysGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
    dayCell: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', position: 'relative' },
    dayToday: { backgroundColor: '#F0F0F0', borderRadius: 20 },
    dayTracked: { backgroundColor: 'rgba(255, 182, 193, 0.2)', borderRadius: 20 },
    dayText: { fontSize: 16, color: COLORS.textMain },
    dayTextToday: { fontWeight: '800' },
    dayTextTracked: { color: COLORS.primary, fontWeight: 'bold' },
    flowIndicator: { position: 'absolute', bottom: 4, width: 4, height: 4, borderRadius: 2, backgroundColor: COLORS.primary },
    actionPanel: { marginTop: SPACING.xl, padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: '#E8E8E8' },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: COLORS.surface, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: SPACING.xl, paddingBottom: 50 },
    flowRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
    flowBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#E8E8E8' },
    flowBtnSelected: { backgroundColor: '#FFE082', borderColor: '#FFB300' },
    flowTextSelected: { color: '#B27D00', fontWeight: 'bold' },
    removeBtn: {
        marginTop: SPACING.xl,
        padding: SPACING.md,
        alignItems: 'center',
    },
    removeBtnText: {
        color: '#FF5252',
        fontWeight: 'bold',
        fontSize: 14,
    }
});
