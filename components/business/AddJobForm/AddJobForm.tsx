import { useLocation } from "@/context/LocationContext";
import { useAddJob } from "@/hooks/jobs/useAddJob";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CreateJobPayload, ModeType } from "@/types/job";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useReducer, useState } from "react";
import { Alert, View } from "react-native";
import ConfirmationModal from "../../ui/ConfirmationModal";
import Geolocation from "../Geolocation";
import StepFive from "./StepFive";
import StepFour from "./StepFour";
import StepModal from "./StepModal";
import StepOne from "./StepOne";
import StepThree from "./StepThree";
import StepTwo from "./StepTwo";
import {
  validateBudget,
  validateDescription,
  validateDuration,
  validateTitle,
} from "@/constants/ValidateAddJobForm";

type FormState = {
  title: string;
  description: string;
  budget: string;
  duration: string;
  durationUnit: string;
  hasDeadline: boolean;
  deadline: Date | null;
  mode: ModeType;
  location: { lat: number; lon: number; address?: string } | null;
  errors: { [key: string]: string };
};

type FormAction =
  | { type: "SET_FIELD"; field: keyof Omit<FormState, "errors">; value: any }
  | { type: "SET_ERROR"; field: string; message: string }
  | { type: "CLEAR_ERRORS" }
  | { type: "RESET"; payload?: Partial<FormState> };

const AddJobForm = () => {
  const { selectedLocation } = useLocation();

  const initialFormState: FormState = {
    title: "",
    description: "",
    budget: "",
    duration: "",
    durationUnit: "days",
    hasDeadline: false,
    deadline: null,
    mode: "remote",
    location: selectedLocation,
    errors: {},
  };

  const formReducer = (state: FormState, action: FormAction) => {
    switch (action.type) {
      case "SET_FIELD":
        return {
          ...state,
          [action.field]: action.value,

          errors: {
            ...state.errors,
            [action.field]: "",
          },
        };

      case "SET_ERROR":
        return {
          ...state,
          errors: {
            ...state.errors,
            [action.field]: action.message,
          },
        };

      case "CLEAR_ERRORS":
        return {
          ...state,
          errors: {},
        };

      case "RESET":
        return initialFormState;

      default:
        return state;
    }
  };

  const navigation = useNavigation<any>();
  const [state, dispatch] = useReducer(formReducer, initialFormState);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showGeolocationModal, setShowGeolocationModal] = useState(false);
  const [step, setStep] = useState(1);
  const [showAddFormModal, setShowAddFormModal] = useState(true);

  const { mutate: addJob, isPending } = useAddJob();

  const {
    title,
    description,
    budget,
    duration,
    durationUnit,
    hasDeadline,
    deadline,
    mode,
    location,
    errors,
  } = state;

  const resetForm = () => dispatch({ type: "RESET" });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Job title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (hasDeadline && !deadline)
      newErrors.deadline = "Deadline date is required";
    if (!budget.trim()) newErrors.budget = "Budget is required";
    if (!duration.trim()) newErrors.duration = "Duration is required";
    if (!location) newErrors.location = "Location is required";

    if (Object.keys(newErrors).length > 0) {
      Object.entries(newErrors).forEach(([field, message]) => {
        dispatch({ type: "SET_ERROR", field, message });
      });
      return false;
    }

    dispatch({ type: "CLEAR_ERRORS" });
    return true;
  };

  const isStepValid = (): boolean => {
    switch (step) {
      case 1:
        return !validateTitle(state.title);

      case 2:
        return (
          !validateDescription(state.description) &&
          !(state.description.length < 50)
        );

      case 3:
        return !validateDuration(state.duration);

      case 5:
        return !validateBudget(state.budget);

      default:
        return true;
    }
  };

  const confirmHandler = () => {
    setShowConfirmationModal(false);
    setStep(1);
    resetForm();
  };
  const cancelHandler = () => {
    setShowConfirmationModal(false);
    navigation.navigate("index");
  };

  const handleSubmit = () => {
    if (validate()) {
      const payload: CreateJobPayload = {
        createdBy: "b27c70a3-4575-4ed5-a52e-1ee9d07dbc4b",
        title,
        description,
        lat: location?.lat,
        lon: location?.lon,
        price: parseFloat(budget),
        mode,
        duration: `${duration} ${durationUnit}`,
        deadline: hasDeadline ? deadline : null,
      };

      addJob(payload, {
        onSuccess: () => {
          resetForm();
          setShowConfirmationModal(true);
        },
        onError: () => {
          Alert.alert(
            "Error",
            "Could not save the job. Please try again later.",
            [{ text: "OK" }]
          );
        },
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepOne title={title} errors={errors} dispatch={dispatch} />;
      case 2:
        return (
          <StepTwo
            description={description}
            errors={errors}
            dispatch={dispatch}
          />
        );
      case 3:
        return (
          <StepThree
            hasDeadline={hasDeadline}
            deadline={deadline}
            duration={duration}
            durationUnit={durationUnit}
            errors={errors}
            dispatch={dispatch}
          />
        );
      case 4:
        return (
          <StepFour
            mode={mode}
            location={location}
            errors={errors}
            dispatch={dispatch}
            setShowGeolocationModal={setShowGeolocationModal}
          />
        );
      case 5:
        return <StepFive budget={budget} errors={errors} dispatch={dispatch} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", resetForm);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (selectedLocation) {
      dispatch({
        type: "SET_FIELD",
        field: "location",
        value: selectedLocation,
      });
    }
  }, [selectedLocation]);

  return (
    <View>
      <StepModal
        visible={showAddFormModal}
        step={step}
        totalSteps={5}
        onNext={() => {
          if (step === 5) {
            handleSubmit();
            return;
          }
          setStep(step + 1);
        }}
        onBack={() => {
          setStep(step - 1);
        }}
        onClose={() => {
          navigation.navigate("index");
          setStep(1);
          resetForm();
        }}
        allowNextStep={isStepValid()}
        state={state}
      >
        {renderStep()}
      </StepModal>

      <ConfirmationModal
        visible={showConfirmationModal}
        message={
          "Your job has been successfully posted and will be live shortly!"
        }
        title={"Job Posted Successfully"}
        onConfirm={confirmHandler}
        onCancel={cancelHandler}
        confirmButtonText="Create new"
        cancelButtonText="Return to home"
      />

      <Geolocation
        visible={showGeolocationModal}
        onClose={() => setShowGeolocationModal(false)}
      />
    </View>
  );
};

export default AddJobForm;
