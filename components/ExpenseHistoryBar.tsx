import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Svg, Rect, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { getAllItems } from "@/lib/appwrite";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import LoadingSVG from "@/components/LoadingSVG";
import { useAppContext } from '@/context/AppContext';
import utc from "dayjs/plugin/utc";
dayjs.extend(isoWeek);
dayjs.extend(utc);

type ChartData = {
  day: string;
  value: number;
  date: dayjs.Dayjs;
  amount: number;
};

const ExpensesHistoryPage = () => {
  const { refreshTrigger } = useAppContext(); // Trigger to refresh data
  const [data, setData] = useState<ChartData[]>([]); // Stores chart data
  const [selectedDay, setSelectedDay] = useState<string | null>(null); // Selected day for expenses
  const [totalExpenses, setTotalExpenses] = useState(0); // Total expenses for selected day
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllItems(); // Fetch expenses data
        if (response?.documents) {
          const expenses = response.documents.map(item => ({
            amount: item.amount,
            date: dayjs(item.date),
            
          }));
          setData(groupExpenses(expenses).map(item => ({ ...item, date: item.date }))); // Process and set data
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [refreshTrigger]); // Re-run when refreshTrigger changes

  useEffect(() => {
    if (data.length > 0) {
      const today = dayjs().startOf('day'); // Get today's date without time
      const currentDay = today.format('ddd'); // Get current day's name

  
      // Filter only today's expenses
      const todayExpenses = data.filter(data =>
        data.date && dayjs(data.date).isSame(today, 'day')
      );
  
      // Calculate total amount spent today
      const totalTodayExpenses = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
      setSelectedDay(currentDay);
      setTotalExpenses(totalTodayExpenses);
    }
  }, [data, refreshTrigger]);
  
  
   // Update selected day's expenses

  useEffect(() => {
    const selectedData = data.find(item => item.day === selectedDay);
    if (selectedData) setTotalExpenses(selectedData.value);
  }, [selectedDay, refreshTrigger]); // Update total expenses when day changes

  const groupExpenses = (expenses: { amount: number; date: dayjs.Dayjs }[]): ChartData[] => {
    const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const grouped = Object.fromEntries(labels.map(label => [label, 0])); // Initialize with zero

    expenses.forEach(({ amount, date }) => {
      const day = dayjs(date).format("ddd"); // Get day label
      if (grouped[day] !== undefined) grouped[day] += amount; // Aggregate expenses
    });

    return labels.map(day => ({
      day,
      value: grouped[day],
      date: dayjs(), // Placeholder date, replace with actual date if available
      amount: grouped[day] // Assuming amount is the same as value
    }));
  };

  return (
    <View className="flex flex-col px-5">
      {isLoading ? (
        <View className="flex items-center justify-center h-[300px]">
          <LoadingSVG /> 
        </View>
      ) : (
        <>
    
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
                   
                    <Rect x={xPos} y={200 - height} width={8} height={height} rx={4} ry={4} fill="url(#gradPurple)" />
                  </React.Fragment>
                );
              })}
            </Svg>

            
            <View className="flex-row justify-between mt-2 w-[300px]">
              {data.map(item => (
                <Text
                  key={item.day}
                  style={{ width: 300 / data.length, textAlign: "center" }}
                  onPress={() => setSelectedDay(item.day)}
                  className={`text-xs mt-3 ${item.day === selectedDay ? "text-white font-bold" : "text-gray-400"}`}
                >
                  {item.day}
                </Text>
              ))}
            </View>
          </View>

          <View className="flex flex-row items-center justify-center mt-16 gap-x-2">
            <FontAwesome name="rupee" size={24} color="white" />
            <Text className="text-white text-[28px] font-poppins font-semibold pt-[6px]">
              {totalExpenses}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

export default ExpensesHistoryPage;