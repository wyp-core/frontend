import { useThemeColor } from '@/hooks/useThemeColor';
import {
  filterSortOptions,
  modeOptions,
  ModeType,
  SortType,
} from '@/types/job';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import OptionButton from '../ui/OptionButton';

interface FiltersProps {
  visible: boolean;
  onClose: () => void;
}

const Filters = ({
  visible,
  onClose,
  onApply,
  initialFilters,
}: FiltersProps & {
  initialFilters: any;
  onApply: (filters: any) => void;
}) => {
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

  const updateFilter = (key: any, value: any) => {
    if (['mode', 'sort'].includes(key) && localFilters[key] === value) {
      value = null;
    }
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
              Price Range:{' '}
              <Text style={{ color: primary }}>
                ₹{localFilters.minPrice} - ₹
                {localFilters.maxPrice === 10000
                  ? '10000+'
                  : localFilters.maxPrice}
              </Text>
            </Text>
            <MultiSlider
              values={[localFilters.minPrice, localFilters.maxPrice]}
              sliderLength={320}
              onValuesChange={(values) => {
                updateFilter('minPrice', values[0]);
                updateFilter('maxPrice', values[1]);
              }}
              min={100}
              max={10000}
              step={100}
              selectedStyle={{ backgroundColor: primary }}
              unselectedStyle={{ backgroundColor: border }}
              markerStyle={{
                backgroundColor: primary,
                height: 12,
                width: 12,
              }}
            />
          </View>

          <View>
            <Text style={[styles.sectionTitle, { color: text }]}>
              Search Radius:{' '}
              <Text style={{ color: primary }}>
                {localFilters.radius === 50
                  ? '50+ km'
                  : `${localFilters.radius} km`}
              </Text>
            </Text>
            <MultiSlider
              values={[localFilters.radius]}
              sliderLength={320}
              onValuesChange={(values) => updateFilter('radius', values[0])}
              min={5}
              max={51}
              step={1}
              selectedStyle={{ backgroundColor: primary }}
              unselectedStyle={{ backgroundColor: border }}
              markerStyle={{
                backgroundColor: primary,
                height: 12,
                width: 12,
              }}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.subSectionTitle, { color: text }]}>Mode</Text>
            <View style={styles.optionRow}>
              {modeOptions.map(({ key, icon }) => (
                <OptionButton
                  key={key}
                  item={key}
                  selected={localFilters.mode === key}
                  iconName={icon}
                  onPress={(val: ModeType) => updateFilter('mode', val)}
                  displayFunction={(val: string) =>
                    val.charAt(0).toUpperCase() + val.slice(1)
                  }
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.subSectionTitle, { color: text }]}>
              Sort By
            </Text>
            <View style={styles.optionRow}>
              {filterSortOptions.map((option) => (
                <OptionButton
                  key={option.key}
                  item={option.key}
                  selected={localFilters.sort === option.key}
                  iconName={option.icon}
                  onPress={(val) => updateFilter('sort', val as SortType)}
                  displayFunction={() => option.label}
                />
              ))}
            </View>
          </View>

          <Pressable
            style={[styles.modalClose, { backgroundColor: primary }]}
            onPress={() => {
              onApply(localFilters);
              onClose();
            }}
          >
            <Text style={{ fontWeight: 'bold', color: '#fff' }}>
              Apply Filters
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

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
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    position: 'relative',
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
  checkIcon: {
    position: 'absolute',
    right: -5,
    top: -5,
    borderRadius: 50,
  },
  modalClose: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
});

export default Filters;
