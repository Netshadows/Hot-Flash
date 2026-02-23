import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AppText } from '../components/Typography';
import { Button } from '../components/Button';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Picker } from '@react-native-picker/picker'; // We will need to add this dependency, or use standard RN components if not available

export const OnboardingBaselineScreen = ({ navigation, route }) => {
    const [lastPeriod, setLastPeriod] = useState('just_finished');
    const [age, setAge] = useState(35);

    const handleNext = () => {
        navigation.navigate('OnboardingSymptomGrid');
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <AppText variant="heading1" style={styles.title}>Let's get your baseline</AppText>

            <AppText variant="body" style={styles.prompt}>
                When was your last period?
            </AppText>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={lastPeriod}
                    onValueChange={(itemValue) => setLastPeriod(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Just finished" value="just_finished" />
                    <Picker.Item label="A week ago" value="week_ago" />
                    <Picker.Item label="A month ago" value="month_ago" />
                    <Picker.Item label="Not sure / Irregular" value="irregular" />
                </Picker>
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
                title="Next"
                onPress={handleNext}
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
        marginBottom: SPACING.sm,
        color: '#4A4A4A'
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
