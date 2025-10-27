import type { ChatMessage, WorkoutPlan, UserProfile } from '@/types/user';
import { generateObject, generateText } from '@rork/toolkit-sdk';
import { z } from 'zod';

export class AIService {
  static async generateExerciseAlternatives(
    exerciseName: string,
    muscleGroups: string[],
    equipment: string[],
    userProfile: any
  ): Promise<any[]> {
    try {
      const prompt = `Generate 5 scientifically-effective alternative exercises for "${exerciseName}" that target the same muscle groups: ${muscleGroups.join(', ')}.

Available equipment: ${equipment.join(', ')}
User level: ${userProfile?.activityLevel || 'intermediate'}

For each alternative, provide exercises that:
- Target the same primary muscle groups
- Have similar movement patterns when possible
- Are appropriate for the available equipment
- Are scientifically proven to be effective
- Include proper form cues`;

      const alternativesSchema = z.object({
        alternatives: z.array(z.object({
          name: z.string(),
          sets: z.number(),
          reps: z.string(),
          restPeriod: z.string(),
          notes: z.string(),
          muscleGroups: z.array(z.string()),
          difficulty: z.string(),
          equipment: z.string()
        }))
      });

      const result = await generateObject({
        messages: [
          { role: 'user', content: `System: You are an expert exercise physiologist. Provide scientifically-backed exercise alternatives.\n\n${prompt}` },
        ],
        schema: alternativesSchema,
      });
      
      return result.alternatives || [];
    } catch (error) {
      console.error('Exercise alternatives generation error:', error);
      return [
        {
          name: "Dumbbell Alternative",
          sets: 3,
          reps: "8-12",
          restPeriod: "60-90 seconds",
          notes: "Use dumbbells as an alternative",
          muscleGroups: muscleGroups || ["General"],
          difficulty: "Intermediate",
          equipment: "Dumbbells"
        },
        {
          name: "Bodyweight Alternative",
          sets: 3,
          reps: "10-15",
          restPeriod: "45-60 seconds",
          notes: "No equipment needed",
          muscleGroups: muscleGroups || ["General"],
          difficulty: "Beginner",
          equipment: "None"
        },
        {
          name: "Resistance Band Alternative",
          sets: 3,
          reps: "12-15",
          restPeriod: "45-60 seconds",
          notes: "Use resistance bands",
          muscleGroups: muscleGroups || ["General"],
          difficulty: "Beginner",
          equipment: "Resistance Bands"
        }
      ];
    }
  }

  static async chat(messages: ChatMessage[], userContext: any): Promise<string> {
    try {
      const systemPrompt = `System: You are a ${userContext?.userType === 'student' ? 'study assistant' : 'productivity coach'} helping a user with:
- Stress level: ${userContext?.stressLevel}
- Focus hours: ${userContext?.focusHours}
- Learning/working style: ${userContext?.learningStyle}

Provide helpful, personalized advice based on their profile.`;

      const formattedMessages = [
        { role: 'user' as const, content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ];

      const result = await generateText({ messages: formattedMessages });
      return result || '';
    } catch (error) {
      console.error('AI chat error:', error);
      throw new Error('Failed to get AI response');
    }
  }

  static async generateWorkoutPlan(
    goals: string[],
    equipment: string[],
    daysPerWeek: number,
    userProfile: any,
  ): Promise<WorkoutPlan> {
    const equipmentStr = equipment.length > 0 ? equipment.join(', ') : 'bodyweight exercises only';
    
    console.log('Generating workout plan...');
    console.log('Goals:', goals);
    console.log('Equipment:', equipment);
    console.log('Days per week:', daysPerWeek);

    const prompt = `Create a detailed, science-based ${daysPerWeek}-day workout plan.

User info:
- Goals: ${goals.join(', ')}
- Equipment: ${equipmentStr}
- Level: ${userProfile?.activityLevel || 'intermediate'}

Create ${daysPerWeek} days with 4-6 exercises each. Include proper form cues in notes.`;
    
    const workoutPlanSchema = z.object({
      plan: z.array(z.object({
        day: z.string(),
        focus: z.string(),
        exercises: z.array(z.object({
          name: z.string(),
          sets: z.number(),
          reps: z.string(),
          restPeriod: z.string(),
          notes: z.string(),
          muscleGroups: z.array(z.string())
        }))
      }))
    });

    try {
      const planData = await generateObject({
        messages: [
          { role: 'user', content: `System: You are an expert fitness coach. Create detailed, science-based workout plans.\n\n${prompt}` },
        ],
        schema: workoutPlanSchema,
      });

      if (!planData || !Array.isArray(planData?.plan)) {
        console.error('Invalid plan data structure:', planData);
        throw new Error('Invalid plan structure received from AI');
      }
      
      console.log('Workout plan generated successfully');
      return {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        goals,
        equipment,
        daysPerWeek,
        plan: planData.plan,
      };
    } catch (error: any) {
      console.error('Workout generation error:', error);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      
      if (error?.message?.includes('fetch') || error?.message?.includes('Network')) {
        throw new Error('Unable to connect to AI service. Please check your internet connection.');
      }
      
      if (error?.message?.includes('500')) {
        throw new Error('AI service is temporarily unavailable. Please try again.');
      }
      
      if (error?.message?.includes('Invalid plan structure')) {
        throw error;
      }
      
      throw new Error('Failed to generate workout plan. Please try again.');
    }
  }

  static async analyzeNutrition(
    meal: string,
    userProfile: any,
  ): Promise<{ insights: string; healthierAlternatives: string[]; calories?: number; protein?: number; carbs?: number; fat?: number }> {
    try {
      const dailyCalories = userProfile?.dailyCalories ?? 2000;
      const prompt = `Analyze this meal: "${meal}"\n\nUser profile:\n- Daily calorie target: ${dailyCalories}\n- Dietary preferences: ${userProfile?.dietaryPreferences?.join(', ') || 'none'}\n- Allergies: ${userProfile?.allergies?.join(', ') || 'none'}\n- Target weight: ${userProfile?.targetWeight ? userProfile.targetWeight + ' kg' : 'not specified'}\n- Weekly goal: ${userProfile?.weeklyWeightGoal ? userProfile.weeklyWeightGoal + ' kg/week' : 'not specified'}\n\nProvide detailed nutritional breakdown with specific macronutrient values. Be specific with numbers. Estimate based on typical portion sizes.`;

      const nutritionSchema = z.object({
        calories: z.number(),
        protein: z.number(),
        carbs: z.number(),
        fat: z.number(),
        insights: z.string(),
        healthierAlternatives: z.array(z.string())
      });

      const parsed = await generateObject({
        messages: [
          { role: 'user', content: `System: You are a nutritionist. Provide specific macronutrient values. Be precise with numbers.\n\n${prompt}` },
        ],
        schema: nutritionSchema,
      });

      return {
        insights: parsed?.insights ?? 'No insights provided.',
        healthierAlternatives: Array.isArray(parsed?.healthierAlternatives) ? parsed.healthierAlternatives : [],
        calories: typeof parsed?.calories === 'number' ? parsed.calories : undefined,
        protein: typeof parsed?.protein === 'number' ? parsed.protein : undefined,
        carbs: typeof parsed?.carbs === 'number' ? parsed.carbs : undefined,
        fat: typeof parsed?.fat === 'number' ? parsed.fat : undefined,
      };
    } catch (error) {
      console.error('Nutrition analysis error:', error);
      throw new Error('Failed to analyze nutrition');
    }
  }

  static async analyzeNutritionImage(
    base64Image: string,
    userProfile: any,
  ): Promise<{ insights: string; healthierAlternatives: string[]; calories?: number; protein?: number; carbs?: number; fat?: number }> {
    try {
      const dailyCalories = userProfile?.dailyCalories ?? 2000;
      const instruction = `Analyze the food in this image.\n\nUser profile:\n- Daily calorie target: ${dailyCalories}\n- Dietary preferences: ${userProfile?.dietaryPreferences?.join(', ') || 'none'}\n- Allergies: ${userProfile?.allergies?.join(', ') || 'none'}\n- Target weight: ${userProfile?.targetWeight ? userProfile.targetWeight + ' kg' : 'not specified'}\n- Weekly goal: ${userProfile?.weeklyWeightGoal ? userProfile.weeklyWeightGoal + ' kg/week' : 'not specified'}\n\nProvide detailed nutritional breakdown with specific macronutrient values. Be specific with numbers. Estimate based on typical portion sizes shown in the image.`;
      
      const nutritionSchema = z.object({
        calories: z.number(),
        protein: z.number(),
        carbs: z.number(),
        fat: z.number(),
        insights: z.string(),
        healthierAlternatives: z.array(z.string())
      });

      const parsed = await generateObject({
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: `System: You are a nutritionist. Provide specific macronutrient values. Be precise with numbers.\n\n${instruction}` },
              { type: 'image', image: base64Image },
            ],
          },
        ],
        schema: nutritionSchema,
      });

      return {
        insights: parsed?.insights ?? 'No insights provided.',
        healthierAlternatives: Array.isArray(parsed?.healthierAlternatives) ? parsed.healthierAlternatives : [],
        calories: typeof parsed?.calories === 'number' ? parsed.calories : undefined,
        protein: typeof parsed?.protein === 'number' ? parsed.protein : undefined,
        carbs: typeof parsed?.carbs === 'number' ? parsed.carbs : undefined,
        fat: typeof parsed?.fat === 'number' ? parsed.fat : undefined,
      };
    } catch (error) {
      console.error('Nutrition image analysis error:', error);
      throw new Error('Failed to analyze nutrition image');
    }
  }
}

export async function generateSupplementPlan(profile: UserProfile): Promise<any> {
  try {
    console.log('Generating supplement plan for profile:', profile);

    const prompt = `Generate a personalized supplement plan for:
    - Age: ${profile.age}
    - Weight: ${profile.weight}kg
    - Height: ${profile.height}cm
    - Goal: ${profile.fitnessGoal}
    - Activity: ${profile.activityLevel}
    - Dietary preferences: ${profile.dietaryPreferences?.join(', ') || 'None'}
    
    Provide specific supplement recommendations with dosages in mg/g.`;

    const supplementPlanSchema = z.object({
      supplements: z.array(z.object({
        name: z.string(),
        dosage: z.string(),
        timing: z.string(),
        benefits: z.string()
      })),
      notes: z.string()
    });

    const result = await generateObject({
      messages: [
        { role: 'user', content: `System: You are a nutrition expert. Provide scientifically-backed supplement recommendations.\n\n${prompt}` }
      ],
      schema: supplementPlanSchema,
    });
    
    console.log('Supplement plan generated successfully');
    return {
      supplements: Array.isArray(result.supplements) ? result.supplements : [],
      notes: result.notes || 'Supplement plan generated successfully'
    };
  } catch (error: any) {
    console.error('Supplement plan generation error:', error);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    
    if (error?.message?.includes('fetch') || error?.message?.includes('Network')) {
      throw new Error('Unable to connect to AI service. Please check your internet connection.');
    }
    
    if (error?.message?.includes('500')) {
      throw new Error('AI service is temporarily unavailable. Please try again.');
    }
    
    throw new Error('Failed to generate supplement plan. Please try again.');
  }
}

export async function analyzeBodyImage(imageUri: string): Promise<any> {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.readAsDataURL(blob);
    });

    const prompt = `Analyze this physique photo for body composition. Be very precise and accurate in your assessment.

Look for:
- Visible muscle definition and separation
- Subcutaneous fat distribution
- Vascularity and muscle striations
- Overall body fat percentage indicators

For body fat estimation:
- 6-9%: Extremely lean, visible abs, striations, vascularity
- 10-12%: Very lean, defined abs, some vascularity
- 13-15%: Lean, abs visible, minimal fat
- 16-19%: Athletic, some ab definition
- 20-24%: Average, little muscle definition
- 25%+: Higher body fat, no muscle definition`;

    const bodyAnalysisSchema = z.object({
      bodyFat: z.number(),
      muscleMass: z.string(),
      bodyType: z.string(),
      muscleDefinition: z.string(),
      recommendations: z.string(),
      confidence: z.string()
    });

    const result = await generateObject({
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: `System: You are an expert body composition analyst with years of experience. Be precise and accurate in your assessments.\n\n${prompt}` },
            { type: 'image', image: base64 }
          ]
        }
      ],
      schema: bodyAnalysisSchema,
    });

    return result;
  } catch (error) {
    console.error('Body image analysis error:', error);
    return {
      bodyFat: 15,
      muscleMass: 'Moderate',
      bodyType: 'Mesomorph',
      muscleDefinition: 'Fair',
      recommendations: 'Unable to analyze image accurately. Please ensure good lighting and clear visibility of your physique.',
      confidence: 'Low'
    };
  }
}

export async function generateRecipe(preferences: any): Promise<any> {
  try {
    const prompt = `Generate a healthy recipe that is:
    - Calories: ${preferences.calories || 'balanced'}
    - Dietary: ${preferences.dietary || 'no restrictions'}
    - Meal type: ${preferences.mealType || 'any'}
    - Cuisine: ${preferences.cuisine || 'any'}`;

    const recipeSchema = z.object({
      name: z.string(),
      calories: z.number(),
      protein: z.string(),
      carbs: z.string(),
      fat: z.string(),
      ingredients: z.array(z.string()),
      instructions: z.array(z.string()),
      prepTime: z.string(),
      cookTime: z.string()
    });

    const result = await generateObject({
      messages: [
        { role: 'user', content: `System: You are a chef and nutritionist. Create healthy, balanced recipes.\n\n${prompt}` }
      ],
      schema: recipeSchema,
    });
    
    return {
      name: result.name || 'Generated Recipe',
      calories: result.calories || 0,
      protein: result.protein || '0g',
      carbs: result.carbs || '0g',
      fat: result.fat || '0g',
      ingredients: Array.isArray(result.ingredients) ? result.ingredients : [],
      instructions: Array.isArray(result.instructions) ? result.instructions : [],
      prepTime: result.prepTime || '0 minutes',
      cookTime: result.cookTime || '0 minutes'
    };
  } catch (error) {
    console.error('Recipe generation error:', error);
    return null;
  }
}
