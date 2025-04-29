import { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import DatePicker, { SingleOutput } from "react-native-neat-date-picker";
import DatePickerButton from "./DatePickerButton";
import { getTransactionsByDate, removeItem, updateItem } from "@/lib/appwrite";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Dialog } from "@rneui/themed";
import FormField from "./FormField";
import CustomButton from "./CustomButton";
import { useAppContext } from "@/context/AppContext";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import RemoveLoadingSVG from "./RemoveLoadingSVG";

type Transaction = {
  title: string;
  date: string;
  amount: number;
  id: string;
  isRemoving: boolean;
  handleRemove: any;
  form: any;
  priceInput: string;
  handlePriceChange: (text: string) => void;
  submit: () => void;
  isSubmitting: boolean;
  toggleDialog: () => void;
  visible: boolean;
  setForm: any;
};

const TransactionItem = ({
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
}: Transaction) => (
  <>
    <View className="flex-row w-full justify-center gap-x-2 items-center">
      <LinearGradient
        colors={["#610094", "#3F0071"]}
        locations={[0, 1]}
        start={[0, 0.5]}
        end={[1, 0.5]}
        style={{
          borderRadius: 10,
          marginVertical: 6,
          width: "60%",
        }}
        className="rounded-2xl my-3"
      >
        <View className="px-4 py-2 flex-row rounded-2xl justify-between items-center">
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
    </View>
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
  </>
);

const TransactionDatePicker = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [currentPageTransactions, setCurrentPageTransactions] = useState<any[]>(
    []
  );
  const [date, setDate] = useState("Select Date");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [visibleId, setVisibleId] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 5;
  const [removingItems, setRemovingItems] = useState<Record<string, boolean>>(
    {}
  );
  const [formState, setFormState] = useState<
    Record<
      string,
      { itemName: string; price: number | null; priceInput: string }
    >
  >({});
  const [isSubmitting, setSubmitting] = useState(false);
  const { refreshTrigger, triggerRefresh } = useAppContext();

  const toggleDialog = (id: string) => {
    if (visibleId === id) setVisibleId(null);
    else {
      const item = allTransactions.find((e) => e.$id === id);
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

  useEffect(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setCurrentPageTransactions(allTransactions.slice(startIndex, endIndex));
  }, [page, allTransactions]);

  const openDatePicker = () => setShowDatePicker(true);

  const onCancel = () => setShowDatePicker(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const result = await getTransactionsByDate(date);
        setAllTransactions(result.documents);
        setTotalPages(Math.ceil(result.documents.length / ITEMS_PER_PAGE));
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (date !== "Select Date") {
      fetchTransactions();
    }
  }, [date, refreshTrigger]);
  const onConfirm = async (output: SingleOutput) => {
    setShowDatePicker(false);
    setPage(1); // Reset to first page when new date is selected

    if (output.date && output.dateString) {
      setIsLoading(true);
      try {
        const result = await getTransactionsByDate(output.dateString);
        setAllTransactions(result.documents);
        setTotalPages(Math.ceil(result.documents.length / ITEMS_PER_PAGE));
        setDate(output.dateString);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;

    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    // First page
    if (start > 1) {
      buttons.push(
        <Text
          key="1"
          className="px-3 py-1 mx-1 bg-[#3F0071] rounded text-white font-sora"
          onPress={() => handlePageChange(1)}
        >
          1
        </Text>
      );
      if (start > 2)
        buttons.push(
          <Text key="dots1" className="text-white">
            ...
          </Text>
        );
    }

    // Page numbers
    for (let i = start; i <= end; i++) {
      buttons.push(
        <Text
          key={i}
          className={`px-3 py-1 mx-1 rounded font-sora ${
            i === page ? "bg-[#610094] text-white" : "bg-[#3F0071] text-white"
          }`}
          onPress={() => handlePageChange(i)}
        >
          {i}
        </Text>
      );
    }

    // Last page
    if (end < totalPages) {
      if (end < totalPages - 1)
        buttons.push(
          <Text key="dots2" className="text-white">
            ...
          </Text>
        );
      buttons.push(
        <Text
          key={totalPages}
          className="px-3 py-1 mx-1 bg-[#3F0071] rounded text-white font-sora"
          onPress={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Text>
      );
    }

    return buttons;
  };

  return (
    <View
      className={`w-full ${showDatePicker ? "h-screen" : "h-auto"} px-10 mb-5`}
    >
      <Text className="text-3xl mb-5 font-sora text-gray-300">
        Transactions by Date
      </Text>
      <DatePickerButton Date={date} handlePress={openDatePicker} />

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

      {isLoading ? (
        <View className="flex-1 justify-center items-center mt-10">
          <Text className="text-gray-400 font-sora text-2xl">Loading...</Text>
        </View>
      ) : currentPageTransactions.length > 0 ? (
        <View className="flex-1">
          <ScrollView
            className="mt-3"
            showsVerticalScrollIndicator={false}
            scrollEnabled
          >
            {currentPageTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.$id}
                id={transaction.$id}
                date={transaction.date.slice(0, 10)}
                title={transaction.item_name}
                amount={transaction.amount}
                isRemoving={removingItems[transaction.$id]}
                handleRemove={() => handleRemove(transaction.$id)}
                toggleDialog={() => toggleDialog(transaction.$id)}
                visible={visibleId === transaction.$id}
                form={
                  formState[transaction.$id] || {
                    itemName: "",
                    price: null,
                    priceInput: "",
                  }
                }
                priceInput={formState[transaction.$id]?.priceInput || ""}
                handlePriceChange={(value) =>
                  handlePriceChange(value, transaction.$id)
                }
                submit={() => handleSubmit(transaction.$id)}
                isSubmitting={isSubmitting}
                setForm={(form) =>
                  setFormState((prev) => ({
                    ...prev,
                    [transaction.$id]: { ...prev[transaction.$id], ...form },
                  }))
                }
              />
            ))}
          </ScrollView>
          <View className="flex-row justify-center items-center py-4">
            {renderPaginationButtons()}
          </View>
        </View>
      ) : (
        date !== "Select Date" && (
          <View className="flex-1 justify-center items-center mt-10">
            <Text className="text-gray-400 font-sora text-2xl">
              No transactions found for this date
            </Text>
          </View>
        )
      )}
    </View>
  );
};

export default TransactionDatePicker;
