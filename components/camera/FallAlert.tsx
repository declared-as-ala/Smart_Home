import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  Platform
} from 'react-native';
import { TriangleAlert as AlertTriangle, Phone, X } from 'lucide-react-native';

type FallAlertProps = {
  onDismiss: () => void;
  onRestart: () => void;
  confidence: number | null;
};

const { width } = Dimensions.get('window');

const FallAlert = ({ onDismiss, onRestart, confidence }: FallAlertProps) => {
  const slideAnim = React.useRef(new Animated.Value(width)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      ])
    ).start();
    
    return () => {
      // Cleanup animations if needed
    };
  }, []);
  
  const handleDismiss = () => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  };
  
  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateX: slideAnim }] }
      ]}
    >
      <View style={styles.header}>
        <Animated.View style={{
          transform: [{ scale: pulseAnim }]
        }}>
          <AlertTriangle color="#FFFFFF" size={40} />
        </Animated.View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Fall Detected!</Text>
          {confidence && (
            <Text style={styles.confidence}>
              {(confidence * 100).toFixed(0)}% confidence
            </Text>
          )}
        </View>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={handleDismiss}
        >
          <X color="#FFFFFF" size={24} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.message}>
        A potential fall has been detected. Do you need assistance?
      </Text>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.emergencyButton}
          activeOpacity={0.8}
        >
          <Phone color="#FFFFFF" size={20} />
          <Text style={styles.emergencyButtonText}>
            Call Emergency Contact
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.dismissButton}
          onPress={() => {
            handleDismiss();
            onRestart();
          }}
        >
          <Text style={styles.dismissButtonText}>
            I'm OK
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#EF4444',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  confidence: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.9,
    marginTop: 4,
  },
  closeButton: {
    padding: 4,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 24,
    opacity: 0.9,
  },
  actions: {
    gap: 12,
  },
  emergencyButton: {
    backgroundColor: '#B91C1C',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dismissButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  dismissButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FallAlert;