import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { COLORS } from '../constants/theme';

const TRACK_COLORS = {
    vasomotor: COLORS.primary,
    psychological: COLORS.insightBlue,
    somatic: COLORS.insightYellow,
    urogenital: COLORS.insightPurple,
    default: '#F43F5E',
};

export const DynamicRadialGraph = ({
    size = 280,
    lifeStage = 'perimenopause',
    progress = 0.5,
    symptomsData = []
}) => {
    const center = size / 2;
    const innerRadius = size / 2 - 60; // Leave room for outward bars
    const strokeWidth = 14;

    // Convert polar coordinates to cartesian
    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };

    // Determine visual style based on life stage
    const getTrackStyle = () => {
        const circum = 2 * Math.PI * innerRadius;
        switch (lifeStage) {
            case 'perimenopause':
                return { dash: "12, 12", color1: "#FFB300", color2: "#FB8C00" }; // Erratic & varied phase
            case 'menopause':
                return { dash: "none", color1: "#A5B4FC", color2: "#818CF8" }; // Smooth, consistent looping
            case 'pregnancy':
                return { dash: `${circum / 40}, 2`, color1: "#FBCFE8", color2: "#F472B6" }; // 40 structural weeks
            case 'menstruating':
            default:
                return { dash: `${circum / 28}, 2`, color1: "#FFB6C1", color2: "#FB7185" }; // 28 cyclic days
        }
    };

    const styleProps = getTrackStyle();
    const circumference = 2 * Math.PI * innerRadius;
    const progressStrokeDashoffset = circumference - (progress * circumference);

    // Filter valid tracks (handles simulated array of objects, or fallback single array)
    const isMultiTrack = symptomsData.length > 0 && typeof symptomsData[0] === 'object';
    const tracks = isMultiTrack ? symptomsData : [{ id: 'default', color: TRACK_COLORS.default, data: symptomsData }];

    // Prepare data for stacked bars
    const renderStackedBars = () => {
        if (!isMultiTrack || tracks.length === 0) return null;

        const numDays = tracks[0].data.length;
        if (numDays === 0) return null;

        const maxBarRadius = 50; // Max height of a full stack outwards from the inner track
        const angleStep = 360 / numDays;

        // Gap between day slices (in degrees)
        const gapDegrees = 2;
        const sliceWidth = angleStep - gapDegrees;

        const bars = [];

        for (let i = 0; i < numDays; i++) {
            const startAngle = i * angleStep;
            const endAngle = startAngle + sliceWidth;

            let currentRadius = innerRadius + (strokeWidth / 2) + 2; // Start just outside the base track

            tracks.forEach((track, trackIdx) => {
                const val = track.data[i];
                // normalize value (assume 0-10 scale in mock data)
                const normalizedVal = Math.max(0, Math.min(10, val));

                if (normalizedVal > 0) {
                    // Calculate how tall this specific segment should be
                    const segmentHeight = (normalizedVal / 10) * maxBarRadius;
                    const nextRadius = currentRadius + segmentHeight;

                    // Generate SVG arc path for a bar segment
                    const p1 = polarToCartesian(center, center, currentRadius, startAngle);
                    const p2 = polarToCartesian(center, center, currentRadius, endAngle);
                    const p3 = polarToCartesian(center, center, nextRadius, endAngle);
                    const p4 = polarToCartesian(center, center, nextRadius, startAngle);

                    // Large arc flag is 0 because the slice width is small
                    const d = [
                        `M ${p1.x} ${p1.y}`,
                        `A ${currentRadius} ${currentRadius} 0 0 1 ${p2.x} ${p2.y}`,
                        `L ${p3.x} ${p3.y}`,
                        `A ${nextRadius} ${nextRadius} 0 0 0 ${p4.x} ${p4.y}`,
                        `Z`
                    ].join(" ");

                    bars.push(
                        <Path
                            key={`bar-${i}-${trackIdx}`}
                            d={d}
                            fill={TRACK_COLORS[track.id] || TRACK_COLORS.default}
                            stroke={COLORS.background} // Separator line between stacks
                            strokeWidth={1}
                        />
                    );

                    currentRadius = nextRadius; // Move start point out for the next segment in the stack
                }
            });
        }
        return bars;
    };

    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={size} height={size}>
                <Defs>
                    <LinearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor={styleProps.color1} />
                        <Stop offset="100%" stopColor={styleProps.color2} />
                    </LinearGradient>
                </Defs>

                {/* Base Ghost Track */}
                <Circle
                    cx={center}
                    cy={center}
                    r={innerRadius}
                    stroke="#F3F4F6"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={styleProps.dash}
                />

                {/* Progress Track Overlay */}
                <Circle
                    cx={center}
                    cy={center}
                    r={innerRadius}
                    stroke="url(#progressGrad)"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={progressStrokeDashoffset}
                    strokeLinecap={lifeStage === 'menopause' ? "round" : "butt"}
                    transform={`rotate(-90 ${center} ${center})`}
                />

                {/* Render Circular Stacked Bars */}
                {renderStackedBars()}

            </Svg>
        </View>
    );
};
