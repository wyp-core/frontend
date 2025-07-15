import { formatCurrency, formatViews, timeAgo } from "@/constants/Utils";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface JobCardProps {
  title: string;
  lat: number;
  lon: number;
  price: string;
  description: string;
  duration: string;
  mode: string;
  views: number;
  createdAt: number;
  onPress: () => void;
}

const JobCard = ({
  title,
  lat,
  lon,
  price,
  description,
  duration,
  mode,
  views,
  createdAt,
  onPress,
}: JobCardProps) => {
  const primary = useThemeColor({}, "primary");
  const text = useThemeColor({}, "text");
  const background = useThemeColor({}, "background");
  const border = useThemeColor({}, "border");
  const secondary = useThemeColor({}, "secondary");

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          borderColor: border,
          shadowColor: background,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={[styles.avatar, { backgroundColor: primary }]}>
            <Text style={styles.avatarText}>WYP</Text>
          </View>
          <View style={{ marginLeft: 12, flexShrink: 1 }}>
            <Text style={[styles.title, { color: text }]}>
              {"to " + title.toLowerCase()}
            </Text>
            <Text style={[styles.location, { color: secondary }]}>
              {lat} {lon}
            </Text>
          </View>
        </View>

        <Text style={[styles.timeAgo, { color: secondary }]}>
          {timeAgo(createdAt)}
        </Text>
      </View>

      <Text style={[styles.price, { color: text }]}>
        {formatCurrency(price)}
      </Text>

      <Text style={[styles.description, { color: secondary }]}>
        {description.length > 75
          ? description.slice(0, 75).trim() + "..."
          : description}
      </Text>

      <View style={styles.tagContainer}>
        <View style={[styles.tag]}>
          <MaterialCommunityIcons
            name="eye-outline"
            size={15}
            color={primary}
          />
          <Text style={[styles.tagText, { color: text }]}>
            {formatViews(views)}
          </Text>
        </View>

        <View style={[styles.tag]}>
          {mode.toLowerCase() === "onsite" ? (
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={15}
              color={primary}
            />
          ) : (
            <MaterialIcons
              name={
                mode.toLowerCase() === "remote"
                  ? "wifi"
                  : mode.toLowerCase() === "onsite"
                  ? "location-on"
                  : "public"
              }
              size={15}
              color={primary}
            />
          )}
          <Text style={[styles.tagText, { color: text }]}>
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </Text>
        </View>
      </View>

      <View style={[styles.tag]}>
        <MaterialIcons name="schedule" size={15} color={primary} />
        <Text style={[styles.tagText, { color: text }]}>{duration}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 10,
    shadowOpacity: 0.01,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 10,
    elevation: 1,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 1,
  },
  title: {
    fontSize: 18,
    marginBottom: 4,
    fontFamily: "Montserrat_600SemiBold",
    letterSpacing: -0.5,
  },
  location: {
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
  },
  timeAgo: {
    fontSize: 12,
    minWidth: 30,
    textAlign: "right",
    marginTop: 4,
    fontFamily: "Montserrat_500Medium",
  },
  price: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: "Montserrat_600SemiBold",
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 4,
    fontFamily: "Montserrat_400Regular",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 5,
    marginTop: 4,
  },
  tagText: {
    fontSize: 12,
    marginLeft: 6,
    fontFamily: "Montserrat_500Medium",
  },
});

export default JobCard;
