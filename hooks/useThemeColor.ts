/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from "@/constants/Colors";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof (typeof Colors)["light"]
) {
  const theme = "light";
  const colorFromProps = props[theme];
  if (colorFromProps) {
    return colorFromProps;
  }
  return Colors[theme][colorName];
}
