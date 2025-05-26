import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

const ConfirmationModal = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
}: ConfirmationModalProps) => {
  const primary = useThemeColor({}, 'primary');
  const secondary = useThemeColor({}, 'secondary');
  const text = useThemeColor({}, 'text');
  const background = useThemeColor({}, 'background');
  const border = useThemeColor({}, 'border');
  const theme = useThemeColor({}, 'theme');

  return (
    <Modal visible={visible} animationType='slide' transparent>
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: background, borderColor: border },
          ]}
        >
          <Text style={[styles.title, { color: text }]}>{title}</Text>
          <Text style={[styles.message, { color: text }]}>{message}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: primary }]}
              onPress={onConfirm}
            >
              <Text style={[styles.buttonText, { color: 'white' }]}>
                {confirmButtonText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={[styles.buttonText, { color: secondary }]}>
                {cancelButtonText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  cancelButton: {
    width: '100%',
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
  },
  confirmButton: {
    width: '100%',
    padding: 12,
    borderRadius: 50,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
  },
});
