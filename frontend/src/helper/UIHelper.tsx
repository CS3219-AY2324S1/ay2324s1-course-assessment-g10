/// maps difficulty value to appropriate colors
export const diffToScheme = (diff: number) => {
  if (diff < 3) {
    return "green";
  }
  if (diff < 6) {
    return "yellow";
  }
  if (diff < 8) {
    return "orange";
  }
  return "red";
};