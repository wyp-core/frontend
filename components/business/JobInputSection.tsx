import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export default function JobInputSection({
  onFocusChange,
}: {
  onFocusChange: (isEditing: boolean) => void;
}) {
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const secondary = useThemeColor({}, "secondary");
  const border = useThemeColor({}, "border");

  const [isEditing, setIsEditing] = useState(false);
  const [userText, setUserText] = useState("");

  const handlePress = () => {
    setIsEditing(true);
    onFocusChange(true);
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: background }]}>
      <Text style={[styles.heading, { color: text }]}>
        What's your price to
      </Text>

      <View
        style={[
          styles.card,
          { backgroundColor: background, borderColor: border },
        ]}
      >
        {isEditing ? (
          <TextInput
            value={userText}
            onChangeText={setUserText}
            placeholder="Describe the task someone might hire you for..."
            placeholderTextColor={secondary}
            style={[styles.input, { color: text }]}
            autoFocus
            multiline
          />
        ) : (
          <Pressable onPress={handlePress}>
            <Text
              style={[styles.placeholderText, { color: secondary }]}
            >{`Tap here to write your post...`}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  heading: {
    fontSize: 28,
    fontWeight: "500",
    marginBottom: 16,
  },

  card: {
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 18,
    elevation: 2,
    borderWidth: 0.6,
    minHeight: 140,
    justifyContent: "center",
  },

  input: {
    fontSize: 18,
    fontWeight: "400",
    lineHeight: 26,
    textAlignVertical: "top",
    minHeight: 100,
  },

  placeholderText: {
    fontSize: 18,
    fontStyle: "italic",
    lineHeight: 26,
  },
});
