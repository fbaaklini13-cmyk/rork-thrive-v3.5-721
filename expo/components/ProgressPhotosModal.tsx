import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { X, Camera, Save } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/constants/colors';
import type { ProgressPhoto } from '@/types/user';

interface ProgressPhotosModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (photo: ProgressPhoto) => Promise<void>;
}

export default function ProgressPhotosModal({
  visible,
  onClose,
  onSave,
}: ProgressPhotosModalProps) {
  const [frontUri, setFrontUri] = useState('');
  const [sideUri, setSideUri] = useState('');
  const [backUri, setBackUri] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const pickImage = async (type: 'front' | 'side' | 'back') => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant camera roll permissions to upload photos'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        switch (type) {
          case 'front':
            setFrontUri(result.assets[0].uri);
            break;
          case 'side':
            setSideUri(result.assets[0].uri);
            break;
          case 'back':
            setBackUri(result.assets[0].uri);
            break;
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async (type: 'front' | 'side' | 'back') => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant camera permissions to take photos'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        switch (type) {
          case 'front':
            setFrontUri(result.assets[0].uri);
            break;
          case 'side':
            setSideUri(result.assets[0].uri);
            break;
          case 'back':
            setBackUri(result.assets[0].uri);
            break;
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const showImageOptions = (type: 'front' | 'side' | 'back') => {
    Alert.alert(
      'Add Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: () => takePhoto(type),
        },
        {
          text: 'Choose from Library',
          onPress: () => pickImage(type),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!frontUri) {
      Alert.alert('Error', 'Please add at least a front photo');
      return;
    }

    setIsSaving(true);
    try {
      const photo: ProgressPhoto = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        frontUri,
        sideUri: sideUri || undefined,
        backUri: backUri || undefined,
      };
      await onSave(photo);
      setFrontUri('');
      setSideUri('');
      setBackUri('');
      onClose();
    } catch (error) {
      console.error('Failed to save photos:', error);
      Alert.alert('Error', 'Failed to save photos');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Progress Photos</Text>
            <Text style={styles.subtitle}>Track your transformation</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color={Colors.darkGrey} size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.photosGrid}>
            <View style={styles.photoItem}>
              <Text style={styles.photoLabel}>Front *</Text>
              <TouchableOpacity
                style={styles.photoButton}
                onPress={() => showImageOptions('front')}
              >
                {frontUri ? (
                  <Image source={{ uri: frontUri }} style={styles.photoImage} />
                ) : (
                  <>
                    <Camera color={Colors.mediumGrey} size={32} />
                    <Text style={styles.photoButtonText}>Add Photo</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.photoItem}>
              <Text style={styles.photoLabel}>Side</Text>
              <TouchableOpacity
                style={styles.photoButton}
                onPress={() => showImageOptions('side')}
              >
                {sideUri ? (
                  <Image source={{ uri: sideUri }} style={styles.photoImage} />
                ) : (
                  <>
                    <Camera color={Colors.mediumGrey} size={32} />
                    <Text style={styles.photoButtonText}>Add Photo</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.photoItem}>
              <Text style={styles.photoLabel}>Back</Text>
              <TouchableOpacity
                style={styles.photoButton}
                onPress={() => showImageOptions('back')}
              >
                {backUri ? (
                  <Image source={{ uri: backUri }} style={styles.photoImage} />
                ) : (
                  <>
                    <Camera color={Colors.mediumGrey} size={32} />
                    <Text style={styles.photoButtonText}>Add Photo</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>Tips for best results:</Text>
            <Text style={styles.tipText}>• Use the same location and lighting each time</Text>
            <Text style={styles.tipText}>• Take photos at the same time of day</Text>
            <Text style={styles.tipText}>• Wear similar clothing for consistency</Text>
            <Text style={styles.tipText}>• Take photos every 2-4 weeks</Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Save color={Colors.white} size={20} />
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : 'Save Photos'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.darkGrey,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.mediumGrey,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  photosGrid: {
    gap: 20,
  },
  photoItem: {
    gap: 8,
  },
  photoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey,
  },
  photoButton: {
    height: 240,
    backgroundColor: Colors.lightGrey,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoButtonText: {
    fontSize: 14,
    color: Colors.mediumGrey,
    fontWeight: '500',
  },
  tipsCard: {
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.lightGrey,
    borderRadius: 12,
    gap: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: Colors.mediumGrey,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});
