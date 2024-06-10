import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { Models } from "react-native-appwrite";
import { icons } from "@/constants";
import { textTrunc } from "@/lib/fn";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { bookmarkPost, removeBookmarkedPost } from "@/lib/appwrites";
import { UserProp } from "@/types/user";

type Props = {
  video: Models.Document;
  showMoreId: string | null;
  onShowMore: (id: string) => void;
  activeVideoId: string | null;
  mutate: () => void;
  user: UserProp | null;
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

  const handleDelete = async () => {};

  // USE EFFECTS
  React.useEffect(() => {
    if (activeVideoId !== video?.$id) {
      setIsPlaying(false);
    }
  }, [activeVideoId, video]);

  return (
    <View className="flex-col items-center px-4 mb-12">
      <View className="flex-row w-full justify-between items-center relative z-50">
        <View className="flex-row items-center gap-x-4 relative z-10">
          <View className="border-secondary border rounded-lg p-0.5 w-[46px] h-[46px]">
            <Image
              source={{ uri: video?.creator?.avatar }}
              resizeMode="contain"
              className="w-full h-full rounded-lg"
            />
          </View>

          <View className="flex-col gap-y-2">
            <Text className="text-white text-sm font-psemibold">
              {textTrunc(video?.tittle)}
            </Text>
            <Text className="text-gray-100 text-xs font-pmedium">
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
                    className="px-4 py-3 flex-row gap-x-3 items-center"
                  >
                    <Image
                      source={icons.bookmark}
                      className="text-gray-100 w-4 h-4"
                      resizeMode="contain"
                    />
                    <Text className="capitalize text-gray-100 text-base">
                      {isLoading ? "Loading" : isSaved ? "Unsaved" : "Save"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleDelete}
                    className="px-4 py-3 flex-row gap-x-3 items-center"
                  >
                    <Image
                      source={icons.deleteIcon}
                      className="text-gray-100 w-4 h-4"
                      resizeMode="contain"
                    />
                    <Text className="capitalize text-gray-100 text-base">
                      Delete
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
          className="w-full h-60 overflow-hidden mt-3 rounded-xl relative z-10"
        />
      ) : (
        <TouchableOpacity
          className="rounded-xl mt-3 w-full h-60 items-center justify-center relative z-10"
          activeOpacity={0.5}
          onPress={() => setIsPlaying(true)}
        >
          <Image
            source={{ uri: video?.thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
