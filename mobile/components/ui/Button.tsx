import type { ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

/**
 * Mobile Button Component
 */

interface MobileButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
}

export function MobileButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}: MobileButtonProps) {
  const styles = StyleSheet.create({
    primary: {
      backgroundColor: '#9CAF88',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
    },
    secondary: {
      backgroundColor: '#FFFFFF',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: '#9CAF88',
    },
    ghost: {
      paddingVertical: 12,
      paddingHorizontal: 24,
    },
    text: {
      fontSize: 16,
      fontWeight: '600',
    },
    primaryText: {
      color: '#FFFFFF',
    },
    secondaryText: {
      color: '#9CAF88',
    },
    ghostText: {
      color: '#9CAF88',
    },
  });

  const buttonStyle = variant === 'primary' ? styles.primary : variant === 'secondary' ? styles.secondary : styles.ghost;
  const textStyle = variant === 'primary' ? styles.primaryText : variant === 'secondary' ? styles.secondaryText : styles.ghostText;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        buttonStyle,
        (disabled || loading) && { opacity: 0.5 },
        pressed && { opacity: 0.8 },
      ]}
    >
      <Text style={[styles.text, textStyle]}>
        {loading ? '...' : title}
      </Text>
    </Pressable>
  );
}

/**
 * Mobile Card Component
 */

interface MobileCardProps {
  children: ReactNode;
  onPress?: () => void;
}

const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export function MobileCard({ children, onPress }: MobileCardProps) {
  return (
    <Pressable
      style={[cardStyles.container, onPress && { opacity: 0.8 }]}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
}

/**
 * Mobile Meal Card
 */

interface MobileMealCardProps {
  name: string;
  calories: number;
  cuisineType: string;
  flavorScore: number;
  mood?: string;
  onPress?: () => void;
}

const mealCardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
    marginVertical: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C2C2C',
  },
});

export function MobileMealCard({
  name,
  calories,
  cuisineType,
  flavorScore,
  mood,
  onPress,
}: MobileMealCardProps) {
  return (
    <Pressable style={mealCardStyles.card} onPress={onPress}>
      <View style={mealCardStyles.header}>
        <Text style={mealCardStyles.title}>{name}</Text>
        <Text style={{ fontSize: 20 }}>😋</Text>
      </View>

      <View style={mealCardStyles.statsContainer}>
        <View style={mealCardStyles.statItem}>
          <Text style={mealCardStyles.statLabel}>Calories</Text>
          <Text style={mealCardStyles.statValue}>{calories}</Text>
        </View>
        <View style={mealCardStyles.statItem}>
          <Text style={mealCardStyles.statLabel}>Cuisine</Text>
          <Text style={mealCardStyles.statValue}>{cuisineType}</Text>
        </View>
        <View style={mealCardStyles.statItem}>
          <Text style={mealCardStyles.statLabel}>Score</Text>
          <Text style={[mealCardStyles.statValue, { color: '#9CAF88' }]}>
            {flavorScore}
          </Text>
        </View>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 12, color: '#999999' }}>
          {mood || 'neutral'} 😊
        </Text>
      </View>
    </Pressable>
  );
}
