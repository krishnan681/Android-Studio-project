import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider } from "./Components/AuthContext";
import OnboardingScreen from "./Components/OnboardingScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';
import "react-native-gesture-handler";
 

// Import Screens
import BottomTabs from "./Components/BottomTabs";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Details from "./Components/Details";
import Profile from "./Components/Profile";
import Coupons from "./Components/Coupons";
import AdminPage from "./Components/Admin/AdminPage";
import UserGuide from "./Components/UserGuide";
import Favorites from "./Components/Favorites";


const Stack = createStackNavigator();
 
const App = () => {

  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const value = await AsyncStorage.getItem("isFirstLaunch");
        if (value === null) {
          setIsFirstLaunch(true);
          await AsyncStorage.setItem("isFirstLaunch", "false"); // Set flag
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error("AsyncStorage error:", error);
      }
    };
    checkFirstLaunch();
  }, []);

  if (isFirstLaunch === null) {
    return null; // Prevent rendering until check is complete
  }




  return (
    <AuthProvider>
    <NavigationContainer>
      <Stack.Navigator>
        {isFirstLaunch && (
          <Stack.Screen name="OnboardingScreen" component={OnboardingScreen}  options={{ headerShown: false }} />
        )}
        <Stack.Screen name="BottomTabs" component={BottomTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
        <Stack.Screen name="Details" component={Details} options={{ headerShown: true }} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="Coupons" component={Coupons} options={{ headerShown: true }} />
        <Stack.Screen name="AdminPage" component={AdminPage} options={{ headerShown: true }} />
        <Stack.Screen name="UserGuide" component={UserGuide} options={{ headerShown: true }} />
        <Stack.Screen name="Favorites" component={Favorites} options={{ headerShown: true }} />

      </Stack.Navigator>
    </NavigationContainer>
  </AuthProvider>
  
  );
};

export default App;
