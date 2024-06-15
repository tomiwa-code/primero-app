import { AuthProps } from "@/types/auth";
import { FileProp, FormType } from "@/types/file";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  ImageGravity,
  Query,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.tc.primero",
  projectId: "66569777001dac7c9737",
  databaseId: "66569844003911efc6d9",
  usersCollectionId: "66569a1e003090f57bc7",
  videosCollectionId: "66569da90029f07cea47",
  storageId: "6656986000296549b9a8",
};

const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Create User
export const createUser = async ({ username, email, password }: AuthProps) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn({ email, password });

    const newUser = await databases.createDocument(
      config.databaseId,
      config.usersCollectionId,
      ID.unique(),
      {
        username: username,
        email: email,
        avatar: avatarUrl,
        accountId: newAccount.$id,
      }
    );

    if (!newUser) throw Error;

    return {
      email: newUser?.mail,
      username: newUser?.name,
      avatar: newUser?.avatar,
      accountId: newUser?.accountId,
      id: newUser?.$id,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

// Sign user in
export const signIn = async ({ email, password }: AuthProps) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (err: any) {
    throw new Error(err);
  }
};

// Sign user out
export const signUserOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (err: any) {
    throw new Error(err);
  }
};

// get current user
export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.usersCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    const { email, username, avatar, accountId, $id } =
      currentUser.documents[0];

    return { email, username, avatar, accountId, id: $id };
  } catch (err: any) {
    throw new Error(err);
  }
};

// Get all posts
export const getAllPosts = async () => {
  try {
    const post = await databases.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.orderDesc("$createdAt")]
    );

    return post.documents;
  } catch (err: any) {
    throw new Error(err);
  }
};

// Get Latest Posts
export const getLatestPosts = async () => {
  try {
    const post = await databases.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );
    return post.documents;
  } catch (err: any) {
    throw new Error(err);
  }
};

// Get user's profile
export const getUserProfile = async (userId: string | string[] | undefined) => {
  try {
    if (!userId) throw Error;

    const user = await databases.listDocuments(
      config.databaseId,
      config.usersCollectionId,
      [Query.equal("$id", userId)]
    );

    return user.documents;
  } catch (err: any) {
    throw new Error(err);
  }
};

// Get user's posts
export const getUsersPosts = async (userId: string | string[] | undefined) => {
  try {
    if (!userId) {
      throw new Error("user ID is required");
    }

    const post = await databases.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    return post.documents;
  } catch (err: any) {
    throw new Error("error", err);
  }
};

// Search for posts
export const searchPosts = async (query: string | string[] | undefined) => {
  if (typeof query !== "string") {
    throw new Error("Search input is invalid");
  }

  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.search("tittle", query)]
    );

    return posts.documents;
  } catch (err: any) {
    throw new Error(err);
  }
};

// Get user bookmarked posts
export const getUsersBookmarkedPosts = async (userId: string | undefined) => {
  if (!userId) throw Error("Could not verify user");

  try {
    const post = await databases.listDocuments(
      config.databaseId,
      config.videosCollectionId
    );

    const filteredPosts = post.documents.filter((post) =>
      post.bookmark.some((bookmark: any) => bookmark?.$id === userId)
    );

    return filteredPosts;
  } catch (err: any) {
    throw new Error(err);
  }
};

// Bookmark a post
export const bookmarkPost = async (videoId: string, userId: string) => {
  try {
    if (!videoId || !userId) throw Error;

    const getVideo = await databases.getDocument(
      config.databaseId,
      config.videosCollectionId,
      videoId
    );

    const updateBookmark = [...getVideo?.bookmark, userId];
    const updateVideo = await databases.updateDocument(
      config.databaseId,
      config.videosCollectionId,
      videoId,
      { bookmark: updateBookmark }
    );

    if (updateVideo?.bookmark?.length > 0) {
      return { success: true, msg: "Video added to bookmark" };
    }
  } catch (err: any) {
    throw new Error(err);
  }
};

// Un-bookmark a post
export const removeBookmarkedPost = async (videoId: string, userId: string) => {
  try {
    if (!videoId || !userId) throw Error;

    const getVideo = await databases.getDocument(
      config.databaseId,
      config.videosCollectionId,
      videoId
    );

    const updateBookmark = getVideo?.bookmark?.filter(
      (item: any) => item?.$id !== userId
    );

    const updateVideo = await databases.updateDocument(
      config.databaseId,
      config.videosCollectionId,
      videoId,
      { bookmark: updateBookmark }
    );

    return {
      success: true,
      msg: "Video removed from bookmark",
      data: updateVideo,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

// Get file Preview
export const getFilePreview = async (
  fileID: string,
  FileType: "images" | "videos"
) => {
  let fileUrl;
  try {
    if (FileType === "videos") {
      fileUrl = storage.getFileView(config.storageId, fileID);
    } else {
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileID,
        2000,
        2000,
        ImageGravity.Top,
        100
      );
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (err: any) {
    throw new Error(err);
  }
};

// Upload file to storage
export const uploadFileToStorage = async (
  file: FileProp,
  fileType: "images" | "videos"
) => {
  if (!file) throw Error("File is required");

  if (!fileType) throw Error("File type is required");

  try {
    const uploadFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      file
    );

    const fileUrl = await getFilePreview(uploadFile.$id, fileType);

    return fileUrl;
  } catch (err: any) {
    throw new Error(err);
  }
};

// Create Video/Post
export const CreatePost = async (
  file: FormType,
  userId: string | undefined
) => {
  try {
    const [thumbnail, video] = await Promise.all([
      uploadFileToStorage(file.thumbnail, "images"),
      uploadFileToStorage(file.video, "videos"),
    ]);

    const createVideo = await databases.createDocument(
      config.databaseId,
      config.videosCollectionId,
      ID.unique(),
      {
        tittle: file.title,
        prompt: file.prompt,
        thumbnail,
        video,
        creator: userId,
      }
    );

    return createVideo;
  } catch (err: any) {
    throw new Error("Failed to create post: " + err.message);
  }
};

// Delete Post
export const DeletePost = async (videoId: string) => {
  try {
    const result = await databases.deleteDocument(
      config.databaseId,
      config.videosCollectionId,
      videoId
    );

    return result;
  } catch (err: any) {
    throw new Error(
      "Post could not be deleted: " + err || "Something went wrong"
    );
  }
};
