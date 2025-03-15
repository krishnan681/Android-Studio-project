import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { StyleSheet } from "react-native";
import { AuthContext } from "./AuthContext";

// Import Screens
import Home from "./Home";
import Settings from "./Settings";
import CategorywisePromotion from "./CategorywisePromotion";
import NearbyPromotion from "./NearbyPromotion";
import MediaPartner from "./MediaPartner";
import { Text } from "react-native-gesture-handler";

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
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
<<<<<<< HEAD
          return <FontAwesome name={iconName} size={20} color={color} />;
=======
          return <FontAwesome name={iconName} size={30} color={color} />;
>>>>>>> 10ccca07ec1e523dcdb02dbaab9e737c75d1dac0
        },
        tabBarActiveTintColor: "#aa336a",
        tabBarInactiveTintColor: "#000",
        tabBarStyle: styles.tabBarStyle,
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Tab.Screen name="CategorywisePromotion" component={CategorywisePromotion} options={{ headerShown: false }} />
      <Tab.Screen name="NearbyPromotion" component={NearbyPromotion} options={{ headerShown: false }} />
      <Tab.Screen name="MediaPartner" component={MediaPartner} options={{ headerShown: false }} />
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
  tabBarText:{
    fontSize:20
  }
});

export default BottomTabs;
