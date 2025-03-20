import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { db, auth, storage } from "../constants/firebaseConfig"; // Ensure correct imports
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp, doc,updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ReportPageReal = () => {
  const [district, setDistrict] = useState("");
  const [location, setLocation] = useState("");
  const [wasteType, setWasteType] = useState("");
  const [issue, setIssue] = useState("");
  const [collectionTime, setCollectionTime] = useState("");
  const [date_collection, setDate_collection] = useState("");
  const [recycle, setRecycle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);




  const locationsByDistrict = {
    Arau: [
      { name: "Arau Town Center", latitude: 6.42928, longitude: 100.27381 },
      { name: "Kampung Guar Sanji", latitude: 6.41578, longitude: 100.27760 }, 
      { name: "Pekan Pauh", latitude: 6.43523, longitude: 100.298455 },
      { name: "UniMAP Kampus Pauh", latitude: 6.46091, longitude: 100.34576 },
    ],
    Kangar: [
      { name: "Taman Sena Indah", latitude: 6.44694, longitude: 100.20585 },
      { name: "Pasar Borong Kangar", latitude: 6.43464, longitude: 100.20137 },
      { name: "Taman Sri Bakong", latitude: 6.424183, longitude: 100.20921 },
    ],
    "Padang Besar": [
      { name: "Padang Besar Border Complex", latitude: 6.65989, longitude: 100.32391 },
      { name: "Kampung Titi Tinggi", latitude: 6.63659, longitude: 100.25974 },
      { name: "Felda Rimba Emas", latitude: 6.64076, longitude: 100.29740 }, 
    ],
  };

  const handleLocationPicker = (selectedDistrict) => {
    setDistrict(selectedDistrict);
    setLocation("");
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleTakePicture = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!imageUri) return null;

    try {
      const blob = await fetch(imageUri).then((res) => res.blob());
      const filename = `reports/${auth.currentUser.uid}/${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);

      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress.toFixed(2));
        },
        (error) => {
          console.error("Image upload failed:", error);
        }
      );

      await uploadTask;
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!district || !location  || !description || !wasteType || !issue || !collectionTime || !recycle) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setUploading(true);

      let imageUrl = null;
      if (imageUri) {
        imageUrl = await uploadImage();
      }

      const user = auth.currentUser;
      if (!user) {
        alert("User not authenticated.");
        return;
      }
      

      // Add a new document into database with a generated id.
      const subcollec = await addDoc(collection(db, "residents", user.uid, "reports"), {
        id_user: user.uid.substring(0, 5),
        district,
        date_collection,
        location,
        wasteType,
        issue,
        collectionTime,
        recycle,
        description,
        imageUrl: imageUrl || "",
        timestamp: serverTimestamp(),
        status: "Pending",
        latitude: locationsByDistrict[district]?.find((loc) => loc.name === location)?.latitude || null,
        longitude: locationsByDistrict[district]?.find((loc) => loc.name === location)?.longitude || null,
      });

      // Get the ID of the newly created document
      const newDocID = subcollec.id;

      // Update the document with the Report_ID
      await updateDoc(doc(db, "residents", user.uid, "reports", newDocID), {
        id_report: newDocID.substring(0, 5),
        
      });
      
  
      alert("Report submitted successfully!");
      setDistrict("");
      setLocation("");
      setDate_collection("");
      setWasteType("");
      setIssue("");
      setCollectionTime("");
      setRecycle("");
      setDescription("");
      setImageUri(null);
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("An error occurred while submitting the report.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ImageBackground source={require("./bg.png")} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.pageContainer}>
        <Text style={styles.header}>Report an Issue</Text>

        <Picker selectedValue={district} onValueChange={handleLocationPicker} style={styles.picker}>
          <Picker.Item label="Select District" value="" />
          <Picker.Item label="Arau" value="Arau" />
          <Picker.Item label="Kangar" value="Kangar" />
          <Picker.Item label="Padang Besar" value="Padang Besar" />
        </Picker>

        {district && (
          <Picker selectedValue={location} onValueChange={(value) => setLocation(value)} style={styles.picker}>
            <Picker.Item label="Select Location" value="" />
            {locationsByDistrict[district]?.map((loc, index) => (
              <Picker.Item key={index} label={loc.name} value={loc.name} />
            ))}
          </Picker>
        )}

        {/* Other Pickers and Text Inputs */}
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
                <Picker.Item label="Prefer Collection Time" value="" />
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
                <Picker.Item label="Prefer Recycle?" value="" />
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

        <View style={styles.imageContainer}>
          <TouchableOpacity style={styles.button} onPress={handleTakePicture}>
            <Text style={styles.buttonText}>Take Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handlePickImage}>
            <Text style={styles.buttonText}>Upload Picture</Text>
          </TouchableOpacity>
        </View>

        {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            {uploading ? `Uploading: ${uploadProgress}%` : "Submit Report"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flexGrow:1 ,resizeMode: " fill" },
  pageContainer: { flexGrow: 1, padding: 20 },
  header: { fontSize: 30, fontWeight: "bold", color: "#000", textAlign: "center", marginBottom: 20, marginTop: 80 },
  picker: { height: 50, marginBottom: 15, backgroundColor: "#fff", borderRadius: 20 },
  input: { backgroundColor: "#fff", borderRadius: 10, padding: 10, fontSize: 16, marginBottom: 20 },
  imageContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  button: { flex: 1, backgroundColor: "#6200ee", padding: 10, marginHorizontal: 5, borderRadius: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  imagePreview: { width: "100%", height: 200, borderRadius: 10, marginVertical: 10 },
  submitButton: { backgroundColor: "#2196f3", padding: 15, borderRadius: 10, alignItems: "center" },
  submitButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default ReportPageReal;
