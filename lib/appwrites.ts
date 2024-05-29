import { AuthProps } from "@/types/auth";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
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

    return newUser;
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

    const { email, username, avatar, accountId } = currentUser.documents[0];

    return { email, username, avatar, accountId };
  } catch (err: any) {
    throw new Error(err);
  }
};
