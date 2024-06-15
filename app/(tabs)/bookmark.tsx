import { FlatList, RefreshControl, View, ViewToken } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TitleHeader from "@/components/TitleHeader";
import SearchInput from "@/components/SearchInput";
import EmptyState from "@/components/EmptyState";
import VideoCard from "@/components/VideoCard";
import useAppWrite from "@/lib/useAppWrite";
import { getUsersBookmarkedPosts } from "@/lib/appwrites";
import { useGlobalContext } from "@/context/GlobalProvider.Context";

const Bookmark = () => {
  // HOOKS
  const { user } = useGlobalContext();
  const { data: posts, mutate } = useAppWrite(() => getUsersBookmarkedPosts(user?.id));
  const [showMoreId, setShowMoreId] = React.useState<string | null>(null);
  const [active, setActive] = React.useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  // FUNCTIONS
  const handleShowMore = (id: string) => {
    setShowMoreId((prevId) => (prevId === id ? null : id));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    mutate();
    setRefreshing(false);
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
          <View className="w-full px-5 py-6 mb-4">
            <TitleHeader subTitle="Your Saved Videos" title="Saved Videos" />

            <View className="mt-6">
              <SearchInput
                placeholder="Search for videos topic"
                keyboardType="web-search"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            subtitle="No video has been bookmarked"
            title="Bookmark empty"
            btnText="Explore videos"
            redirect="/home"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
        onViewableItemsChanged={viewableItemsChanged}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Bookmark;
