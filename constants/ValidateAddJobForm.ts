export const validateTitle = (title: string): string | null => {
  title = title.trim();
  if (!title) return "This field is required";
  if (/^[^a-zA-Z0-9]/.test(title))
    return "Cannot start with a special character";
  if (title === title.toUpperCase() && title.length > 2)
    return "Avoid using all uppercase letters";
  if (title.length > 30) return "Cannot exceed 30 characters";
  return null;
};

export const validateDescription = (desc: string): string | null => {
  desc = desc.trim();
  if (!desc) return "This field is required";
  if (/^[^a-zA-Z0-9]/.test(desc))
    return "Cannot start with a special character";
  if (desc === desc.toUpperCase() && desc.length > 2)
    return "Avoid using all uppercase letters";
  if (desc.length > 150) return "Cannot exceed 150 characters";
  return null;
};

export const validateBudget = (budget: string): string | null => {
  if (!budget.trim()) return "This field is required";
  const value = parseFloat(budget);
  if (isNaN(value) || value <= 0)
    return "Must be a valid number greater than zero";
  return null;
};

export const validateDuration = (duration: string): string | null => {
  if (!duration.trim()) return "This field is required";
  const value = parseInt(duration);
  if (isNaN(value) || value <= 0)
    return "Must be a valid number greater than zero";
  return null;
};
