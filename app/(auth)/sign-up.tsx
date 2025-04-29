import { View, Text,ScrollView, Alert, Dimensions, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import { createUser } from '@/lib/appwrite'

const Logo = require("@/assets/images/icon.png"); // Ensure this file exists


const SignUp = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username:"",
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);
    try {
      const result = await createUser(form.email, form.password, form.username);
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error","Please enter correct data");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-[#000000] h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center font-poppins h-full px-12 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <View className='flex flex-row justify-start gap-x-4 items-center'>
          <Image source={Logo} className='h-[39px] w-[39px]'/>
          <Text className='font-sora text-white text-[34.07px]'>
            MyKharch
          </Text>
          </View>


          <Text className="text-2xl font-bold font-poppins my-4 text-white mt-10 font-psemibold">
            Sign Up to <Text className='text-[#610094]'>MyKharch</Text>
          </Text>

          <FormField
            title="Username"
            placeholder='your unique username'
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-7 "
          />

          <FormField
            title="Email"
            placeholder='your email'
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7 "
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            placeholder='your password'
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyle="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex font-poppins justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-white font-medium">
              Already have an account?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-bold text-[#610094]"
            >
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp