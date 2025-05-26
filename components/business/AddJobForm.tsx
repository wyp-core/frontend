import DatePickerModal from '@/components/ui/DateSelector';
import DurationPickerModal from '@/components/ui/DurationPickerModal';
import { useAddJob } from '@/hooks/useAddJob';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ConfirmationModal from '../ui/ConfirmationModal';

type ModeType = 'remote' | 'onsite' | 'both';

export default function AddJobForm() {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hasDeadline, setHasDeadline] = useState(false);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [mode, setMode] = useState<ModeType>('both');
  const [budget, setBudget] = useState('');
  const [durationValue, setDurationValue] = useState('');
  const [durationUnit, setDurationUnit] = useState('days');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDurationUnit, setSelectedDurationUnit] = useState('days');
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false);

  const primary = useThemeColor({}, 'primary');
  const secondary = useThemeColor({}, 'secondary');
  const text = useThemeColor({}, 'text');
  const background = useThemeColor({}, 'background');
  const border = useThemeColor({}, 'border');

  const { mutate: addJob, isPending } = useAddJob();
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setHasDeadline(false);
    setDeadline(null);
    setMode('both');
    setBudget('');
    setDurationValue('');
    setLocation('');
    setErrors({});
  };

  const confirmHandler = () => {
    resetForm();
    setIsConfirmationModalVisible(false);
  };
  const cancelHandler = () => {
    setIsConfirmationModalVisible(false);
    navigation.navigate('index');
  };

  const handleUseCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }
    let currentLoc = await Location.getCurrentPositionAsync({});
    const coords = currentLoc.coords;
    setLocation(
      `Lat: ${coords.latitude.toFixed(2)}, Lon: ${coords.longitude.toFixed(2)}`
    );
  };

  const handleDateChange = (selectedDate: Date) => {
    setDeadline(selectedDate);
    setErrors({ ...errors, deadline: '' });
    setHasDeadline(true);
  };

  const handleToggleDeadline = (val: boolean) => {
    if (val) {
      setIsDatePickerVisible(true);
    } else {
      setHasDeadline(false);
      setDeadline(null);
      setErrors({ ...errors, deadline: '' });
    }
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = 'Job title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (hasDeadline && !deadline)
      newErrors.deadline = 'Deadline date is required';
    if (!budget.trim()) newErrors.budget = 'Budget is required';
    if (!durationValue.trim()) newErrors.duration = 'Duration is required';
    if (!location.trim()) newErrors.location = 'Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const duration = `${durationValue} ${selectedDurationUnit}`;
      const payload = {
        createdBy: 'b27c70a3-4575-4ed5-a52e-1ee9d07dbc4b',
        title,
        description,
        lat: 40.7128,
        lon: -74.006,
        price: parseFloat(budget),
        category: 'Web Development',
        mode: 'online',
        duration,
      };

      addJob(payload, {
        onSuccess: () => {
          setIsConfirmationModalVisible(true);
        },
        onError: () => {
          Alert.alert(
            'Error',
            'Could not save the job. Please try again later.',
            [{ text: 'OK' }]
          );
        },
      });
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      resetForm();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={'height'}
      keyboardVerticalOffset={0}
    >
      <Text style={[styles.header, { color: text }]}>
        What's your{' '}
        <Text style={[styles.headerHighlight, { color: primary }]}>price</Text>{' '}
        to
      </Text>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { justifyContent: 'space-between' },
        ]}
        keyboardShouldPersistTaps='handled'
      >
        <TextInput
          style={[
            styles.input,
            { color: text, borderColor: border, marginBottom: 4 },
          ]}
          maxLength={50}
          placeholder='Short description (e.g., do my taxes?)'
          placeholderTextColor={secondary}
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            setErrors({ ...errors, title: '' });
          }}
        />
        <View style={styles.infoRow}>
          {errors.title && <Text style={styles.error}>{errors.title}</Text>}
          <Text
            style={[
              styles.charCount,
              { color: title.length >= 45 ? 'red' : secondary },
            ]}
          >
            {title.length}/50
          </Text>
        </View>

        <TextInput
          style={[
            styles.input,
            styles.multilineInput,
            { color: text, borderColor: border, marginBottom: 4 },
          ]}
          multiline
          maxLength={500}
          placeholder='Describe what needs to be done'
          placeholderTextColor={secondary}
          value={description}
          onChangeText={(text) => {
            setDescription(text);
            setErrors({ ...errors, description: '' });
          }}
        />
        <View style={styles.infoRow}>
          {errors.description && (
            <Text style={styles.error}>{errors.description}</Text>
          )}
          <Text
            style={[
              styles.charCount,
              { color: description.length >= 495 ? red : secondary },
            ]}
          >
            {description.length}/500
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.label, { color: text }]}>
            {hasDeadline && deadline
              ? `Deadline: ${deadline.toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}`
              : 'Is there a deadline?'}
          </Text>
          <Switch
            value={hasDeadline}
            onValueChange={handleToggleDeadline}
            trackColor={{ true: primary, false: border }}
            thumbColor={'#f4f4f4'}
          />
        </View>

        <DatePickerModal
          visible={isDatePickerVisible}
          onClose={() => setIsDatePickerVisible(false)}
          onSelect={handleDateChange}
        />

        <View style={styles.optionsRow}>
          {['remote', 'onsite', 'both'].map((item) => (
            <Pressable
              key={item}
              style={[
                styles.optionButton,
                { borderColor: border },
                mode === item && {
                  borderColor: primary,
                  borderWidth: 1,
                },
              ]}
              onPress={() => setMode(item as ModeType)}
            >
              {item === 'onsite' ? (
                <MaterialCommunityIcons
                  name='map-marker-outline'
                  size={16}
                  color={mode === item ? primary : text}
                />
              ) : (
                <MaterialIcons
                  name={
                    item === 'remote'
                      ? 'wifi'
                      : item === 'onsite'
                      ? 'location-on'
                      : 'public'
                  }
                  size={16}
                  color={mode === item ? primary : text}
                />
              )}
              <Text
                style={[
                  styles.optionText,
                  { color: text },
                  mode === item && {
                    color: primary,
                  },
                ]}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.budgetDurationRow}>
          <View
            style={[styles.flexContainer, errors.budget && styles.errorBorder]}
          >
            <Text style={[styles.inputLabel, { color: text }]}>
              Budget (INR)
            </Text>
            <TextInput
              style={[styles.input, { color: text, borderColor: border }]}
              keyboardType='numeric'
              placeholder='e.g., 5000'
              placeholderTextColor={secondary}
              value={budget}
              onChangeText={(text) => {
                setBudget(text);
                setErrors({ ...errors, budget: '' });
              }}
            />
            {errors.budget && <Text style={styles.error}>{errors.budget}</Text>}
          </View>
          <View
            style={[
              styles.flexContainer,
              styles.marginLeft,
              errors.duration && styles.errorBorder,
            ]}
          >
            <Text style={[styles.inputLabel, { color: text }]}>Duration</Text>
            <View style={styles.durationRow}>
              <TextInput
                style={[
                  styles.input,
                  styles.durationInput,
                  { color: text, borderColor: border },
                ]}
                keyboardType='numeric'
                placeholder='2'
                placeholderTextColor={secondary}
                value={durationValue}
                onChangeText={(text) => {
                  setDurationValue(text);
                  setErrors({ ...errors, duration: '' });
                }}
              />
              <TouchableOpacity
                style={[
                  styles.dropdown,
                  styles.durationSelector,
                  { borderColor: border },
                ]}
                onPress={() => setModalVisible(true)}
              >
                <Text style={[styles.dropdownText, { color: text }]}>
                  {selectedDurationUnit}
                </Text>
                <MaterialIcons
                  name='arrow-drop-down'
                  size={20}
                  color={secondary}
                />
              </TouchableOpacity>
            </View>
            {errors.duration && (
              <Text style={styles.error}>{errors.duration}</Text>
            )}
          </View>
        </View>

        <View style={styles.locationRow}>
          <TextInput
            style={[
              styles.input,
              { flex: 1, color: text, borderColor: border },
            ]}
            placeholder='Location'
            placeholderTextColor={secondary}
            value={location}
            onChangeText={(text) => {
              setLocation(text);
              setErrors({ ...errors, location: '' });
            }}
          />
          <Pressable
            onPress={handleUseCurrentLocation}
            style={[styles.locationButton]}
          >
            <MaterialCommunityIcons
              name='navigation-variant-outline'
              size={20}
              color={primary}
            />
          </Pressable>
        </View>
        {errors.location && <Text style={styles.error}>{errors.location}</Text>}
      </ScrollView>

      <Pressable
        style={({ pressed }) => [
          styles.submitButton,
          {
            backgroundColor: primary,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
        onPress={handleSubmit}
        disabled={isPending}
      >
        <Text style={[styles.submitText, { color: '#fff', opacity: 1 }]}>
          Post Job
        </Text>
        {isPending && <ActivityIndicator size='small' color='#fff' />}
      </Pressable>

      <DurationPickerModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        selectedUnit={selectedDurationUnit}
        onSelect={(unit) => {
          setSelectedDurationUnit(unit);
          setModalVisible(false);
        }}
      />
      <ConfirmationModal
        visible={isConfirmationModalVisible}
        message={
          'Your job has been successfully posted and will be live shortly!'
        }
        title={'Job Posted Successfully'}
        onConfirm={confirmHandler}
        onCancel={cancelHandler}
        confirmButtonText='Create new'
        cancelButtonText='Return to home'
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  header: {
    fontSize: 20,
    fontWeight: '800',
    padding: 24,
    paddingBottom: 16,
  },
  headerHighlight: {
    fontWeight: '900',
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 4,
  },
  multilineInput: {
    height: 130,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginBottom: 8,
    flex: 1,
    textAlignVertical: 'center',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: -4,
    marginBottom: 10,
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  dateText: {
    fontWeight: '600',
    fontSize: 14,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 16,
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    gap: 6,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  inr: {
    fontSize: 14,
    fontWeight: '600',
  },
  locationButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderRadius: 12,
  },
  useLocationText: {
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 6,
    marginHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  submitText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#fff',
  },
  rowLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingHorizontal: 2,
  },
  inputLabel: {
    fontWeight: '600',
    fontSize: 14,
    flex: 1,
    textAlign: 'left',
    marginBottom: 6,
    marginLeft: 2,
  },
  budgetDurationRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dropdownText: {
    fontSize: 14,
    textAlign: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  flexContainer: {
    flex: 1,
  },
  marginLeft: {
    marginLeft: 12,
  },
  durationInput: {
    width: '40%',
    height: 40,
    marginRight: 8,
    textAlign: 'center',
  },
  durationSelector: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
  },
  errorBorder: {
    borderColor: 'red',
  },
});
