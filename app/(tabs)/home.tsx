import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  View,
  ViewToken,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import SearchInput from "@/components/SearchInput";
import EmptyState from "@/components/EmptyState";
import { getAllPosts } from "@/lib/appwrites";
import useAppWrite from "@/lib/useAppWrite";
import VideoCard from "@/components/VideoCard";
import Latest from "@/components/Latest";
import { useGlobalContext } from "@/context/GlobalProvider.Context";
import TitleHeader from "@/components/TitleHeader";

const Home = () => {
  // HOOKS
  const { data: posts, mutate } = useAppWrite(getAllPosts);
  const { data: LTPosts } = useAppWrite(getAllPosts);
  const [refreshing, setRefreshing] = React.useState(false);
  const { user } = useGlobalContext();
  const [showMore, setShowMore] = React.useState<string | null>(null);
  const [active, setActive] = React.useState<string | null>(null);

  const handleShowMore = (id: string) => {
    setShowMore((prevId) => (prevId === id ? null : id));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    mutate();
    setRefreshing(false);
  };

  const viewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (viewableItems.length > 0) {
      setActive(viewableItems[0].key);
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
            showMoreId={showMore}
            onShowMore={handleShowMore}
            activeVideoId={active}
          />
        )}
        ListHeaderComponent={() => (
          <View className="px-6 my-6 space-y-6">
            <View className="flex-row items-start justify-between mb-6">
              <TitleHeader subTitle="Welcome Back" title={user?.username} />

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="h-8 w-7"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput
              placeholder="Search for a video topic"
              handleSearch={() => {}}
              handleChangeText={() => {}}
              value=""
              keyboardType="web-search"
            />

            <View className="flex-1 w-full pt-2 pb-8">
              <Text className="mb-3 text-lg text-gray-100 font-pregular">
                Latest videos
              </Text>

              <Latest posts={LTPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found"
            subtitle="Be the first to upload an image"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
        onViewableItemsChanged={viewableItemsChanged}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Home;
