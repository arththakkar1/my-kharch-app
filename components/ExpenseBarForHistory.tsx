import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Svg, Rect, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { getAllItems } from "@/lib/appwrite";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import LoadingSVG from '@/components/LoadingSVG';
import { useAppContext } from '@/context/AppContext';
dayjs.extend(isoWeek);

type Period = "week" | "month" | "year";

type Expense = {
  amount: number;
  date: dayjs.Dayjs;
};

const ExpensesHistoryPage = () => {
  const { refreshTrigger } = useAppContext();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("week");
  const [rawExpenses, setRawExpenses] = useState<Expense[]>([]);
  const [data, setData] = useState<Array<{ day: string; value: number }>>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch raw data once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllItems();
        if (response?.documents) {
          const expenses = response.documents.map(item => ({
            amount: item.amount,
            date: dayjs(item.date),
          }));
          setRawExpenses(expenses);
          setData(groupExpenses(expenses, selectedPeriod));
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [refreshTrigger]); // Remove selectedPeriod dependency

  // Handle period changes using existing data
  useEffect(() => {
    setData(groupExpenses(rawExpenses, selectedPeriod));
  }, [selectedPeriod, rawExpenses]);

  useEffect(() => {
    if (data.length > 0) {
      let currentDefault;
      switch (selectedPeriod) {
        case "week":
          currentDefault = dayjs().format('ddd');
          break;
        case "month":
          currentDefault = `Week ${dayjs().isoWeek() - dayjs().startOf("month").isoWeek() + 1}`;
          break;
        case "year":
          currentDefault = dayjs().format('MMM');
          break;
      }
      
      const currentPeriodData = data.find(item => item.day === currentDefault);
      if (currentPeriodData) {
        setSelectedDay(currentDefault);
        setTotalExpenses(currentPeriodData.value);
      } else {
        setSelectedDay(data[0].day);
        setTotalExpenses(data[0].value);
      }
    }
  }, [data, selectedPeriod]);

  const generateLabels = (period: Period): string[] => {
    if (period === "week") return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    if (period === "month") return Array.from({ length: 5 }, (_, i) => `Week ${i + 1}`);
    if (period === "year") return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return [];
  };

  const groupExpenses = (expenses: Expense[], period: Period) => {
    const labels = generateLabels(period);
    const grouped = Object.fromEntries(labels.map(label => [label, 0]));

    expenses.forEach(({ amount, date }) => {
      let key;
      switch (period) {
        case "week":
          key = date.format("ddd");
          break;
        case "month":
          key = `Week ${date.isoWeek() - dayjs(date).startOf("month").isoWeek() + 1}`;
          break;
        case "year":
          key = date.format("MMM");
          break;
      }
      if (key in grouped) grouped[key] += amount;
    });

    return labels.map(day => ({ day, value: grouped[day] }));
  };

  return (
    <View className="flex flex-col px-5 flex-1">
      {isLoading ? (
        <View className="flex items-center justify-center h-[300px]">
          <LoadingSVG />
        </View>
      ) : (
        <View className="flex-1">
          {/* Period Selector Buttons */}
          <View className="flex-row justify-center mt-5 gap-x-3">
            {["week", "month", "year"].map((period) => (
              <TouchableOpacity
                key={period}
                onPress={() => setSelectedPeriod(period as Period)}
                className={`px-4 py-2 rounded-lg border border-[#610094] ${
                  selectedPeriod === period ? "bg-[#610094]" : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-sm font-medium capitalize ${
                    selectedPeriod === period ? "text-white" : "text-gray-400"
                  }`}
                >
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Chart */}
          <View className="flex items-center mt-5">
            <Svg width={300} height={220}>
              <Defs>
                <SvgGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#3F0071" stopOpacity="1" />
                  <Stop offset="100%" stopColor="#610094" stopOpacity="1" />
                </SvgGradient>
              </Defs>

              {data.map((item, index) => {
                const barSpacing = 300 / data.length;
                const height = data.length > 0 ? (item.value / Math.max(...data.map(d => d.value))) * 180 : 0;
                const xPos = index * barSpacing + (barSpacing - 6) / 2;
                return (
                  <React.Fragment key={item.day}>
                    <Rect x={xPos - 2} y={20} width={8} height={180} rx={4} ry={4} fill="#23222d" opacity={0.7} />
                    <Rect x={xPos} y={200 - height} width={6} height={height} rx={4} ry={4} fill="url(#gradPurple)" />
                  </React.Fragment>
                );
              })}
            </Svg>

            <View className="flex-row justify-between mt-2 w-[300px]">
              {data.map(item => (
                <Text
                  key={item.day}
                  style={{ width: 300 / data.length, textAlign: "center" }}
                  onPress={() => {
                    setSelectedDay(item.day);
                    setTotalExpenses(item.value);
                  }}
                  className={`text-xs mt-3 ${item.day === selectedDay ? "text-white font-bold" : "text-gray-400"}`}
                >
                  {item.day}
                </Text>
              ))}
            </View>
          </View>

          {/* Total Expenses Display */}
          <View className="flex flex-row items-center justify-center mt-16 gap-x-2">
            <FontAwesome name="rupee" size={24} color="white" />
            <Text className="text-white text-[28px] font-poppins font-semibold pt-[6px]">
              {totalExpenses}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default ExpensesHistoryPage;
