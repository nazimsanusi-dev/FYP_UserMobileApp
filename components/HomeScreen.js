// // Install the following dependencies first if not installed:
// // npm install @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated

// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
// // import { NavigationContainer } from '@react-navigation/native';
// // import { createStackNavigator } from '@react-navigation/stack';
// // import ReportPage from './ReportPage';


// // Modularized Pages


// const HomeScreen = ({ navigation }) => (
//   <ImageBackground source={require('./bg.png')} style={styles.backgroundImage}>
//     <View style={styles.container}>
//       <Text style={styles.greeting}>Hello {"{User.Name}"}</Text>
//       <View style={styles.buttonGrid}>
//         <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Report')}>
//           <Text style={styles.buttonText}>REPORT</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Status')}>
//           <Text style={styles.buttonText}>STATUS</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('History')}>
//           <Text style={styles.buttonText}>HISTORY</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UserProfile')}>
//           <Text style={styles.buttonText}>USER PROFILE</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   </ImageBackground>
// );

// // const Stack = createStackNavigator();

// // export default function App() {
// //   return (
// //     <NavigationContainer>
// //       <Stack.Navigator screenOptions={{ headerShown: false }}>
// //         <Stack.Screen name="Home" component={HomeScreen} />
// //         <Stack.Screen name="Report" component={ReportPage} />
// //         <Stack.Screen name="History" component={HistoryPage} />
// //         <Stack.Screen name="Status" component={StatusPage} />
// //         <Stack.Screen name="UserProfile" component={UserProfilePage} />
// //       </Stack.Navigator>
// //     </NavigationContainer>
// //   );
// // }

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'transparent',
//   },
//   greeting: {
//     fontSize: 30,
//     marginBottom: 20,
//     color: '#fff',
//   },
//   buttonGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//   },
//   button: {
//     backgroundColor: '#90ee90',
//     padding: 20,
//     margin: 10,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 120,
//     height: 120,
//   },
//   buttonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   pageContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
// });
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, BackHandler, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, signOut } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      // Clear data cache
      await AsyncStorage.clear();

      // Sign out user
      const auth = getAuth();
      await signOut(auth);

      // Navigate to Login screen
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Hold on!",
          "Are you sure you want to go back?",
          [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel"
            },
            { text: "YES", onPress: () => BackHandler.exitApp() }
          ]
        );
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  return (
    <ImageBackground source={require('./bg.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.greeting}>Welcome !</Text>
        <View style={styles.buttonGrid}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Report')}>
            <Text style={styles.buttonText}>REPORT</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Status')}>
            <Text style={styles.buttonText}>STATUS</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UserProfile')}>
            <Text style={styles.buttonText}>PROFILE</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(240, 255, 243, 0)', // Light background color with transparency
  },
  greeting: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    margin: 10,
    borderRadius: 25, // More rounded corners
    alignItems: 'center',
    width: 150,
    shadowColor: '#000', // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    alignContent: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;