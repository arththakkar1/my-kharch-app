import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LogoHeader from "@/components/LogoHeader";
import TransactionHistoryPage from "@/components/TransactionHistoryPage";
import ExpensesHistoryPage from "@/components/ExpenseBarForHistory";
import ExpenseDatePicker from "@/components/DatePicker";
import TransactionDatePicker from "@/components/TransactionDatePicker";

const history = () => {
  return (
    <SafeAreaView className="bg-[#000000] h-screen w-full">
      <ScrollView nestedScrollEnabled={true}>
        <LogoHeader />
        <ExpensesHistoryPage />
        <ExpenseDatePicker />
        <TransactionDatePicker />
        <TransactionHistoryPage />
      </ScrollView>
    </SafeAreaView>
  );
};

export default history;
