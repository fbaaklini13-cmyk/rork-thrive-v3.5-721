import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Stack } from 'expo-router';
import { Camera, Upload, Scan } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Palette } from '@/constants/theme';
import { analyzeBodyImage } from '@/services/ai-service';
import { useAIConsent } from '@/components/AIConsentProvider';

export default function BodyScannerScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const requestAIConsent = useAIConsent();

  const pickImage = async (useCamera: boolean) => {
    // Ask before a body photo is even taken: it is the most sensitive thing the app sends.
    if (!(await requestAIConsent())) return;
    const result = await (useCamera
      ? ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [3, 4],
          quality: 1,
        })
      : ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [3, 4],
          quality: 1,
        }));

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      analyzeImage(result.assets[0].uri);
    }
  };

  const analyzeImage = async (uri: string) => {
    setLoading(true);
    try {
      const result = await analyzeBodyImage(uri);
      if (result) {
        setAnalysis(result);
      } else {
        Alert.alert('Error', 'Failed to analyze image. Please try again.');
      }
    } catch (error) {
      console.error('Body scan error:', error);
      Alert.alert('Error', 'Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'AI Body Scanner',
          headerStyle: { backgroundColor: Palette.canvas },
          headerTintColor: Palette.ink,
          headerShadowVisible: false,
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {!selectedImage ? (
          <View style={styles.uploadSection}>
            <Scan size={80} color={Palette.accent} />
            <Text style={styles.title}>AI Body Analysis</Text>
            <Text style={styles.subtitle}>
              Take or upload a photo to analyze your physique
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => pickImage(true)}
            >
              <Camera size={20} color={Palette.canvas} />
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => pickImage(false)}
            >
              <Upload size={20} color={Palette.accent} />
              <Text style={styles.secondaryButtonText}>Upload from Gallery</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.resultSection}>
            {selectedImage && selectedImage.trim() !== '' && (
              <Image source={{ uri: selectedImage }} style={styles.image} />
            )}

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Palette.accent} />
                <Text style={styles.loadingText}>Analyzing your physique...</Text>
              </View>
            ) : analysis ? (
              <View style={styles.analysisContainer}>
                <Text style={styles.analysisTitle}>Analysis Results</Text>
                
                {analysis.confidence && (
                  <View style={[styles.confidenceCard, 
                    analysis.confidence === 'High' ? styles.confidenceHigh :
                    analysis.confidence === 'Medium' ? styles.confidenceMedium : styles.confidenceLow
                  ]}>
                    <Text style={styles.confidenceText}>Confidence: {analysis.confidence}</Text>
                  </View>
                )}

                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Body Fat Percentage</Text>
                  <Text style={styles.metricValue}>{analysis.bodyFat}%</Text>
                </View>

                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Muscle Mass</Text>
                  <Text style={styles.metricValue}>{analysis.muscleMass}</Text>
                </View>

                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Body Type</Text>
                  <Text style={styles.metricValue}>{analysis.bodyType}</Text>
                </View>

                {analysis.muscleDefinition && (
                  <View style={styles.metricCard}>
                    <Text style={styles.metricLabel}>Muscle Definition</Text>
                    <Text style={styles.metricValue}>{analysis.muscleDefinition}</Text>
                  </View>
                )}

                <View style={styles.recommendationCard}>
                  <Text style={styles.recommendationTitle}>Recommendations</Text>
                  <Text style={styles.recommendationText}>
                    {analysis.recommendations}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => {
                    setSelectedImage(null);
                    setAnalysis(null);
                  }}
                >
                  <Text style={styles.buttonText}>Scan Again</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.canvas,
  },
  uploadSection: {
    padding: 20,
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Palette.ink,
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Palette.inkMuted,
    textAlign: 'center',
    marginBottom: 40,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: Palette.accent,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
    width: '80%',
    justifyContent: 'center',
  },
  buttonText: {
    color: Palette.canvas,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: Palette.canvasRaised,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: Palette.accent,
    width: '80%',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: Palette.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  resultSection: {
    padding: 20,
  },
  image: {
    width: '100%',
    height: 400,
    borderRadius: 15,
    marginBottom: 20,
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
  analysisContainer: {
    backgroundColor: Palette.canvasRaised,
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: Palette.line,
  },
  analysisTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Palette.ink,
    marginBottom: 20,
  },
  metricCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Palette.line,
  },
  metricLabel: {
    fontSize: 16,
    color: Palette.inkMuted,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Palette.accent,
  },
  recommendationCard: {
    marginTop: 20,
    padding: 15,
    backgroundColor: Palette.canvasRaised,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Palette.line,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Palette.ink,
    marginBottom: 10,
  },
  recommendationText: {
    fontSize: 14,
    color: Palette.inkMuted,
    lineHeight: 20,
  },
  confidenceCard: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  confidenceHigh: {
    backgroundColor: '#19C59A1A',
    borderColor: Palette.good,
    borderWidth: 1,
  },
  confidenceMedium: {
    backgroundColor: '#F2B33D1A',
    borderColor: Palette.warn,
    borderWidth: 1,
  },
  confidenceLow: {
    backgroundColor: '#F0645A1A',
    borderColor: Palette.bad,
    borderWidth: 1,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.ink,
  },
});