import { View, Text, Alert, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Dialog } from "@rneui/themed";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { useAppContext } from "@/context/AppContext";
import { getHistoryItems, removeItem, updateItem } from "@/lib/appwrite";
import { Models } from "appwrite";
import RemoveLoadingSVG from "./RemoveLoadingSVG";

const ExpenseItem = ({
  id,
  title,
  date,
  amount,
  isRemoving,
  handleRemove,
  form,
  priceInput,
  handlePriceChange,
  submit,
  isSubmitting,
  toggleDialog,
  visible,
  setForm,
}) => {
  return (
    <View className="flex-row w-full justify-center gap-x-2 items-center">
      <LinearGradient
        colors={["#610094", "#3F0071"]}
        className="rounded-2xl w-[80%] my-3"
        start={[0, 0.5]}
        end={[1, 0.5]}
        style={{ borderRadius: 10 }}
      >
        <View className="px-4 py-2 rounded-xl flex-row justify-between items-center">
          <View>
            <Text className="text-white font-semibold font-sora text-lg">
              {title}
            </Text>
            <Text className="text-gray-300 font-sora">{date}</Text>
          </View>
          <Text className="text-white font-semibold font-sora text-lg">
            ₹ {amount}
          </Text>
        </View>
      </LinearGradient>

      <Button
        color="white"
        onPress={toggleDialog}
        buttonStyle={{ borderRadius: 10 }}
      >
        <Feather name="edit-3" className="p-[5px]" size={24} color="black" />
      </Button>

      <TouchableOpacity
        onPress={handleRemove}
        className="w-14 h-14 rounded-full"
      >
        <LinearGradient
          colors={["#C10000", "#600000"]}
          style={{
            borderRadius: 10,
            padding: 10,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          {isRemoving ? (
            <RemoveLoadingSVG />
          ) : (
            <MaterialCommunityIcons name="cancel" size={25} color="white" />
          )}
        </LinearGradient>
      </TouchableOpacity>

      <Dialog
        isVisible={visible}
        onBackdropPress={toggleDialog}
        overlayStyle={{ backgroundColor: "black" }}
      >
        <View className="flex flex-col gap-y-5">
          <Text className="text-white mb-3 font-semibold text-xl">
            Update Item
          </Text>
          <FormField
            title="Item Name"
            value={form.itemName}
            placeholder="your item name"
            handleChangeText={(e) => setForm({ ...form, itemName: e })}
          />
          <FormField
            title="Price"
            placeholder="your price"
            keyboardType="numeric"
            value={priceInput}
            handleChangeText={handlePriceChange}
            isNumber={true}
          />
          <CustomButton
            title="Update Item"
            handlePress={submit}
            containerStyle="mt-7"
            textStyle="px-10 py-0"
            isLoading={isSubmitting}
          />
        </View>
      </Dialog>
    </View>
  );
};

const TransactionHistoryPage = () => {
  const [expenses, setExpenses] = useState<Models.Document[]>([]);
  const [visibleId, setVisibleId] = useState<string | null>(null);
  const [removingItems, setRemovingItems] = useState<Record<string, boolean>>(
    {}
  );
  const [page, setPage] = useState(1);
  const [formState, setFormState] = useState<
    Record<
      string,
      { itemName: string; price: number | null; priceInput: string }
    >
  >({});
  const [isSubmitting, setSubmitting] = useState(false);
  const ITEMS_PER_PAGE = 10;

  const { refreshTrigger, triggerRefresh } = useAppContext();

  useEffect(() => {
    getHistoryItems().then((res) => {
      setExpenses(
        res.documents.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        })
      );
    });
  }, [refreshTrigger]);

  const toggleDialog = (id: string) => {
    if (visibleId === id) setVisibleId(null);
    else {
      const item = expenses.find((e) => e.$id === id);
      setFormState((prev) => ({
        ...prev,
        [id]: {
          itemName: item?.item_name || "",
          price: item?.amount || null,
          priceInput: item?.amount?.toString() || "",
        },
      }));
      setVisibleId(id);
    }
  };

  const handlePriceChange = (value: string, id: string) => {
    setFormState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        priceInput: value,
        price: value ? Number(value) : null,
      },
    }));
  };

  const handleSubmit = async (id: string) => {
    const { itemName, price } = formState[id];
    if (!itemName || price === null) return Alert.alert("Fill all fields");
    setSubmitting(true);
    try {
      await updateItem(id, itemName, price);
      triggerRefresh();
      setVisibleId(null);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id: string) => {
    setRemovingItems((prev) => ({ ...prev, [id]: true }));
    try {
      await removeItem(id);
      triggerRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingItems((prev) => ({ ...prev, [id]: false }));
    }
  };

  const totalPages = Math.ceil(expenses.length / ITEMS_PER_PAGE);
  const paginated = expenses.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <View className="flex-1">
      <Text className="text-3xl font-sora text-gray-300 p-10">
        History Transaction
      </Text>
      <ScrollView className="px-10">
        {paginated.map((item) => (
          <ExpenseItem
            key={item.$id}
            id={item.$id}
            title={item.item_name}
            date={item.date?.slice(0, 10)}
            amount={item.amount}
            isRemoving={removingItems[item.$id]}
            handleRemove={() => handleRemove(item.$id)}
            toggleDialog={() => toggleDialog(item.$id)}
            visible={visibleId === item.$id}
            form={
              formState[item.$id] || {
                itemName: "",
                price: null,
                priceInput: "",
              }
            }
            priceInput={formState[item.$id]?.priceInput || ""}
            handlePriceChange={(value) => handlePriceChange(value, item.$id)}
            submit={() => handleSubmit(item.$id)}
            isSubmitting={isSubmitting}
            setForm={(form) =>
              setFormState((prev) => ({
                ...prev,
                [item.$id]: { ...prev[item.$id], ...form },
              }))
            }
          />
        ))}
      </ScrollView>
      <View className="flex-row justify-center py-4">
        {[...Array(totalPages)].map((_, i) => (
          <Text
            key={i}
            onPress={() => setPage(i + 1)}
            className={`px-3 py-1 mx-1 rounded font-sora ${
              page === i + 1
                ? "bg-[#610094] text-white"
                : "bg-[#3F0071] text-white"
            }`}
          >
            {i + 1}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default TransactionHistoryPage;
