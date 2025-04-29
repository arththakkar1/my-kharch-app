import {
  View,
  Text,
  ScrollView,
  Alert,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { addItem } from "@/lib/appwrite";
import LogoHeader from "@/components/LogoHeader";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useAppContext } from "@/context/AppContext";
import DatePickerButton from "@/components/DatePickerButton";
import DatePicker, { SingleOutput } from "react-native-neat-date-picker";

const Add = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [isBookmark, setIsBookmark] = useState(false);
  const [priceInput, setPriceInput] = useState("");
  const [date, setDate] = useState("Select Date");
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onConfirm = async (output: SingleOutput) => {
    setShowDatePicker(false);
    setDate(output.dateString);
  };
  const [form, setForm] = useState({
    itemName: "",
    price: null as number | null,
  });

  const { triggerRefresh } = useAppContext();

  const handlePriceChange = (value: string) => {
    setPriceInput(value);
    setForm((prev) => ({ ...prev, price: value ? Number(value) : null }));
  };

  const openDatePicker = () => setShowDatePicker(true);

  const onCancel = () => setShowDatePicker(false);

  const submit = async () => {
    if (form.itemName === "" || form.price === null) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setSubmitting(true);

    try {
      await addItem(form.itemName, form.price, isBookmark, date);
      triggerRefresh();
      // Reset form values
      setForm({
        itemName: "",
        price: null,
      });
      setPriceInput("");
      setIsBookmark(false);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Add item failed");
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
          <LogoHeader />
          <Text className="text-3xl flex justify-start font-sora text-gray-300">
            Add Item
          </Text>

          <FormField
            title="Item Name"
            placeholder="Your item name"
            value={form.itemName}
            handleChangeText={(e) => setForm({ ...form, itemName: e })}
            otherStyles="mt-7 "
          />

          <FormField
            title="Price"
            placeholder="Your price"
            keyboardType="numeric"
            value={priceInput}
            handleChangeText={handlePriceChange}
            otherStyles="mt-7 "
            isNumber={true}
          />
          <View className="mt-9">
            <DatePickerButton Date={date} handlePress={openDatePicker} />
          </View>

          <DatePicker
            isVisible={showDatePicker}
            mode={"single"}
            colorOptions={{
              backgroundColor: "black",
              headerColor: "#610094",
              dateTextColor: "white",
              selectedDateBackgroundColor: "#610094",
              weekDaysColor: "#610094",
              confirmButtonColor: "#610094",
            }}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />

          <View className="flex flex-row justify-between mt-7 items-center">
            <Text className="text-[16px] text-[#CDCDE0] font-poppins font-medium mb-3">
              Bookmark
            </Text>
            <TouchableOpacity onPress={() => setIsBookmark(!isBookmark)}>
              <Text className="text-[16px] text-[#CDCDE0] font-poppins font-medium mb-3">
                {isBookmark ? (
                  <MaterialCommunityIcons
                    name="toggle-switch-outline"
                    size={44}
                    color="#610094"
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="toggle-switch-off-outline"
                    size={44}
                    color="white"
                  />
                )}
              </Text>
            </TouchableOpacity>
          </View>

          <CustomButton
            title="Add Item"
            handlePress={submit}
            containerStyle="mt-7"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Add;
