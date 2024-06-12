import {
  Alert,
  Image,
  KeyboardTypeOptions,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { icons } from "@/constants";
import { usePathname, useRouter } from "expo-router";

type Props = {
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  defaultValue?: string;
};

const SearchInput = ({ placeholder, keyboardType, defaultValue }: Props) => {
  // HOOKS
  const [query, setQuery] = React.useState<string>(
    defaultValue ? defaultValue : ""
  );
  const router = useRouter();
  const pathname = usePathname();

  // FUNCTIONS
  const handleTextOnChange = (e: string) => {
    setQuery(e);
  };

  const handleSearch = () => {
    if (typeof query !== "string") {
      Alert.alert("Search input", "Search input is invalid");
    }

    if (query.length === 0) {
      Alert.alert("Empty Search", "Search cannot be empty");
      return;
    }

    if (pathname.startsWith("/search")) {
      if (query) {
        router.setParams({ query });
      }
    } else {
      router.push(`/search/${query}`);
    }
  };

  return (
    <View className="relative flex-row items-center w-full h-16 px-4 border-2 border-black-200 bg-black-100 rounded-2xl focus:border-secondary">
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={"#CDCDE0"}
        value={query}
        keyboardType={keyboardType}
        className={"flex-1 text-white font-psemibold text-base"}
        onChangeText={handleTextOnChange}
      />

      <TouchableOpacity onPress={handleSearch}>
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
