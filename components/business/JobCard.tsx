import { formatCurrency, formatViews, timeAgo } from "@/constants/Utils";
import { FontAwesome, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface JobCardProps {
  title: string;
  location: string;
  price: string;
  description: string;
  duration: string;
  mode: string;
  views: number;
  createdAt: number;
}

export default function JobCard({
  title,
  location,
  price,
  description,
  duration,
  mode,
  views,
  createdAt,
}: JobCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>WYP</Text>
          </View>
          <View style={{ marginLeft: 12, flexShrink: 1 }}>
            <Text style={styles.title}>{title.toLowerCase()}</Text>
            <Text style={styles.location}>{location}</Text>
          </View>
        </View>

        <Text style={styles.timeAgo}>{timeAgo(createdAt)}</Text>
      </View>

      <Text style={styles.price}>{formatCurrency(price)}</Text>

      <Text style={styles.description}>
        {description.length > 150
          ? description.slice(0, 100).trim() + "..."
          : description}
      </Text>

      <View style={styles.tagContainer}>
        <View style={styles.tag}>
          <FontAwesome name="eye" size={12} color="#5CB338" />
          <Text style={styles.tagText}>{formatViews(views)}</Text>
        </View>

        <View style={styles.tag}>
          <FontAwesome6
            name={
              mode.toLowerCase() === "remote"
                ? "wifi"
                : mode.toLowerCase() === "onsite"
                ? "location-dot"
                : "globe"
            }
            size={12}
            color={"#5CB338"}
          />

          <Text style={styles.tagText}>{mode}</Text>
        </View>

        <View style={styles.tag}>
          <FontAwesome5 name="clock" size={12} color="#5CB338" />
          <Text style={styles.tagText}>{duration}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.01,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 10,
    elevation: 0.25,
    borderWidth: 1,
    borderColor: "#eee",
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
    backgroundColor: "#5CB338",
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
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },
  location: {
    fontSize: 13,
    color: "#888",
  },
  timeAgo: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
    minWidth: 30,
    textAlign: "right",
    marginTop: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 10,
  },
  description: {
    fontSize: 13,
    color: "#888",
    lineHeight: 20,
    marginBottom: 14,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 4,
    marginTop: 4,
    backgroundColor: "#fbfbfb",
  },
  tagText: {
    fontSize: 12,
    color: "#333",
    marginLeft: 6,
  },
});
