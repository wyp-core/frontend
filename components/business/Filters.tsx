import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface FiltersProps {
  visible: boolean;
  onClose: () => void;
}

export type ModeType = 'remote' | 'onsite' | 'both';
export type SortType = 'nearest' | 'price';

export default function Filters({
  visible,
  onClose,
  onApply,
  initialFilters,
}: FiltersProps & {
  initialFilters: any;
  onApply: (filters: any) => void;
}) {
  const [localFilters, setLocalFilters] = useState(initialFilters);

  useEffect(() => {
    if (!visible) {
      setLocalFilters(initialFilters);
    }
  }, [visible, initialFilters]);

  const primary = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');
  const background = useThemeColor({}, 'background');
  const border = useThemeColor({}, 'border');

  const updateFilter = (key: keyof typeof localFilters, value: any) => {
    setLocalFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <Modal
      animationType='fade'
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[styles.overlay]}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: background, shadowColor: border },
          ]}
        >
          <Text style={[styles.modalTitle, { color: text }]}>Filters</Text>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: text }]}>
              Min Price:{' '}
              <Text style={{ color: primary }}>₹{localFilters.minPrice}</Text>
            </Text>
            <Slider
              minimumValue={100}
              maximumValue={10000}
              step={100}
              value={localFilters.minPrice}
              onValueChange={(value) => updateFilter('minPrice', value)}
              minimumTrackTintColor={primary}
              maximumTrackTintColor={border}
              thumbTintColor={primary}
            />
            <Text style={[styles.sectionTitle, { color: text }]}>
              Max Price:{' '}
              <Text style={{ color: primary }}>
                ₹
                {localFilters.maxPrice === 10000
                  ? '10000+'
                  : localFilters.maxPrice}
              </Text>
            </Text>
            <Slider
              minimumValue={100}
              maximumValue={10000}
              step={100}
              value={localFilters.maxPrice}
              onValueChange={(value) => updateFilter('maxPrice', value)}
              minimumTrackTintColor={primary}
              maximumTrackTintColor={border}
              thumbTintColor={primary}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: text }]}>
              Search Radius:{' '}
              <Text style={{ color: primary }}>
                {localFilters.radius === 50
                  ? '50+ km'
                  : `${localFilters.radius} km`}
              </Text>
            </Text>
            <Slider
              minimumValue={5}
              maximumValue={50}
              step={1}
              value={localFilters.radius}
              onValueChange={(value) => updateFilter('radius', value)}
              minimumTrackTintColor={primary}
              maximumTrackTintColor={border}
              thumbTintColor={primary}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.subSectionTitle, { color: text }]}>Mode</Text>
            <View style={styles.optionRow}>
              {['remote', 'onsite', 'both'].map((item) => (
                <Pressable
                  key={item}
                  style={[
                    styles.optionButton,
                    {
                      borderColor:
                        localFilters.mode === item ? primary : border,
                      backgroundColor:
                        localFilters.mode === item
                          ? primary + '20'
                          : background,
                    },
                  ]}
                  onPress={() => updateFilter('mode', item as ModeType)}
                >
                  <MaterialIcons
                    name={
                      item === 'remote'
                        ? 'wifi'
                        : item === 'onsite'
                        ? 'location-on'
                        : 'public'
                    }
                    size={16}
                    color={localFilters.mode === item ? primary : text}
                    style={styles.icon}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      { color: localFilters.mode === item ? primary : text },
                    ]}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.subSectionTitle, { color: text }]}>
              Sort By
            </Text>
            <View style={styles.optionRow}>
              {['nearest', 'price'].map((item) => (
                <Pressable
                  key={item}
                  style={[
                    styles.optionButton,
                    {
                      borderColor:
                        localFilters.sort === item ? primary : border,
                      backgroundColor:
                        localFilters.sort === item
                          ? primary + '20'
                          : background,
                    },
                  ]}
                  onPress={() => updateFilter('sort', item as SortType)}
                >
                  <MaterialCommunityIcons
                    name={
                      item === 'nearest' ? 'map-marker-outline' : 'currency-inr'
                    }
                    size={16}
                    color={localFilters.sort === item ? primary : text}
                    style={styles.icon}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      { color: localFilters.sort === item ? primary : text },
                    ]}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable
            style={[styles.modalClose, { backgroundColor: primary }]}
            onPress={() => {
              onApply(localFilters); // Pass updated filters to onApply
              onClose();
            }}
          >
            <Text style={{ color: background, fontWeight: 'bold' }}>
              Apply Filters
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'justify',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'justify',
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'justify',
  },
  sliderThumb: {
    width: 20,
    height: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  icon: {
    alignSelf: 'center',
    marginRight: 8,
  },
  modalClose: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
});
