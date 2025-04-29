import { Client, Account, ID, Databases, Query } from "react-native-appwrite";

export const config = {
  endpoint: "",
  platfrom: "",
  projectId: "",
  databaseId: "",
  transaction_collection_id: "",
  user_profile_collection_id: "",
};

let client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platfrom);

const account = new Account(client);
const databases = new Databases(client);

//Sign Up
export async function createUser(
  email: string,
  password: string,
  username: string
) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw new Error("Failed to create account.");

    await signIn(email, password);
    const user = await getCurrentUser();
    // Ensure you are saving the user in the User Profile Collection
    const newUser = await databases.createDocument(
      config.databaseId,
      config.user_profile_collection_id, // Make sure this matches your collection ID
      ID.unique(),
      {
        user_id: newAccount.$id, // This is where the user_id should be set
        email: email,
        user_name: username,
      }
    );

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Sign In
export async function signIn(email: string, password: string) {
  try {
    // Check for existing session
    const currentSession = await account
      .getSession("current")
      .catch(() => null);

    // If a session exists, delete it
    if (currentSession) {
      await account.deleteSession("current");
    }

    // Now, create a new session
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    console.error("Sign-in error:", error);
    throw error;
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw null;
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    // Fetch the account details directly
    const currentAccount = await account.get();

    // Query the user profile
    const users = await databases.listDocuments(
      config.databaseId,
      config.user_profile_collection_id,
      [Query.equal("user_id", currentAccount.$id)]
    );

    if (users.documents.length === 0) {
      // Optional: Automatically create a user profile if missing
      const newUser = await databases.createDocument(
        config.databaseId,
        config.user_profile_collection_id,
        ID.unique(),
        {
          user_id: currentAccount.$id,
          user_name: currentAccount.name || "Unnamed User", // Ensure `user_name` is always set
          email: currentAccount.email,
          password: currentAccount.password,
        }
      );

      return newUser;
    }

    return users.documents[0];
  } catch (error) {
    return null;
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw new Error();
  }
}

// Add Item
export async function addItem(
  itemName: string,
  price: number,
  isBookmark: boolean,
  Date?: string
) {
  const currentAccount = await account.get();
  try {
    const addItem = await databases.createDocument(
      config.databaseId,
      config.transaction_collection_id, // Make sure this matches your collection ID
      ID.unique(),
      {
        user_id: currentAccount.$id, // This is where the user_id should be set
        transaction_id: ID.unique(),
        item_name: itemName,
        amount: price,
        date: Date,
        isBookmark: isBookmark,
      }
    );
  } catch (error) {
    throw error;
  }
}

// Get All Items
export async function getAllItems() {
  const currentAccount = await account.get();
  try {
    const items = await databases.listDocuments(
      config.databaseId,
      config.transaction_collection_id,
      [
        Query.equal("user_id", currentAccount.$id),
        Query.orderDesc("$createdAt"),
      ]
    );
    return items;
  } catch (error) {}
}

// Get All Bookmarked Items
export async function getAllBookmarkedItems() {
  const currentAccount = await account.get();
  const items = await databases.listDocuments(
    config.databaseId,
    config.transaction_collection_id,
    [
      Query.equal("user_id", currentAccount.$id),
      Query.equal("isBookmark", true),
    ]
  );
  return items;
}

// Remove Bookmark Item
export async function removeBookmarkItem(itemId: string) {
  const item = await databases.updateDocument(
    config.databaseId,
    config.transaction_collection_id,
    itemId,
    {
      isBookmark: false,
    }
  );
  return item;
}

// Remove Item
export async function removeItem(itemId: string) {
  const item = await databases.deleteDocument(
    config.databaseId,
    config.transaction_collection_id,
    itemId
  );
  return item;
}

// Update Item
export async function updateItem(
  itemId: string,
  itemName: string,
  price: number
) {
  const currentAccount = await account.get();
  const item = await databases.updateDocument(
    config.databaseId,
    config.transaction_collection_id,
    itemId,
    {
      user_id: currentAccount.$id,
      item_name: itemName,
      amount: price,
    }
  );
  return item;
}

// History Page Items with Pagination
export async function getHistoryItems() {
  try {
    const currentAccount = await account.get();

    const response = await databases.listDocuments(
      config.databaseId,
      config.transaction_collection_id,
      [
        Query.equal("user_id", currentAccount.$id),
        Query.limit(100),
        Query.orderDesc("$createdAt"),
      ]
    );
    return response;
  } catch (error) {
    console.error("Error fetching history items:", error);
    throw error;
  }
}

// Get Expenses history by date
export async function getExpensesByDate(date: string) {
  const currentAccount = await account.get();
  const items = await databases.listDocuments(
    config.databaseId,
    config.transaction_collection_id,
    [Query.equal("user_id", currentAccount.$id), Query.equal("date", date)]
  );
  return items;
}

// Update User Profile
export async function updateUserProfile(
  userId: string,
  updates: {
    user_name?: string;
    // add other fields as needed
  }
) {
  try {
    const updatedUser = await databases.updateDocument(
      config.databaseId,
      config.user_profile_collection_id,
      userId,
      updates
    );
    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

// Get User Profile
export async function getUserProfile() {
  try {
    const currentAccount = await account.get();
    const users = await databases.listDocuments(
      config.databaseId,
      config.user_profile_collection_id,
      [Query.equal("user_id", currentAccount.$id)]
    );

    if (users.documents.length === 0) {
      throw new Error("User profile not found");
    }

    return users.documents[0];
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

//Get Transactions by Date
export const getTransactionsByDate = async (date: string) => {
  try {
    const currentAccount = await account.get();
    const response = await databases.listDocuments(
      config.databaseId,
      config.transaction_collection_id,
      [
        Query.equal("date", date),
        Query.equal("user_id", currentAccount.$id),
        Query.orderDesc("$createdAt"),
        Query.limit(100),
      ]
    );
    return response;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};
