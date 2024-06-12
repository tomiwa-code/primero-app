import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { FlatList, View, ViewToken } from "react-native";
import TitleHeader from "@/components/TitleHeader";
import SearchInput from "@/components/SearchInput";
import useAppWrite from "@/lib/useAppWrite";
import { searchPosts } from "@/lib/appwrites";
import VideoCard from "@/components/VideoCard";
import { useGlobalContext } from "@/context/GlobalProvider.Context";
import EmptyState from "@/components/EmptyState";

const Search = () => {
  // HOOKS
  const { query } = useLocalSearchParams();
  const { data: posts, mutate } = useAppWrite(() => searchPosts(query));
  const { user } = useGlobalContext();
  const [activeVideoId, setActiveVideoId] = React.useState<string | null>(null);
  const [showMoreId, setShowMoreId] = React.useState<string | null>(null);

  // FUNCTIONS
  const handleShowMoreId = (id: string) => {
    setShowMoreId((prev) => (prev === id ? null : id));
  };

  const handleViewableItemsChange = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (viewableItems.length !== 0) {
      setActiveVideoId(viewableItems[0].key);
    }
  };

  // USE EFFECTS
  React.useEffect(() => {
    if (query) {
      mutate();
    }
  }, [query]);

  return (
    <SafeAreaView className="w-full h-full bg-primary">
      <FlatList
        data={posts}
        keyExtractor={(item) => item?.$id}
        renderItem={({ item }) => (
          <VideoCard
            showMoreId={showMoreId}
            video={item}
            onShowMore={handleShowMoreId}
            activeVideoId={activeVideoId}
            mutate={mutate}
            user={user}
          />
        )}
        ListHeaderComponent={() => (
          <View className="px-4 my-6 space-y-6">
            <View className="flex-row items-start justify-between mb-6">
              <TitleHeader
                subTitle="Search results"
                title={typeof query === "string" ? query : ""}
              />
            </View>

            <SearchInput
              placeholder="Search for a video topic"
              keyboardType="web-search"
              defaultValue={typeof query === "string" ? query : ""}
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            redirect="/home"
            btnText="Explore more videos"
            title="Search result not found"
            subtitle="Video of this title is not found in our database"
          />
        )}
        viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
        onViewableItemsChanged={handleViewableItemsChange}
      />
    </SafeAreaView>
  );
};

export default Search;
