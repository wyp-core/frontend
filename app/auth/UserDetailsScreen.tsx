import { useThemeColor } from '@/hooks/useThemeColor';
import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker, { useDefaultStyles } from 'react-native-ui-datepicker';

export default function UserDetailsScreen({ navigation }: { navigation: any }) {
  const [name, setName] = useState('');
  const [dob, setDob] = useState<Date | null>(null);
  const [gender, setGender] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const defaultStyles = useDefaultStyles();

  const primary = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');
  const border = useThemeColor({}, 'border');
  const secondary = useThemeColor({}, 'secondary');
  const theme = useThemeColor({}, 'theme');

  const handleSubmit = () => {
    if (name && dob && gender) {
      navigation.navigate('(tabs)');
    }
  };

  return (
    <View style={[styles.container]}>
      <Text style={[styles.title, { color: primary }]}>
        Complete Your Profile
      </Text>
      <Text style={[styles.subtitle, { color: secondary }]}>
        Well done. You have successfully registered. Now, please complete your
        profile.
      </Text>

      <View
        style={[
          styles.inputContainer,
          { borderColor: border, paddingHorizontal: 16, height: 56 },
        ]}
      >
        <TextInput
          style={[styles.input, { color: text }]}
          placeholder='Enter Name'
          placeholderTextColor={secondary}
          value={name}
          onChangeText={setName}
          cursorColor={primary}
        />
      </View>

      <Pressable
        style={[
          styles.inputContainer,
          {
            borderColor: border,
            justifyContent: 'flex-start',
            padding: 16,
            height: 56,
          },
        ]}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={{ color: dob ? text : secondary, fontSize: 16 }}>
          {dob ? dob.toLocaleDateString() : 'Select Date of Birth'}
        </Text>
      </Pressable>

      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType='slide'
        onRequestClose={() => setShowDatePicker(false)}
      >
        <Pressable
          style={styles.modalContainer}
          onPress={() => setShowDatePicker(false)}
        >
          <View
            style={[
              styles.calendarWrapper,
              {
                borderColor: border,
                backgroundColor: theme === 'dark' ? '#111' : '#fff',
              },
            ]}
          >
            <DateTimePicker
              mode='single'
              date={dob || new Date()}
              onChange={(params: any) => {
                setDob(params.date);
                setShowDatePicker(false);
              }}
              styles={{
                ...defaultStyles,
                today: { backgroundColor: primary },
                today_label: { color: '#fff' },
                selected: { backgroundColor: primary },
                selected_label: { color: theme === 'dark' ? '#000' : '#fff' },
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
                  fontWeight: '500',
                },
                year_label: { color: text },
                year_selector_label: {
                  color: text,
                  fontSize: 16,
                  fontWeight: '500',
                },
                weekday_label: {
                  color: secondary,
                  fontSize: 12,
                  textTransform: 'uppercase',
                },
                header: { marginBottom: 5 },

                selected_month: {
                  backgroundColor: primary,
                  borderColor: primary,
                },
                selected_month_label: {
                  color: theme === 'dark' ? '#000' : '#fff',
                },
                selected_year: {
                  backgroundColor: primary,
                  borderColor: primary,
                },
                selected_year_label: {
                  color: theme === 'dark' ? '#000' : '#fff',
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

      <View style={[styles.genderContainer, { borderColor: border }]}>
        <Pressable
          style={[
            styles.genderTab,
            {
              borderColor: gender === 'Male' ? primary : border,
            },
          ]}
          onPress={() => setGender('Male')}
        >
          <FontAwesome name='mars' size={16} color={primary} />
          <Text style={[styles.genderText, { color: text }]}>Male</Text>
        </Pressable>
        <Pressable
          style={[
            styles.genderTab,
            {
              borderColor: gender === 'Female' ? primary : border,
            },
          ]}
          onPress={() => setGender('Female')}
        >
          <FontAwesome name='venus' size={16} color={primary} />
          <Text style={[styles.genderText, { color: text }]}>Female</Text>
        </Pressable>
        <Pressable
          style={[
            styles.genderTab,
            {
              borderColor: gender === 'Others' ? primary : border,
            },
          ]}
          onPress={() => setGender('Others')}
        >
          <FontAwesome name='genderless' size={16} color={primary} />
          <Text style={[styles.genderText, { color: text }]}>Others</Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.button, { backgroundColor: primary }]}
        onPress={handleSubmit}
      >
        <Text style={[styles.buttonText, { color: '#fff' }]}>Submit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    height: 56, // Consistent height
  },
  calendarWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  picker: {
    flex: 1,
    fontSize: 16,
    borderRadius: 8,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 16,
    height: 56,
    gap: 8,
  },
  genderTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 6,
    marginHorizontal: 4,
    fontSize: 14,
    borderWidth: 1,
  },
  genderText: {
    marginLeft: 8,
    fontSize: 14,
  },
});
