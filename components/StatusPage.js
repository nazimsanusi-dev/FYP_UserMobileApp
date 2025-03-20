import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image,ScrollView,ImageBackground } from "react-native";
import { auth, db } from "../constants/firebaseConfig"; // Ensure correct imports
import { collection, query, where, onSnapshot, orderBy, limit, startAfter,getDocs } from "firebase/firestore";

const ReportsList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          alert("User not authenticated.");
          return;
        }

        // Reference the `reports` subcollection under the authenticated user's `residents` document
        const reportsRef = collection(db, "residents", user.uid, "reports");
        const q = query(reportsRef, where("status", "in", ["Pending", "Success"]), orderBy("timestamp", "desc"), limit(10)); // Fetch first 10 reports

        // Real-time listener for the reports
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const reportsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Sort reports to have "Pending" first
          reportsData.sort((a, b) => {
            if (a.status === "Pending" && b.status !== "Pending") return -1;
            if (a.status !== "Pending" && b.status === "Pending") return 1;
            return 0;
          });

          setReports(reportsData);
          setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
          setLoading(false);
        });

        return unsubscribe; // Clean up the listener when the component unmounts
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    const unsubscribe = fetchReports();

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe(); // Clean up the listener when the component unmounts
      }
    };
  }, []);

  const fetchMoreReports = async () => {
    if (loadingMore || !lastVisible) return;

    setLoadingMore(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("User not authenticated.");
        return;
      }

      // Reference the `reports` subcollection under the authenticated user's `residents` document
      const reportsRef = collection(db, "residents", user.uid, "reports");
      const q = query(reportsRef, where("status", "in", ["Pending", "Success"]), orderBy("timestamp", "desc"), startAfter(lastVisible), limit(10)); // Fetch next 10 reports

      const snapshot = await getDocs(q);
      const reportsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort reports to have "Pending" first
      reportsData.sort((a, b) => {
        if (a.status === "Pending" && b.status !== "Pending") return -1;
        if (a.status !== "Pending" && b.status === "Pending") return 1;
        return 0;
      });

      setReports((prevReports) => [...prevReports, ...reportsData]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setLoadingMore(false);
    } catch (error) {
      console.error("Error fetching more reports:", error);
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading Reports...</Text>
      </View>
    );
  }

  if (reports.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No Report Create</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.location}</Text>
        <Text style={styles.subtitle}>Issue: {item.issue}</Text>
        <Text style={styles.subtitle}>
          Date: {new Date(item.timestamp?.seconds * 1000).toLocaleDateString()}
        </Text>
        <Text style={styles.subtitlestatus}>Status: {item.status}</Text>
        <Text style={styles.subtitle}>Report ID: {item.id_report}</Text>
        
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={require('./bg.png')} style={styles.backgroundImage}>
    <View style={styles.container}>
      <Text style={styles.header}>My Reports</Text>
      <FlatList
        data={reports}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        onEndReached={fetchMoreReports}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore && <Text style={styles.loadingText}>Loading more...</Text>}
      />
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
    backgroundColor: "#0000",
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
    overflow: "hidden",
  },
  image: {
    width: 100,
    height: 140,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  info: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  subtitlestatus: {
    fontSize: 14,
    color: "#000",
    marginTop: 5,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#999",
  },
  emptyText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#555",
    textAlign: "center",
  },
});

export default ReportsList;