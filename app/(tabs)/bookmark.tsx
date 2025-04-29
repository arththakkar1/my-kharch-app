import { View } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import LogoHeader from "@/components/LogoHeader";
import BookMarkPageItems from "@/components/BookmarkPageItems";
import LoadingSVG from "@/components/LoadingSVG";

const Bookmark = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <SafeAreaView className="bg-[#000000] h-screen w-full">
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <LoadingSVG />
        </View>
      ) : (
        <>
          <LogoHeader />
          <BookMarkPageItems />
        </>
      )}
    </SafeAreaView>
  );
};

export default Bookmark;
