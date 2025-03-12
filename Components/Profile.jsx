
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Button,
  ScrollView,
  MenuItem,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from './AuthContext';
import axios from 'axios';


const Profile = () => {


  const [taskCount, setTaskCount] = useState(0); // Task count (set to 0 instead of "")
  const [referralCount, setReferralCount] = useState(0);
  const {userData, setUserData} = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(null);
  const date = new Date().toISOString().split('T')[0];
  const [error, setError] = useState(null);
  const [membershipModalVisible, setMembershipModalVisible] = useState(false);
  const openMembershipModal = () => setMembershipModalVisible(true);
  const closeMembershipModal = () => setMembershipModalVisible(false);

  // profile image function

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!userData?.id) return;

      try {
        const response = await axios.get(
          `https://signpostphonebook.in/image_upload_for_new_database.php?id=${userData.id}`,
        );
        // console.log("Fetched Image Response:", response.data);

        if (response.data.success) {
          const imageUrl = response.data.imageUrl;
          const fullUrl = imageUrl.startsWith('http')
            ? imageUrl
            : `https://signpostphonebook.in/${imageUrl}`;
          setProfileImage(fullUrl + `?t=${new Date().getTime()}`); // Prevent caching
          setUserData(prevData => ({...prevData, profileImage: fullUrl}));
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchProfileImage();
  }, [userData.id, setUserData]);

  const handleImagePick = async () => {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please allow access to the gallery.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const selectedImage = result.assets[0].uri;
      console.log('Selected Image URI:', selectedImage);
      setProfileImage(selectedImage);
      uploadImage(selectedImage);
    }
  };

  const uploadImage = async imageUri => {
    const formData = new FormData();
    formData.append('profileImage', {
      uri: imageUri,
      name: 'profile.jpg',
      type: 'image/jpeg',
    });
    formData.append('id', userData?.id);
    formData.append(
      'name',
      userData?.businessname || userData?.person || 'Unknown',
    );

    try {
      const response = await axios.post(
        'https://signpostphonebook.in/image_upload_for_new_database.php',
        formData,
        {headers: {'Content-Type': 'multipart/form-data'}},
      );

      //   console.log("Upload Response:", response.data);

      if (response.data.success) {
        const fullUrl = response.data.imageUrl.startsWith('http')
          ? response.data.imageUrl
          : `https://signpostphonebook.in/${response.data.imageUrl}`;

        setProfileImage(fullUrl + `?t=${new Date().getTime()}`); // Prevent caching
        setUserData(prevData => ({...prevData, profileImage: fullUrl}));
      } else {
        console.error('Upload failed:', response.data.message);
        Alert.alert('Upload Failed', response.data.message);
      }
    } catch (error) {
      console.error('Error uploading image:', error.message);
      Alert.alert(
        'Upload Error',
        'An error occurred while uploading the image.',
      );
    }
  };

  const fetchUserData = async (userid, date, signal) => {
    try {
      if (!userid || !date) {
        throw new Error('Please provide a valid ID and Date.');
      }

      const response = await fetch(
        `https://signpostphonebook.in/data_entry_details.php?userid=${userid}&date=${date}`,
        {signal}, // Attach the abort signal
      );

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'success' && data.data) {
        return data.data;
      } else if (
        data.status === 'error' &&
        data.message === 'No record found.'
      ) {
        return {count: 0}; // Ensure frontend handles missing data correctly
      } else {
        throw new Error(data.message || 'Failed to fetch details.');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching user data:', error.message);
      }
      return null;
    }
  };

  useEffect(() => {
    if (!userData?.id || !date) {
      setError('Invalid user data or date.');
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const getData = async () => {
      setIsLoading(true);
      const data = await fetchUserData(userData.id, date, signal);
      setIsLoading(false);

      if (data) {
        setTaskCount(data.count || 0); // Ensure count is handled even if 0
        setError(null);
      } else {
        setError('No data found.');
        setTaskCount(0); // Reset count if no data is found
      }
    };

    getData();
    if (typeof fetchReferralCount === 'function') {
      fetchReferralCount();
    }

    return () => controller.abort(); // Cancel fetch request on unmount
  }, [userData, date]);

  // Fetch referral count
  const fetchReferralCount = async () => {
    if (!userData?.mobileno) return;
    try {
      const response = await fetch(
        `https://signpostphonebook.in/try_referrals_count.php?mobile=${encodeURIComponent(
          userData.mobileno,
        )}`,
      );
      const data = await response.text();
      const match = data.match(/Total Referred: (\d+)/);
      if (match) setReferralCount(parseInt(match[1], 10));
    } catch (error) {
      setError('Failed to fetch referral count.');
    }
  };

  // style={styles.profileImage}







  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-left" size={20} color="#fff" style={styles.backIcon} />
        </TouchableOpacity>
        
        <TouchableOpacity>
          <Icon name="cog" size={20} color="#fff" style={styles.settingsIcon} />
        </TouchableOpacity>

        {/* Profile Image */}
        <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
                resizeMode="contain"
              />
        <Text style={styles.userName}> {userData?.businessname || userData?.person || 'Your name'}</Text>
        {/* <Text style={styles.userRole}>Joining date</Text> */}

        {/* Follow Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            <Text style={styles.statsNumber}>{taskCount}</Text> Total Count
          </Text>
          <Text style={styles.statsText}>
            <Text style={styles.statsNumber}>{referralCount}</Text> Referral Count
          </Text>
        </View>
      </View>

      {/* Contact Information */}
      <ScrollView style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Icon name="envelope" size={20} color="#666" />
          <Text style={styles.infoText}>{userData.description || 'description'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="phone" size={20} color="#666" />
          <Text style={styles.infoText}> {userData.product || 'Product'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="twitter" size={20} color="#1DA1F2" />
          <Text style={styles.infoText}>{userData.address || 'Address'}, {userData.city || 'City'},{' '}
          {userData.pincode || 'Pincode'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="behance" size={20} color="#1769FF" />
          <Text style={styles.infoText}>{userData.mobileno || 'Mobile No'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="facebook" size={20} color="#4267B2" />
          <Text style={styles.infoText}>{userData.email || 'Email'}</Text>
        </View>




        <TouchableOpacity
          style={styles.openModalButton}
          onPress={openMembershipModal}
        >
          <Text style={styles.buttonText}>Membership Card</Text>
        </TouchableOpacity>




 {/* Membership Card Modal */}
 <Modal
          visible={membershipModalVisible}
          animationType="fade"
          transparent={true}
        >
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              {/* Header Section */}
              <View style={styles.heaader}>
                <Image
                  source={require("../src/assets/images/Logo_Phonebook.jpg")}
                  style={styles.logo}
                />
                <Text style={styles.heaaderText}>SIGNPOST PHONE BOOK</Text>

                {/* Close Button */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeMembershipModal}
                >
                  <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
              </View>

              {/* Membership Card Content */}
              <Text style={styles.membershipText}>Membership Card</Text>
              <View style={styles.cardContent}>
                <Image
                  source={{ uri: profileImage }}
                  style={styles.memprofileImage}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>
                    {userData?.businessname || userData?.person}
                  </Text>
                  <Text style={styles.validText}>
                    Valid Until: Date Not Available
                  </Text>
                  <Text style={styles.addressText}>
                    Address: {userData?.address || "N/A"},{userData?.city || "N/A"},{userData?.pincode || "N/A"} 
                  </Text>
                </View>
              </View>

              {/* Footer Section */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  This card is valid for 5 years from the date of issue.
                </Text>
                <Text style={styles.footerAddress}>
                  46, Sidco Industrial Estate, Coimbatore - 641021
                </Text>
              </View>
            </View>
          </View>
        </Modal>



      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#1E3CFF", // Blue background
    alignItems: "center",
    paddingVertical: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  backIcon: {
    position: "absolute",
    left: 20,
    top: 15,
  },
  settingsIcon: {
    position: "absolute",
    right: 20,
    top: 15,
  },
  profileText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },
  userName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  userRole: {
    color: "#fff",
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginTop: 15,
  },
  statsText: {
    color: "#fff",
    fontSize: 14,
  },
  statsNumber: {
    fontWeight: "bold",
    fontSize: 16,
  },
  infoSection: {
    padding: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  infoText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },

  // /membership cars styles

  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
  },
  heaader: {
    backgroundColor: "#ff4081",
    width: "100%",
    flexDirection: "row", // Arrange items in a row
    alignItems: "center", // Align items vertically
    justifyContent: "center", // Align items horizontally
    padding: 15,
  },

  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  heaaderText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    bottom: 25,

    marginLeft: 10,
    marginBottom: -50,
  },
  membershipText: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  memprofileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userInfo: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  validText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "gray",
    marginTop: 5,
  },
  addressText: {
    width: "90%",
    fontSize: 14,
    color: "gray",
    marginTop: 5,
    flexWrap: "wrap",
  },
  footer: {
    backgroundColor: "#ff4081",
    width: "100%",
    padding: 10,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "white",
  },
  footerAddress: {
    fontSize: 12,
    color: "white",
  },
  closeButton: {
    position: "absolute",
    right: 15,
    top: 15,
    backgroundColor: "white",
    width: 25,
    height: 25,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  ProfilecloseButton: {
    position: "absolute",
    right: "10",
  },

  ProfilecloseButtonText: {
    color: "white",
    backgroundColor: "black",
    width: 35,
    height: 35,
    fontSize: 26,
    paddingLeft: 10,
    // left: 150,
    // marginVertical: 15,
    borderRadius: 25,
    fontWeight: "bold",
  },
});

export default Profile;
