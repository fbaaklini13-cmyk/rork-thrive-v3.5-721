import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, Camera, ChefHat, Pill, BarChart3, X } from 'lucide-react-native';
import { useUserProfile } from '@/hooks/user-profile-store';

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  onSubscribe?: () => void;
}

const { width } = Dimensions.get('window');

export default function PremiumModal({ visible, onClose, onSubscribe }: PremiumModalProps) {
  const { subscribeToPremium, profile } = useUserProfile();

  const handleSubscribe = async () => {
    try {
      await subscribeToPremium();
      Alert.alert('Success!', 'Welcome to Thrive Premium! 🎉\n\nAll premium features are now unlocked!');
      onSubscribe?.();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to subscribe. Please try again.');
    }
  };

  const features = [
    {
      icon: Camera,
      title: 'AI Body Scanner',
      description: 'Analyze your physique and track changes with precision',
    },
    {
      icon: BarChart3,
      title: 'Macros Breakdown',
      description: 'See protein, carbs, and fats alongside calories',
    },
    {
      icon: ChefHat,
      title: 'Recipe Generator',
      description: 'Discover meal ideas that fit your goals',
    },
    {
      icon: Pill,
      title: 'Supplement Generator',
      description: 'Science-based recommendations with exact dosages',
    },
  ];

  if (profile.isPremium) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#7F8C8D" />
          </TouchableOpacity>

          <LinearGradient
            colors={['#008264', '#008a6a']}
            style={styles.header}
          >
            <Crown size={48} color="#FFFFFF" />
            <Text style={styles.title}>Thrive Premium</Text>
            <Text style={styles.subtitle}>Unlock Your Full Potential</Text>
          </LinearGradient>

          <ScrollView style={styles.featuresContainer} showsVerticalScrollIndicator={false}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <feature.icon size={24} color="#008264" />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}

            <View style={styles.adFreeFeature}>
              <Text style={styles.adFreeText}>✨ Ad-Free Experience</Text>
              <Text style={styles.adFreeDescription}>
                Focus fully on your progress, distraction-free
              </Text>
            </View>
          </ScrollView>

          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>Only $4.99/month</Text>
            <Text style={styles.priceSubtext}>Cancel anytime</Text>
          </View>

          <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
            <LinearGradient
              colors={['#008264', '#008a6a']}
              style={styles.subscribeGradient}
            >
              <Text style={styles.subscribeText}>Start Free Trial</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: width * 0.9,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 5,
  },
  header: {
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 5,
    opacity: 0.9,
  },
  featuresContainer: {
    padding: 20,
    maxHeight: 300,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F4F6F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 3,
  },
  featureDescription: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  adFreeFeature: {
    backgroundColor: '#F4F6F7',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    alignItems: 'center',
  },
  adFreeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 5,
  },
  adFreeDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  priceContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#F4F6F7',
    marginHorizontal: 20,
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008264',
  },
  priceSubtext: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 5,
  },
  subscribeButton: {
    margin: 20,
    marginTop: 0,
  },
  subscribeGradient: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  subscribeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});