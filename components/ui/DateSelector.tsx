import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";

interface DateSelectorProps {
  visible: boolean;
  onClose: () => void;
  onDateChange: (date: Date) => void;
  value: Date | number | null;
  maxDate: Date | number | null;
  minDate: Date | number | null;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  visible,
  onClose,
  onDateChange,
  value,
  maxDate,
  minDate,
}) => {
  const theme = useThemeColor({}, "theme");
  const border = useThemeColor({}, "border");
  const primary = useThemeColor({}, "primary");
  const secondary = useThemeColor({}, "secondary");
  const text = useThemeColor({}, "text");

  const defaultStyles = useDefaultStyles();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalContainer} onPress={onClose}>
        <View
          style={[
            styles.calendarWrapper,
            {
              borderColor: border,
              backgroundColor: theme === "dark" ? "#111" : "#fff",
            },
          ]}
        >
          <DateTimePicker
            mode="single"
            date={value}
            maxDate={maxDate}
            minDate={minDate}
            onChange={(params: any) => onDateChange(params)}
            styles={{
              ...defaultStyles,
              today: { backgroundColor: primary },
              today_label: { color: "#fff" },
              selected: { backgroundColor: primary },
              selected_label: { color: theme === "dark" ? "#000" : "#fff" },
              day_label: { color: text },
              disabled_label: { color: secondary, opacity: 0.5 },
              month: {
                borderColor: border,
                borderWidth: 1,
                borderRadius: 6,
              },
              year: {
                borderColor: border,
                borderWidth: 1,
                borderRadius: 6,
              },
              month_label: {
                color: text,
              },
              month_selector_label: {
                color: text,
                fontSize: 16,
                fontWeight: "500",
              },
              year_label: { color: text },
              year_selector_label: {
                color: text,
                fontSize: 16,
                fontWeight: "500",
              },
              weekday_label: {
                color: secondary,
                fontSize: 12,
                textTransform: "uppercase",
              },
              header: { marginBottom: 5 },

              selected_month: {
                backgroundColor: primary,
                borderColor: primary,
              },
              selected_month_label: {
                color: theme === "dark" ? "#000" : "#fff",
              },
              selected_year: {
                backgroundColor: primary,
                borderColor: primary,
              },
              selected_year_label: {
                color: theme === "dark" ? "#000" : "#fff",
              },
              button_next_image: {
                tintColor: text,
              },
              button_prev_image: {
                tintColor: text,
              },
            }}
          />
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  calendarWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 16,
  },
});

export default DateSelector;
