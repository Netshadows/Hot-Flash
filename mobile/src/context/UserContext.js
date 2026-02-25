import React, { createContext, useContext, useState } from 'react';

import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

const UserContext = createContext({});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    // Tiers: 'free', 'premium', 'ai_pro'
    const [tier, setTier] = useState('free');

    const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop');

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

    const [notifications, setNotifications] = useState({
        enabled: false,
        workflow: 'Morning Only',
    });

    const updateOnboardingData = (newData) => {
        setOnboardingData(prev => ({ ...prev, ...newData }));
    };

    const updateNotifications = (newData) => {
        setNotifications(prev => ({ ...prev, ...newData }));
    };

    const updateProfileImage = (uri) => {
        setProfileImage(uri);
        console.log(`[UserContext] Profile image updated to: ${uri}`);
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
            setNotifications({
                enabled: false,
                workflow: 'Morning Only',
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
            notifications,
            updateNotifications,
            profileImage,
            updateProfileImage,
            logout
        }}>
            {children}
        </UserContext.Provider>
    );
};
