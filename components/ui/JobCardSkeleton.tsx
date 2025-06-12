import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useEffect } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

const JobCardSkeleton = () => {
  const background = useThemeColor({}, 'background');
  const shimmerBase = useThemeColor({}, 'border');
  const shimmerHighlight = useThemeColor({}, 'text');

  const shimmerValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const shimmerTranslate = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['-100%', '100%'],
  });

  return (
    <View
      style={[
        styles.card,
        {
          borderColor: `${shimmerBase}`,
        },
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: shimmerBase, opacity: 0.5 },
          ]}
        />
        <View style={styles.titleBlock}>
          <View
            style={[
              styles.titleLine,
              { backgroundColor: shimmerBase, opacity: 0.5 },
            ]}
          />
          <View
            style={[
              styles.subLine,
              { backgroundColor: shimmerBase, opacity: 0.4 },
            ]}
          />
        </View>
      </View>

      <View
        style={[
          styles.priceLine,
          { backgroundColor: shimmerBase, opacity: 0.5 },
        ]}
      />

      <View
        style={[
          styles.descriptionLine,
          { backgroundColor: shimmerBase, opacity: 0.4 },
        ]}
      />
      <View
        style={[
          styles.descriptionLine,
          { width: '70%', backgroundColor: shimmerBase, opacity: 0.4 },
        ]}
      />

      {/* Tags */}
      <View style={styles.tags}>
        {[...Array(3)].map((_, i) => (
          <View
            key={i}
            style={[styles.tag, { backgroundColor: shimmerBase, opacity: 0.4 }]}
          />
        ))}
      </View>

      <Animated.View
        style={[
          styles.shimmerOverlay,
          {
            backgroundColor: shimmerHighlight,
            opacity: 0.15,
            transform: [{ translateX: shimmerTranslate }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    borderWidth: 0.75,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  titleBlock: {
    marginLeft: 12,
    flex: 1,
  },
  titleLine: {
    height: 14,
    width: '60%',
    borderRadius: 4,
    marginBottom: 6,
  },
  subLine: {
    height: 12,
    width: '40%',
    borderRadius: 4,
  },
  priceLine: {
    height: 16,
    width: '30%',
    borderRadius: 4,
    marginBottom: 10,
  },
  descriptionLine: {
    height: 10,
    width: '90%',
    borderRadius: 4,
    marginBottom: 6,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  tag: {
    height: 24,
    width: 60,
    borderRadius: 6,
  },
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
  },
});

export default JobCardSkeleton;
