import { Text, TouchableOpacity } from "react-native";
import React from "react";

type Props = {
  title: string;
  handlePress: () => void;
  containerStyles: string;
  textStyles?: string;
  isLoading?: boolean;
};

const CustomButtons = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={`bg-secondary rounded-xl justify-center items-center min-h-[62px] ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
      onPress={handlePress}
    >
      <Text
        className={`text-primary text-lg text-center font-psemibold ${textStyles}`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButtons;
