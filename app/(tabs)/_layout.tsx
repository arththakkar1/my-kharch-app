import { StatusBar, View } from 'react-native';
import { Tabs } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';

type TabsIconType = {
  Icon:any;
  color: string;
  name: string;
  focused: boolean;
};

const TabsIcon = ({ Icon, color, name, focused }: TabsIconType) => {
  return (
    <View>
      <Icon
        name={name}
        size={focused ? 30 : 24}
        color={color}
      />
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
    
    <Tabs
    screenOptions={{
      tabBarActiveTintColor:"#610094",
      tabBarInactiveTintColor:"#CDCDE0",
      tabBarStyle:{
        backgroundColor:"black",
        paddingTop:4,
      }
    }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabsIcon Icon={Entypo} name="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmark"
        options={{
          title: "Bookmark",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabsIcon Icon={FontAwesome} name="bookmark" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabsIcon Icon={FontAwesome6} name="add" color={color} focused={focused} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabsIcon Icon={MaterialCommunityIcons} name="history" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabsIcon Icon={Ionicons} name="person-sharp" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
    </>

  );
};

export default TabsLayout;
