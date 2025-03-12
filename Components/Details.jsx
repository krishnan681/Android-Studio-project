import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Modal,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Details = ({route, navigation}) => {
  // Get the selected item passed from navigation
  const {selectedItem} = route.params;

  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

    const openDialpad = number => {
      let phoneUrl = `tel:${number}`;
      Linking.openURL(phoneUrl).catch(() =>
        Alert.alert('Error', 'Dial pad not supported'),
      );
    };

    const openWhatsApp = number => {
      Linking.openURL(`https://wa.me/${number}`);
    };

    const sendEmail = email => {
      Linking.openURL(`mailto:${email}`);
    };

    const sendSMS = number => {
      Linking.openURL(`sms:${number}`);
    };

  return (
    <ScrollView contentContainerStyle={styles.home_container}>
      <View style={styles.home_card}>
        {/* Image Section */}
        <View style={styles.home_imageContainer}>
          <Image
            source={{
              uri: 'https://w.wallhaven.cc/full/6q/wallhaven-6q3wyx.jpg',
            }}
            style={styles.home_image}
            resizeMode="cover"
          />
        </View>

        {/* Content Section */}
        <View style={styles.home_content}>
          <Text style={styles.home_title}>
            {selectedItem?.businessname ||
              selectedItem?.person ||
              'Name not found'}
          </Text>
          <Text style={styles.home_subtitle}>{selectedItem?.product}</Text>

          {/* Buttons */}
          <View style={styles.home_buttonContainer}>
            <TouchableOpacity style={styles.home_inviteButton}>
              <Text style={styles.home_inviteButtonText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.home_chatButton}
              onPress={openModal}>
              <Text style={styles.home_chatButtonText}>Chat with Us</Text>
            </TouchableOpacity>
          </View>

          {/* Contact Section */}
          <View style={styles.home_contactSection}>
            <Text style={styles.home_contactTitle}>Contact Us</Text>
            <Text style={styles.home_contactText}>
              {selectedItem?.description}
            </Text>
          </View>

          {/* Gallery & Message Button */}
          <View style={styles.home_messageContainer}>
            <Text style={styles.home_siteText}>My Gallery</Text>
            <TouchableOpacity style={styles.home_messageButton}>
              <Text style={styles.home_messageButtonText}>Reviews</Text>
            </TouchableOpacity>
          </View>

          {/* Photos Section */}
          <Text style={styles.home_profileName}>Photos</Text>
        </View>

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Close Button */}
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>✕</Text>
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Contact Us</Text>

              {/* Contact Buttons */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, {backgroundColor: '#6A0DAD'}]}
                  onPress={() => openDialpad(selectedItem?.mobileno)}>
                  <Text style={styles.buttonText}>Dial</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, {backgroundColor: '#25D366'}]}
                  onPress={() => openWhatsApp(selectedItem?.mobileno)}>
                  <Text style={styles.buttonText}>WhatsApp</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, {backgroundColor: '#FF9900'}]}
                  onPress={() => sendEmail(selectedItem?.email)}>
                  <Text style={styles.buttonText}>Email</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, {backgroundColor: '#4285F4'}]}
                  onPress={() => sendSMS(selectedItem?.mobileno)}>
                  <Text style={styles.buttonText}>SMS</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  home_container: {
    flexGrow: 1,
    backgroundColor: '#F3F4F6',
  },
  home_card: {
    width: '100%', // Full width
    backgroundColor: '#FFFFFF',
    borderRadius: 0, // Removed rounded corners for a full-width look
    overflow: 'hidden',
  },
  home_imageContainer: {
    width: '100%',
  },
  home_image: {
    width: '100%',
    height: 200,
  },
  home_content: {
    padding: 16,
    backgroundColor: '#FCE7F3',
  },
  home_title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  home_subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B21A8',
    marginBottom: 16,
  },
  home_buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  home_inviteButton: {
    backgroundColor: 'white',
    borderColor: '#6B21A8',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  home_inviteButtonText: {
    color: '#6B21A8',
    fontWeight: 'bold',
  },
  home_chatButton: {
    backgroundColor: '#EF4444',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  home_chatButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  home_contactSection: {
    marginBottom: 16,
  },
  home_contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  home_contactText: {
    color: '#4B5563',
    //   textAlign: 'center',
  },
  home_messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  home_siteText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  home_messageButton: {
    backgroundColor: 'white',
    borderColor: '#6B21A8',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  home_messageButtonText: {
    color: '#6B21A8',
    fontWeight: 'bold',
  },
  home_profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginTop: 10,
  },

  //modal

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  modalButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 6,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    // fontSize: 16,
  },
});

export default Details;
