// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { getFirestore, collection, getDocs } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';

// const HistoryPage = () => {
//     const navigation = useNavigation();
//     const [reports, setReports] = useState([]);
//     const db = getFirestore();
//     const auth = getAuth();

//     useEffect(() => {
//         const fetchReports = async () => {
//             const user = auth.currentUser;
//             if (user) {
//                 const querySnapshot = await getDocs(collection(db, "residents", user.uid, "reports"));
//                 const reportsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//                 setReports(reportsList);
//             }
//         };

//         fetchReports();
//     }, []);

//     const handleNavigate = (reportId) => {
//         navigation.navigate('HistoryView', { reportId });
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.text}>History Page</Text>
//             <FlatList
//                 data={reports}
//                 keyExtractor={item => item.id}
//                 renderItem={({ item }) => (
//                     <View style={styles.reportItem}>
//                         <Text>{item.district}</Text>
//                         <Text>{item.location}</Text>
//                         <Text>{item.wasteType}</Text>
//                         <Text>{item.issue}</Text>
//                         <Text>{item.collectionTime}</Text>
//                         <Text>{item.recycle ? 'Recycle' : 'No Recycle'}</Text>
//                         <Text>{item.description}</Text>
//                         <Text>{item.status}</Text>
//                         <Text>{item.MonthYear}</Text>
//                         <Text>{item.Year}</Text>
                        
//                     </View>
//                 )}
//             />
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
//     reportItem: {
//         padding: 10,
//         borderBottomWidth: 1,
//         borderBottomColor: '#ccc',
//     },
// });

// export default HistoryPage;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import auth instance

const HistoryView = ({ route }) => {
    const { reportId } = route.params; // Retrieve reportId passed from HistoryPage
    const [reportDetails, setReportDetails] = useState(null);
    const db = getFirestore();
    const auth = getAuth(); // Get the auth instance

    useEffect(() => {
        const fetchReportDetails = async () => {
            try {
                const user = auth.currentUser; // Get the currently logged-in user
                if (!user) {
                    console.error("User not logged in.");
                    return;
                }

                const docRef = doc(db, "residents", user.uid, "reports", reportId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setReportDetails(docSnap.data());
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching report details:", error);
            }
        };

        fetchReportDetails();
    }, [reportId]);

    if (!reportDetails) {
        return (
            <View style={styles.container}>
                <Text>Loading report details...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Report Details</Text>
            <Text>District: {reportDetails.district}</Text>
            <Text>Location: {reportDetails.location}</Text>
            <Text>Waste Type: {reportDetails.wasteType}</Text>
            <Text>Issue: {reportDetails.issue}</Text>
            <Text>Collection Time: {reportDetails.collectionTime}</Text>
            <Text>Recycle: {reportDetails.recycle ? "Yes" : "No"}</Text>
            <Text>Description: {reportDetails.description}</Text>
            <Text>Status: {reportDetails.status}</Text>
            <Text>Month/Year: {reportDetails.MonthYear}</Text>
            <Text>Year: {reportDetails.Year}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default HistoryView;
