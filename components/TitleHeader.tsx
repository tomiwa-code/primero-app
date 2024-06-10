import { View, Text } from "react-native";
import React from "react";

type Props = {
  subTitle?: string;
  title: string | undefined;
};

const TitleHeader = ({ subTitle, title }: Props) => {
  return (
    <View>
      <Text className="text-sm text-gray-100 font-pmedium">{subTitle}</Text>
      <Text className="text-2xl text-white font-psemibold mt-0.5">{title}</Text>
    </View>
  );
};

export default TitleHeader;
