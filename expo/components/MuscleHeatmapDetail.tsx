import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '@/constants/colors';
import { shouldShowOnFront, shouldShowOnBack, getMuscleColor } from '@/constants/muscle-mapping';

interface MuscleHeatmapDetailProps {
  primaryMuscle: string;
  secondaryMuscles?: string[];
}

export function MuscleHeatmapDetail({ primaryMuscle, secondaryMuscles = [] }: MuscleHeatmapDetailProps) {
  const allMuscles = [primaryMuscle, ...secondaryMuscles].filter(Boolean);
  const uniqueMuscles = Array.from(new Set(allMuscles.map(m => m.toLowerCase())));

  const frontMuscles = uniqueMuscles.filter(m => shouldShowOnFront(m));
  const backMuscles = uniqueMuscles.filter(m => shouldShowOnBack(m));

  const isMuscleActive = (muscleType: string, muscleList: string[]) => {
    return muscleList.some(m => m.toLowerCase().includes(muscleType.toLowerCase()));
  };

  const getMuscleOpacity = (muscleType: string, muscleList: string[]) => {
    const isPrimary = primaryMuscle.toLowerCase().includes(muscleType.toLowerCase());
    return isPrimary ? 0.9 : 0.6;
  };

  const renderBodyDiagram = (muscles: string[], viewType: 'front' | 'back') => {
    if (muscles.length === 0) return null;

    return (
      <View style={styles.bodyContainer}>
        <Text style={styles.viewLabel}>{viewType === 'front' ? 'Front View' : 'Back View'}</Text>
        
        <View style={styles.bodyDiagram}>
          {/* Head */}
          <View style={[styles.bodyPart, styles.head]} />
          
          {/* Neck */}
          {isMuscleActive('neck', muscles) && (
            <View style={[
              styles.neck,
              {
                backgroundColor: getMuscleColor('neck', primaryMuscle.toLowerCase().includes('neck')),
                opacity: getMuscleOpacity('neck', muscles),
              }
            ]} />
          )}
          
          {viewType === 'front' && (
            <>
              {/* Shoulders - Front */}
              {isMuscleActive('shoulder', muscles) && (
                <>
                  <View style={[
                    styles.frontLeftShoulder,
                    {
                      backgroundColor: getMuscleColor('shoulders', primaryMuscle.toLowerCase().includes('shoulder')),
                      opacity: getMuscleOpacity('shoulder', muscles),
                    }
                  ]} />
                  <View style={[
                    styles.frontRightShoulder,
                    {
                      backgroundColor: getMuscleColor('shoulders', primaryMuscle.toLowerCase().includes('shoulder')),
                      opacity: getMuscleOpacity('shoulder', muscles),
                    }
                  ]} />
                </>
              )}
              
              {/* Chest/Pecs */}
              {isMuscleActive('chest', muscles) && (
                <View style={[
                  styles.chest,
                  {
                    backgroundColor: getMuscleColor('chest', primaryMuscle.toLowerCase().includes('chest')),
                    opacity: getMuscleOpacity('chest', muscles),
                  }
                ]} />
              )}
              
              {/* Abs */}
              {isMuscleActive('ab', muscles) && (
                <View style={[
                  styles.abs,
                  {
                    backgroundColor: getMuscleColor('abdominals', primaryMuscle.toLowerCase().includes('ab')),
                    opacity: getMuscleOpacity('ab', muscles),
                  }
                ]} />
              )}
              
              {/* Biceps */}
              {isMuscleActive('bicep', muscles) && (
                <>
                  <View style={[
                    styles.leftBicep,
                    {
                      backgroundColor: getMuscleColor('biceps', primaryMuscle.toLowerCase().includes('bicep')),
                      opacity: getMuscleOpacity('bicep', muscles),
                    }
                  ]} />
                  <View style={[
                    styles.rightBicep,
                    {
                      backgroundColor: getMuscleColor('biceps', primaryMuscle.toLowerCase().includes('bicep')),
                      opacity: getMuscleOpacity('bicep', muscles),
                    }
                  ]} />
                </>
              )}
              
              {/* Forearms - Front */}
              {isMuscleActive('forearm', muscles) && (
                <>
                  <View style={[
                    styles.leftForearm,
                    {
                      backgroundColor: getMuscleColor('forearms', primaryMuscle.toLowerCase().includes('forearm')),
                      opacity: getMuscleOpacity('forearm', muscles),
                    }
                  ]} />
                  <View style={[
                    styles.rightForearm,
                    {
                      backgroundColor: getMuscleColor('forearms', primaryMuscle.toLowerCase().includes('forearm')),
                      opacity: getMuscleOpacity('forearm', muscles),
                    }
                  ]} />
                </>
              )}
              
              {/* Quadriceps */}
              {isMuscleActive('quad', muscles) && (
                <>
                  <View style={[
                    styles.leftQuad,
                    {
                      backgroundColor: getMuscleColor('quadriceps', primaryMuscle.toLowerCase().includes('quad')),
                      opacity: getMuscleOpacity('quad', muscles),
                    }
                  ]} />
                  <View style={[
                    styles.rightQuad,
                    {
                      backgroundColor: getMuscleColor('quadriceps', primaryMuscle.toLowerCase().includes('quad')),
                      opacity: getMuscleOpacity('quad', muscles),
                    }
                  ]} />
                </>
              )}
              
              {/* Adductors */}
              {isMuscleActive('adductor', muscles) && (
                <View style={[
                  styles.adductors,
                  {
                    backgroundColor: getMuscleColor('adductors', primaryMuscle.toLowerCase().includes('adductor')),
                    opacity: getMuscleOpacity('adductor', muscles),
                  }
                ]} />
              )}
              
              {/* Calves - Front */}
              {isMuscleActive('calf', muscles) || isMuscleActive('calves', muscles) && (
                <>
                  <View style={[
                    styles.frontLeftCalf,
                    {
                      backgroundColor: getMuscleColor('calves', primaryMuscle.toLowerCase().includes('calf')),
                      opacity: getMuscleOpacity('calf', muscles),
                    }
                  ]} />
                  <View style={[
                    styles.frontRightCalf,
                    {
                      backgroundColor: getMuscleColor('calves', primaryMuscle.toLowerCase().includes('calf')),
                      opacity: getMuscleOpacity('calf', muscles),
                    }
                  ]} />
                </>
              )}
            </>
          )}
          
          {viewType === 'back' && (
            <>
              {/* Shoulders - Back */}
              {isMuscleActive('shoulder', muscles) && (
                <>
                  <View style={[
                    styles.backLeftShoulder,
                    {
                      backgroundColor: getMuscleColor('shoulders', primaryMuscle.toLowerCase().includes('shoulder')),
                      opacity: getMuscleOpacity('shoulder', muscles),
                    }
                  ]} />
                  <View style={[
                    styles.backRightShoulder,
                    {
                      backgroundColor: getMuscleColor('shoulders', primaryMuscle.toLowerCase().includes('shoulder')),
                      opacity: getMuscleOpacity('shoulder', muscles),
                    }
                  ]} />
                </>
              )}
              
              {/* Traps */}
              {isMuscleActive('trap', muscles) && (
                <View style={[
                  styles.traps,
                  {
                    backgroundColor: getMuscleColor('traps', primaryMuscle.toLowerCase().includes('trap')),
                    opacity: getMuscleOpacity('trap', muscles),
                  }
                ]} />
              )}
              
              {/* Upper/Middle Back & Lats */}
              {(isMuscleActive('back', muscles) || isMuscleActive('lat', muscles)) && (
                <View style={[
                  styles.back,
                  {
                    backgroundColor: getMuscleColor('middle back', 
                      primaryMuscle.toLowerCase().includes('back') || primaryMuscle.toLowerCase().includes('lat')),
                    opacity: getMuscleOpacity('back', muscles),
                  }
                ]} />
              )}
              
              {/* Lower Back */}
              {isMuscleActive('lower back', muscles) && (
                <View style={[
                  styles.lowerBack,
                  {
                    backgroundColor: getMuscleColor('lower back', primaryMuscle.toLowerCase().includes('lower back')),
                    opacity: getMuscleOpacity('lower back', muscles),
                  }
                ]} />
              )}
              
              {/* Triceps */}
              {isMuscleActive('tricep', muscles) && (
                <>
                  <View style={[
                    styles.leftTricep,
                    {
                      backgroundColor: getMuscleColor('triceps', primaryMuscle.toLowerCase().includes('tricep')),
                      opacity: getMuscleOpacity('tricep', muscles),
                    }
                  ]} />
                  <View style={[
                    styles.rightTricep,
                    {
                      backgroundColor: getMuscleColor('triceps', primaryMuscle.toLowerCase().includes('tricep')),
                      opacity: getMuscleOpacity('tricep', muscles),
                    }
                  ]} />
                </>
              )}
              
              {/* Forearms - Back */}
              {isMuscleActive('forearm', muscles) && (
                <>
                  <View style={[
                    styles.leftForearmBack,
                    {
                      backgroundColor: getMuscleColor('forearms', primaryMuscle.toLowerCase().includes('forearm')),
                      opacity: getMuscleOpacity('forearm', muscles),
                    }
                  ]} />
                  <View style={[
                    styles.rightForearmBack,
                    {
                      backgroundColor: getMuscleColor('forearms', primaryMuscle.toLowerCase().includes('forearm')),
                      opacity: getMuscleOpacity('forearm', muscles),
                    }
                  ]} />
                </>
              )}
              
              {/* Glutes */}
              {isMuscleActive('glute', muscles) && (
                <View style={[
                  styles.glutes,
                  {
                    backgroundColor: getMuscleColor('glutes', primaryMuscle.toLowerCase().includes('glute')),
                    opacity: getMuscleOpacity('glute', muscles),
                  }
                ]} />
              )}
              
              {/* Hamstrings */}
              {isMuscleActive('hamstring', muscles) && (
                <>
                  <View style={[
                    styles.leftHamstring,
                    {
                      backgroundColor: getMuscleColor('hamstrings', primaryMuscle.toLowerCase().includes('hamstring')),
                      opacity: getMuscleOpacity('hamstring', muscles),
                    }
                  ]} />
                  <View style={[
                    styles.rightHamstring,
                    {
                      backgroundColor: getMuscleColor('hamstrings', primaryMuscle.toLowerCase().includes('hamstring')),
                      opacity: getMuscleOpacity('hamstring', muscles),
                    }
                  ]} />
                </>
              )}
              
              {/* Calves - Back */}
              {(isMuscleActive('calf', muscles) || isMuscleActive('calves', muscles)) && (
                <>
                  <View style={[
                    styles.backLeftCalf,
                    {
                      backgroundColor: getMuscleColor('calves', primaryMuscle.toLowerCase().includes('calf')),
                      opacity: getMuscleOpacity('calf', muscles),
                    }
                  ]} />
                  <View style={[
                    styles.backRightCalf,
                    {
                      backgroundColor: getMuscleColor('calves', primaryMuscle.toLowerCase().includes('calf')),
                      opacity: getMuscleOpacity('calf', muscles),
                    }
                  ]} />
                </>
              )}
            </>
          )}
        </View>
        
        {/* Muscle labels for this view */}
        <View style={styles.muscleList}>
          {muscles.map((muscle, index) => {
            const isPrimary = primaryMuscle.toLowerCase() === muscle;
            return (
              <View key={`${muscle}-${index}`} style={styles.muscleItem}>
                <View style={[
                  styles.muscleDot,
                  {
                    backgroundColor: getMuscleColor(muscle, isPrimary),
                    opacity: isPrimary ? 0.9 : 0.6,
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Muscles Worked</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.diagramsScrollContainer}>
        <View style={styles.diagramsContainer}>
          {frontMuscles.length > 0 && renderBodyDiagram(frontMuscles, 'front')}
          {backMuscles.length > 0 && renderBodyDiagram(backMuscles, 'back')}
        </View>
      </ScrollView>
      
      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Primary:</Text>
          <Text style={styles.summaryValue}>{primaryMuscle}</Text>
        </View>
        {secondaryMuscles.length > 0 && (
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Secondary:</Text>
            <Text style={styles.summaryValue}>{secondaryMuscles.join(', ')}</Text>
          </View>
        )}
      </View>
    </ScrollView>
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
  diagramsScrollContainer: {
    marginBottom: 24,
  },
  diagramsContainer: {
    flexDirection: 'row',
    gap: 32,
    paddingHorizontal: 8,
  },
  bodyContainer: {
    alignItems: 'center',
    minWidth: 180,
  },
  viewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 16,
  },
  bodyDiagram: {
    width: 160,
    height: 380,
    backgroundColor: '#F5F5F5',
    borderRadius: 80,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  bodyPart: {
    position: 'absolute',
  },
  
  // Head
  head: {
    top: 12,
    left: '50%',
    marginLeft: -22,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8E8E8',
  },
  
  // Neck
  neck: {
    top: 54,
    left: '50%',
    marginLeft: -12,
    width: 24,
    height: 20,
    borderRadius: 6,
  },
  
  // FRONT VIEW POSITIONING
  // Shoulders - Front
  frontLeftShoulder: {
    top: 70,
    left: 12,
    width: 32,
    height: 42,
    borderRadius: 16,
  },
  frontRightShoulder: {
    top: 70,
    right: 12,
    width: 32,
    height: 42,
    borderRadius: 16,
  },
  
  // Chest
  chest: {
    top: 85,
    left: 42,
    right: 42,
    height: 65,
    borderRadius: 14,
  },
  
  // Abs
  abs: {
    top: 150,
    left: 50,
    right: 50,
    height: 70,
    borderRadius: 12,
  },
  
  // Biceps
  leftBicep: {
    top: 110,
    left: 6,
    width: 22,
    height: 56,
    borderRadius: 11,
  },
  rightBicep: {
    top: 110,
    right: 6,
    width: 22,
    height: 56,
    borderRadius: 11,
  },
  
  // Forearms - Front
  leftForearm: {
    top: 166,
    left: 8,
    width: 18,
    height: 54,
    borderRadius: 9,
  },
  rightForearm: {
    top: 166,
    right: 8,
    width: 18,
    height: 54,
    borderRadius: 9,
  },
  
  // Quadriceps
  leftQuad: {
    top: 220,
    left: 42,
    width: 32,
    height: 90,
    borderRadius: 16,
  },
  rightQuad: {
    top: 220,
    right: 42,
    width: 32,
    height: 90,
    borderRadius: 16,
  },
  
  // Adductors
  adductors: {
    top: 240,
    left: '50%',
    marginLeft: -10,
    width: 20,
    height: 60,
    borderRadius: 10,
  },
  
  // Calves - Front
  frontLeftCalf: {
    bottom: 12,
    left: 44,
    width: 26,
    height: 70,
    borderRadius: 13,
  },
  frontRightCalf: {
    bottom: 12,
    right: 44,
    width: 26,
    height: 70,
    borderRadius: 13,
  },
  
  // BACK VIEW POSITIONING
  // Shoulders - Back
  backLeftShoulder: {
    top: 70,
    left: 12,
    width: 32,
    height: 42,
    borderRadius: 16,
  },
  backRightShoulder: {
    top: 70,
    right: 12,
    width: 32,
    height: 42,
    borderRadius: 16,
  },
  
  // Traps
  traps: {
    top: 60,
    left: 44,
    right: 44,
    height: 40,
    borderRadius: 10,
  },
  
  // Back & Lats
  back: {
    top: 100,
    left: 30,
    right: 30,
    height: 95,
    borderRadius: 14,
  },
  
  // Lower Back
  lowerBack: {
    top: 195,
    left: 48,
    right: 48,
    height: 38,
    borderRadius: 10,
  },
  
  // Triceps
  leftTricep: {
    top: 110,
    left: 6,
    width: 22,
    height: 56,
    borderRadius: 11,
  },
  rightTricep: {
    top: 110,
    right: 6,
    width: 22,
    height: 56,
    borderRadius: 11,
  },
  
  // Forearms - Back
  leftForearmBack: {
    top: 166,
    left: 8,
    width: 18,
    height: 54,
    borderRadius: 9,
  },
  rightForearmBack: {
    top: 166,
    right: 8,
    width: 18,
    height: 54,
    borderRadius: 9,
  },
  
  // Glutes
  glutes: {
    top: 233,
    left: 44,
    right: 44,
    height: 50,
    borderRadius: 14,
  },
  
  // Hamstrings
  leftHamstring: {
    top: 283,
    left: 44,
    width: 30,
    height: 74,
    borderRadius: 15,
  },
  rightHamstring: {
    top: 283,
    right: 44,
    width: 30,
    height: 74,
    borderRadius: 15,
  },
  
  // Calves - Back
  backLeftCalf: {
    bottom: 12,
    left: 46,
    width: 24,
    height: 68,
    borderRadius: 12,
  },
  backRightCalf: {
    bottom: 12,
    right: 46,
    width: 24,
    height: 68,
    borderRadius: 12,
  },
  
  // Muscle list
  muscleList: {
    marginTop: 20,
    gap: 10,
    width: 180,
  },
  muscleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  muscleDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  muscleText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: Colors.darkGrey,
    textTransform: 'capitalize',
  },
  primaryBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },
  
  // Summary
  summary: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    gap: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  summaryLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.darkGrey,
    minWidth: 90,
  },
  summaryValue: {
    flex: 1,
    fontSize: 15,
    color: Colors.mediumGrey,
    textTransform: 'capitalize',
  },
});
