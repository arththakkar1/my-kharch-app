import React from 'react'
import Svg, { Circle } from 'react-native-svg'
import { useEffect, useRef } from 'react'
import { Animated, Easing } from 'react-native'

const LoadingSVG = () => {
  const spinValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start()
  }, [])

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <Animated.View style={{ transform: [{ rotate: spin }], padding:3 }}>
      <Svg height="50" width="50" viewBox="0 0 50 50">
        <Circle
          cx="25"
          cy="25"
          r="20"
          stroke="white"
          strokeWidth="2"
          fill="none"
          strokeDasharray="80"
          strokeDashoffset="60"
        />
      </Svg>
    </Animated.View>
  )
}

export default LoadingSVG 