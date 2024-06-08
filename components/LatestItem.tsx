import * as Animatable from "react-native-animatable";
import React from "react";
import { ImageBackground, TouchableOpacity } from "react-native";
import { Models } from "react-native-appwrite";
import { Image } from "react-native";
import { icons } from "@/constants";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";

type Props = {
  latestPost: Models.Document;
  activeItems: string;
};

Animatable.initializeRegistryWithDefinitions({
  scaleIn: {
    0: {
      transform: [{ scale: 0.9 }],
    },
    1: {
      transform: [{ scale: 1 }],
    },
  },

  scaleOut: {
    0: {
      transform: [{ scale: 1 }],
    },
    1: {
      transform: [{ scale: 0.9 }],
    },
  },
});

const LatestItem = ({ latestPost, activeItems }: Props) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  React.useEffect(() => {
    if (activeItems !== latestPost?.$id) {
      setIsPlaying(false);
    }
  }, [activeItems, latestPost]);

  return (
    <Animatable.View
      className="mr-6"
      animation={activeItems === latestPost?.$id ? "scaleIn" : "scaleOut"}
      duration={500}
    >
      {isPlaying ? (
        <Video
          source={{ uri: latestPost?.video }}
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
          className="w-52 h-72 overflow-hidden my-4 rounded-3xl shadow-lg shadow-black/10"
        />
      ) : (
        <TouchableOpacity
          className="relative items-center justify-center"
          activeOpacity={0.7}
          onPress={() => setIsPlaying(true)}
        >
          <ImageBackground
            source={{ uri: latestPost?.thumbnail }}
            className="w-52 h-72 overflow-hidden my-4 rounded-3xl shadow-lg shadow-black/40"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

export default LatestItem;
