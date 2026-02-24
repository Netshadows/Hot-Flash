import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AppText } from './Typography';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

export const SelectGroup = ({ options, selected, onSelect, multi = false }) => {
    return (
        <View style={styles.chipContainer}>
            {options.map(opt => {
                const isSelected = multi ? selected.includes(opt) : selected === opt;
                return (
                    <TouchableOpacity
                        key={opt}
                        activeOpacity={0.8}
                        style={[styles.chip, isSelected && styles.chipSelected]}
                        onPress={() => {
                            if (multi) {
                                onSelect(isSelected ? selected.filter(x => x !== opt) : [...selected, opt]);
                            } else {
                                onSelect(opt);
                            }
                        }}
                    >
                        <AppText style={[styles.chipText, isSelected && styles.chipTextSelected]}>{opt}</AppText>
                    </TouchableOpacity>
                )
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    chip: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: COLORS.surfaceBorder,
        borderRadius: RADIUS.full,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    chipSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    chipText: {
        fontSize: 14,
        color: COLORS.textMain,
        fontWeight: '500',
    },
    chipTextSelected: {
        color: '#FFF',
    }
});
