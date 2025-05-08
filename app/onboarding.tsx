import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chrome as Home, ChartLine, Bell, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const slides = [
  {
    id: '1',
    title: 'Smart Control',
    description: 'Control all your home devices with just a tap',
    icon: Home,
    image: 'https://images.pexels.com/photos/3935333/pexels-photo-3935333.jpeg',
  },
  {
    id: '2',
    title: 'Real-time Monitoring',
    description: 'Track temperature, humidity, and gas levels',
    icon: ChartLine,
    image: 'https://images.pexels.com/photos/4792480/pexels-photo-4792480.jpeg',
  },
  {
    id: '3',
    title: 'Instant Alerts',
    description: 'Get notified about important events',
    icon: Bell,
    image: 'https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollTo({
        x: width * (currentIndex + 1),
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace('/login');
    }
  };

  const handleSkip = () => {
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={slidesRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      >
        {slides.map((slide, index) => {
          const Icon = slide.icon;
          return (
            <View key={slide.id} style={[styles.slide, { width }]}>
              <Image
                source={{ uri: slide.image }}
                style={StyleSheet.absoluteFillObject}
              />
              <LinearGradient
                colors={['rgba(0,0,0,0.7)', 'transparent', 'rgba(0,0,0,0.8)']}
                style={StyleSheet.absoluteFillObject}
              />
              <SafeAreaView style={styles.content}>
                <View style={styles.header}>
                  <Icon size={48} color="#FFFFFF" />
                  <Text style={styles.title}>{slide.title}</Text>
                  <Text style={styles.description}>{slide.description}</Text>
                </View>

                <View style={styles.footer}>
                  <View style={styles.pagination}>
                    {slides.map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.paginationDot,
                          i === currentIndex && styles.paginationDotActive,
                        ]}
                      />
                    ))}
                  </View>

                  <View style={styles.buttons}>
                    {currentIndex < slides.length - 1 ? (
                      <>
                        <TouchableOpacity
                          style={styles.skipButton}
                          onPress={handleSkip}
                        >
                          <Text style={styles.skipButtonText}>Skip</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.nextButton}
                          onPress={handleNext}
                        >
                          <Text style={styles.nextButtonText}>Next</Text>
                          <ChevronRight size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                      </>
                    ) : (
                      <TouchableOpacity
                        style={[styles.nextButton, styles.getStartedButton]}
                        onPress={handleNext}
                      >
                        <Text style={styles.nextButtonText}>Get Started</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </SafeAreaView>
            </View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  slide: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  description: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
  },
  footer: {
    padding: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
    width: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    padding: 16,
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.8,
  },
  nextButton: {
    backgroundColor: '#0891B2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  getStartedButton: {
    flex: 1,
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});