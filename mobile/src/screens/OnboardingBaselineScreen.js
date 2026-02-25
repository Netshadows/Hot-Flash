import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList, Animated } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { ScientificHint } from '../components/ScientificHint';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

const ITEM_WIDTH = 80;
const AGES = Array.from({ length: 60 }, (_, i) => i + 18);

export const OnboardingBaselineScreen = ({ navigation, route }) => {
    const { profileData } = route.params || { profileData: {} };

    const [selectedDate, setSelectedDate] = useState(null);
    const [generalResponse, setGeneralResponse] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [age, setAge] = useState(35);

    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef(null);

    // Center the initial age
    useEffect(() => {
        setTimeout(() => {
            const index = AGES.indexOf(35);
            if (flatListRef.current && index !== -1) {
                flatListRef.current.scrollToIndex({ index, animated: false, viewPosition: 0.5 });
            }
        }, 100);
    }, []);

    const handleNext = () => {
        const lastPeriodData = selectedDate ? { type: 'specific', date: selectedDate.toISOString() } : { type: 'generic', value: generalResponse };
        navigation.navigate('OnboardingLifestyle', {
            profileData: { ...profileData, baseline: { lastPeriod: lastPeriodData, age } }
        });
    }

    const onScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false }
    );

    const onMomentumScrollEnd = (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / ITEM_WIDTH);
        setAge(AGES[index]);
    };

    // Mini Calendar Logic
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDayIndex = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

    const handleDateSelect = (day) => {
        const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setSelectedDate(d);
        setGeneralResponse(null);
    };

    const handleGenericSelect = (val) => {
        setGeneralResponse(val);
        setSelectedDate(null);
    };

    const renderAgeItem = ({ item, index }) => {
        const range = [
            (index - 2) * ITEM_WIDTH,
            (index - 1) * ITEM_WIDTH,
            index * ITEM_WIDTH,
            (index + 1) * ITEM_WIDTH,
            (index + 2) * ITEM_WIDTH,
        ];

        const outputRange = [0.4, 0.6, 1, 0.6, 0.4];
        const scale = scrollX.interpolate({ inputRange: range, outputRange: [0.8, 0.9, 1.2, 0.9, 0.8], extrapolate: 'clamp' });
        const opacity = scrollX.interpolate({ inputRange: range, outputRange, extrapolate: 'clamp' });

        return (
            <Animated.View style={[styles.ageItem, { opacity, transform: [{ scale }] }]}>
                <AppText style={[styles.ageText, age === item && styles.ageTextActive]}>{item}</AppText>
                <View style={[styles.rulerTick, age === item && styles.rulerTickActive]} />
            </Animated.View>
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md }}>
                <AppText variant="heading1" style={styles.title}>Your Baseline</AppText>
            </View>

            {/* AGE SECTION - NOW AT TOP */}
            <AppText variant="body" style={styles.prompt}>
                How old are you?
            </AppText>

            <View style={styles.pickerWrapper}>
                <View style={styles.selectionIndicator} />
                <Animated.FlatList
                    ref={flatListRef}
                    data={AGES}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.toString()}
                    renderItem={renderAgeItem}
                    contentContainerStyle={styles.pickerContent}
                    snapToInterval={ITEM_WIDTH}
                    decelerationRate="fast"
                    onScroll={onScroll}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    scrollEventThrottle={16}
                    getItemLayout={(_, index) => ({
                        length: ITEM_WIDTH,
                        offset: ITEM_WIDTH * index,
                        index,
                    })}
                />
                <View style={styles.selectedAgeLabel}>
                    <AppText style={styles.selectedAgeText}>{age} years</AppText>
                </View>
            </View>

            {/* PERIOD SECTION - NOW BELOW AGE */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: SPACING.xl, marginBottom: SPACING.md }}>
                <AppText variant="body" style={[styles.prompt, { marginBottom: 0 }]}>
                    When was your last period?
                </AppText>
                <View style={{ marginLeft: SPACING.xs }}>
                    <ScientificHint title="Cycle Baselines" rationale="The length of time since your last period acts as the primary differentiator between stages." />
                </View>
            </View>

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
        paddingTop: 80,
    },
    title: {
        marginBottom: SPACING.md,
        color: '#2D2D2D',
    },
    prompt: {
        fontWeight: '700',
        marginBottom: SPACING.lg,
        color: '#4A4A4A',
        fontSize: 18
    },
    pickerWrapper: {
        height: 180,
        backgroundColor: '#FFF',
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        justifyContent: 'center',
    },
    pickerContent: {
        paddingHorizontal: (ITEM_WIDTH * 2),
        alignItems: 'center',
    },
    selectionIndicator: {
        position: 'absolute',
        top: '15%',
        bottom: '15%',
        left: '50%',
        width: 2,
        backgroundColor: COLORS.primary,
        marginLeft: -1,
        zIndex: 10,
        borderRadius: 1,
    },
    ageItem: {
        width: ITEM_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ageText: {
        fontSize: 24,
        fontWeight: '400',
        color: '#999',
    },
    ageTextActive: {
        color: COLORS.primary,
        fontWeight: '800',
        fontSize: 32,
    },
    rulerTick: {
        height: 12,
        width: 1,
        backgroundColor: '#CCC',
        marginTop: 12,
    },
    rulerTickActive: {
        backgroundColor: COLORS.primary,
        height: 20,
        width: 2,
    },
    selectedAgeLabel: {
        position: 'absolute',
        bottom: 15,
        alignSelf: 'center',
    },
    selectedAgeText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.primary,
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
        width: '14.28%',
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
    nextButton: {
        marginTop: SPACING.md,
        marginBottom: 60,
    }
});
