import React, {useEffect, useState} from 'react';
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
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const Home = route => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firmName, setFirmName] = useState('');
  const [productName, setProductName] = useState('');
  const [selectedItem, setSelectedItem] = useState('');

  const [user, setUser] = useState(''); // Assuming login status (set this properly)

  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

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
    // Dial button click panna nadakura function

    const handleMorePress = item => {
      if (user && user !== '') {
        // Ensure user is properly set
        navigation.navigate('Details', {selectedItem: item});
      } else {
        Alert.alert('Login Required', 'You need to log in to view details.', [
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
      <ActivityIndicator size="large" color="royalblue" style={styles.loader} />
    );
  }

  return (
    <View style={{flex: 1}}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Firm/Person"
          value={firmName}
          onChangeText={text => {
            setFirmName(text);
            setProductName('');
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Product"
          value={productName}
          onChangeText={text => {
            setProductName(text);
            setFirmName('');
          }}
        />
      </View>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
