import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabs from "./Components/BottomTabs";
import Details from "./Components/Details";
import Login from "./Components/Login"; // Import Login screen
import Signup from "./Components/Signup";
import { AuthProvider } from "./Components/AuthContext"; 
import NearbyPromotion from "./Components/NearbyPromotion";
import CategorywisePromotion from "./Components/CategorywisePromotion";

const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider> 
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="HomeTabs" component={BottomTabs} options={{ headerShown: false }} />
          <Stack.Screen name="Details" component={Details} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} /> 
          <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} /> 
          <Stack.Screen name="CategorywisePromotion" component={CategorywisePromotion} options={{ headerShown: false }} /> 
          <Stack.Screen name="NearbyPromotion" component={NearbyPromotion} options={{ headerShown: false }} /> 
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
