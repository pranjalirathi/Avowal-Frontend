import React from "react";
import { Text } from "react-native";

export const renderContentWithMentions = (text, baseStyle, mentionStyle) => {
  const parts = text.split(/(@\w+)/g);

  return parts.map((part, index) => {
    if (part.match(/^@\w+$/)) {
      return (
        <Text key={index} style={[baseStyle, mentionStyle]}>
          {part}
        </Text>
      );
    }
    return (
      <Text key={index} style={baseStyle}>
        {part}
      </Text>
    );
  });
};
