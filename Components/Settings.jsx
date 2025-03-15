import { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from './AuthContext';

const Settings = ({ navigation }) => {
  const { user, userData, logout } = useContext(AuthContext);

  // Check if user is logged in
  const isLoggedIn = user !== '';
  const displayName = isLoggedIn ? (userData.businessname || userData.person) : 'Guest User';

  return (
    <ScrollView style={styles.container}>
     
      
      {/* General Section */}
      <Text style={styles.sectionTitle}>GENERAL</Text>
      {isLoggedIn && (
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Account')}>
          <Icon name="person-outline" size={24} color="#aa336a" />
          <Text style={styles.optionText}>Account</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Notifications')}>
        <Icon name="notifications-outline" size={24} color="#aa336a" />
        <Text style={styles.optionText}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Coupons')}>
        <Icon name="gift-outline" size={24} color="#aa336a" />
        <Text style={styles.optionText}>Coupons</Text>
      </TouchableOpacity>
      {isLoggedIn && (
        <TouchableOpacity style={styles.option} onPress={() => logout(navigation)}>
          <Icon name="log-out-outline" size={24} color="#aa336a" />
          <Text style={[styles.optionText, { color: 'red' }]}>Logout</Text>
        </TouchableOpacity>
      )}

      {/* Feedback Section */}
      <Text style={styles.sectionTitle}>FEEDBACK</Text>
      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('ReportBug')}>
        <Icon name="alert-circle-outline" size={24} color="#aa336a" />
        <Text style={styles.optionText}>Report a Bug</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('SendFeedback')}>
        <Icon name="send-outline" size={24} color="#aa336a" />
        <Text style={styles.optionText}>Send Feedback</Text>
      </TouchableOpacity>

      {/* Show Login & Sign Up if not logged in */}
      {!isLoggedIn && (
        <View>
          <TouchableOpacity style={styles.authButton} onPress={() => navigation.navigate('Login')}>
            <Icon name="log-in-outline" size={24} color="white" />
            <Text style={styles.authText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.authButton} onPress={() => navigation.navigate('Signup')}>
            <Icon name="person-add-outline" size={24} color="white" />
            <Text style={styles.authText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  headerContainer: {
    padding: 20,
    backgroundColor: '#F3E5F5',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#aa336a',
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 20,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#aa336a',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 10,
    elevation: 3,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#aa336a',
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#aa336a',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 10,
  },
  authText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
});

export default Settings;
