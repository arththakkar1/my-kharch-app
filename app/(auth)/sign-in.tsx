import { View, Text, ScrollView, Alert, Dimensions, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { signIn } from "@/lib/appwrite";

const Logo = require("@/assets/images/icon.png");

const SignIn = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setSubmitting(true);

    try {
      await signIn(form.email, form.password);
      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Sign-in failed");
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
          <View className="flex flex-row justify-start gap-x-4 items-center">
            <Image source={Logo} className="h-[39px] w-[39px]" />
            <Text className="font-sora text-white text-[34.07px]">
              MyKharch
            </Text>
          </View>

          <View className="flex flex-row my-7 gap-x-2">
            <Text className="text-2xl font-bold text-white">Log in to</Text>
            <Text className="text-[#610094] text-2xl font-bold">MyKharch</Text>
          </View>

          <FormField
            title="Email"
            placeholder="your email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7 "
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            placeholder="your password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyle="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex font-poppins justify-end pt-5 flex-row gap-2">
            <Text className="text-lg text-white font-medium">
              Don't have an account?
            </Text>
            <Link href="/sign-up">
              <Text className="text-lg font-bold text-[#610094]">Signup</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
