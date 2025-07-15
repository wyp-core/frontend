import ProgressBar from "@/components/ui/ProgressBar";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";

type StepModalProps = {
  visible: boolean;
  onClose: () => void;
  onNext: () => void;
  onBack: () => void;
  step: number;
  totalSteps: number;
  allowNextStep: boolean | null;
  children: React.ReactNode;
  state: Object;
};

const StepModal = ({
  visible,
  onClose,
  onNext,
  onBack,
  step,
  totalSteps,
  state,
  allowNextStep,
  children,
}: StepModalProps) => {
  const text = useThemeColor({}, "text");
  const border = useThemeColor({}, "border");
  const bg = useThemeColor({}, "background");

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShow = () => setKeyboardVisible(true);
    const keyboardDidHide = () => setKeyboardVisible(false);

    const showSub = Keyboard.addListener("keyboardDidShow", keyboardDidShow);
    const hideSub = Keyboard.addListener("keyboardDidHide", keyboardDidHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: bg }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={[{ flex: 1 }, isKeyboardVisible && { paddingTop: 40 }]}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
            }}
          >
            {!isKeyboardVisible && (
              <ProgressBar currentStep={step} totalSteps={totalSteps} />
            )}
            {!isKeyboardVisible && (
              <Text style={[styles.stepLabel, { color: text }]}>
                Step {step} of {totalSteps}
              </Text>
            )}
            <View style={[styles.modalContent]}>{children}</View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={[styles.footer, { padding: isKeyboardVisible ? 6 : 12 }]}>
          <View style={styles.footerSpacer}>
            <TouchableOpacity
              onPress={() => {
                if (isKeyboardVisible) {
                  Keyboard.dismiss();
                } else {
                  step > 1 ? onBack() : onClose();
                }
              }}
              style={styles.footerButton}
            >
              {isKeyboardVisible ? (
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={24}
                  color={text}
                />
              ) : (
                <Text style={[styles.footerText, { color: text }]}>
                  {step > 1 ? "Back" : "Exit"}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footerSpacerRight}>
            <TouchableOpacity
              onPress={onNext}
              style={[
                styles.footerButton,
                { backgroundColor: allowNextStep ? text : border },
              ]}
              disabled={!allowNextStep}
            >
              <Text style={[styles.footerText, { color: "white" }]}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    flex: 1,
    paddingTop: 40,
  },
  stepLabel: {
    fontSize: 13,
    marginBottom: 16,
    marginTop: 10,
    fontFamily: "Montserrat_600SemiBold",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerSpacer: {
    flex: 1,
    alignItems: "flex-start",
  },
  footerSpacerRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  footerButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontSize: 12,
    borderRadius: 6,
  },
  footerText: {
    fontSize: 13,
    fontFamily: "Montserrat_600SemiBold",
  },
});

export default StepModal;
