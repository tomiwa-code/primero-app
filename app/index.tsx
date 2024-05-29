import { Image, ScrollView, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import CustomButtons from "@/components/CustomButtons";
import { Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "@/context/GlobalProvider.Context";

const App = () => {
  const { isLoading, isLoggedIn } = useGlobalContext();

if (!isLoading && isLoggedIn) return <Redirect href={"/home"} />;

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full h-full items-center justify-center px-4">
          <View className="flex-row gap-x-2 items-center justify-center">
            <Image
              source={images.logoSmall}
              resizeMode="contain"
              className="w-[50px] h-[45px]"
            />
            <Text className={"text-white font-psemibold text-4xl"}>
              Primero
            </Text>
          </View>

          <Image
            source={images.cards}
            resizeMode="contain"
            className="max-w-[380px] h-[300px]"
          />

          <View className="relative mt-5 px-2">
            <Text className="text-3xl text-white font-pbold text-center">
              Discover Endless Possibilities with{" "}
              <Text className="text-secondary-200">Primero</Text>
            </Text>

            <Image
              source={images.path}
              resizeMode="contain"
              className="max-w-[65px] h-[15px] absolute right-2 bottom-10"
            />

            <Text className="text-gray-100 mt-3 text-center text-sm font-pregular">
              Where Creativity Meets Innovation: Embark on a Journey of
              Limitless Exploration with Primero
            </Text>
          </View>

          <View className="px-2 mt-7 w-full">
            <CustomButtons
              title="Continue with Email"
              containerStyles="w-full"
              handlePress={() => router.push("/sign-in")}
            />
          </View>
        </View>
      </ScrollView>

      <StatusBar backgroundColor={"#161622"} style="light" />
    </SafeAreaView>
  );
};

export default App;
