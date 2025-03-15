import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  
  // Corrected function
  const handleDone = () => {
    navigation.navigate("BottomTabs");
  };

  return (
    <View style={styles.container}>
      <Onboarding
        onDone={handleDone}
        onSkip={handleDone}
        pages={[
          {
            backgroundColor: '#a7f3d0',
            image: (
              <View style={styles.lottieContainer}>
                <LottieView
                  source={require('../src/assets/animations/OnBoarding Animations/Animation - 1741766420544.json')} // Ensure correct path
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </View>
            ),
            title: 'Welcome!',
            subtitle: 'Experience smooth onboarding with animations!',
          },

          {
            backgroundColor: '#fef3c7',
            image: (
              <View style={styles.lottieContainer}>
                <LottieView
                  source={require('../src/assets/animations/OnBoarding Animations/Animation - 1741767350475.json')} // Ensure correct path
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </View>
            ),
            title: 'Easy Navigation',
            subtitle: 'Navigate through the app effortlessly!',
          },

          {
            backgroundColor: '#a78bfa',
            image: (
              <View style={styles.lottieContainer}>
                <LottieView
                  source={require('../src/assets/animations/OnBoarding Animations/Animation - 1741773493053.json')} // Ensure correct path
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </View>
            ),
            title: 'Let’s Begin!',
            subtitle: 'Start using the app now!',
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  lottieContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: width * 0.8,
    height: width * 0.8,
  },
});

export default OnboardingScreen;
