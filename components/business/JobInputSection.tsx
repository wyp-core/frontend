import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function JobInputSection({
  onFocusChange,
}: {
  onFocusChange: (isEditing: boolean) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [userText, setUserText] = useState("");

  const handlePress = () => {
    setIsEditing(true);
    onFocusChange(true);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>What's your price to</Text>

      <View style={styles.card}>
        {isEditing ? (
          <TextInput
            value={userText}
            onChangeText={setUserText}
            placeholder="Describe the task someone might hire you for..."
            placeholderTextColor="#aaa"
            style={styles.input}
            autoFocus
            multiline
          />
        ) : (
          <Pressable onPress={handlePress}>
            <Text style={styles.placeholderText}>
              Tap here to write your post...
            </Text>
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
    backgroundColor: "#f9f9fb",
  },

  heading: {
    fontSize: 28,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 18,
    elevation: 2,
    borderWidth: 0.6,
    borderColor: "#e5e7eb",
    minHeight: 140,
    justifyContent: "center",
  },

  input: {
    fontSize: 18,
    fontWeight: "400",
    color: "#111",
    lineHeight: 26,
    textAlignVertical: "top",
    minHeight: 100,
  },

  placeholderText: {
    fontSize: 18,
    color: "#9ca3af",
    fontStyle: "italic",
    lineHeight: 26,
  },
});
