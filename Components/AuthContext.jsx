import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

// Create Auth Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [userData, setUserData] = useState("");
  const [favorites, setFavorites] = useState({ Supplier: [], Buyer: [], Firms: [] });

  // Function to load favorites for the logged-in user
  const loadFavorites = async (mobileNumber) => {
    if (!mobileNumber) return;

    try {
      const allFavorites = await AsyncStorage.getItem("favorites");
      const parsedFavorites = allFavorites ? JSON.parse(allFavorites) : {};
      
      // Set favorites for the logged-in user without clearing them on logout
      setFavorites(parsedFavorites[mobileNumber] || { Supplier: [], Buyer: [], Firms: [] });
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  // Login Function
  const Login = async (username, password, navigation) => {
    if (!username) {
      Alert.alert("Error", "Please enter your registered mobile number.");
      return;
    }

    if (password !== "signpost") {
      Alert.alert("Invalid Password", "Please enter the correct password.");
      return;
    }

    try {
      const response = await axios.post(
        "https://signpostphonebook.in/test_auth_for_new_database.php",
        { mobileno: username }
      );

      if (response.data.valid) {
        setUser(response.data.businessname || response.data.person);
        setUserData(response.data);

        // Load favorites for this user (persistent across logins)
        loadFavorites(response.data.mobileno);

        navigation.navigate("Home");
      } else {
        Alert.alert("User Not Found", "Please sign up.");
        navigation.navigate("Signup");
      }
    } catch (error) {
      Alert.alert("Login Error", "Unable to login. Please try again later.");
      console.error("Login Error:", error);
    }
  };

  // Logout Function (Do NOT clear favorites)
  const logout = (navigation) => {
    setUser("");
    setUserData("");
    navigation.navigate("Login");
  };

  return (
    <AuthContext.Provider value={{ user, userData, favorites, setFavorites, setUserData, Login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
