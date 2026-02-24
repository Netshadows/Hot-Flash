import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS } from '../constants/theme';

const TRACK_COLORS = {
    vasomotor: COLORS.primary,
    psychological: COLORS.insightBlue,
    somatic: COLORS.insightYellow,
    urogenital: COLORS.insightPurple,
    default: '#F43F5E',
};

export const DynamicRadialGraph = ({
    size = 220,
    lifeStage = 'perimenopause',
    progress = 0.5,
    symptomsData = []
}) => {
    const center = size / 2;
    const trackRadius = size / 2 - 38; // Moved inward to allow lines on the outside
    const strokeWidth = 14;

    // Convert polar coordinates to cartesian for the line graph
    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };

    // Build a smooth bezier curve loop from an array of numbers
    const buildSmoothSymptomPath = (data) => {
        if (!data || data.length === 0) return '';

        const minRadius = trackRadius + 12; // Start outside the track
        const maxRadius = trackRadius + 32; // Expand further outward

        const angleStep = 360 / data.length;

        // Calculate all points first
        const points = data.map((val, index) => {
            const angle = index * angleStep;
            const normalizedVal = Math.max(0, Math.min(10, val));
            const pointRadius = minRadius + ((normalizedVal / 10) * (maxRadius - minRadius));
            return polarToCartesian(center, center, pointRadius, angle);
        });

        // Catmull-Rom to Cubic Bezier path generation for closed loop
        let d = `M ${points[0].x},${points[0].y}`;
        const tension = 0.15; // Lower = tighter, Higher = looser curve

        for (let i = 0; i < points.length; i++) {
            const p0 = points[(i - 1 + points.length) % points.length];
            const p1 = points[i];
            const p2 = points[(i + 1) % points.length];
            const p3 = points[(i + 2) % points.length];

            const cp1 = {
                x: p1.x + (p2.x - p0.x) * tension,
                y: p1.y + (p2.y - p0.y) * tension,
            };
            const cp2 = {
                x: p2.x - (p3.x - p1.x) * tension,
                y: p2.y - (p3.y - p1.y) * tension,
            };
            d += ` C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${p2.x},${p2.y}`;
        }

        return d;
    };

    // Determine visual style based on life stage
    const getTrackStyle = () => {
        const circum = 2 * Math.PI * trackRadius;
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
    const circumference = 2 * Math.PI * trackRadius;
    const progressStrokeDashoffset = circumference - (progress * circumference);

    // Filter valid tracks (handles simulated array of objects, or fallback single array)
    const isMultiTrack = symptomsData.length > 0 && typeof symptomsData[0] === 'object';
    const tracks = isMultiTrack ? symptomsData : [{ id: 'default', color: TRACK_COLORS.default, data: symptomsData }];

    // Render dominant symptom dots on the outer track
    const renderDominantDots = () => {
        if (!isMultiTrack || tracks.length === 0) return null;

        const numDays = tracks[0].data.length;
        if (numDays === 0) return null;

        const dots = [];
        const angleStep = 360 / numDays;

        for (let i = 0; i < numDays; i++) {
            // Find dominant track for day 'i'
            let maxVal = -1;
            let dominantTrackId = null;

            tracks.forEach(track => {
                const val = track.data[i];
                if (val > maxVal) {
                    maxVal = val;
                    dominantTrackId = track.id;
                }
            });

            // Only draw a dot if the symptom was somewhat present
            if (maxVal > 2 && dominantTrackId) {
                const angle = i * angleStep;
                // Place dot straight exactly on the track radius
                const pt = polarToCartesian(center, center, trackRadius, angle);
                const dotColor = TRACK_COLORS[dominantTrackId] || TRACK_COLORS.default;

                dots.push(
                    <Circle
                        key={`dot-${i}`}
                        cx={pt.x}
                        cy={pt.y}
                        r={3}
                        fill={dotColor}
                        stroke="#FFF"
                        strokeWidth="1"
                        opacity={0.9}
                    />
                );
            }
        }
        return dots;
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
                    r={trackRadius}
                    stroke="#F3F4F6"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={styleProps.dash}
                />

                {/* Progress Track Overlay */}
                <Circle
                    cx={center}
                    cy={center}
                    r={trackRadius}
                    stroke="url(#progressGrad)"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={progressStrokeDashoffset}
                    strokeLinecap={lifeStage === 'menopause' ? "round" : "butt"}
                    transform={`rotate(-90 ${center} ${center})`}
                />

                {/* Render Circular Smooth Symptom Paths */}
                {tracks.map((track, idx) => {
                    const pathString = buildSmoothSymptomPath(track.data);
                    if (!pathString) return null;
                    const pathColor = TRACK_COLORS[track.id] || TRACK_COLORS.default;

                    return (
                        <Path
                            key={`path-${track.id}-${idx}`}
                            d={pathString}
                            fill={pathColor + "15"} // 15 Hex Alpha = Very translucent
                            stroke={pathColor}
                            strokeWidth="2"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        />
                    );
                })}

                {/* Render Dominant Symptom Dots On the Track */}
                {renderDominantDots()}

            </Svg>
        </View>
    );
};
