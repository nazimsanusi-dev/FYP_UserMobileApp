import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen'; // Adjust path
import ReportPage from './components/ReportPage'; // Adjust path
// import HistoryPage from './components/HistoryPage'; // Create if needed
// import StatusPage from './components/StatusPage'; // Create if needed
// import UserProfilePage from './components/UserProfilePage'; // Create if needed
import LoginPage from './reg/LoginPage'; // Adjust path for login
import RegisterPage from './reg/RegisterPage'; // Adjust path for register
import HistoryPage from './components/HistoryPage';
import StatusPage from './components/StatusPage';
import UserProfilePage from './components/UserProfilePage';
import HistoryView from './components/HistoryView/HistoryView';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        {/* Authentication Screens */}
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Register" component={RegisterPage} />

        {/* Main Screens */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Report" component={ReportPage} />
        <Stack.Screen name="History" component={HistoryPage} />
        <Stack.Screen name="Status" component={StatusPage} />
        <Stack.Screen name="UserProfile" component={UserProfilePage} />

        <Stack.Screen name="HistoryView" component={HistoryView} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
