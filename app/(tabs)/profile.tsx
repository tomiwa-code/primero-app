import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants";
import { useGlobalContext } from "@/context/GlobalProvider.Context";
import useAppWrite from "@/lib/useAppWrite";
import { getUsersPosts } from "@/lib/appwrites";
import VideoCard from "@/components/VideoCard";
import EmptyState from "@/components/EmptyState";

const Profile = () => {
  // HOOKS
  const { user } = useGlobalContext();
  const { data: posts, mutate } = useAppWrite(getUsersPosts);
  const [showMoreId, setShowMoreId] = React.useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [active, setActive] = React.useState<string | null>(null);

  // FUNCTIONS
  const handleShowMore = (id: string) => {
    setShowMoreId((prevId) => (prevId === id ? null : id));
  };

  const handleOnRefresh = () => {
    setRefreshing(false);
    mutate();
    setRefreshing(true);
  };

  const viewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (viewableItems.length !== 0) {
      setActive(viewableItems[0].key);
    }
  };

  const handleLogout = async () => {};

  return (
    <SafeAreaView className="w-full h-full bg-primary">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            video={item}
            onShowMore={handleShowMore}
            showMoreId={showMoreId}
            activeVideoId={active}
          />
        )}
        ListHeaderComponent={() => (
          <View className="py-6 w-full px-4 mb-6">
            <View className="w-full items-end">
              <TouchableOpacity onPress={handleLogout}>
                <Image
                  source={icons.logout}
                  resizeMode="contain"
                  className="w-5 h-5"
                />
              </TouchableOpacity>
            </View>

            <View className="mt-5 items-center justify-center">
              <View className="flex-col gap-y-4 items-center justify-center">
                <View className="border-secondary border rounded-lg p-0.5 w-[60px] h-[60px]">
                  <Image
                    source={{ uri: user?.avatar }}
                    resizeMode="contain"
                    className="w-full h-full rounded-lg"
                  />
                </View>
                <Text className="text-white text-xl text-center font-psemibold">
                  {user?.username}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-x-10 items-center justify-center mt-6">
              <View>
                <Text className="text-white text-3xl text-center font-pbold">
                  10
                </Text>
                <Text className="text-gray-100 text-base text-center font-pregular capitalize">
                  posts
                </Text>
              </View>

              <View>
                <Text className="text-white text-3xl text-center font-pbold">
                  1.2k
                </Text>
                <Text className="text-gray-100 text-base text-center font-pregular capitalize">
                  views
                </Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No videos found" subtitle="Create a video" />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleOnRefresh} />
        }
        viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
        onViewableItemsChanged={viewableItemsChanged}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Profile;
