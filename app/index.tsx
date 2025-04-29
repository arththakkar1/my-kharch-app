import { View, Text, ScrollView, Image, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import { useGlobalContext } from "@/context/GlobalProvider";

const heroSection = require("@/assets/images/hero-secontion.png");

const Index = () => {
  const { loading, isLogged } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isLogged) {
      router.replace("/home");
    }
  }, [loading, isLogged]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator animating={true} color="#610094" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="w-full h-full justify-center items-center px-4">
          <Image
            source={heroSection}
            className="max-w-[340px] my-7 w-full h-[370px]"
          />
          <View className="flex flex-row">
            <Text className="text-white text-center text-[30px] font-bold font-poppins">
            Handle Endless Expenses with{" "}
            <Text className="text-[#610094] text-[30px] font-bold font-poppins">MyKharch</Text>
            </Text> 

          </View>
          <Text className="text-[15px] font-thin text-[#AAAAAA] text-center p-4 font-poppins">
            Track expenses wisely, budget efficiently, save consistently, and
            invest smartly for financial stability.
          </Text>
          <CustomButton
            title="Continue with Email"
            handlePress={() => {
              router.push("/sign-in");
            }}
            containerStyle="px-10 m-7"
            textStyle=""
            isLoading={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
