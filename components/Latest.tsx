import { FlatList, ViewToken } from "react-native";
import React from "react";
import { Models } from "react-native-appwrite";
import LatestItem from "./LatestItem";
import { View } from "react-native";

interface LatestProps {
  posts: Models.Document[];
}

const Latest: React.FC<LatestProps> = ({ posts }) => {
  // HOOKS
  const [active, setActive] = React.useState<string>(posts[1]?.$id);

  // FUNCTIONS
  const viewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (viewableItems?.length !== 0) {
      setActive(viewableItems[0].key);
    }
  };

  return (
    <View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <LatestItem latestPost={item} activeItems={active} />
        )}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 70,
        }}
        contentOffset={{ x: 170, y: 0 }}
        onViewableItemsChanged={viewableItemsChanged}
        showsHorizontalScrollIndicator={false}
        horizontal
      />

      <View className="w-full items-center justify-center duration-500 gap-x-2 flex-row">
        {posts?.map((item) => (
          <View
            className={`rounded-full h-2 duration-700  ${
              item?.$id === active ? "w-5 bg-secondary" : "w-2  bg-gray-100"
            } `}
            key={item?.$id}
          />
        ))}
      </View>
    </View>
  );
};

export default Latest;
