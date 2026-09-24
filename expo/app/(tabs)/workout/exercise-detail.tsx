import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Bookmark, Share2, Dumbbell } from 'lucide-react-native';
import { Palette } from '@/constants/theme';
import { ALL_EXERCISES } from '@/mocks/full-exercise-library';
import { AnatomicalMuscleMap } from '@/components/AnatomicalMuscleMap';
import ExerciseDemo from '@/components/ExerciseDemo';
import { getExerciseEnrichment } from '@/mocks/exercise-enrichment';



export default function ExerciseDetailScreen() {
  const params = useLocalSearchParams();
  const exerciseId = params.exerciseId || params.id;
  const exercise = ALL_EXERCISES.find(ex => ex.id === exerciseId);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'animation' | 'heatmap'>('animation');
  const { width: windowWidth } = useWindowDimensions();
  const enrichment = useMemo(
    () => (typeof exerciseId === 'string' ? getExerciseEnrichment(exerciseId) : undefined),
    [exerciseId],
  );

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
            {enrichment && enrichment.imageUrls.length > 0 ? (
              // Start/end frames from free-exercise-db, crossfaded into a looping demo.
              <ExerciseDemo imageUrls={enrichment.imageUrls} width={windowWidth - 32} height={240} />
            ) : (
              <View style={styles.placeholderContainer}>
                <Dumbbell size={64} color={Palette.inkMuted} />
                <Text style={styles.placeholderText}>Animation not available</Text>
                <Text style={styles.placeholderSubtext}>Exercise: {exercise.name}</Text>
              </View>
            )}
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.heatmapContainer}>
            <AnatomicalMuscleMap
              primaryMuscle={exercise.primaryMuscle}
              secondaryMuscles={exercise.secondaryMuscles || []}
            />
          </ScrollView>
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Share2 color={Palette.ink} size={20} />
          <Text style={styles.actionButtonText}>Share Exercise</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <Bookmark 
            color={isFavorite ? Palette.accent : Palette.inkMuted} 
            size={20}
            fill={isFavorite ? Palette.accent : 'transparent'}
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

      {enrichment && enrichment.instructions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {enrichment.instructions.map((step, index) => (
            <View key={index} style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.instructionText}>{step}</Text>
            </View>
          ))}
        </View>
      )}

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
    backgroundColor: Palette.canvas,
  },
  visualSection: {
    backgroundColor: Palette.canvasRaised,
    marginBottom: 12,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Palette.line,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Palette.accent,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: Palette.inkMuted,
  },
  activeTabText: {
    color: Palette.accent,
  },
  animationContainer: {
    height: 300,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heatmapContainer: {
    minHeight: 500,
    paddingHorizontal: 20,
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
    color: Palette.inkMuted,
    marginTop: 16,
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: 14,
    color: Palette.inkMuted,
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
    backgroundColor: Palette.canvasRaised,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Palette.line,
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
    backgroundColor: Palette.canvasRaised,
    borderWidth: 1,
    borderColor: Palette.line,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.ink,
  },
  titleSection: {
    backgroundColor: Palette.canvasRaised,
    padding: 20,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Palette.ink,
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
    backgroundColor: Palette.canvasRaised,
    borderWidth: 1,
    borderColor: Palette.line,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.ink,
    textTransform: 'capitalize',
  },
  section: {
    backgroundColor: Palette.canvasRaised,
    padding: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Palette.ink,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Palette.inkMuted,
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
    backgroundColor: Palette.canvasRaised,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Palette.line,
  },
  instructionNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.ink,
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    color: Palette.ink,
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
    color: Palette.ink,
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
    backgroundColor: Palette.accent + '20',
  },
  goalText: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.accent,
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.accent,
    padding: 16,
    borderRadius: 12,
  },
  videoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Palette.canvas,
  },
  errorText: {
    fontSize: 16,
    color: Palette.inkMuted,
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
    color: Palette.ink,
  },
  muscleValue: {
    fontSize: 15,
    color: Palette.inkMuted,
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
    color: Palette.ink,
    marginRight: 8,
  },
  infoValue: {
    fontSize: 15,
    color: Palette.inkMuted,
    textTransform: 'capitalize' as const,
  },
});
