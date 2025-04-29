import { Text, View, TextInput, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import { getCurrentUser, signOut, updateUserProfile } from "@/lib/appwrite";
import { useRouter } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Models } from "appwrite";
import LoadingSVG from "@/components/LoadingSVG";
import LogoHeader from "@/components/LogoHeader";
import CancelButton from "@/components/CancelButton";
const Profile = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<Models.Document | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData = await getCurrentUser();
      if (userData) {
        setUser(userData);
        setEditedUsername(userData.user_name || "");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch user profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsSubmitting(true);
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      Alert.alert("Error", "Failed to sign out");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!editedUsername.trim()) {
      Alert.alert("Error", "Username cannot be empty");
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedUser = await updateUserProfile(user?.$id || "", {
        user_name: editedUsername
      });
      setUser(updatedUser);
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <LoadingSVG />
        </View>
      ) : (
        <View className="flex-1 px-4">
          <LogoHeader />
          <View className="flex-1 items-center justify-center space-y-6">
            <View className="p-4 ">
              <FontAwesome name="user" size={80} color="white" />
            </View>

            {isEditing ? (
              <View className="w-full space-y-4">
                <TextInput
                  value={editedUsername}
                  onChangeText={setEditedUsername}
                  className="bg-gray-800 text-white m-3 px-4 py-3 rounded-lg text-center text-lg"
                  placeholder="Enter new username"
                  placeholderTextColor="#666"
                />
                <View className="flex-row space-x-3">
                  <CustomButton
                    title="Save"
                    handlePress={handleUpdateProfile}
                    containerStyle="flex-1 m-3"
                    isLoading={isSubmitting}
                  />
                  <CustomButton
                    title="Cancel"
                    handlePress={() => {
                      setIsEditing(false);
                      setEditedUsername(user?.user_name || "");
                    }}
                    isLoading={false}
                    containerStyle="flex-1 m-3"
                  />
                </View>
              </View>
            ) : (
              <View className="items-center space-y-4">
                <Text className="text-white font-sore text-2xl font-bold">{user?.user_name}</Text>
                <Text className="text-gray-400 font-sora">{user?.email}</Text>
                <CustomButton
                  title="Edit Profile"
                  handlePress={() => setIsEditing(true)}
                  containerStyle="w-full m-5"
                  textStyle="py-3 px-10"
                  isLoading={false}
                />
              </View>
            )}
          </View>

          <View className="w-full mb-10">
            <CancelButton
              title="Sign Out"
              containerStyle="w-full px-16"
              textStyle="text-3xl"
              handlePress={handleSignOut}
              isLoading={isSubmitting}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Profile;
