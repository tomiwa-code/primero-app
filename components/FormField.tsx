import { Image, KeyboardTypeOptions, Text, TextInput, TouchableOpacity, View } from "react-native";
import React from "react";
import { icons } from "@/constants";

type Props = {
  value?: string;
  placeholder: string;
  otherStyles?: string;
  handleChangeText: (e: string) => void;
  title: string;
  keyboardType?: KeyboardTypeOptions;
};

const FormField = ({
  value,
  placeholder,
  otherStyles,
  handleChangeText,
  title,
  keyboardType,
}: Props) => {
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <View className={`${otherStyles} space-y-2`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>

      <View className="relative flex-row items-center w-full h-16 px-4 border-2 border-black-200 bg-black-100 rounded-2xl focus:border-secondary">
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={"#7b7b8b"}
          value={value}
          keyboardType={keyboardType}
          className={"flex-1 text-white font-psemibold text-base"}
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={handleShowPassword}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
