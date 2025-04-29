import { useState } from 'react'
import {  Text, View } from 'react-native'
import DatePicker, {  SingleOutput } from 'react-native-neat-date-picker'
import DatePickerButton from './DatePickerButton'
import { getExpensesByDate } from '@/lib/appwrite'
import LoadingSVG from '@/components/LoadingSVG'

const ExpenseDatePicker = () => {
  const [showDatePickerSingle, setShowDatePickerSingle] = useState(false)
  const [amount, setAmount] = useState(0)
  const [date, setDate] = useState("10-02-2025")
  const [isLoading, setIsLoading] = useState(false)

  const openDatePickerSingle = () => setShowDatePickerSingle(true)

  const onCancelSingle = () => {
    // You should close the modal here
    setShowDatePickerSingle(false)
  }

  const onConfirmSingle = async (output: SingleOutput) => {
    setShowDatePickerSingle(false)

    if (output.date && output.dateString) {
      setIsLoading(true)
      try {
        const expenses = await getExpensesByDate(output.dateString)
        setAmount(expenses.documents.reduce((acc, curr) => acc + curr.amount, 0))
        setDate(output.dateString)
      } catch (error) {
        console.error("Error fetching expenses:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <View className='h-[370px] flex flex-col justify-center items-center w-full'>
      {/* Single Date */}
      <DatePickerButton Date={date} handlePress={openDatePickerSingle}/>

      <DatePicker
        isVisible={showDatePickerSingle}
        mode={'single'}
        colorOptions={{
          backgroundColor: 'black',
          headerColor:'#610094',
          dateTextColor:'white',
          selectedDateBackgroundColor:'#610094',
          weekDaysColor:'#610094',
          confirmButtonColor:'#610094',
        }}

        onCancel={onCancelSingle}
        onConfirm={onConfirmSingle}
      />

      {isLoading ? (
        <View className="flex items-center justify-center h-[50px] mt-10">
          <LoadingSVG />
        </View>
      ) : (
        <Text className='text-white font-sora text-xl mt-10 w-full text-center'>{date} : {amount}</Text>
      )}
    </View>
  )
}

export default ExpenseDatePicker


