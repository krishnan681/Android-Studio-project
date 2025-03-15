import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
  Linking,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {AuthContext, AuthProvider} from './AuthContext';
import axios from 'axios';

const Home = route => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firmName, setFirmName] = useState('');
  const [productName, setProductName] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const {user, userData} = useContext(AuthContext);

  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!userData?.id) return;

      try {
        const response = await axios.get(
          `https://signpostphonebook.in/image_upload_for_new_database.php?id=${userData.id}`,
        );

        if (response.data.success) {
          const imageUrl = response.data.imageUrl;
          const fullUrl = imageUrl.startsWith('http')
            ? imageUrl
            : `https://signpostphonebook.in/${imageUrl}`;
          setProfileImage(fullUrl + `?t=${new Date().getTime()}`); // Prevent caching
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchProfileImage();
  }, [userData?.id]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        'https://signpostphonebook.in/client_fetch_for_new_database.php',
      );
      if (!response.ok)
        throw new Error(`HTTP Error! Status: ${response.status}`);
      const jsonResponse = await response.json();
      if (Array.isArray(jsonResponse)) {
        const sortedData = jsonResponse.sort((a, b) => b.id - a.id);
        setData(sortedData);
        setFilteredData(sortedData);
      } else {
        Alert.alert('Error', 'Unexpected response from server.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = data;
    if (firmName) {
      filtered = data.filter(item =>
        item.businessname?.toLowerCase().includes(firmName.toLowerCase()),
      );
    } else if (productName) {
      filtered = data.filter(item =>
        item.product?.toLowerCase().includes(productName.toLowerCase()),
      );
    }
    setFilteredData(filtered);
  }, [firmName, productName, data]);

  const renderItem = ({item}) => {
    //................................................................................................................
    // Dial button and more button  click panna nadakura function

    const handleMorePress = item => {
      if (user) {
        navigation.navigate('Details', {selectedItem: item});
      } else {
        Alert.alert('Login Required', 'You need to log in to make a call.', [
          {text: 'OK', onPress: () => navigation.navigate('Login')},
        ]);
      }
    };

    const OpenDialpad = dialedNumber => {
      if (!user || user === '') {
        Alert.alert('Login Required', 'You need to log in to make a call.', [
          {text: 'OK', onPress: () => navigation.navigate('Login')},
        ]);
        return;
      }

      const phoneUrl = `tel:${dialedNumber}`;

      Linking.canOpenURL(phoneUrl)
        .then(supported => {
          if (supported) {
            Linking.openURL(phoneUrl);
          } else {
            Alert.alert('Error', 'Dial pad is not supported on this device.');
          }
        })
        .catch(err => console.error('An error occurred', err));
    };

    return (
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <View style={styles.textContainer}>
            <Text style={styles.businessName}>
              {item.businessname || item.person || 'Name not found'}
            </Text>
            {productName && (
              <Text style={styles.productName}>{item.product}</Text>
            )}
            {!productName && item.city && item.pincode && (
              <Text style={styles.locationText}>
                {item.city}, {item.pincode}
              </Text>
            )}
          </View>

          <View style={styles.rightContainer}>
            {item.mobileno && (
              <Text style={styles.mobile}>
                {item.mobileno.slice(0, 5)}xxxxx
              </Text>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => OpenDialpad(item.mobileno)}>
                <Text style={styles.buttonText}>Dial</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.detailButton}
                onPress={() => handleMorePress(item)}>
                <Text style={styles.buttonText}>More</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="darkyellow"
        style={styles.loader}
      />
    );
  }

  //colors={['#FFD700', '#FFB800']}

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient colors={['#FF69B4', '#FFFFFF']} style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.welcomeText}>
            Welcome {userData.businessname || userData.person || 'Guest'}
          </Text>
          <View style={styles.iconGroup}>
            <MaterialIcons name="notifications-none" size={24} color="#000" />
            <TouchableOpacity
              style={styles.profileIconContainer}
              onPress={() => {
                if (userData && userData.id) {
                  navigation.navigate('Profile'); // Navigate to Profile if logged in
                } else {
                  navigation.navigate('Login'); // Navigate to Login if not logged in
                }
              }}>
              {userData?.id && profileImage ? (
                <Image
                  source={{uri: profileImage}}
                  style={styles.profileIcon}
                  resizeMode="cover"
                />
              ) : (
                <MaterialIcons name="person" size={28} color="black" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* SEARCH INPUT */}
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Search firm name..."
            style={styles.searchInput}
            value={firmName}
            onChangeText={setFirmName}
          />
          <TextInput
            placeholder="Search product..."
            style={styles.searchInput}
            value={productName}
            onChangeText={setProductName}
          />
        </View>

        {/* HEADER CONTENT */}
        <View>
          <Text style={styles.headercontent}>Find Anyone, Anytime</Text>
          <Text style={styles.headersub}>
            Discover your customers near by you, Attract them with your offers &
            Discounts.
          </Text>
        </View>
      </LinearGradient>

      {/* FLATLIST CONTAINER */}
      <View>
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  //Linear Gradient kulla irrukura items ku styles

  header: {
    padding: 20,
    // paddingTop: 40,
    // paddingVertical: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  iconGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  headercontent: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 20,
  },
  headersub: {
    textAlign: 'center',
    marginTop: 5,
  },

  //Profile icon ku styles

  profileIconContainer: {
    width: 30, 
    height: 30, 
    borderRadius: 50, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Light gray background for icon style
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 90, // Circular profile image
    zIndex:1,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
    elevation: 4,
    margin: 10,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  businessName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6A0DAD',
  },
  locationText: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  mobile: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    backgroundColor: '#6A0DAD',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 5,
  },
  detailButton: {
    backgroundColor: '#6A0DAD',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  businessName: {fontSize: 18, fontWeight: 'bold'},
  locationText: {fontSize: 14, color: 'gray'},
  mobile: {fontSize: 16, color: '#333'},
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  detailButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {color: '#fff', textAlign: 'center'},
  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  inputContainer: {flexDirection: 'row', padding: 10},
  input: {flex: 1, borderWidth: 1, borderRadius: 5, padding: 10, margin: 5},
});

export default Home;
