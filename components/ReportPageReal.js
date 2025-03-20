import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

import { collection, addDoc, } from "firebase/firestore";
import { db, auth } from "../constants/firebaseConfig"; // Ensure paths to Firestore and Auth are correct
import { onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";



const ReportPage = () => {
  
  const [district, setDistrict] = useState('');
  const [location, setLocation] = useState('');
  const [wasteType, setWasteType] = useState('');
  const [issue, setIssue] = useState('');
  const [collectionTime, setCollectionTime] = useState('');
  const [recycle, setRecycle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false); // State for uploading status
  const [imageUri, setImageUri] = useState(null);
  
  
  // Ubah LAT LONG SETIAP LOKASI
  const locationsByDistrict = {
    Arau: [
      { name: 'Arau Town Center', latitude: 6.426604947708557, longitude: 100.27318368976259 },
      { name: 'Kampung Guar Sanji', latitude: 6.429, longitude: 100.275 },
      { name: 'Kampung Teluk Jambu', latitude: 6.431, longitude: 100.277 }
    ],
    Kangar: [
      { name: 'Taman Sena', latitude: 6.433, longitude: 100.279 },
      { name: 'Pasar Borong Kangar', latitude: 6.435, longitude: 100.281 },
      { name: 'Kampung Bakau', latitude: 6.437, longitude: 100.283 }
    ],
    'Padang Besar': [
      { name: 'Padang Besar Border Complex', latitude: 6.439, longitude: 100.285 },
      { name: 'Kampung Titi Tinggi', latitude: 6.441, longitude: 100.287 },
      { name: 'Kampung Baru Padang Besar', latitude: 6.443, longitude: 100.289 }
    ]
  };

  const handleLocationPicker = (selectedDistrict) => {
    setDistrict(selectedDistrict);
    setLocation('');
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.uri);
    }
  };

  const handleTakePicture = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.uri);
    }
  };

  // const handleSubmit = () => {
  //   console.log({ district, location, wasteType, issue, collectionTime, recycle, description, image });
  // }; onAuthStateChanged(auth, async (user) => {}

  const handleSubmit = async () => {
    if (!district || !location || !wasteType || !issue || !collectionTime || !description) {
      alert("Please fill in all fields.");
      return;
    }
  
    try {
      
      // Listen for authentication state
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          let imageUrl = null;

          if (image) {
            try{
            // Upload image to Firebase Storage
            const storage = getStorage();
            const imageRef = ref(storage, `reports/${user.uid}/${Date.now()}.jpg`); // Unique file name
            const response = await fetch(image);
            const blob = await response.blob();
  
            await uploadBytes(imageRef, blob); // Upload image
            imageUrl = await getDownloadURL(imageRef); // Get download URL
            }
            catch (imageError) {
              console.error("Image upload failed:", imageError);
              alert("Image upload failed. Please try again.");
              return;
            }
          }
          
          
          setUploading(true);
          
          // Save report data to Firestore
          await addDoc(collection(db, "residents", user.uid, "reports"), {
            User_ID: user.uid,
            district,
            location,
            wasteType,
            issue,
            collectionTime,
            recycle,
            description,
            image: imageUrl, // Store image URL in Firestore
            timestamp: new Date(),
            Month_Year: new Date().toLocaleString('default', { month: '2-digit', year: 'numeric' }),
            Year: new Date().getFullYear(),
            status: "Pending", // Default status
            Date_Collection: '',
            Trip_ID: '',
            //Report_ID : reportRef.id,
            latitude: locationsByDistrict[district].find(loc => loc.name === location)?.latitude || null,
            longitude: locationsByDistrict[district].find(loc => loc.name === location)?.longitude || null,
          });
  
          alert("Report submitted successfully!");
  
          // Clear form inputs
          setDistrict('');
          setLocation('');
          setWasteType('');
          setIssue('');
          setCollectionTime('');
          setRecycle('');
          setDescription('');
          setImage(null);
  
          
          setUploading(false);
          navigation.replace('home');

        } else {
          // User is signed out
        }
      });
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("An error occurred while submitting the report.");
    }
  };
  

  return (
    <ImageBackground source={require('./bg.png')} style={styles.backgroundImage}>
    <ScrollView contentContainerStyle={styles.pageContainer}>
      <Text style={styles.header}>Report an Issue</Text>

      <Picker
        selectedValue={district}
        onValueChange={handleLocationPicker}
        style={styles.picker}
      >
        <Picker.Item label="Select District" value="" />
        <Picker.Item label="Arau" value="Arau" />
        <Picker.Item label="Kangar" value="Kangar" />
        <Picker.Item label="Padang Besar" value="Padang Besar" />
      </Picker>

      {district && (
        <Picker
          selectedValue={location}
          onValueChange={(itemValue) => setLocation(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Location" value="" />
          {locationsByDistrict[district].map((loc, index) => (
            <Picker.Item key={index} label={loc.name} value={loc.name} />
          ))}
        </Picker>
      )}

      <Picker
        selectedValue={wasteType}
        onValueChange={(itemValue) => setWasteType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Waste Type" value="" />
        <Picker.Item label="Mix Waste" value="Mix Waste" />
        <Picker.Item label="Organic Waste" value="Organic Waste" />
        <Picker.Item label="Bulky Waste" value="Bulky Waste" />
        <Picker.Item label="Garden Waste" value="Garden Waste" />
        <Picker.Item label="Plastic Waste" value="Plastic Waste" />
        <Picker.Item label="Paper Waste" value="Paper Waste" />
        <Picker.Item label="Glass Waste" value="Glass Waste" />
        <Picker.Item label="Textile Waste" value="Textile Waste" />
        
      </Picker>

      <Picker
        selectedValue={issue}
        onValueChange={(itemValue) => setIssue(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Issue" value="" />
        <Picker.Item label="Missed Collection" value="Missed Collection" />
        <Picker.Item label="Odor Problems" value="Odor Problems" />
        <Picker.Item label="Illegal Dumping" value="Illegal Dumping" />
        <Picker.Item label="Delayed Collection" value="Delayed Collection" />
        <Picker.Item label="Pest Infestation" value="Pest Infestation" />
        <Picker.Item label="Spilled Waste" value="Spilled Waste" />
        <Picker.Item label="Bin Overflow" value="Bin Overflow" />
        <Picker.Item label="Recycling Bin Contamination" value="Recycling Bin Contamination" />
        <Picker.Item label="Incomplete Collection" value="Incomplete Collection" />
        <Picker.Item label="Broken/Damaged Bin" value="Broken/Damaged Bin" />
        <Picker.Item label="Lost/Stolen Bin" value="Lost/Stolen Bin" />
        <Picker.Item label="Inadequate Recycling Options" value="Inadequate Recycling Options" />
        <Picker.Item label="No Issue" value="No Issue" />

      </Picker>

      <Picker
        selectedValue={collectionTime}
        onValueChange={(itemValue) => setCollectionTime(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Collection Time" value="" />
        <Picker.Item label="Early morning (4 AM - 7 AM)" value="Early morning" />
        <Picker.Item label="Morning (7 AM - 11 AM)" value="Morning" />
        <Picker.Item label="Afternoon (2 PM - 6 PM)" value="Afternoon" />
        <Picker.Item label="Midnight (10 PM - 12 PM)" value="Midnight" />
      </Picker>

      <Picker
        selectedValue={recycle}
        onValueChange={(itemValue) => setRecycle(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Preferred Recycle?" value="" />
        <Picker.Item label="YES" value="YES" />
        <Picker.Item label="NO" value="NO" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

        {/* Image Upload and Preview */}
        <View style={styles.imageContainer}>
          <TouchableOpacity style={styles.button} onPress={handleTakePicture}>
            <Text style={styles.buttonText}>Take Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handlePickImage}>
            <Text style={styles.buttonText}>Upload Picture</Text>
          </TouchableOpacity>
        </View>
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
        {uploading ? 'Uploading...' : "Submit Report"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
    </ImageBackground>
  );
  
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  picker: {
    height: 50,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#6200ee',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  submitButton: {
    backgroundColor: '#2196f3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ReportPage;

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   ImageBackground,
//   Image,
//   ActivityIndicator,
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import * as ImagePicker from 'expo-image-picker';
// import { collection, addDoc } from "firebase/firestore";
// import { db, auth } from "../constants/firebaseConfig"; // Ensure Firebase is correctly configured
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// const ReportPage = () => {
//   const [district, setDistrict] = useState('');
//   const [location, setLocation] = useState('');
//   const [wasteType, setWasteType] = useState('');
//   const [issue, setIssue] = useState('');
//   const [collectionTime, setCollectionTime] = useState('');
//   const [recycle, setRecycle] = useState('');
//   const [description, setDescription] = useState('');
//   const [imageUri, setImageUri] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   const locationsByDistrict = {
//     Arau: ['Arau Town Center', 'Kampung Guar Sanji', 'Kampung Teluk Jambu'],
//     Kangar: ['Taman Sena', 'Pasar Borong Kangar', 'Kampung Bakau'],
//     'Padang Besar': ['Padang Besar Border Complex', 'Kampung Titi Tinggi', 'Kampung Baru Padang Besar'],
//   };

//   const handlePickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 0.5,
//     });

//     if (!result.canceled) {
//       setImageUri(result.uri);
//     }
//   };

//   const handleTakePicture = async () => {
//     const result = await ImagePicker.launchCameraAsync({
//       allowsEditing: true,
//       quality: 0.5,
//     });

//     if (!result.canceled) {
//       setImageUri(result.uri);
//     }
//   };

//   const uploadImageAndGetUrl = async (imageUri) => {
//     try {
//       const user = auth.currentUser;
//       if (!user) {
//         throw new Error("User not logged in.");
//       }

//       const storage = getStorage();
//       const imageName = `images/reports/${user.uid}/${Date.now()}.jpg`; // Unique file name
//       const imageRef = ref(storage, imageName);
//       const response = await fetch(imageUri);
//       const blob = await response.blob();

//       await uploadBytes(imageRef, blob); // Upload image
//       const imageUrl = await getDownloadURL(imageRef); // Get download URL
//       return imageUrl;
//     } catch (error) {
//       console.error("Image upload failed:", error);
//       throw error;
//     }
//   };

//   const handleSubmit = async () => {
//     if (!district || !location || !wasteType || !issue || !collectionTime || !description) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     if (!imageUri) {
//       alert("Please upload or take a picture.");
//       return;
//     }

//     setUploading(true);

//     try {
//       const imageUrl = await uploadImageAndGetUrl(imageUri);

//       const user = auth.currentUser;
//       if (!user) {
//         throw new Error("User not logged in.");
//       }

//       // Save report data to Firestore
//       await addDoc(collection(db, "users", user.uid, "reports"), {
//         district,
//         location,
//         wasteType,
//         issue,
//         collectionTime,
//         recycle,
//         description,
//         image: imageUrl, // Save the image URL
//         timestamp: new Date(),
//       });

//       alert("Report submitted successfully!");

//       // Clear form inputs
//       setDistrict('');
//       setLocation('');
//       setWasteType('');
//       setIssue('');
//       setCollectionTime('');
//       setRecycle('');
//       setDescription('');
//       setImageUri(null);
//     } catch (error) {
//       console.error("Error submitting report:", error);
//       alert("An error occurred while submitting the report.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <ImageBackground source={require('./bg.png')} style={styles.backgroundImage}>
//       <ScrollView contentContainerStyle={styles.pageContainer}>
//         <Text style={styles.header}>Report an Issue</Text>

//         {/* District Picker */}
//         <Picker
//           selectedValue={district}
//           onValueChange={setDistrict}
//           style={styles.picker}
//         >
//           <Picker.Item label="Select District" value="" />
//           <Picker.Item label="Arau" value="Arau" />
//           <Picker.Item label="Kangar" value="Kangar" />
//           <Picker.Item label="Padang Besar" value="Padang Besar" />
//         </Picker>

//         {/* Location Picker */}
//         {district && (
//           <Picker
//             selectedValue={location}
//             onValueChange={setLocation}
//             style={styles.picker}
//           >
//             <Picker.Item label="Select Location" value="" />
//             {locationsByDistrict[district].map((loc, index) => (
//               <Picker.Item key={index} label={loc} value={loc} />
//             ))}
//           </Picker>
//         )}

//         {/* Waste Type Picker */}
//         <Picker
//           selectedValue={wasteType}
//           onValueChange={setWasteType}
//           style={styles.picker}
//         >
//           <Picker.Item label="Select Waste Type" value="" />
//           <Picker.Item label="Mix Waste" value="Mix Waste" />
//           <Picker.Item label="Organic Waste" value="Organic Waste" />
//           <Picker.Item label="Bulky Waste" value="Bulky Waste" />
//           <Picker.Item label="Garden Waste" value="Garden Waste" />
//           <Picker.Item label="Plastic Waste" value="Plastic Waste" />
//           <Picker.Item label="Paper Waste" value="Paper Waste" />
//           <Picker.Item label="Glass Waste" value="Glass Waste" />
//           <Picker.Item label="Textile Waste" value="Textile Waste" />
//         </Picker>

//         {/* Issue Picker */}
//         <Picker
//           selectedValue={issue}
//           onValueChange={setIssue}
//           style={styles.picker}
//         >
//           <Picker.Item label="Select Issue" value="" />
//           <Picker.Item label="Missed Collection" value="Missed Collection" />
//           <Picker.Item label="Odor Problems" value="Odor Problems" />
//           <Picker.Item label="Illegal Dumping" value="Illegal Dumping" />
//           <Picker.Item label="Delayed Collection" value="Delayed Collection" />
//           <Picker.Item label="Pest Infestation" value="Pest Infestation" />
//           <Picker.Item label="Spilled Waste" value="Spilled Waste" />
//         </Picker>

//         {/* Image Upload and Preview */}
//         <View style={styles.imageContainer}>
//           <TouchableOpacity style={styles.button} onPress={handleTakePicture}>
//             <Text style={styles.buttonText}>Take Picture</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.button} onPress={handlePickImage}>
//             <Text style={styles.buttonText}>Upload Picture</Text>
//           </TouchableOpacity>
//         </View>
//         {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

//         {/* Submit Button */}
//         <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//           <Text style={styles.submitButtonText}>
//             {uploading ? <ActivityIndicator color="#fff" /> : "Submit Report"}
//           </Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   backgroundImage: { flex: 1, resizeMode: "cover" },
//   pageContainer: { flexGrow: 1, padding: 20 },
//   header: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
//   picker: { height: 50, borderWidth: 1, borderColor: "#ccc", marginBottom: 15 },
//   input: { borderWidth: 1, borderColor: "#ccc", marginBottom: 15 },
//   imageContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
//   button: { padding: 10, backgroundColor: "#4caf50", borderRadius: 5 },
//   buttonText: { color: "#fff", textAlign: "center" },
//   imagePreview: { width: "100%", height: 200, marginVertical: 10 },
//   submitButton: { padding: 15, backgroundColor: "#2196F3", borderRadius: 5 },
//   submitButtonText: { color: "#fff", textAlign: "center" },
// });

// export default ReportPage;
