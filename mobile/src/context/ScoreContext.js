import React, { createContext, useContext, useState, useRef } from 'react';
import * as Haptics from 'expo-haptics';
import { ScoreAnimator } from '../components/ScoreAnimator';

const ScoreContext = createContext({});

export const useScore = () => useContext(ScoreContext);

export const ScoreProvider = ({ children }) => {
    const [xp, setXp] = useState(1250); // initial mock total
    const [streak, setStreak] = useState(14); // initial mock total
    const [animations, setAnimations] = useState([]);

    const nextId = useRef(0);

    const triggerDopamine = (points = 50, message = "Daily Goal Complete!") => {
        setXp(prev => prev + points);

        // Signature "Addictive" Haptics sequence
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 100);
        setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 200);
        setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 300);
        setTimeout(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success), 500);

        // Queue visual animation overlay
        const id = nextId.current++;
        setAnimations(prev => [...prev, { id, points, message }]);

        // Clean up animation component after it finishes playing
        setTimeout(() => {
            setAnimations(prev => prev.filter(anim => anim.id !== id));
        }, 3000);
    };

    return (
        <ScoreContext.Provider value={{ xp, streak, triggerDopamine }}>
            {children}
            {animations.map(anim => (
                <ScoreAnimator key={anim.id} points={anim.points} message={anim.message} />
            ))}
        </ScoreContext.Provider>
    );
};
