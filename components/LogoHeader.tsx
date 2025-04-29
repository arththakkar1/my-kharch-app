import { View, Text } from 'react-native'
import React from 'react'
import { Image } from 'react-native'

const Logo = require("@/assets/images/icon.png"); // Ensure this file exists



const LogoHeader = () => {
  return (
    <View>
      <View className='flex flex-row justify-center gap-x-4 my-10 items-center'>
          <Image source={Logo} className='h-[35px] w-[35px]'/>
          <Text className='font-sora text-white font-light text-[34.07px]'>
            MyKharch
          </Text>
    </View>
    </View>
  )
}

export default LogoHeader