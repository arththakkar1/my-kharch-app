import { View, Text, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { getHistoryItems } from "@/lib/appwrite";
import { Models } from "appwrite";
import LoadingSVG from "@/components/LoadingSVG";
import { useAppContext } from "@/context/AppContext";

type Expense = {
  title: string;
  date: string;
  amount: number;
  id: string;
};

const ExpenseItem = ({ title, date, amount }: Expense) => (
  <LinearGradient
    colors={["#610094", "#3F0071"]}
    locations={[0, 1]}
    start={[0, 0.5]}
    end={[1, 0.5]}
    style={{
      borderRadius: 10,
      marginVertical: 6,
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
);

const TransactionHistoryPage = () => {
  const { refreshTrigger } = useAppContext();
  const [expenses, setExpenses] = useState<Models.Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const expenses = await getHistoryItems();
        setExpenses(
          expenses.documents
            .sort((a, b) => {
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            })
            .slice(0, 3)
        );
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExpenses();
  }, [refreshTrigger]);

  return (
    <View className="p-10">
      <Text className="text-3xl mb-5 font-sora text-gray-300 mt-5">
        History Transaction
      </Text>
      {isLoading ? (
        <View className="flex items-center justify-center h-[200px]">
          <LoadingSVG />
        </View>
      ) : expenses.length === 0 ? (
        <View className="flex items-center justify-center h-[200px]">
          <Text className="text-gray-300 font-sora text-2xl">
            No transaction history
          </Text>
        </View>
      ) : (
        <ScrollView>
          {expenses.map((item) => (
            <ExpenseItem
              key={item.$id}
              id={item.$id}
              date={item.date.slice(0, 10)}
              title={item.item_name}
              amount={item.amount}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default TransactionHistoryPage;
