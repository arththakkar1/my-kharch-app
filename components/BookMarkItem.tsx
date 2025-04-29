import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, Dispatch, SetStateAction } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { addItem, removeBookmarkItem } from "@/lib/appwrite";
import { useAppContext } from "@/context/AppContext";
import RemoveLoadingSVG from "./RemoveLoadingSVG";

type BookMarkItemProps = {
  name: string;
  price: number;
  isTabBookMark: boolean;
  itemId: string;
  Key: number;
  isRemoving?: boolean;
  setRemovingItems?: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
  Date?: string;
};

const BookMarkItem = ({
  name,
  price,
  isTabBookMark,
  itemId,
  Key,
  isRemoving,
  Date,
  setRemovingItems,
}: BookMarkItemProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { triggerRefresh } = useAppContext();

  const handleAdd = async () => {
    setIsLoading(true);
    const item = await addItem(name, price, false, Date);
    triggerRefresh();

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  const handleRemove = async () => {
    if (setRemovingItems) {
      setRemovingItems((prev) => ({ ...prev, [itemId]: true }));
    }
    try {
      await removeBookmarkItem(itemId);
      triggerRefresh();
    } catch (error) {
      console.error("Error removing bookmark:", error);
    } finally {
      if (setRemovingItems) {
        setRemovingItems((prev) => ({ ...prev, [itemId]: false }));
      }
    }
  };

  return (
    <View className="flex flex-row border-none justify-between my-5 mx-10 items-center">
      <View>
        {isTabBookMark && (
          <Text className="text-white text-[16px] font-poppins font-semibold">
            {Key}. {name.length > 20 ? name.slice(0, 20) + "..." : name}
          </Text>
        )}
        {!isTabBookMark && (
          <Text className="text-white text-[16px] font-poppins font-semibold">
            {name.length > 20 ? name.slice(0, 20) + "..." : name}
          </Text>
        )}

        <Text className="text-white text-[16px] font-poppins flex font-semibold">
          <FontAwesome name="rupee" size={15} color="white" />
          <Text className="text-white text-[16px] mx-3 font-poppins font-semibold">
            {price}
          </Text>
        </Text>
      </View>
      <View className="w-14 h-14 gap-x-3 flex flex-row justify-center items-center rounded-full">
        <TouchableOpacity
          onPress={handleAdd}
          activeOpacity={0.7}
          className="w-14 h-14 gap-x-3 flex flex-row justify-center items-center rounded-full"
        >
          <LinearGradient
            colors={["#610094", "#3F0071"]}
            className="border-none"
            locations={[0, 1]}
            start={[0, 0.5]}
            end={[1, 0.5]}
            style={{
              borderRadius: 9999,
              justifyContent: "center",
              borderColor: "none",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            {isLoading ? (
              <View className="flex items-center justify-center">
                <MaterialIcons name="done" size={24} color="white" />
              </View>
            ) : (
              <AntDesign name="plus" size={24} color="white" />
            )}
          </LinearGradient>
        </TouchableOpacity>

        {isTabBookMark && (
          <TouchableOpacity
            onPress={handleRemove}
            className="w-14 h-14 gap-x-3 flex flex-row justify-center items-center rounded-full"
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={["#C10000", "#600000"]}
              locations={[0, 1]}
              start={[0, 0.5]}
              end={[1, 0.5]}
              style={{
                borderRadius: 9999,
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              {isRemoving ? (
                <View className="flex items-center justify-center">
                  <RemoveLoadingSVG />
                </View>
              ) : (
                <MaterialCommunityIcons name="cancel" size={25} color="white" />
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default BookMarkItem;
