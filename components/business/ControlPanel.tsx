import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Filters from './Filters';

export default function ControlPanel({
  initialFilters,
  onApply,
}: {
  initialFilters: any;
  onApply: (filters: any) => void;
}) {
  const [search, setSearch] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const primary = useThemeColor({}, 'primary');
  const secondary = useThemeColor({}, 'secondary');
  const text = useThemeColor({}, 'text');
  const border = useThemeColor({}, 'border');

  const examples = [
    'online math tutor',
    'weekend househelp',
    'dog walking gigs',
    'homework help jobs',
    'remote tax assistant',
    'freelance developer',
    'evening babysitter',
    'local gardening work',
    'fitness coach clients',
    'part-time writer',
    'moving help offers',
    'mobile car mechanic',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(animatedValue, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setPlaceholderIndex((prev) => (prev + 1) % examples.length);
        animatedValue.setValue(20);
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={[styles.searchWrapper, { borderColor: border }]}>
          <View style={styles.searchBox}>
            <TextInput
              style={[styles.input, { color: text }]}
              placeholder=''
              placeholderTextColor={secondary}
              value={search}
              onChangeText={setSearch}
            />
            {search === '' && (
              <View style={styles.placeholderContainer}>
                <Text style={[styles.placeholderStatic, { color: secondary }]}>
                  Search for{' '}
                </Text>
                <View style={styles.animatedTextWrapper}>
                  <Animated.Text
                    style={[
                      styles.placeholderAnimated,
                      {
                        color: secondary,
                        transform: [{ translateY: animatedValue }],
                      },
                    ]}
                  >
                    "{examples[placeholderIndex]}"
                  </Animated.Text>
                </View>
              </View>
            )}
            <MaterialIcons name='search' size={20} color={primary} />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.filterButton, { borderColor: border }]}
          onPress={() => setFilterModalVisible(true)}
        >
          <MaterialIcons name='tune' size={20} color={primary} />
        </TouchableOpacity>
      </View>

      <Filters
        visible={filterModalVisible}
        initialFilters={initialFilters}
        onClose={() => setFilterModalVisible(false)}
        onApply={(updatedFilters) => {
          onApply(updatedFilters);
          setFilterModalVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchWrapper: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  placeholderContainer: {
    position: 'absolute',
    left: 5,
    top: 8,
    flexDirection: 'row',
  },
  placeholderStatic: {
    fontSize: 14,
  },
  animatedTextWrapper: {
    height: 20,
    overflow: 'hidden',
  },
  placeholderAnimated: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  filterButton: {
    marginLeft: 8,
    padding: 8,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
});
