import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Bookmark, Share2, Dumbbell } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { ALL_EXERCISES } from '@/mocks/full-exercise-library';
import { MuscleHeatmapDetail } from '@/components/MuscleHeatmapDetail';



export default function ExerciseDetailScreen() {
  const params = useLocalSearchParams();
  const exerciseId = params.exerciseId || params.id;
  const exercise = ALL_EXERCISES.find(ex => ex.id === exerciseId);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'animation' | 'heatmap'>('animation');

  if (!exercise) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Exercise not found</Text>
      </View>
    );
  }



  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.visualSection}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'animation' && styles.activeTab]}
            onPress={() => setActiveTab('animation')}
          >
            <Text style={[styles.tabText, activeTab === 'animation' && styles.activeTabText]}>
              Animation
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'heatmap' && styles.activeTab]}
            onPress={() => setActiveTab('heatmap')}
          >
            <Text style={[styles.tabText, activeTab === 'heatmap' && styles.activeTabText]}>
              Muscle Map
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'animation' ? (
          <View style={styles.animationContainer}>
            <View style={styles.placeholderContainer}>
              <Dumbbell size={64} color={Colors.mediumGrey} />
              <Text style={styles.placeholderText}>Animation not available</Text>
              <Text style={styles.placeholderSubtext}>Exercise: {exercise.name}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.heatmapContainer}>
            <MuscleHeatmapDetail
              primaryMuscle={exercise.primaryMuscle}
              secondaryMuscles={exercise.secondaryMuscles || []}
            />
          </View>
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Share2 color={Colors.darkGrey} size={20} />
          <Text style={styles.actionButtonText}>Share Exercise</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <Bookmark 
            color={isFavorite ? Colors.primary : Colors.darkGrey} 
            size={20}
            fill={isFavorite ? Colors.primary : 'transparent'}
          />
          <Text style={styles.actionButtonText}>Add to Favorites</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.title}>{exercise.name}</Text>
        <View style={styles.headerBadges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{exercise.difficulty}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{exercise.equipment}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Muscle Groups</Text>
        <View style={styles.muscleInfo}>
          <Text style={styles.muscleLabel}>Primary: </Text>
          <Text style={styles.muscleValue}>{exercise.primaryMuscle}</Text>
        </View>
        {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
          <View style={styles.muscleInfo}>
            <Text style={styles.muscleLabel}>Secondary: </Text>
            <Text style={styles.muscleValue}>{exercise.secondaryMuscles.join(', ')}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Exercise Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Equipment:</Text>
          <Text style={styles.infoValue}>{exercise.equipment}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Difficulty:</Text>
          <Text style={styles.infoValue}>{exercise.difficulty}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
  },
  visualSection: {
    backgroundColor: Colors.white,
    marginBottom: 12,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.mediumGrey,
  },
  activeTabText: {
    color: Colors.primary,
  },
  animationContainer: {
    height: 300,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heatmapContainer: {
    minHeight: 400,
    padding: 20,
  },
  exerciseAnimation: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.mediumGrey,
    marginTop: 16,
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: 14,
    color: Colors.mediumGrey,
    marginTop: 8,
    textAlign: 'center',
  },
  playPauseButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.lightGrey,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.darkGrey,
  },
  titleSection: {
    backgroundColor: Colors.white,
    padding: 20,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.darkGrey,
    marginBottom: 12,
  },
  headerBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.lightGrey,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.darkGrey,
    textTransform: 'capitalize',
  },
  section: {
    backgroundColor: Colors.white,
    padding: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.mediumGrey,
    lineHeight: 24,
  },

  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    color: Colors.darkGrey,
    lineHeight: 22,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: Colors.darkGrey,
    lineHeight: 22,
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: Colors.primary + '20',
  },
  goalText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
  },
  videoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  errorText: {
    fontSize: 16,
    color: Colors.mediumGrey,
    textAlign: 'center',
    marginTop: 40,
  },
  muscleInfo: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  muscleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.darkGrey,
  },
  muscleValue: {
    fontSize: 15,
    color: Colors.mediumGrey,
    textTransform: 'capitalize' as const,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginRight: 8,
  },
  infoValue: {
    fontSize: 15,
    color: Colors.mediumGrey,
    textTransform: 'capitalize' as const,
  },
});
