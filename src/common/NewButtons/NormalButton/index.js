import React from "react";
import { TouchableOpacity } from "react-native";

export const NormalButton = ({
  children,
  containerStyle,
  onPress,
  iconLeft,
  iconRight,
  disabled,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={containerStyle}
    >
      {iconLeft}
      {children}
      {iconRight}
    </TouchableOpacity>
  );
};
