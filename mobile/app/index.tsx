import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// TODO: Import screens when created
// import HomeScreen from '../screens/HomeScreen';
// import CameraScreen from '../screens/CameraScreen';
// import StatsScreen from '../screens/StatsScreen';
// import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#F5F3EF',
            borderTopColor: '#E5E5E5',
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          tabBarActiveTintColor: '#9CAF88',
          tabBarInactiveTintColor: '#999',
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={DummyScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: () => null, // TODO: Add icon
          }}
        />
        <Tab.Screen 
          name="Camera" 
          component={DummyScreen}
          options={{
            tabBarLabel: 'Log Meal',
            tabBarIcon: () => null, // TODO: Add icon
          }}
        />
        <Tab.Screen 
          name="Stats" 
          component={DummyScreen}
          options={{
            tabBarLabel: 'Stats',
            tabBarIcon: () => null, // TODO: Add icon
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={DummyScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: () => null, // TODO: Add icon
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Dummy screen for now
function DummyScreen() {
  return null;
}
