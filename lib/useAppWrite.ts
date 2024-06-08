import React from "react";
import { Alert } from "react-native";
import { Models } from "react-native-appwrite";

const useAppWrite = (
  fetcherFn: () => Promise<Models.Document[]>
): { data: Models.Document[]; isLoading: boolean; mutate: () => void } => {
  const [data, setData] = React.useState<Models.Document[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const fetchPosts = async () => {
    try {
      const res = await fetcherFn();
      setData(res);
    } catch (err: any) {
      Alert.alert("Error", err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const mutate = () => {
    fetchPosts();
  };

  React.useEffect(() => {
    fetchPosts();
  }, []);

  return { data, isLoading, mutate };
};

export default useAppWrite;
