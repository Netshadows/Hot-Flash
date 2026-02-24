import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Onboarding & Auth
import { OnboardingCommitmentScreen } from './src/screens/OnboardingCommitmentScreen';
import { OnboardingGoalScreen } from './src/screens/OnboardingGoalScreen';
import { OnboardingBaselineScreen } from './src/screens/OnboardingBaselineScreen';
import { OnboardingLifestyleScreen } from './src/screens/OnboardingLifestyleScreen';
import { OnboardingInterstitialScreen } from './src/screens/OnboardingInterstitialScreen';
import { OnboardingSymptomGridScreen } from './src/screens/OnboardingSymptomGridScreen';
import { OnboardingAnalysisScreen } from './src/screens/OnboardingAnalysisScreen';
import { OnboardingRevealScreen } from './src/screens/OnboardingRevealScreen';
import { LoginScreen } from './src/screens/LoginScreen';

// Main App
import { DashboardScreen } from './src/screens/DashboardScreen';
import { LoggingScreen } from './src/screens/LoggingScreen';
import { HealthReportScreen } from './src/screens/HealthReportScreen';
import { CommunityScreen } from './src/screens/CommunityScreen';
import { QuizzesScreen } from './src/screens/QuizzesScreen';
import { QuizFlowScreen } from './src/screens/QuizFlowScreen';
import { DailyActivityScreen } from './src/screens/DailyActivityScreen';
import { DailyPulseScreen } from './src/screens/DailyPulseScreen';
import { DailyJournalScreen } from './src/screens/DailyJournalScreen';
import { JournalHistoryScreen } from './src/screens/JournalHistoryScreen';
import { CalendarScreen } from './src/screens/CalendarScreen';
import { MacroTimelineScreen } from './src/screens/MacroTimelineScreen';
import { PreferencesScreen } from './src/screens/PreferencesScreen';
import { IntegrationsScreen } from './src/screens/IntegrationsScreen';
import { COLORS } from './src/constants/theme';
import { ScoreProvider } from './src/context/ScoreContext';
import { UserProvider } from './src/context/UserContext';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <UserProvider>
            <ScoreProvider>
                <NavigationContainer>
                    <StatusBar style="dark" />
                    <Stack.Navigator
                        screenOptions={{
                            headerShown: false,
                            contentStyle: { backgroundColor: COLORS.background },
                            animation: 'slide_from_right',
                        }}
                        initialRouteName="OnboardingCommitment"
                    >
                        {/* Onboarding Flow & Auth */}
                        <Stack.Screen name="OnboardingCommitment" component={OnboardingCommitmentScreen} />
                        <Stack.Screen name="OnboardingGoal" component={OnboardingGoalScreen} />
                        <Stack.Screen name="OnboardingBaseline" component={OnboardingBaselineScreen} />
                        <Stack.Screen name="OnboardingLifestyle" component={OnboardingLifestyleScreen} />
                        <Stack.Screen name="OnboardingInterstitial" component={OnboardingInterstitialScreen} />
                        <Stack.Screen name="OnboardingSymptomGrid" component={OnboardingSymptomGridScreen} />
                        <Stack.Screen name="OnboardingAnalysis" component={OnboardingAnalysisScreen} />
                        <Stack.Screen name="OnboardingReveal" component={OnboardingRevealScreen} />
                        <Stack.Screen name="Login" component={LoginScreen} />

                        {/* Main Dashboard (Stubbing Tabs for now due to missing dependency wrapper) */}
                        <Stack.Screen name="MainTabs" component={DashboardScreen} />

                        <Stack.Screen
                            name="Logging"
                            component={LoggingScreen}
                            options={{ presentation: 'modal' }}
                        />

                        <Stack.Screen name="HealthReport" component={HealthReportScreen} />
                        <Stack.Screen name="Community" component={CommunityScreen} />
                        <Stack.Screen name="Quizzes" component={QuizzesScreen} />
                        <Stack.Screen name="QuizFlow" component={QuizFlowScreen} />
                        <Stack.Screen name="DailyActivity" component={DailyActivityScreen} />
                        <Stack.Screen name="DailyPulse" component={DailyPulseScreen} options={{ presentation: 'modal' }} />
                        <Stack.Screen name="DailyJournal" component={DailyJournalScreen} options={{ presentation: 'modal' }} />
                        <Stack.Screen name="JournalHistory" component={JournalHistoryScreen} />
                        <Stack.Screen name="Calendar" component={CalendarScreen} />
                        <Stack.Screen name="MacroTimeline" component={MacroTimelineScreen} />
                        <Stack.Screen name="Preferences" component={PreferencesScreen} />
                        <Stack.Screen name="Integrations" component={IntegrationsScreen} />
                    </Stack.Navigator>
                </NavigationContainer>
            </ScoreProvider>
        </UserProvider>
    );
}
