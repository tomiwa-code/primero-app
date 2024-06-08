import {
  Image,
  KeyboardTypeOptions,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { icons } from "@/constants";

type Props = {
  value?: string;
  placeholder: string;
  otherStyles?: string;
  handleChangeText: (e: string) => void;
  handleSearch: () => void;
  keyboardType?: KeyboardTypeOptions;
};

const SearchInput = ({
  value,
  placeholder,
  handleSearch,
  handleChangeText,
  keyboardType,
}: Props) => {
  return (
    <View className="relative flex-row items-center w-full h-16 px-4 border-2 border-black-200 bg-black-100 rounded-2xl focus:border-secondary">
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={"#7b7b8b"}
        value={value}
        keyboardType={keyboardType}
        className={"flex-1 text-white font-psemibold text-base"}
        onChangeText={handleChangeText}
      />

      <TouchableOpacity onPress={handleSearch}>
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
