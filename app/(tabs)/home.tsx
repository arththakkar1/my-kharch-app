import { View, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ExpensesHistory from "@/components/ExpenseHistoryBar";
import LogoHeader from "@/components/LogoHeader";
import BookMarkItems from "@/components/BookMarkItems";
import ExpenseHistory from "@/components/TransactionHistory";
import LoadingSVG from "@/components/LoadingSVG";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <SafeAreaView className="bg-[#000000] h-screen w-full">
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <LoadingSVG />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <LogoHeader />
          <ExpensesHistory />
          <BookMarkItems />
          <ExpenseHistory />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Home;
