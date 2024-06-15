import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import { icons } from "@/constants";
import { ResizeMode, Video } from "expo-av";
import CustomButtons from "@/components/CustomButtons";
import * as ImagePicker from "expo-image-picker";
import { useGlobalContext } from "@/context/GlobalProvider.Context";
import { CreatePost } from "@/lib/appwrites";
import { useRouter } from "expo-router";

type FormProp = {
  title: string;
  video: ImagePicker.ImagePickerAsset | null;
  thumbnail: ImagePicker.ImagePickerAsset | null;
  prompt: string;
};

const Create = () => {
  // HOOKS
  const [form, setForm] = React.useState<FormProp>({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });
  const [uploading, SetUploading] = React.useState<boolean>(false);
  const { user } = useGlobalContext();
  const router = useRouter();

  // FUNCTIONS
  const handleImagePicker = async (selectedType: "image" | "video") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectedType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (selectedType === "video") {
        setForm((prevData) => ({ ...prevData, video: result.assets[0] }));
      } else {
        setForm((prevData) => ({ ...prevData, thumbnail: result.assets[0] }));
      }
    }
  };

  const handleSubmit = async () => {
    const { prompt, thumbnail, title, video } = form;

    // Early return if any form field is missing
    if (!prompt || !thumbnail || !title || !video) {
      return Alert.alert("Form incomplete", "All form inputs are required");
    }

    const formattedThumbnail = {
      name: thumbnail.fileName || "",
      size: thumbnail.fileSize || 0,
      type: thumbnail.mimeType || "",
      uri: thumbnail.uri,
    };

    const formattedVideo = {
      name: video.fileName || "",
      size: video.fileSize || 0,
      type: video.mimeType || "",
      uri: video.uri,
    };

    SetUploading(true);
    try {
      await CreatePost(
        {
          thumbnail: formattedThumbnail,
          prompt,
          video: formattedVideo,
          title,
        },
        user?.id
      );

      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });

      router.push("/home");

      Alert.alert("Success", "Your post has been successfully created");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      SetUploading(false);
    }
  };

  const handleRemove = (type: "video" | "image") => {
    switch (type) {
      case "image":
        setForm((prevData) => ({ ...prevData, thumbnail: null }));
        break;
      case "video":
        setForm((prevData) => ({ ...prevData, video: null }));
        break;

      default:
        break;
    }
  };

  return (
    <SafeAreaView className="w-full h-full bg-primary">
      <ScrollView
        className="w-full px-4 my-6"
        contentContainerStyle={{ minHeight: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text className="text-2xl text-white capitalize font-psemibold">
            upload video
          </Text>

          <View className="flex-col gap-y-5 mt-7">
            <FormField
              placeholder="Give your video a catch title"
              title="Video Title"
              value={form.title}
              keyboardType="web-search"
              handleChangeText={(e) =>
                setForm((prevData) => ({ ...prevData, title: e }))
              }
            />

            <View>
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-gray-100 capitalize font-pmedium">
                  upload video
                </Text>

                {form.video && (
                  <TouchableOpacity
                    className="px-3 py-1 bg-red-500 rounded-xl"
                    onPress={() => handleRemove("video")}
                  >
                    <Text className="text-xs text-white capitalize font-pmedium">
                      Remove
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View className="w-full h-[150] bg-black-200 rounded-2xl items-center justify-center mt-1.5">
                {form.video ? (
                  <Video
                    source={{ uri: form.video.uri }}
                    resizeMode={ResizeMode.COVER}
                    useNativeControls
                    isLooping
                    className="w-full h-full rounded-2xl"
                  />
                ) : (
                  <TouchableOpacity
                    className="items-center justify-center w-full h-full"
                    onPress={() => handleImagePicker("video")}
                  >
                    <View className="w-10 h-10 p-2 border border-dashed border-secondary rounded-xl">
                      <Image
                        source={icons.upload}
                        alt="image"
                        className="w-full h-full"
                        resizeMode="contain"
                      />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View className="w-full">
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-gray-100 capitalize font-pmedium">
                  Thumbnail image
                </Text>

                {form.thumbnail && (
                  <TouchableOpacity
                    className="px-3 py-1 bg-red-500 rounded-xl"
                    onPress={() => handleRemove("image")}
                  >
                    <Text className="text-xs text-white capitalize font-pmedium">
                      Remove
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View className="bg-black-200 w-full items-center justify-center rounded-2xl mt-1.5">
                {form.thumbnail ? (
                  <View className="w-full h-[200]">
                    <Image
                      source={{ uri: form.thumbnail.uri }}
                      className="w-full h-full rounded-xl"
                      alt="thumbnail"
                      resizeMode="cover"
                    />
                  </View>
                ) : (
                  <TouchableOpacity
                    className="items-center justify-center w-full h-[70]"
                    onPress={() => handleImagePicker("image")}
                  >
                    <View className="flex-row items-center justify-center gap-x-3">
                      <View className="w-6 h-6">
                        <Image
                          source={icons.upload}
                          alt="image"
                          className="w-full h-full"
                          resizeMode="contain"
                        />
                      </View>
                      <Text className="text-base text-white font-pmedium">
                        Choose a file
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <FormField
              placeholder="The AI prompt of your video"
              title="AI Prompt"
              value={form.prompt}
              keyboardType="web-search"
              otherStyles="mt-5"
              handleChangeText={(e) =>
                setForm((prevData) => ({ ...prevData, prompt: e }))
              }
            />

            <CustomButtons
              title="Submit & Publish"
              handlePress={handleSubmit}
              containerStyles="w-full mt-7"
              isLoading={uploading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
