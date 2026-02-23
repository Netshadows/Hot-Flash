import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext({});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    // Tiers: 'free', 'premium', 'ai_pro'
    const [tier, setTier] = useState('free');

    // Used by PaywallModal to elevate privileges
    const upgradeTier = (newTier) => {
        setTier(newTier);
        console.log(`[UserContext] Upgraded to ${newTier} tier`);
    };

    return (
        <UserContext.Provider value={{ tier, upgradeTier }}>
            {children}
        </UserContext.Provider>
    );
};
