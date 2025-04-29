import { useCallback, useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import _ from "lodash";

type FormFieldType = {
  title: string;
  value: string;
  placeholder: string;
  handleChangeText: (e: any) => void;
  otherStyles?: string;
  keyboardType?: any;
  isNumber?: boolean;
};

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  keyboardType,
  otherStyles,
  isNumber,
  ...props
}: FormFieldType) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isWrong, setIsWrong] = useState(false);

  const checkIfWrong = (val: string) => {
    if (title === "Email") return !val.includes("@") || val !== val.toLowerCase();
    if (title === "Username") return val.length < 3;
    if (title === "Password") return val.length < 6;
    return false;
  };

  const debouncedCheck = useCallback(
    _.debounce((val: string) => {
      setIsWrong(checkIfWrong(val));
    }, 500),
    [title]
  );

  useEffect(() => {
    debouncedCheck(value);
  }, [value, debouncedCheck]);

  const handleTextChange = (text: string) => {
    if (isNumber) {
      // Remove any non-numeric characters except decimal point
      const cleanedText = text.replace(/[^0-9.]/g, '');
      
      // Prevent multiple decimal points
      const decimalCount = cleanedText.split('.').length - 1;
      if (decimalCount > 1) return;
      
      // Ensure only two decimal places
      if (cleanedText.includes('.')) {
        const [whole, decimal] = cleanedText.split('.');
        if (decimal && decimal.length > 2) return;
      }
      
      handleChangeText(cleanedText);
    } else {
      handleChangeText(text);
    }
  };

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-[16px] text-[#CDCDE0] font-poppins font-medium mb-3">{title?title:null}</Text>

      <View
        className={`w-full h-16 px-4 font-poppins rounded-2xl flex-row items-center bg-[#1E1E2D]`}
        style={{
          borderWidth: 2,
          borderColor: isFocused ? (isWrong ? "red" : "#610094") : "transparent",
        }}
      >
        <TextInput
          className="flex-1 text-white font-semibold font-poppins text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          style={{ fontFamily: "poppinslight", fontWeight: "100", fontSize: 14 }}
          onChangeText={handleTextChange}
          secureTextEntry={title === "Password" && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType={isNumber ? "decimal-pad" : keyboardType}
          maxLength={isNumber ? 10 : undefined}
          {...props}
        />
        <Text>
        {title === "Password" ? (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather name={showPassword ? "eye-off" : "eye"} size={24} color="white" />
          </TouchableOpacity>
        ):(null)}
        </Text>
        
      </View>

      {isFocused && isWrong && (
        <Text className="text-red-500 mt-[5px] text-sm">
        {title === "Email" ? "Invalid email format":null}
        {title === "Username" ? "Username must be at least 3 characters":null}
        {title === "Password" ? "Password must be at least 6 characters":null}
        {!(title === "Email" || title === "Username" || title === "Password") && " "}
      </Text>
      )}
    </View>
  );
};

export default FormField;
