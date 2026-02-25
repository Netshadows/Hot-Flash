import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Onboarding & Auth
import { OnboardingSDOHScreen } from './src/screens/OnboardingSDOHScreen';
import { OnboardingBITScreen } from './src/screens/OnboardingBITScreen';
import { OnboardingCBTScreen } from './src/screens/OnboardingCBTScreen';
import { OnboardingIDEASScreen } from './src/screens/OnboardingIDEASScreen';
import { OnboardingIntegrationsScreen } from './src/screens/OnboardingIntegrationsScreen';
import { OnboardingCommitmentScreen } from './src/screens/OnboardingCommitmentScreen';
import { OnboardingGoalScreen } from './src/screens/OnboardingGoalScreen';
import { OnboardingBaselineScreen } from './src/screens/OnboardingBaselineScreen';
import { OnboardingLifestyleScreen } from './src/screens/OnboardingLifestyleScreen';
import { OnboardingInterstitialScreen } from './src/screens/OnboardingInterstitialScreen';
import { OnboardingSymptomGridScreen } from './src/screens/OnboardingSymptomGridScreen';
import { OnboardingAnalysisScreen } from './src/screens/OnboardingAnalysisScreen';
import { OnboardingRevealScreen } from './src/screens/OnboardingRevealScreen';
import { OnboardingProfileScreen } from './src/screens/OnboardingProfileScreen';
import { OnboardingFrictionScreen } from './src/screens/OnboardingFrictionScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { PaywallScreen } from './src/screens/PaywallScreen';
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
import { OnboardingDataScreen } from './src/screens/OnboardingDataScreen';
import { PreferencesScreen } from './src/screens/PreferencesScreen';
import { NotificationSettingsScreen } from './src/screens/NotificationSettingsScreen';
import { IntegrationsScreen } from './src/screens/IntegrationsScreen';
import { MindfulnessActivityScreen } from './src/screens/MindfulnessActivityScreen';
import { MovementActivityScreen } from './src/screens/MovementActivityScreen';
import { NutritionActivityScreen } from './src/screens/NutritionActivityScreen';
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
                        initialRouteName="OnboardingSDOH"
                    >
                        {/* Advanced Onboarding Flow */}
                        <Stack.Screen name="OnboardingSDOH" component={OnboardingSDOHScreen} />
                        <Stack.Screen name="OnboardingBIT" component={OnboardingBITScreen} />
                        <Stack.Screen name="OnboardingCBT" component={OnboardingCBTScreen} />
                        <Stack.Screen name="OnboardingIDEAS" component={OnboardingIDEASScreen} />
                        <Stack.Screen name="OnboardingIntegrations" component={OnboardingIntegrationsScreen} />

                        {/* Existing Onboarding Flow & Auth */}
                        <Stack.Screen name="OnboardingCommitment" component={OnboardingCommitmentScreen} />
                        <Stack.Screen name="OnboardingGoal" component={OnboardingGoalScreen} />
                        <Stack.Screen name="OnboardingBaseline" component={OnboardingBaselineScreen} />
                        <Stack.Screen name="OnboardingLifestyle" component={OnboardingLifestyleScreen} />
                        <Stack.Screen name="OnboardingInterstitial" component={OnboardingInterstitialScreen} />
                        <Stack.Screen name="OnboardingSymptomGrid" component={OnboardingSymptomGridScreen} />
                        <Stack.Screen name="OnboardingAnalysis" component={OnboardingAnalysisScreen} />
                        <Stack.Screen name="OnboardingReveal" component={OnboardingRevealScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                        <Stack.Screen name="Paywall" component={PaywallScreen} />
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
                        <Stack.Screen name="MindfulnessActivity" component={MindfulnessActivityScreen} />
                        <Stack.Screen name="MovementActivity" component={MovementActivityScreen} />
                        <Stack.Screen name="NutritionActivity" component={NutritionActivityScreen} />
                        <Stack.Screen name="DailyPulse" component={DailyPulseScreen} options={{ presentation: 'modal' }} />
                        <Stack.Screen name="DailyJournal" component={DailyJournalScreen} options={{ presentation: 'modal' }} />
                        <Stack.Screen name="JournalHistory" component={JournalHistoryScreen} />
                        <Stack.Screen name="Calendar" component={CalendarScreen} />
                        <Stack.Screen name="MacroTimeline" component={MacroTimelineScreen} />
                        <Stack.Screen name="Preferences" component={PreferencesScreen} />
                        <Stack.Screen name="OnboardingData" component={OnboardingDataScreen} />
                        <Stack.Screen name="OnboardingProfile" component={OnboardingProfileScreen} />
                        <Stack.Screen name="OnboardingFriction" component={OnboardingFrictionScreen} />
                        <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
                        <Stack.Screen name="Integrations" component={IntegrationsScreen} />
                    </Stack.Navigator>
                </NavigationContainer>
            </ScoreProvider>
        </UserProvider>
    );
}
