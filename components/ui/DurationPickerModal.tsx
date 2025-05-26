import { useThemeColor } from '@/hooks/useThemeColor';
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

const durationUnits = ['minutes', 'hours', 'days', 'weeks', 'months'];

interface DurationPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (unit: string) => void;
  selectedUnit?: string;
}

const DurationPickerModal: React.FC<DurationPickerModalProps> = ({
  visible,
  onClose,
  onSelect,
  selectedUnit,
}) => {
  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const primary = useThemeColor({}, 'primary');
  const secondary = useThemeColor({}, 'secondary');
  const border = useThemeColor({}, 'border');

  const currentIndex = selectedUnit ? durationUnits.indexOf(selectedUnit) : 0;

  const [selectedIndex, setSelectedIndex] = useState(currentIndex);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const renderDropdown = () => (
    <FlatList
      data={durationUnits}
      keyExtractor={(item) => item}
      style={[styles.dropdownList, { borderColor: border }]}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          style={[styles.dropdownItem, { borderBottomColor: border }]}
          onPress={() => {
            setSelectedIndex(index);
            setDropdownOpen(false);
          }}
        >
          <Text
            style={{
              color: index === selectedIndex ? primary : text,
              fontWeight: index === selectedIndex ? '700' : '400',
            }}
          >
            {item}
          </Text>
        </TouchableOpacity>
      )}
    />
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
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
          <View style={styles.titleRow}>
            <Icon name='timer' size={18} color={primary} />
            <Text style={[styles.titleText, { color: text }]}>
              {' '}
              Select Duration Unit
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.dropdown, { borderColor: border }]}
            onPress={() => setDropdownOpen(!dropdownOpen)}
          >
            <Text style={[styles.dropdownText, { color: text }]}>
              {durationUnits[selectedIndex]}
            </Text>
            <Icon
              name={dropdownOpen ? 'arrow-drop-up' : 'arrow-drop-down'}
              size={24}
              color={secondary}
            />
          </TouchableOpacity>

          {dropdownOpen && renderDropdown()}

          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: primary }]}
            onPress={() => {
              onSelect(durationUnits[selectedIndex]);
              onClose();
            }}
          >
            <Text style={[styles.confirmText]}>Confirm</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default DurationPickerModal;

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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  dropdown: {
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
