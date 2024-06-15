import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { Models } from "react-native-appwrite";
import { icons } from "@/constants";
import { textTrunc } from "@/lib/fn";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import {
  DeletePost,
  bookmarkPost,
  removeBookmarkedPost,
} from "@/lib/appwrites";
import { UserProp } from "@/types/user";
import { Link } from "expo-router";

type Props = {
  video: Models.Document;
  showMoreId: string | null;
  onShowMore: (id: string) => void;
  activeVideoId: string | null;
  mutate: () => void;
  user: UserProp | null | Models.Document;
};

const VideoCard = ({
  video,
  onShowMore,
  showMoreId,
  activeVideoId,
  mutate,
  user,
}: Props) => {
  // HOOKS
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const isSaved = React.useMemo(() => {
    const findUser = video?.bookmark?.find(
      (item: any) => item?.accountId === user?.accountId
    );
    if (findUser) {
      return true;
    }
    return false;
  }, [video]);
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);

  // FUNCTIONS
  const handleBookmark = async (action: "save" | "unsaved") => {
    if (user?.id) {
      // Bookmark post
      if (action === "save") {
        setIsLoading(true);
        try {
          const res = await bookmarkPost(video?.$id, user.id);
          if (res?.success) {
            mutate();
            onShowMore(video?.$id);
          }
        } catch (err: any) {
          Alert.alert("Error", err?.message);
        } finally {
          setTimeout(() => {
            setIsLoading(false);
          }, 1500);
        }
        return;
      }

      // Un-Bookmark post
      if (action === "unsaved") {
        setIsLoading(true);
        try {
          const res = await removeBookmarkedPost(video?.$id, user.id);
          if (res?.success) {
            mutate();
            onShowMore(video?.$id);
          }
        } catch (err: any) {
          Alert.alert("Error", err?.message);
        } finally {
          setTimeout(() => {
            setIsLoading(false);
          }, 1500);
        }
      }
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await DeletePost(video?.$id);
      mutate();
      Alert.alert("Post Deleted", "Post has been deleted successfully");
    } catch (err: any) {
      Alert.alert("Error", err);
    } finally {
      setIsDeleting(false);
    }
  };

  // USE EFFECTS
  React.useEffect(() => {
    if (activeVideoId !== video?.$id) {
      setIsPlaying(false);
    }
  }, [activeVideoId, video]);

  return (
    <View className="flex-col items-center px-4 mb-12">
      <View className="relative z-50 flex-row items-center justify-between w-full">
        <View className="relative z-10 flex-row items-center gap-x-4">
          <Link
            href={`${
              user?.accountId !== video?.creator?.accountId
                ? `/user/${video?.creator?.$id}`
                : "/profile"
            }`}
          >
            <View className="border-secondary border rounded-lg p-0.5 w-[46px] h-[46px]">
              <Image
                source={{ uri: video?.creator?.avatar }}
                resizeMode="contain"
                className="w-full h-full rounded-lg"
              />
            </View>
          </Link>

          <View className="flex-col gap-y-2">
            <Text className="text-sm text-white font-psemibold">
              {textTrunc(video?.tittle)}
            </Text>
            <Text className="text-xs text-gray-100 font-pmedium">
              {video?.creator?.username}
            </Text>
          </View>
        </View>

        {user?.accountId === video?.creator?.accountId && (
          <>
            <View className="relative">
              <TouchableOpacity onPress={() => onShowMore(video?.$id)}>
                <Image
                  source={icons.menu}
                  resizeMode="contain"
                  className="w-5 h-5"
                />
              </TouchableOpacity>

              {showMoreId === video?.$id && (
                <View className="bg-black-200 rounded-xl w-[120px] absolute -bottom-[100px] right-0">
                  <TouchableOpacity
                    onPress={() => handleBookmark(isSaved ? "unsaved" : "save")}
                    className="flex-row items-center px-4 py-3 gap-x-3"
                  >
                    <Image
                      source={icons.bookmark}
                      className="w-4 h-4 text-gray-100"
                      resizeMode="contain"
                    />
                    <Text className="text-base text-gray-100 capitalize">
                      {isLoading ? "Loading" : isSaved ? "Unsaved" : "Save"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleDelete}
                    className="flex-row items-center px-4 py-3 gap-x-3"
                  >
                    <Image
                      source={icons.deleteIcon}
                      className="w-4 h-4 text-gray-100"
                      resizeMode="contain"
                    />
                    <Text className="text-base text-gray-100 capitalize">
                      {isDeleting ? " Deleting" : "Delete"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </>
        )}
      </View>

      {isPlaying ? (
        <Video
          source={{ uri: video?.video }}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
            if (status.isLoaded) {
              if (status.didJustFinish) {
                setIsPlaying(false);
              }
            }
          }}
          className="relative z-10 w-full mt-3 overflow-hidden h-60 rounded-xl"
        />
      ) : (
        <TouchableOpacity
          className="relative z-10 items-center justify-center w-full mt-3 rounded-xl h-60"
          activeOpacity={0.5}
          onPress={() => setIsPlaying(true)}
        >
          <Image
            source={{ uri: video?.thumbnail }}
            className="w-full h-full mt-3 rounded-xl"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="absolute w-12 h-12"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
