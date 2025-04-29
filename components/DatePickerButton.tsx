import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

const DatePickerButton = ({Date,handlePress}:{Date:string,handlePress:()=>void}) => {
  return (
    <View>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7} className={`w-full px-10 `}>
      <LinearGradient
        colors={["#610094", "#3F0071"]} // Lighter purple on left, darker on right
        locations={[0, 1]} // Ensures smooth transition
        start={[0, 0.5]} // Light starts from left-center
        end={[1, 0.5]} // Dark extends to right-center
        style={{
          borderRadius: 16,
          padding:16,
          minHeight: 60,
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          flexDirection:"row"
        }}
      >
          <Text className={`text-white font-sora text-lg `}>
            {Date}
          </Text>
          <MaterialIcons name="date-range" size={24} color="white" />
      </LinearGradient>
    </TouchableOpacity>
    </View>
  )
}

export default DatePickerButton