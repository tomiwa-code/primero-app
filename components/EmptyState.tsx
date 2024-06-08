import { View, Text, Image } from "react-native";
import React from "react";
import CustomButtons from "./CustomButtons";
import { router } from "expo-router";
import { images } from "@/constants";

interface EmptyStateProps {
  title: string;
  subtitle: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, subtitle }) => {
  return (
    <View className="items-center justify-center px-6">
      <Image
        source={images.empty}
        resizeMode="contain"
        className="w-[250px] h-[170px]"
      />

      <Text className="text-xl text-center text-white font-psemibold">
        {title}
      </Text>
      <Text className="mt-2 text-sm text-center text-gray-100 font-pmedium">
        {subtitle}
      </Text>

      <CustomButtons
        handlePress={() => router.push("/create")}
        containerStyles="w-full my-5"
        title="Create video"
      />
    </View>
  );
};

export default EmptyState;
