// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { getFirestore, doc, getDoc } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth'; // Import auth instance

// const HistoryPage = () => {
//     return (
//         <View style={styles.container}>
//             <Text style={styles.text}>Hello</Text>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     text: {
//         fontSize: 20,
//     },
// });

// export default HistoryPage;

// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { getFirestore, doc, getDoc } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth'; // Import auth instance

// const UserProfile = () => {
    
//     const [reportDetails, setReportDetails] = useState(null);
//     const db = getFirestore();
//     const auth = getAuth(); // Get the auth instance

//     useEffect(() => {
//         const fetchReportDetails = async () => {
//             try {
//                 const user = auth.currentUser; // Get the currently logged-in user
//                 if (!user) {
//                     console.error("User not logged in.");
//                     return;
//                 }

//                 const docRef = doc(db, "residents" );
//                 const docSnap = await getDoc(docRef);

//                 if (docSnap.exists()) {
//                     setReportDetails(docSnap.data());
//                 } else {
//                     console.log("No such document!");
//                 }
//             } catch (error) {
//                 console.error("Error fetching report details:", error);
//             }
//         };

//         fetchReportDetails();
//     }, [db]);

//     if (!reportDetails) {
//         return (
//             <View style={styles.container}>
//                 <Text>Loading User Profile...</Text>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}> User Profile </Text>
//             <Text>Email: {reportDetails.email}</Text>
//             <Text>Password: {reportDetails.password}</Text>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 20,
//     },
// });

// export default UserProfile;


// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { getAuth } from 'firebase/auth';
// import { getFirestore, doc, getDoc } from 'firebase/firestore';

// const UserProfilePage = () => {
//     const [reportDetails, setReportDetails] = useState(null);
//     const auth = getAuth();
//     const db = getFirestore();

//     useEffect(() => {
//         const fetchReportDetails = async () => {
//             try {
//                 const user = auth.currentUser; // Get the currently logged-in user
//                 if (!user) {
//                     console.error("User not logged in.");
//                     return;
//                 }

//                 const docRef = doc(db, "residents", user.uid); // Correct document reference
//                 const docSnap = await getDoc(docRef);

//                 if (docSnap.exists()) {
//                     setReportDetails(docSnap.data());
//                 } else {
//                     console.log("No such document!");
//                 }
//             } catch (error) {
//                 console.error("Error fetching report details:", error);
//             }
//         };

//         fetchReportDetails();
//     }, [db]);

//     if (!reportDetails) {
//         return (
//             <View style={styles.container}>
//                 <Text>Loading User Profile...</Text>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             <Text>User Profile</Text>
//             <Text>District: {reportDetails.email}</Text>
//             <Text>Address: {reportDetails.password}</Text>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
// });

// export default UserProfilePage;
//************************************************ */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView,ImageBackground } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const UserProfilePage = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    console.error("User not logged in.");
                    setLoading(false);
                    return;
                }

                const docRef = doc(db, "residents", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUserDetails(docSnap.data());
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [db]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text style={styles.loadingText}>Loading Profile...</Text>
            </View>
        );
    }

    if (!userDetails) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error: Unable to load user profile.</Text>
            </View>
        );
    }

    return (
        <ImageBackground source={require("./bg.png")} style={styles.backgroundImage}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>User Profile</Text>

                <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                        <Ionicons name="person-outline" size={24} color="#555" style={styles.icon} />
                        <Text style={styles.infoText}>{userDetails.fullName}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="mail-outline" size={24} color="#555" style={styles.icon} />
                        <Text style={styles.infoText}>Email: {userDetails.email}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="call-outline" size={24} color="#555" style={styles.icon} />
                        <Text style={styles.infoText}>Phone: {userDetails.phoneNumber}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={24} color="#555" style={styles.icon} />
                        <Text style={styles.infoText}>Date of Birth: {userDetails.dateOfBirth}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="finger-print-outline" size={24} color="#555" style={styles.icon} />
                        <Text style={styles.infoText}>ID Number: {userDetails.idNumber}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="time-outline" size={24} color="#555" style={styles.icon} />
                        <Text style={styles.infoText}>Registered On: {userDetails.timestamp?.toDate().toLocaleDateString()}</Text>
                    </View>
                </View>
            </View>
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
        backgroundColor: '#f9f9f9',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        width: '100%',
        maxWidth: 400,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    infoContainer: {
        width: '100%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 5,
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    icon: {
        marginRight: 10,
    },
    infoText: {
        fontSize: 16,
        color: '#555',
        flexShrink: 1,
        fontWeight : 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: '#d9534f',
    },
});

export default UserProfilePage;
