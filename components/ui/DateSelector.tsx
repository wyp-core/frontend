import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: Date) => void;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedDay, setSelectedDay] = useState(currentDate);
  const [monthDropdown, setMonthDropdown] = useState(false);
  const [dayDropdown, setDayDropdown] = useState(false);

  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const primary = useThemeColor({}, 'primary');
  const secondary = useThemeColor({}, 'secondary');
  const border = useThemeColor({}, 'border');

  const getDaysInMonth = (monthIndex: number) =>
    new Date(currentYear, monthIndex + 1, 0).getDate();

  const getFilteredDays = () => {
    const total = getDaysInMonth(selectedMonth);
    const start = selectedMonth === currentMonth ? currentDate : 1;
    return Array.from({ length: total - start + 1 }, (_, i) => start + i);
  };

  const renderDropdown = (
    data: any[],
    onItemPress: (item: any, index: number) => void,
    keyExtractor: (item: any, index: number) => string
  ) => (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      style={[styles.dropdownList, { borderColor: border }]}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          style={[styles.dropdownItem, { borderBottomColor: border }]}
          onPress={() => onItemPress(item, index)}
        >
          <Text style={{ color: text }}>{item}</Text>
        </TouchableOpacity>
      )}
    />
  );

  return (
    <Modal visible={visible} transparent animationType='fade'>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={[
            styles.modal,
            { backgroundColor: background, borderColor: border },
          ]}
          activeOpacity={1}
        >
          <Text style={[styles.title, { color: text }]}>
            <View style={styles.titleRow}>
              <MaterialIcons name='calendar-month' color={primary} size={18} />
              <Text style={[styles.titleText, { color: text }]}>
                {' '}
                Select Date
              </Text>
            </View>
          </Text>

          <View style={styles.dropdownRow}>
            <TouchableOpacity
              style={[styles.dropdown, { borderColor: border }]}
              onPress={() => {
                setMonthDropdown(!monthDropdown);
                setDayDropdown(false);
              }}
            >
              <Text style={[styles.dropdownText, { color: text }]}>
                {months[selectedMonth]}
              </Text>
              <Icon name='arrow-drop-down' size={24} color={secondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dropdown, { borderColor: border }]}
              onPress={() => {
                setDayDropdown(!dayDropdown);
                setMonthDropdown(false);
              }}
            >
              <Text style={[styles.dropdownText, { color: text }]}>
                {selectedDay}
              </Text>
              <Icon name='arrow-drop-down' size={24} color={secondary} />
            </TouchableOpacity>
          </View>

          {monthDropdown &&
            renderDropdown(
              months.slice(currentMonth),
              (_, i) => {
                const index = currentMonth + i;
                setSelectedMonth(index);
                if (selectedDay > getDaysInMonth(index)) {
                  setSelectedDay(getDaysInMonth(index));
                }
                setMonthDropdown(false);
              },
              (item) => item
            )}

          {dayDropdown &&
            renderDropdown(
              getFilteredDays(),
              (day) => {
                setSelectedDay(day);
                setDayDropdown(false);
              },
              (item) => item.toString()
            )}

          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: primary }]}
            onPress={() => {
              onSelect(new Date(currentYear, selectedMonth, selectedDay));
              onClose();
            }}
          >
            <Text style={[styles.confirmText, { color: '#fff' }]}>Confirm</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default DatePickerModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modal: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
  },
  title: {
    fontWeight: '700',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  dropdownRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dropdown: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 14,
  },
  dropdownList: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 12,
    maxHeight: 150,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
  },
  confirmButton: {
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#fff',
  },
});
