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
import { Colors } from '@/constants/colors';
import { analyzeBodyImage } from '@/services/ai-service';

export default function BodyScannerScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async (useCamera: boolean) => {
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
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {!selectedImage ? (
          <View style={styles.uploadSection}>
            <Scan size={80} color={Colors.primary} />
            <Text style={styles.title}>AI Body Analysis</Text>
            <Text style={styles.subtitle}>
              Take or upload a photo to analyze your physique
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => pickImage(true)}
            >
              <Camera size={20} color={Colors.white} />
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => pickImage(false)}
            >
              <Upload size={20} color={Colors.primary} />
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
                <ActivityIndicator size="large" color={Colors.primary} />
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
    backgroundColor: Colors.lightGrey,
  },
  uploadSection: {
    padding: 20,
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.darkGrey,
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.mediumGrey,
    textAlign: 'center',
    marginBottom: 40,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
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
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    width: '80%',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: Colors.primary,
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
    color: Colors.mediumGrey,
  },
  analysisContainer: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 20,
  },
  analysisTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.darkGrey,
    marginBottom: 20,
  },
  metricCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  metricLabel: {
    fontSize: 16,
    color: Colors.mediumGrey,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  recommendationCard: {
    marginTop: 20,
    padding: 15,
    backgroundColor: Colors.lightGrey,
    borderRadius: 10,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 10,
  },
  recommendationText: {
    fontSize: 14,
    color: Colors.mediumGrey,
    lineHeight: 20,
  },
  confidenceCard: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  confidenceHigh: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4caf50',
    borderWidth: 1,
  },
  confidenceMedium: {
    backgroundColor: '#fff3e0',
    borderColor: '#ff9800',
    borderWidth: 1,
  },
  confidenceLow: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
    borderWidth: 1,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.darkGrey,
  },
});