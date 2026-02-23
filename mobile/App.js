import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Onboarding
import { OnboardingGoalScreen } from './src/screens/OnboardingGoalScreen';
import { OnboardingBaselineScreen } from './src/screens/OnboardingBaselineScreen';
import { OnboardingSymptomGridScreen } from './src/screens/OnboardingSymptomGridScreen';
import { OnboardingAnalysisScreen } from './src/screens/OnboardingAnalysisScreen';

// Main App
import { DashboardScreen } from './src/screens/DashboardScreen';
import { LoggingScreen } from './src/screens/LoggingScreen';
import { HealthReportScreen } from './src/screens/HealthReportScreen';
import { CommunityScreen } from './src/screens/CommunityScreen';
import { QuizzesScreen } from './src/screens/QuizzesScreen';
import { QuizFlowScreen } from './src/screens/QuizFlowScreen';
import { DailyActivityScreen } from './src/screens/DailyActivityScreen';
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
                initialRouteName="OnboardingGoal"
            >
                {/* Onboarding Flow */}
                <Stack.Screen name="OnboardingGoal" component={OnboardingGoalScreen} />
                <Stack.Screen name="OnboardingBaseline" component={OnboardingBaselineScreen} />
                <Stack.Screen name="OnboardingSymptomGrid" component={OnboardingSymptomGridScreen} />
                <Stack.Screen name="OnboardingAnalysis" component={OnboardingAnalysisScreen} />

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
            </Stack.Navigator>
        </NavigationContainer>
    );
}
