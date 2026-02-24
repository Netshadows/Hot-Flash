import React, { createContext, useContext, useState } from 'react';

import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

const UserContext = createContext({});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    // Tiers: 'free', 'premium', 'ai_pro'
    const [tier, setTier] = useState('free');

    const [activeTracks, setActiveTracks] = useState({
        hot_flashes: true,
        sleep: true,
        weight: false,
        energy: false,
        mood: true,
    });

    const toggleTrack = (trackId) => {
        setActiveTracks(prev => ({
            ...prev,
            [trackId]: !prev[trackId]
        }));
    };

    // Used by PaywallModal to elevate privileges
    const upgradeTier = (newTier) => {
        setTier(newTier);
        console.log(`[UserContext] Upgraded to ${newTier} tier`);
    };

    const [onboardingData, setOnboardingData] = useState({
        stage: null,
        frictionPoints: [],
        symptoms: [],
        goals: [],
        commitment: null,
    });

    const updateOnboardingData = (newData) => {
        setOnboardingData(prev => ({ ...prev, ...newData }));
    };

    const logout = async () => {
        try {
            await signOut(auth);
            console.log("[UserContext] Logged out successfully");
            // Reset local state if needed
            setTier('free');
            setActiveTracks({
                hot_flashes: true,
                sleep: true,
                weight: false,
                energy: false,
                mood: true,
            });
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <UserContext.Provider value={{
            tier,
            upgradeTier,
            activeTracks,
            toggleTrack,
            onboardingData,
            updateOnboardingData,
            logout
        }}>
            {children}
        </UserContext.Provider>
    );
};
