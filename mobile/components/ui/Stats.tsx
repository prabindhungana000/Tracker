import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Mobile StatBlock Component
 */

interface MobileStatBlockProps {
  icon: string;
  label: string;
  value: string | number;
  color?: string;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 8,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
});

export function MobileStatBlock({
  icon,
  label,
  value,
}: MobileStatBlockProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

/**
 * Mobile Progress Ring Component
 */

interface MobileProgressRingProps {
  value: number;
  max: number;
  label: string;
  size?: number;
}

const progressStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
    color: '#999999',
    marginTop: 8,
  },
});

export function MobileProgressRing({
  value,
  max,
  label,
  size = 100,
}: MobileProgressRingProps) {
  const percentage = (value / max) * 100;

  return (
    <View style={progressStyles.container}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#F5F3EF',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 4,
          borderColor: '#9CAF88',
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#2C2C2C' }}>
          {value}
        </Text>
        <Text style={{ fontSize: 10, color: '#999999' }}>/ {max}</Text>
      </View>
      <Text style={progressStyles.text}>{label}</Text>
    </View>
  );
}

/**
 * Mobile Achievement Badge
 */

interface MobileAchievementBadgeProps {
  icon: string;
  title: string;
  unlocked: boolean;
}

const achievementStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  badge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#9CAF88',
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2C',
    textAlign: 'center',
  },
  locked: {
    opacity: 0.5,
  },
});

export function MobileAchievementBadge({
  icon,
  title,
  unlocked,
}: MobileAchievementBadgeProps) {
  return (
    <View style={[achievementStyles.container, !unlocked && achievementStyles.locked]}>
      <View style={achievementStyles.badge}>
        <Text style={achievementStyles.icon}>{icon}</Text>
      </View>
      <Text style={achievementStyles.title}>{title}</Text>
    </View>
  );
}
