import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from './AuthContext'; // Import AuthContext

// Import Screens
import Home from './Home';
import Profile from './Profile';
import Settings from './Settings';
import CategorywisePromotion from './CategorywisePromotion';
import NearbyPromotion from './NearbyPromotion';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const { user } = useContext(AuthContext); // Get user data from AuthContext

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Profile') iconName = 'person';
          else if (route.name === 'Settings') iconName = 'settings';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6B21A8',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      
      {/* Show Profile Tab only if user is logged in */}
      {user !== '' && <Tab.Screen name="Profile" component={Profile} />}
      
      <Tab.Screen name="CategorywisePromotion" component={CategorywisePromotion} />
      <Tab.Screen name="NearbyPromotion" component={NearbyPromotion} />
      <Tab.Screen name="Settings" component={Settings} />



    </Tab.Navigator>
  );
};

export default BottomTabs;
