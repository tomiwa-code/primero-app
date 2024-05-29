import { Alert, Image, ScrollView, Text, View } from "react-native";
import React from "react";
import { images } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButtons from "@/components/CustomButtons";
import FormField from "@/components/FormField";
import { Link, router } from "expo-router";
import { createUser } from "@/lib/appwrites";
import { AuthProps } from "@/types/auth";
import { useGlobalContext } from "@/context/GlobalProvider.Context";

const SignUp = () => {
  const [form, setForm] = React.useState<AuthProps>({
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const handleFormSubmit = async () => {
    if (!form.email || !form.password || !form.username) {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }

    setIsSubmitting(true);
    const username = form.username;
    const email = form.email;
    const password = form.password;

    try {
      const result = await createUser({ username, email, password });
      setUser(result);
      setIsLoggedIn(true);

      router.replace("/home");
    } catch (err: any) {
      Alert.alert("Error", err?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="w-full h-full bg-primary">
      <ScrollView
        className="w-full px-4"
        contentContainerStyle={{ height: "100%" }}
      >
        <View className="justify-center w-full h-full">
          <View className="flex-row items-center gap-x-2 justify-left">
            <Image
              source={images.logoSmall}
              resizeMode="contain"
              className="w-[40px] h-[40px]"
            />
            <Text className={"text-white font-psemibold text-3xl"}>
              Primero
            </Text>
          </View>

          <Text className="px-1 mt-8 text-xl text-white font-psemibold">
            Sign Up to Primero
          </Text>

          <FormField
            value={form.username}
            title="Username"
            otherStyles="mt-7"
            placeholder="Your unique username"
            keyboardType="default"
            handleChangeText={(e) =>
              setForm((prev) => ({ ...prev, username: e }))
            }
          />

          <FormField
            value={form.email}
            title="Email"
            otherStyles="mt-7"
            placeholder="Enter your email"
            keyboardType="email-address"
            handleChangeText={(e) => setForm((prev) => ({ ...prev, email: e }))}
          />

          <FormField
            value={form.password}
            otherStyles="mt-7"
            title="Password"
            placeholder="Enter your password"
            handleChangeText={(e) =>
              setForm((prev) => ({ ...prev, password: e }))
            }
          />

          <CustomButtons
            handlePress={handleFormSubmit}
            isLoading={isSubmitting}
            containerStyles="w-full mt-5 px-1"
            title="Sign Up"
          />

          <View className="flex-row items-center justify-center px-1 pt-5 gap-x-1">
            <Text className="text-base text-gray-100 font-pregular">
              Already have an account?{" "}
            </Text>
            <Link
              href={"/sign-in"}
              className="text-base font-psemibold text-secondary-200"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
