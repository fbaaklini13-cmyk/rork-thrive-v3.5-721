import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { shouldShowOnFront, shouldShowOnBack, getMuscleColor } from '@/constants/muscle-mapping';

interface MuscleHeatmapDetailProps {
  primaryMuscle: string;
  secondaryMuscles?: string[];
}

export function MuscleHeatmapDetail({ primaryMuscle, secondaryMuscles = [] }: MuscleHeatmapDetailProps) {
  const allMuscles = [primaryMuscle, ...secondaryMuscles].filter(Boolean);
  const uniqueMuscles = Array.from(new Set(allMuscles));

  // Group muscles by body region
  const frontMuscles = uniqueMuscles.filter(m => shouldShowOnFront(m));
  const backMuscles = uniqueMuscles.filter(m => shouldShowOnBack(m));

  const renderBodyDiagram = (muscles: string[], viewType: 'front' | 'back') => {
    return (
      <View style={styles.bodyContainer}>
        <Text style={styles.viewLabel}>{viewType === 'front' ? 'Front View' : 'Back View'}</Text>
        
        <View style={styles.bodyDiagram}>
          {/* Head */}
          <View style={[styles.bodyPart, styles.head]} />
          
          {/* Upper Body */}
          <View style={styles.upperBody}>
            {viewType === 'front' && (
              <>
                {/* Chest/Pecs */}
                {muscles.some(m => m.toLowerCase().includes('chest') || m.toLowerCase().includes('pec')) && (
                  <View style={[
                    styles.chest,
                    {
                      backgroundColor: getMuscleColor('chest', muscles[0].toLowerCase().includes('chest')),
                      opacity: muscles[0].toLowerCase().includes('chest') ? 0.9 : 0.5,
                    }
                  ]} />
                )}
                
                {/* Shoulders */}
                {muscles.some(m => m.toLowerCase().includes('shoulder') || m.toLowerCase().includes('delt')) && (
                  <>
                    <View style={[
                      styles.leftShoulder,
                      {
                        backgroundColor: getMuscleColor('shoulders', muscles[0].toLowerCase().includes('shoulder')),
                        opacity: muscles[0].toLowerCase().includes('shoulder') ? 0.9 : 0.5,
                      }
                    ]} />
                    <View style={[
                      styles.rightShoulder,
                      {
                        backgroundColor: getMuscleColor('shoulders', muscles[0].toLowerCase().includes('shoulder')),
                        opacity: muscles[0].toLowerCase().includes('shoulder') ? 0.9 : 0.5,
                      }
                    ]} />
                  </>
                )}
                
                {/* Abs */}
                {muscles.some(m => m.toLowerCase().includes('ab') || m.toLowerCase().includes('core')) && (
                  <View style={[
                    styles.abs,
                    {
                      backgroundColor: getMuscleColor('abdominals', muscles[0].toLowerCase().includes('ab')),
                      opacity: muscles[0].toLowerCase().includes('ab') ? 0.9 : 0.5,
                    }
                  ]} />
                )}
              </>
            )}
            
            {viewType === 'back' && (
              <>
                {/* Back muscles */}
                {muscles.some(m => m.toLowerCase().includes('back') || m.toLowerCase().includes('lat')) && (
                  <View style={[
                    styles.back,
                    {
                      backgroundColor: getMuscleColor('back', muscles[0].toLowerCase().includes('back')),
                      opacity: muscles[0].toLowerCase().includes('back') ? 0.9 : 0.5,
                    }
                  ]} />
                )}
                
                {/* Traps */}
                {muscles.some(m => m.toLowerCase().includes('trap')) && (
                  <View style={[
                    styles.traps,
                    {
                      backgroundColor: getMuscleColor('traps', muscles[0].toLowerCase().includes('trap')),
                      opacity: muscles[0].toLowerCase().includes('trap') ? 0.9 : 0.5,
                    }
                  ]} />
                )}
              </>
            )}
          </View>
          
          {/* Arms */}
          <View style={styles.arms}>
            {viewType === 'front' && muscles.some(m => m.toLowerCase().includes('bicep')) && (
              <>
                <View style={[
                  styles.leftBicep,
                  {
                    backgroundColor: getMuscleColor('biceps', muscles[0].toLowerCase().includes('bicep')),
                    opacity: muscles[0].toLowerCase().includes('bicep') ? 0.9 : 0.5,
                  }
                ]} />
                <View style={[
                  styles.rightBicep,
                  {
                    backgroundColor: getMuscleColor('biceps', muscles[0].toLowerCase().includes('bicep')),
                    opacity: muscles[0].toLowerCase().includes('bicep') ? 0.9 : 0.5,
                  }
                ]} />
              </>
            )}
            
            {viewType === 'back' && muscles.some(m => m.toLowerCase().includes('tricep')) && (
              <>
                <View style={[
                  styles.leftTricep,
                  {
                    backgroundColor: getMuscleColor('triceps', muscles[0].toLowerCase().includes('tricep')),
                    opacity: muscles[0].toLowerCase().includes('tricep') ? 0.9 : 0.5,
                  }
                ]} />
                <View style={[
                  styles.rightTricep,
                  {
                    backgroundColor: getMuscleColor('triceps', muscles[0].toLowerCase().includes('tricep')),
                    opacity: muscles[0].toLowerCase().includes('tricep') ? 0.9 : 0.5,
                  }
                ]} />
              </>
            )}
          </View>
          
          {/* Legs */}
          <View style={styles.legs}>
            {viewType === 'front' && muscles.some(m => m.toLowerCase().includes('quad')) && (
              <>
                <View style={[
                  styles.leftQuad,
                  {
                    backgroundColor: getMuscleColor('quadriceps', muscles[0].toLowerCase().includes('quad')),
                    opacity: muscles[0].toLowerCase().includes('quad') ? 0.9 : 0.5,
                  }
                ]} />
                <View style={[
                  styles.rightQuad,
                  {
                    backgroundColor: getMuscleColor('quadriceps', muscles[0].toLowerCase().includes('quad')),
                    opacity: muscles[0].toLowerCase().includes('quad') ? 0.9 : 0.5,
                  }
                ]} />
              </>
            )}
            
            {viewType === 'back' && (
              <>
                {muscles.some(m => m.toLowerCase().includes('glute')) && (
                  <View style={[
                    styles.glutes,
                    {
                      backgroundColor: getMuscleColor('glutes', muscles[0].toLowerCase().includes('glute')),
                      opacity: muscles[0].toLowerCase().includes('glute') ? 0.9 : 0.5,
                    }
                  ]} />
                )}
                
                {muscles.some(m => m.toLowerCase().includes('hamstring')) && (
                  <>
                    <View style={[
                      styles.leftHamstring,
                      {
                        backgroundColor: getMuscleColor('hamstrings', muscles[0].toLowerCase().includes('hamstring')),
                        opacity: muscles[0].toLowerCase().includes('hamstring') ? 0.9 : 0.5,
                      }
                    ]} />
                    <View style={[
                      styles.rightHamstring,
                      {
                        backgroundColor: getMuscleColor('hamstrings', muscles[0].toLowerCase().includes('hamstring')),
                        opacity: muscles[0].toLowerCase().includes('hamstring') ? 0.9 : 0.5,
                      }
                    ]} />
                  </>
                )}
              </>
            )}
            
            {/* Calves (visible from both sides) */}
            {muscles.some(m => m.toLowerCase().includes('calf')) && (
              <>
                <View style={[
                  styles.leftCalf,
                  {
                    backgroundColor: getMuscleColor('calves', muscles[0].toLowerCase().includes('calf')),
                    opacity: muscles[0].toLowerCase().includes('calf') ? 0.9 : 0.5,
                  }
                ]} />
                <View style={[
                  styles.rightCalf,
                  {
                    backgroundColor: getMuscleColor('calves', muscles[0].toLowerCase().includes('calf')),
                    opacity: muscles[0].toLowerCase().includes('calf') ? 0.9 : 0.5,
                  }
                ]} />
              </>
            )}
          </View>
        </View>
        
        {/* Muscle labels for this view */}
        <View style={styles.muscleList}>
          {muscles.map((muscle, index) => {
            const isPrimary = muscle.toLowerCase() === primaryMuscle.toLowerCase();
            return (
              <View key={index} style={styles.muscleItem}>
                <View style={[
                  styles.muscleDot,
                  {
                    backgroundColor: getMuscleColor(muscle, isPrimary),
                    opacity: isPrimary ? 0.9 : 0.5,
                  }
                ]} />
                <Text style={styles.muscleText}>{muscle}</Text>
                {isPrimary && <Text style={styles.primaryBadge}>Primary</Text>}
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Muscles Worked</Text>
      
      <View style={styles.diagramsContainer}>
        {frontMuscles.length > 0 && renderBodyDiagram(frontMuscles, 'front')}
        {backMuscles.length > 0 && renderBodyDiagram(backMuscles, 'back')}
      </View>
      
      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Primary:</Text>
          <Text style={styles.summaryValue}>{primaryMuscle}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 24,
  },
  diagramsContainer: {
    flexDirection: 'row',
    gap: 24,
    justifyContent: 'center',
    marginBottom: 24,
  },
  bodyContainer: {
    alignItems: 'center',
  },
  viewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 16,
  },
  bodyDiagram: {
    width: 150,
    height: 350,
    backgroundColor: Colors.lightGrey,
    borderRadius: 75,
    position: 'relative',
    overflow: 'hidden',
  },
  bodyPart: {
    position: 'absolute',
  },
  head: {
    top: 10,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  upperBody: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    height: 120,
  },
  chest: {
    position: 'absolute',
    top: 10,
    left: 20,
    right: 20,
    height: 60,
    borderRadius: 12,
  },
  leftShoulder: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 40,
    borderRadius: 15,
  },
  rightShoulder: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 40,
    borderRadius: 15,
  },
  abs: {
    position: 'absolute',
    top: 70,
    left: 30,
    right: 30,
    height: 50,
    borderRadius: 8,
  },
  back: {
    position: 'absolute',
    top: 10,
    left: 15,
    right: 15,
    height: 100,
    borderRadius: 12,
  },
  traps: {
    position: 'absolute',
    top: 0,
    left: 25,
    right: 25,
    height: 30,
    borderRadius: 8,
  },
  arms: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
  },
  leftBicep: {
    position: 'absolute',
    top: 0,
    left: 5,
    width: 20,
    height: 50,
    borderRadius: 10,
  },
  rightBicep: {
    position: 'absolute',
    top: 0,
    right: 5,
    width: 20,
    height: 50,
    borderRadius: 10,
  },
  leftTricep: {
    position: 'absolute',
    top: 0,
    left: 5,
    width: 20,
    height: 50,
    borderRadius: 10,
  },
  rightTricep: {
    position: 'absolute',
    top: 0,
    right: 5,
    width: 20,
    height: 50,
    borderRadius: 10,
  },
  legs: {
    position: 'absolute',
    top: 170,
    left: 20,
    right: 20,
    height: 170,
  },
  leftQuad: {
    position: 'absolute',
    top: 0,
    left: 5,
    width: 40,
    height: 100,
    borderRadius: 20,
  },
  rightQuad: {
    position: 'absolute',
    top: 0,
    right: 5,
    width: 40,
    height: 100,
    borderRadius: 20,
  },
  glutes: {
    position: 'absolute',
    top: 0,
    left: 10,
    right: 10,
    height: 50,
    borderRadius: 12,
  },
  leftHamstring: {
    position: 'absolute',
    top: 50,
    left: 5,
    width: 40,
    height: 80,
    borderRadius: 20,
  },
  rightHamstring: {
    position: 'absolute',
    top: 50,
    right: 5,
    width: 40,
    height: 80,
    borderRadius: 20,
  },
  leftCalf: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    width: 30,
    height: 60,
    borderRadius: 15,
  },
  rightCalf: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    width: 30,
    height: 60,
    borderRadius: 15,
  },
  muscleList: {
    marginTop: 16,
    gap: 8,
    width: '100%',
  },
  muscleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: Colors.lightGrey,
    borderRadius: 12,
  },
  muscleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  muscleText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.darkGrey,
    textTransform: 'capitalize',
  },
  primaryBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  summary: {
    marginTop: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.darkGrey,
  },
  summaryValue: {
    fontSize: 15,
    color: Colors.mediumGrey,
    textTransform: 'capitalize',
  },
});
