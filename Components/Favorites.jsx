import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from './AuthContext'; // Import AuthContext

const Favorites = () => {
  const { userData, favorites, setFavorites } = useContext(AuthContext); // ✅ Move useContext inside the component

  const [selectedContacts, setSelectedContacts] = useState({
    Supplier: [],
    Buyer: [],
    Firms: [],
  });

  // Function to load favorites from AsyncStorage when user logs in
  const loadFavorites = async () => {
    if (!userData?.mobileno) return; // Ensure user is logged in

    try {
      const allFavorites = await AsyncStorage.getItem("favorites");
      if (allFavorites) {
        const parsedFavorites = JSON.parse(allFavorites);
        setFavorites(parsedFavorites[userData.mobileno] || { Supplier: [], Buyer: [], Firms: [] });
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  // Load favorites when component mounts or user changes
  useEffect(() => {
    loadFavorites();
  }, [userData]); // ✅ Now properly loads favorites when userData changes

  // Function to toggle selection of a contact
  const toggleSelection = (category, item) => {
    setSelectedContacts((prev) => {
      const isSelected = prev[category].some((contact) => contact.id === item.id);
      const updatedCategory = isSelected
        ? prev[category].filter((contact) => contact.id !== item.id)
        : [...prev[category], item];

      return { ...prev, [category]: updatedCategory };
    });
  };

  // Function to send SMS to selected contacts
  const sendBulkSMS = (category) => {
    const numbers = selectedContacts[category].map((item) => item.mobileno).join(",");
    if (!numbers) {
      Alert.alert("Error", "No contacts selected for SMS");
      return;
    }
    const smsUrl = `sms:${numbers}`;
    Linking.openURL(smsUrl).catch((err) => console.error("Error opening SMS:", err));
  };

  // Function to delete a contact from favorites
  const deleteFavorite = async (category, item) => {
    Alert.alert(
      "Delete Favorite",
      `Are you sure you want to remove ${item.businessname || item.person} from favorites?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            const updatedFavorites = {
              ...favorites,
              [category]: favorites[category].filter((contact) => contact.id !== item.id),
            };
            setFavorites(updatedFavorites);
            await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
          },
          style: "destructive",
        },
      ]
    );
  };

  const renderCategory = (category) => (
    <View style={styles.categoryContainer} key={category}>
      <Text style={styles.categoryTitle}>{category}</Text>

      {/* Display Selected Contacts */}
      {selectedContacts[category].length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectedContainer}>
          {selectedContacts[category].map((contact) => (
            <View key={contact.id} style={styles.selectedCard}>
              <Text style={styles.selectedText}>{contact.businessname || contact.person}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* FlatList for category */}
      {favorites[category]?.length > 0 ? (
        <FlatList
          data={favorites[category]}
          keyExtractor={(item, index) => `fav-${item.id}-${index}`}
          renderItem={({ item }) => {
            const isSelected = selectedContacts[category].some((contact) => contact.id === item.id);
            return (
              <TouchableOpacity
                style={[styles.card, isSelected && styles.selectedCardStyle]}
                onPress={() => toggleSelection(category, item)}
                onLongPress={() => deleteFavorite(category, item)}
                activeOpacity={0.7}
              >
                <View style={styles.cardContent}>
                  <View style={styles.textContainer}>
                    <Text style={styles.favoriteText}>{item.businessname || item.person}</Text>
                    {item.product ? <Text style={styles.productText}>{item.product}</Text> : null}
                    {item.city && item.pincode ? (
                      <Text style={styles.locationText}>
                        {item.city}, {item.pincode}
                      </Text>
                    ) : null}
                    {item.mobileno ? (
                      <Text style={styles.mobileText}>{item.mobileno.slice(0, 5)}xxxxx</Text>
                    ) : null}
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <Text style={styles.noFavorites}>No favorites in this category</Text>
      )}

      {/* Send SMS Button for Category */}
      {selectedContacts[category].length > 0 && (
        <TouchableOpacity style={styles.sendButton} onPress={() => sendBulkSMS(category)}>
          <MaterialIcons name="send" size={20} color="white" />
          <Text style={styles.sendButtonText}>Send SMS to Selected</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Favorites</Text>
      {["Supplier", "Buyer", "Firms"].map((category) => renderCategory(category))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#d32f2f",
    marginBottom: 8,
  },
  noFavorites: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
    marginTop: 5,
  },
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d32f2f",
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  sendButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default Favorites;
