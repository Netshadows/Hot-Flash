import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Onboarding
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { OnboardingHealthScreen } from './src/screens/OnboardingHealthScreen';
import { OnboardingProfileScreen } from './src/screens/OnboardingProfileScreen';
import { OnboardingFrictionScreen } from './src/screens/OnboardingFrictionScreen';

// Main App
import { DashboardScreen } from './src/screens/DashboardScreen';
import { LoggingScreen } from './src/screens/LoggingScreen';
import { COLORS } from './src/constants/theme';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <StatusBar style="dark" />
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: COLORS.background },
                    animation: 'slide_from_right',
                }}
                initialRouteName="Welcome"
            >
                {/* Onboarding Flow */}
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="OnboardingHealth" component={OnboardingHealthScreen} />
                <Stack.Screen name="OnboardingProfile" component={OnboardingProfileScreen} />
                <Stack.Screen name="OnboardingFriction" component={OnboardingFrictionScreen} />

                {/* Main Dashboard (Stubbing Tabs for now due to missing dependency wrapper) */}
                <Stack.Screen name="MainTabs" component={DashboardScreen} />

                <Stack.Screen name="Logging" component={LoggingScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
