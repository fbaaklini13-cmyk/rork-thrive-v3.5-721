import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Stack } from 'expo-router';
import { Pill, Clock, Info, RefreshCw } from 'lucide-react-native';
import { Palette } from '@/constants/theme';
import { generateSupplementPlan } from '@/services/ai-service';
import { useUserProfile } from '@/hooks/user-profile-store';
import { useAIConsent } from '@/components/AIConsentProvider';

export default function SupplementsScreen() {
  const { profile } = useUserProfile();
  const requestAIConsent = useAIConsent();
  const [supplementPlan, setSupplementPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSupplementPlan = async () => {
    if (!(await requestAIConsent())) {
      setError('AI features are off. Allow them to get a supplement plan (Profile → AI Assistant).');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const plan = await generateSupplementPlan(profile);
      setSupplementPlan(plan);
    } catch (error: any) {
      console.error('Failed to generate supplement plan:', error);
      const errorMessage = error?.message || 'Failed to load supplement plan';
      setError(errorMessage);
      setSupplementPlan(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSupplementPlan();
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Supplement Guide',
          headerStyle: { backgroundColor: Palette.canvas },
          headerTintColor: Palette.ink,
          headerShadowVisible: false,
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pill size={60} color={Palette.accent} />
          <Text style={styles.title}>Personalized Supplements</Text>
          <Text style={styles.subtitle}>
            General guidance on common supplements, with typical ranges
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Palette.accent} />
            <Text style={styles.loadingText}>Generating your supplement plan...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadSupplementPlan}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : supplementPlan ? (
          <>
            <View style={styles.supplementsList}>
              {supplementPlan.supplements?.map((supplement: any, index: number) => (
                <View key={index} style={styles.supplementCard}>
                  <View style={styles.supplementHeader}>
                    <View style={styles.iconContainer}>
                      <Pill size={24} color={Palette.accent} />
                    </View>
                    <View style={styles.supplementInfo}>
                      <Text style={styles.supplementName}>{supplement.name}</Text>
                      <Text style={styles.supplementDosage}>{supplement.dosage}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.timingRow}>
                    <Clock size={16} color={Palette.inkMuted} />
                    <Text style={styles.timingText}>{supplement.timing}</Text>
                  </View>
                  
                  <View style={styles.benefitsRow}>
                    <Info size={16} color={Palette.inkMuted} />
                    <Text style={styles.benefitsText}>{supplement.benefits}</Text>
                  </View>
                </View>
              ))}
            </View>

            {supplementPlan.notes && (
              <View style={styles.notesCard}>
                <Text style={styles.notesTitle}>Important Notes</Text>
                <Text style={styles.notesText}>{supplementPlan.notes}</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.refreshButton}
              onPress={loadSupplementPlan}
            >
              <RefreshCw size={20} color={Palette.canvas} />
              <Text style={styles.refreshButtonText}>Regenerate Plan</Text>
            </TouchableOpacity>
          </>
        ) : null}

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Always consult with a healthcare professional before starting any supplement regimen.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.canvas,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: Palette.canvasRaised,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Palette.ink,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Palette.inkMuted,
    marginTop: 5,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: Palette.inkMuted,
  },
  supplementsList: {
    padding: 20,
  },
  supplementCard: {
    backgroundColor: Palette.canvasRaised,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Palette.line,
  },
  supplementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Palette.canvasRaised,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: Palette.line,
  },
  supplementInfo: {
    flex: 1,
  },
  supplementName: {
    fontSize: 18,
    fontWeight: '600',
    color: Palette.ink,
  },
  supplementDosage: {
    fontSize: 16,
    color: Palette.accent,
    fontWeight: '500',
    marginTop: 2,
  },
  timingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  timingText: {
    fontSize: 14,
    color: Palette.inkMuted,
  },
  benefitsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  benefitsText: {
    fontSize: 14,
    color: Palette.inkMuted,
    flex: 1,
    lineHeight: 20,
  },
  notesCard: {
    backgroundColor: '#F2B33D14',
    margin: 20,
    marginTop: 0,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Palette.warn,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Palette.ink,
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    color: Palette.inkMuted,
    lineHeight: 20,
  },
  refreshButton: {
    flexDirection: 'row',
    backgroundColor: Palette.accent,
    margin: 20,
    marginTop: 10,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  refreshButtonText: {
    color: Palette.canvas,
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: Palette.inkMuted,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Palette.accent,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryButtonText: {
    color: Palette.canvas,
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    margin: 20,
    padding: 15,
    backgroundColor: Palette.canvasRaised,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Palette.line,
  },
  disclaimerText: {
    fontSize: 12,
    color: Palette.inkMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});