import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

type CustomButtonType = {
  title: string;
  handlePress: () => void;
  containerStyle?: string;
  textStyle?: string;
  isLoading:boolean,
};

const CustomButton = ({ title, handlePress, containerStyle, textStyle, isLoading }: CustomButtonType) => {
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7} className={`w-full ${containerStyle}`}>
      <LinearGradient
        colors={["#610094", "#3F0071"]} // Lighter purple on left, darker on right
        locations={[0, 1]} // Ensures smooth transition
        start={[0, 0.5]} // Light starts from left-center
        end={[1, 0.5]} // Dark extends to right-center
        style={{
          borderRadius: 16,
          minHeight: 60,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        {isLoading ? (
          <ActivityIndicator
            animating={isLoading}
            color="#fff"
            size="small"
            className="ml-2"
          />
        ) : (
          <Text className={`text-white font-sora text-lg font-bold ${textStyle}`}>
            {title?title:null}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default CustomButton;
