import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { formatCurrency, timeAgo } from "@/constants/Utils";
import { Job } from "@/types/job";

interface JobDescriptionModalProps {
  visible: boolean;
  onClose: () => void;
  job: Job;
}

export default function JobDescriptionModal({
  visible,
  onClose,
  job,
}: JobDescriptionModalProps) {
  const text = useThemeColor({}, "text");
  const secondary = useThemeColor({}, "secondary");
  const background = useThemeColor({}, "background");
  const border = useThemeColor({}, "border");
  const primary = useThemeColor({}, "primary");

  const [expandedBid, setExpandedBid] = useState<number | null>(null);

  const {
    title,
    description,
    lat,
    lon,
    price,
    views,
    duration,
    mode,
    createdAt,
  } = job;

  const bids = job.bids || [];

  const toggleExpand = (index: number) => {
    setExpandedBid((prev) => (prev === index ? null : index));
  };

  const animTitle = useRef(new Animated.Value(0)).current;
  const animLocation = useRef(new Animated.Value(0)).current;
  const animDescription = useRef(new Animated.Value(0)).current;
  const animMeta = useRef(new Animated.Value(0)).current;
  const animBudget = useRef(new Animated.Value(0)).current;
  const animBidsHeader = useRef(new Animated.Value(0)).current;
  const animNoBidsSub = useRef(new Animated.Value(0)).current;

  const fadeIn = (anim: Animated.Value, delay: number) =>
    Animated.timing(anim, {
      toValue: 1,
      duration: 300,
      delay,
      useNativeDriver: true,
    });

  const slideFadeStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  });

  useEffect(() => {
    if (visible) {
      animTitle.setValue(0);
      animLocation.setValue(0);
      animDescription.setValue(0);
      animMeta.setValue(0);
      animBudget.setValue(0);
      animBidsHeader.setValue(0);
      animNoBidsSub.setValue(0);

      Animated.stagger(50, [
        fadeIn(animTitle, 0),
        fadeIn(animLocation, 0),
        fadeIn(animDescription, 0),
        fadeIn(animMeta, 0),
        fadeIn(animBudget, 0),
        fadeIn(animBidsHeader, 0),
        ...(bids.length === 0 ? [fadeIn(animNoBidsSub, 200)] : []),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: background }]}>
          <Pressable onPress={onClose} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={text} />
          </Pressable>

          <View style={styles.content}>
            <View>
              <Animated.Text
                style={[
                  styles.title,
                  { color: text },
                  slideFadeStyle(animTitle),
                ]}
              >
                What's your price to {title.toLowerCase()}?
              </Animated.Text>

              <Animated.Text
                style={[
                  styles.location,
                  { color: secondary },
                  slideFadeStyle(animLocation),
                ]}
              >
                {lat}, {lon}
              </Animated.Text>

              <Animated.Text
                style={[
                  styles.description,
                  { color: text },
                  slideFadeStyle(animDescription),
                ]}
              >
                {description}
              </Animated.Text>

              <Animated.View style={slideFadeStyle(animMeta)}>
                <View style={styles.metaContainer}>
                  <View style={[styles.metaPill, { borderColor: border }]}>
                    <MaterialCommunityIcons
                      name="eye-outline"
                      size={14}
                      color={primary}
                    />
                    <Text style={[styles.metaText, { color: text }]}>
                      {views} views
                    </Text>
                  </View>

                  <View style={[styles.metaPill, { borderColor: border }]}>
                    <MaterialIcons name="schedule" size={14} color={primary} />
                    <Text style={[styles.metaText, { color: text }]}>
                      {duration}
                    </Text>
                  </View>

                  <View style={[styles.metaPill, { borderColor: border }]}>
                    <MaterialIcons
                      name={
                        mode.toLowerCase() === "remote" ? "wifi" : "location-on"
                      }
                      size={14}
                      color={primary}
                    />
                    <Text style={[styles.metaText, { color: text }]}>
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Text>
                  </View>
                </View>

                <View style={[styles.metaPill, { borderColor: border }]}>
                  <MaterialIcons
                    name="calendar-today"
                    size={14}
                    color={primary}
                  />
                  <Text style={[styles.metaText, { color: text }]}>
                    Posted {timeAgo(createdAt)}
                  </Text>
                </View>
              </Animated.View>
            </View>

            <View>
              <Animated.View
                style={[
                  styles.budgetContainer,
                  {
                    backgroundColor: background,
                    borderColor: border,
                    ...slideFadeStyle(animBudget),
                  },
                ]}
              >
                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Text style={[styles.statLabel, { color: text }]}>
                      Budget
                    </Text>
                    <Text style={[styles.statValue, { color: primary }]}>
                      {formatCurrency(price)}
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.statBox}>
                    <Text style={[styles.statLabel, { color: text }]}>
                      Highest Bid
                    </Text>
                    <Text style={[styles.statValue, { color: primary }]}>
                      {bids.length > 0
                        ? formatCurrency(
                            [...bids].sort((a, b) => b.amount - a.amount)[0]
                              .amount
                          )
                        : "~"}
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.statBox}>
                    <Text style={[styles.statLabel, { color: text }]}>
                      Bids
                    </Text>
                    <Text style={[styles.statValue, { color: primary }]}>
                      {bids.length}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            </View>

            <Animated.View
              style={[styles.bidsWrapper, slideFadeStyle(animBidsHeader)]}
            >
              <Text style={[styles.subheading, { color: text }]}>Bids</Text>

              <ScrollView
                style={styles.bidsScroll}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={true}
              >
                {bids.length === 0 ? (
                  <Animated.Text
                    style={[
                      styles.noBidsSub,
                      { color: secondary },
                      slideFadeStyle(animNoBidsSub),
                    ]}
                  >
                    No bids have been placed yet.
                  </Animated.Text>
                ) : (
                  bids.map((bid, index) => (
                    <View
                      key={index}
                      style={[
                        styles.bidCard,
                        { borderColor: border, backgroundColor: background },
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => toggleExpand(index)}
                        style={styles.bidHeader}
                      >
                        <Text style={[styles.bidder, { color: text }]}>
                          {bid.name} — {formatCurrency(bid.amount)}
                        </Text>
                        <MaterialIcons
                          name={
                            expandedBid === index
                              ? "expand-less"
                              : "expand-more"
                          }
                          size={20}
                          color={text}
                        />
                      </TouchableOpacity>

                      {expandedBid === index && (
                        <>
                          <Text style={[styles.bidText, { color: secondary }]}>
                            {bid.description}
                          </Text>
                          <TouchableOpacity
                            style={[
                              styles.chatButton,
                              { borderColor: primary },
                            ]}
                          >
                            <MaterialIcons
                              name="chat"
                              size={14}
                              color={primary}
                            />
                            <Text style={[styles.chatText, { color: primary }]}>
                              Chat
                            </Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  ))
                )}
              </ScrollView>
            </Animated.View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  content: {
    flex: 1,
    flexDirection: "column",
  },
  title: {
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
    marginBottom: 2,
    marginTop: 14,
  },
  location: {
    fontSize: 13,
    fontFamily: "Montserrat_500Medium",
  },
  description: {
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    lineHeight: 22,
    marginVertical: 20,
    minHeight: 30,
    alignContent: "center",
  },
  metaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    marginRight: 10,
  },
  metaText: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    marginLeft: 6,
  },
  budgetContainer: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginVertical: 30,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
  },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: "#ddd",
    marginHorizontal: 8,
  },
  bidsWrapper: {
    flex: 1,
    marginTop: 12,
  },
  bidsScroll: {
    flex: 1,
  },
  subheading: {
    fontSize: 17,
    fontFamily: "Montserrat_700Bold",
    marginBottom: 12,
  },
  bidCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  bidHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bidder: {
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
  },
  bidText: {
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 10,
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  chatText: {
    fontSize: 13,
    fontFamily: "Montserrat_500Medium",
    marginLeft: 6,
  },
  noBidsSub: {
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    textAlign: "center",
    paddingHorizontal: 10,
  },
});
