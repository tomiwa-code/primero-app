import { Image, ImageSourcePropType, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { icons } from "@/constants";

type TabsProp = {
  icon: ImageSourcePropType | undefined;
  color: string;
  name: string;
  focused: boolean;
};

const TabsIcon = ({ icon, color, name, focused }: TabsProp) => (
  <View className={"items-center justify-center gap-2"}>
    <Image
      source={icon}
      resizeMode="contain"
      tintColor={color}
      className="w-5 h-5"
    />
    <Text
      className={`text-xs text-center ${
        focused ? "font-psemibold" : "pregular"
      }`}
      style={{ color: color }}
    >
      {name}
    </Text>
  </View>
);

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#FFA001",
        tabBarInactiveTintColor: "#CDCDE0",
        tabBarStyle: {
          backgroundColor: "#161622",
          borderTopWidth: 1,
          borderTopColor: "#232533",
          height: 80,
        },
      }}
    >
      {/* Home  */}
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            <TabsIcon
              focused={focused}
              color={color}
              name="Home"
              icon={icons.home}
            />
          ),
        }}
      />

      {/* Bookmark  */}
      <Tabs.Screen
        name="bookmark"
        options={{
          headerShown: false,
          title: "Bookmark",
          tabBarIcon: ({ focused, color }) => (
            <TabsIcon
              focused={focused}
              color={color}
              name="Bookmark"
              icon={icons.bookmark}
            />
          ),
        }}
      />

      {/* Create  */}
      <Tabs.Screen
        name="create"
        options={{
          headerShown: false,
          title: "Create",
          tabBarIcon: ({ focused, color }) => (
            <TabsIcon
              focused={focused}
              color={color}
              name="Create"
              icon={icons.plus}
            />
          ),
        }}
      />

      {/* Profile  */}
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ focused, color }) => (
            <TabsIcon
              focused={focused}
              color={color}
              name="Profile"
              icon={icons.profile}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
