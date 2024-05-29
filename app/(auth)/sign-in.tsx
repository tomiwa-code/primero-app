import { Alert, Image, ScrollView, Text, View } from "react-native";
import React from "react";
import { images } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButtons from "@/components/CustomButtons";
import FormField from "@/components/FormField";
import { Link, router } from "expo-router";
import { AuthProps } from "@/types/auth";
import { signIn } from "@/lib/appwrites";
import { useGlobalContext } from "@/context/GlobalProvider.Context";


const SignIn = () => {
  const [form, setForm] = React.useState<AuthProps>({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const handleFormSubmit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }

    setIsSubmitting(true);
    const email = form.email;
    const password = form.password;

    try {
      const result = await signIn({ email, password });
      setUser(result);
      setIsLoggedIn(true);

      Alert.alert("success", "You have successfully signed in")
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
            Log in to Primero
          </Text>

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

          <Text className="px-1 mt-5 text-sm text-right text-gray-100 font-pregular">
            Forgot password
          </Text>

          <CustomButtons
            handlePress={handleFormSubmit}
            containerStyles="w-full mt-5 px-1"
            title="Sign In"
            isLoading={isSubmitting}
          />

          <View className="flex-row items-center justify-center px-1 pt-5 gap-x-1">
            <Text className="text-base text-gray-100 font-pregular">
              Don't have an account?{" "}
            </Text>
            <Link
              href={"/sign-up"}
              className="text-base font-psemibold text-secondary-200"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
