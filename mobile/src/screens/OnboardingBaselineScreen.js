import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { ScientificHint } from '../components/ScientificHint';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Picker } from '@react-native-picker/picker';

export const OnboardingBaselineScreen = ({ navigation, route }) => {
    const { profileData } = route.params || { profileData: {} };

    const [selectedDate, setSelectedDate] = useState(null);
    const [generalResponse, setGeneralResponse] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [age, setAge] = useState(35);

    const handleNext = () => {
        // Construct the payload prioritizing specific date if selected, otherwise generic
        const lastPeriodData = selectedDate ? { type: 'specific', date: selectedDate.toISOString() } : { type: 'generic', value: generalResponse };
        navigation.navigate('OnboardingLifestyle', {
            profileData: { ...profileData, baseline: { lastPeriod: lastPeriodData, age } }
        });
    }

    // Mini Calendar Logic
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDayIndex = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

    const handleDateSelect = (day) => {
        const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setSelectedDate(d);
        setGeneralResponse(null); // Clear generic if specific mapped
    };

    const handleGenericSelect = (val) => {
        setGeneralResponse(val);
        setSelectedDate(null); // Clear specific if generic mapped
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xl }}>
                <AppText variant="heading1" style={styles.title}>Let's get your baseline</AppText>
                <View style={{ marginBottom: SPACING.xl }}><ScientificHint title="Cycle Baselines" rationale="The length of time since your last period acts as the primary differentiator between Early Perimenopause, Late Perimenopause, and Post-Menopause." /></View>
            </View>

            <AppText variant="body" style={styles.prompt}>
                When was your last period?
            </AppText>

            {/* Inline Mini Calendar */}
            <View style={styles.calendarCard}>
                <View style={styles.calHeader}>
                    <TouchableOpacity onPress={handlePrevMonth} style={styles.navBtn}>
                        <AppText style={styles.navText}>{"<"}</AppText>
                    </TouchableOpacity>
                    <AppText variant="heading3" style={{ color: COLORS.primary }}>
                        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </AppText>
                    <TouchableOpacity onPress={handleNextMonth} style={styles.navBtn}>
                        <AppText style={styles.navText}>{">"}</AppText>
                    </TouchableOpacity>
                </View>

                <View style={styles.weekDays}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <AppText key={i} style={styles.weekDayText}>{d}</AppText>)}
                </View>

                <View style={styles.daysGrid}>
                    {Array.from({ length: firstDayIndex }).map((_, i) => <View key={`empty-${i}`} style={styles.dayCell} />)}
                    {days.map(day => {
                        const isSelected = selectedDate &&
                            selectedDate.getDate() === day &&
                            selectedDate.getMonth() === currentMonth.getMonth() &&
                            selectedDate.getFullYear() === currentMonth.getFullYear();
                        return (
                            <TouchableOpacity
                                key={day}
                                style={[styles.dayCell, isSelected && styles.dayCellSelected]}
                                onPress={() => handleDateSelect(day)}
                            >
                                <AppText style={[styles.dayText, isSelected && styles.dayTextSelected]}>{day}</AppText>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* General Responses */}
            <AppText variant="caption" style={{ color: '#999', textAlign: 'center', marginBottom: SPACING.md }}>
                OR SELECT A GENERAL TIMEFRAME
            </AppText>

            <View style={styles.genericGroup}>
                {[
                    { label: "Don't Remember", val: "dont_remember" },
                    { label: "Irregular / Not Sure", val: "irregular" },
                    { label: "Over a year ago", val: "over_a_year" }
                ].map(opt => (
                    <TouchableOpacity
                        key={opt.val}
                        style={[styles.genericBtn, generalResponse === opt.val && styles.genericBtnSelected]}
                        onPress={() => handleGenericSelect(opt.val)}
                    >
                        <AppText style={[styles.genericText, generalResponse === opt.val && styles.genericTextSelected]}>
                            {opt.label}
                        </AppText>
                    </TouchableOpacity>
                ))}
            </View>

            <AppText variant="body" style={styles.prompt}>
                How old are you?
            </AppText>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={age}
                    onValueChange={(itemValue) => setAge(itemValue)}
                    style={styles.picker}
                >
                    {Array.from({ length: 60 }, (_, i) => i + 18).map(a => (
                        <Picker.Item key={a} label={`${a} years`} value={a} />
                    ))}
                </Picker>
            </View>

            <Button
                title="Continue"
                onPress={handleNext}
                disabled={!selectedDate && !generalResponse}
                style={styles.nextButton}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: SPACING.lg,
        paddingTop: 60,
    },
    title: {
        marginBottom: SPACING.xl,
        color: '#2D2D2D',
    },
    prompt: {
        fontWeight: '600',
        marginBottom: SPACING.md,
        color: '#4A4A4A',
        fontSize: 18
    },
    calendarCard: {
        backgroundColor: '#FFF',
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.xl,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    calHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    navBtn: { padding: SPACING.sm },
    navText: { fontSize: 20, color: '#999', fontWeight: 'bold' },
    weekDays: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: SPACING.sm,
    },
    weekDayText: {
        color: '#999',
        width: 32,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 12
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    dayCell: {
        width: '14.28%', // 100/7
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    dayCellSelected: {
        backgroundColor: COLORS.primary,
        borderRadius: 20,
    },
    dayText: {
        color: '#4A4A4A',
        fontSize: 16,
    },
    dayTextSelected: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    genericGroup: {
        gap: SPACING.sm,
        marginBottom: SPACING.xl,
    },
    genericBtn: {
        paddingVertical: 14,
        paddingHorizontal: SPACING.md,
        borderRadius: RADIUS.md,
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        alignItems: 'center',
    },
    genericBtnSelected: {
        backgroundColor: 'rgba(255, 88, 100, 0.05)',
        borderColor: COLORS.primary,
    },
    genericText: {
        color: '#4A4A4A',
        fontWeight: '500',
    },
    genericTextSelected: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    pickerContainer: {
        backgroundColor: '#F5F5F5',
        borderRadius: RADIUS.md,
        marginBottom: SPACING.xl,
        overflow: 'hidden',
    },
    picker: {
        width: '100%',
        height: 150,
    },
    nextButton: {
        marginTop: SPACING.md,
    }
});
