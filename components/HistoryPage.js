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
//                         {/* <Text>{item.district}</Text>
//                         <Text>{item.location}</Text>
//                         <Text>{item.wasteType}</Text>
//                         <Text>{item.issue}</Text>
//                         <Text>{item.collectionTime}</Text>
//                         <Text>{item.recycle ? 'Recycle' : 'No Recycle'}</Text>
//                         <Text>{item.description}</Text>
//                         <Text>{item.status}</Text>
//                         <Text>{item.MonthYear}</Text>
//                         <Text>{item.Year}</Text> */}
//                         <Button
//                             title={`Go to ${item.id}`}
//                             onPress={() => handleNavigate(item.id)}
//                         />
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
import { View, Text, Button, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const HistoryPage = () => {
    const navigation = useNavigation();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const db = getFirestore();
    const auth = getAuth();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const user = auth.currentUser;

                if (!user) {
                    throw new Error("No user signed in.");
                }

                const reportsCollection = collection(db, "residents", user.uid, "reports");
                const querySnapshot = await getDoc(reportsCollection);

                if (querySnapshot.empty) {
                    setReports([]);
                } else {
                    const reportsList = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setReports(reportsList);
                }
            } catch (err) {
                console.error("Error fetching reports:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading reports...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>History Page</Text>
            {reports.length === 0 ? (
                <Text>No reports found.</Text>
            ) : (
                <FlatList
                    data={reports}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.reportItem}>
                            <Text>{item.district}</Text>
                            <Button
                                title={`View Report ${item.id}`}
                                onPress={() => navigation.navigate('HistoryView', { reportId: item.id })}
                            />
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    reportItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
    },
});

export default HistoryPage;
