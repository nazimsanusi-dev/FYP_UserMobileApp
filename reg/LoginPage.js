// LoginPage.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ImageBackground,ScrollView } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../constants/firebaseConfig';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigation = useNavigation();

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const usersCollection = collection(db, 'residents');
  //       const usersSnapshot = await getDocs(usersCollection);
  //       const usersList = usersSnapshot.docs.map(doc => doc.data());
  //       setUsers(usersList);
  //       console.log(usersList);
  //     } catch (error) {
  //       console.error('Error fetching users:', error);
  //     }
  //   };

  //   fetchUsers();
  // }, []);

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Alert.alert('Login successful', 'Welcome back!');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', "Use Correct Email and Password");
    }
  };

  return (
    <ImageBackground source={require("./anime-style-clouds.jpg")} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
    
      <Text style={styles.title}>Log In</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
    
    </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex:1 ,resizeMode: " cover" },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  title: {
    fontSize: 40,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  input: {
    height: 55,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 2,
    marginBottom: 15,
    paddingHorizontal: 18,
    borderRadius: 10, // Rounded corners
    backgroundColor: '#fff', // White background
  },
  loginButton: {
    padding: 12,
    backgroundColor: '#007BFF',
    borderRadius: 25, // More rounded corners
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000', // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginTop: 10,
  },
  loginButtonText: {
    alignContent: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#28a745', // Green color for register button
    borderRadius: 25, // More rounded corners
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000', // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  usersContainer: {
    marginTop: 20,
    width: '100%',
    padding: 10,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
  },
  usersTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    alignContent: 'center',
    justifyContent: 'center',
  },
  userItem: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
});

export default LoginPage;

