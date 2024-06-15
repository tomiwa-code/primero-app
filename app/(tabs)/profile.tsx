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
import { getUsersPosts, signUserOut } from "@/lib/appwrites";
import VideoCard from "@/components/VideoCard";
import EmptyState from "@/components/EmptyState";
import { useRouter } from "expo-router";

const Profile = () => {
  // HOOKS
  const { user } = useGlobalContext();
  const { data: posts, mutate } = useAppWrite(() => getUsersPosts(user?.id));
  const [showMoreId, setShowMoreId] = React.useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [active, setActive] = React.useState<string | null>(null);
  const { setUser, setIsLoggedIn } = useGlobalContext();

  // DECLARES
  const router = useRouter();

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

  const handleLogout = async () => {
    try {
      const res = await signUserOut();
      if (res) {
        setUser(null);
        setIsLoggedIn(false);
        router.replace("/sign-in");
      }
    } catch (err: any) {
      throw new Error(err);
    }
  };

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
            mutate={mutate}
            user={user}
          />
        )}
        ListHeaderComponent={() => (
          <View className="w-full px-4 py-6 mb-6">
            <View className="items-end w-full">
              <TouchableOpacity onPress={handleLogout}>
                <Image
                  source={icons.logout}
                  resizeMode="contain"
                  className="w-5 h-5"
                />
              </TouchableOpacity>
            </View>

            <View className="items-center justify-center mt-5">
              <View className="flex-col items-center justify-center gap-y-4">
                <View className="border-secondary border rounded-lg p-0.5 w-[60px] h-[60px]">
                  <Image
                    source={{ uri: user?.avatar }}
                    resizeMode="contain"
                    className="w-full h-full rounded-lg"
                  />
                </View>
                <Text className="text-xl text-center text-white font-psemibold">
                  {user?.username}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-center mt-6 gap-x-10">
              <View>
                <Text className="text-3xl text-center text-white font-pbold">
                  {posts?.length}
                </Text>
                <Text className="text-base text-center text-gray-100 capitalize font-pregular">
                  posts
                </Text>
              </View>

              <View>
                <Text className="text-3xl text-center text-white font-pbold">
                  1.2k
                </Text>
                <Text className="text-base text-center text-gray-100 capitalize font-pregular">
                  views
                </Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            subtitle="No videos found found for this profile"
            title="No video found"
            btnText="Create a video"
            redirect="/create"
          />
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
