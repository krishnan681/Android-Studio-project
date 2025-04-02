import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { StyleSheet } from "react-native";
import { AuthContext } from "./AuthContext";
import { Alert } from "react-native";

// Import Screens
import Home from "./Home";
import Settings from "./Settings";
import CategorywisePromotion from "./CategorywisePromotion";
import NearbyPromotion from "./NearbyPromotion";
import MediaPartner from "./MediaPartner";
import Login from "./Login"; // Import Login screen

const Tab = createBottomTabNavigator();

const BottomTabs = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  // Function to handle restricted navigation
  const handleRestrictedNavigation = (navigation, screenName) => {
    if (!user) {
      Alert.alert("Restricted Access", "You need to log in.");
      navigation.navigate("Login"); // Redirect to Login screen
      return;
    }
    navigation.navigate(screenName); // Navigate to the requested screen
  };
  

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "CategorywisePromotion":
              iconName = "th-large";
              break;
            case "NearbyPromotion":
              iconName = "map-marker";
              break;
            case "MediaPartner":
              iconName = "users";
              break;
            case "Settings":
              iconName = "cog";
              break;
            default:
              iconName = "question-circle";
          }
          return <FontAwesome name={iconName} size={30} color={color} />;
        },
        tabBarActiveTintColor: "#aa336a",
        tabBarInactiveTintColor: "#000",
        tabBarStyle: styles.tabBarStyle,
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />

      <Tab.Screen
        name="CategorywisePromotion"
        component={user ? CategorywisePromotion : Login}
        options={{ headerShown: false }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!user) {
              e.preventDefault();
              handleRestrictedNavigation(navigation, "CategorywisePromotion");
            }
          },
        })}
        
      />

      <Tab.Screen
        name="NearbyPromotion"
        component={user ? NearbyPromotion : Login}
        options={{ headerShown: false }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!user) {
              e.preventDefault();
              handleRestrictedNavigation(navigation, "NearbyPromotion");
            }
          },
        })}
        
      />

      <Tab.Screen
        name="MediaPartner"
        component={user ? MediaPartner : Login}
        options={{ headerShown: false }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!user) {
              e.preventDefault();
              handleRestrictedNavigation(navigation, "MediaPartner");
            }
          },
        })}
        
      />

      <Tab.Screen name="Settings" component={Settings} options={{ headerShown: true }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    position: "relative",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 60,
  },
});

export default BottomTabs;
