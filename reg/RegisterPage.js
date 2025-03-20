import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView,ImageBackground } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../constants/firebaseConfig';
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../constants/firebaseConfig";

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!fullName || !phoneNumber || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "residents", user.uid), {
        fullName,
        nickname,
        phoneNumber,
        dateOfBirth,
        gender,
        idNumber,
        email,
        password, // Replace with a hashed password for production
        // Storing plain passwords is not secure; this is for demonstration purposes
        timestamp: Timestamp.now('date'),
        Id: user.uid.substring(0,5) // Add more fields as needed
      });

      Alert.alert('Registration successful', 'You can now log in.');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Registration Error', error.message);
    }
  };

  return (
    <ImageBackground source={require("./anime-style-clouds.jpg")} style={styles.backgroundImage}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nickname (Mr/Mrs/Ms/Dr)"
        value={nickname}
        onChangeText={setNickname}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
      />
      <TextInput
        style={styles.input}
        placeholder="Gender (Male/Female)"
        value={gender}
        onChangeText={setGender}
      />
      <TextInput
        style={styles.input}
        placeholder="Identification Number"
        value={idNumber}
        onChangeText={setIdNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
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
  title: { fontSize: 28, marginBottom: 20, fontWeight: 'bold', color: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: '100%',
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default RegisterPage;
