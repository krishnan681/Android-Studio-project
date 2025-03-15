// =============================== updated signup page ======================================
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Button,
  Image,
} from "react-native";
// import RNPickerSelect from "react-native-picker-select";
import { RadioButton } from "react-native-paper";
import LinearGradient from "react-native-linear-gradient";
import { KeyboardAvoidingView, Platform } from "react-native";


const Signup = ({ navigation }) => {
  const [mypromoCode, setPromoCode] = useState("");
  const [mybusinessname, setBusinessname] = useState("");
  const [myaddress, setAddress] = useState("");
  const [myperson, setPerson] = useState("");
  const [mycity, setCity] = useState("");
  const [mypincode, setPincode] = useState("");
  const [myproduct, setProduct] = useState("");
  const [mylandLine, setLandLine] = useState("");
  const [myLcode, setLcode] = useState("");
  const [myemail, setEmail] = useState("");
  const [myprefix, setPrefix] = useState("");
  const [mymobileno, setMobileno] = useState("");
  const [showMobiletext, setshowMobiletext] = useState(false);
  const [showbusinesstext, setShowBusinesstext] = useState(false);
  const [regName, setRegName] = useState("");
  const [regPrefix, setRegPrefix] = useState("");
  const [regBusinessName, setRegBusinessName] = useState("");
  const [regBusinessPrefix, setRegBusinessPrefix] = useState("");
  const [showPersonName, setShowPersonName] = useState(false);
  const [showprefixtext, setShowPrefixText] = useState(false);
  const [showAddressText, setshowAddressText] = useState(false);
  const [showCityText, setshowCityText] = useState(false);
  const [showPincodeText, setshowPincodeText] = useState(false);
  const [showProductText, setshowProductText] = useState(false);
  const [showLandlineText, setshowLandlineText] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showStdText, setshowStdText] = useState(false);
  const [showEmailText, setshowEmailText] = useState(false);
  const [showPromoText, setshowPromoText] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup1, setShowPopup1] = useState(false);
  const mypriority = "0";
  const mydiscount = "10";
  const mydescription = "Update Soon";
  const cmpanyPrefix = "M/s.";
  const navigate = useNavigate();

  const [dateTime, setDateTime] = useState("");

  const updateDateTime = () => {
    const now = new Date();

    // Format date
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const formattedDate = now.toLocaleDateString(undefined, options);

    // Format time
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format
    const formattedTime = `${hours}:${
      minutes < 10 ? "0" + minutes : minutes
    } ${ampm}`;

    // Combine date and time
    setDateTime(`${formattedDate} ${formattedTime}`);
  };

  useEffect(() => {
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000); // Update every second
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const resetForm = () => {
    setBusinessname("");
    setMobileno("");
    setPrefix("");
    setAddress("");
    setPerson("");
    setPincode("");
    setCity("");
    setProduct("");
    setLandLine("");
    setLandLine("");
    setLcode("");
    setEmail("");
    setPromoCode("");
  };

  const handleBusinessName = (e) => {
    const businessName = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(businessName)) {
      setBusinessname(businessName);
    }
  };
  const handlePersonName = (e) => {
    const personName = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(personName)) {
      setPerson(personName);
    }
  };
  const handlePopup = (e) => {
    e.preventDefault();
    setShowPopup(false);
    navigate("/login");
    resetForm();
  };

  const handleClosePopup1 = (e) => {
    e.preventDefault();
    setShowPopup1(false);
  };
  const handleCityName = (e) => {
    const cityName = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(cityName)) {
      setCity(cityName);
    }
  };



  // Check if the mobile number is registered
  const checkMobileNumber = async (mobile) => {
    try {
      const response = await fetch(
        `https://signpostphonebook.in/client_insert_data_for_new_database.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobileno: mobile }),
        }
      );
      const result = await response.json();
      if (result.registered) {
        console.log(result.data);
        setRegBusinessName(result.businessname);
        setRegBusinessPrefix(result.prefix);
        setRegName(result.person);
        setRegPrefix(result.personprefix);
        setIsRegistered(true);
        setShowPopup1(true);
        setMobileno("");
      } else {
        setIsRegistered(false);
        setShowPopup1(false);
      }
    } catch (error) {
      alert("Unable to verify mobile number.");
      console.log(error);
    }
  };

  // Insert new record if the mobile number is not registered
  const insertRecord = async (e) => {
    e.preventDefault();

    if (!myaddress || !mycity || !mypincode || !myprefix || !mymobileno) {
      alert("Please enter all required fields.");
      return;
    }

    if (isRegistered) {
      alert("Mobile number is already registered.");
      return;
    }
    const Data = {
      businessname: mybusinessname,
      prefix: cmpanyPrefix,
      person: myperson,
      personprefix: myprefix,
      address: myaddress,
      priority: mypriority,
      city: mycity,
      pincode: mypincode,
      mobileno: mymobileno,
      email: myemail,
      product: myproduct,
      landline: mylandLine,
      lcode: myLcode,
      promocode: mypromoCode,
      discount: mydiscount,
      description: mydescription,
      subscription_date: dateTime,
    };

    try {
      const response = await fetch(
        "https://signpostphonebook.in/client_insert_data_for_new_database.php",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Data),
        }
      );

      const jsonResponse = await response.json();

      if (jsonResponse.Message) {
        setShowPopup(true);
      } else {
        alert("Unexpected response from server.");
      }
    } catch (error) {
      alert("Error saving data.");
      console.log(error);
    }
  };

  const handleMobileHelptext = () => {
    setshowMobiletext(true);
    setShowPersonName(false);
    setShowPrefixText(false);
    setshowAddressText(false);
    setShowBusinesstext(false);
    setshowCityText(false);
    setshowPincodeText(false);
    setshowProductText(false);
    setshowLandlineText(false);
    setshowStdText(false);
    setshowEmailText(false);
    setshowPromoText(false);
  };

  const handleBusinessHelptext = () => {
    setShowBusinesstext(true);
    setshowMobiletext(false);
    setShowPersonName(false);
    setShowPrefixText(false);
    setshowAddressText(false);
    setshowCityText(false);
    setshowPincodeText(false);
    setshowProductText(false);
    setshowLandlineText(false);
    setshowStdText(false);
    setshowEmailText(false);
    setshowPromoText(false);
  };
  const handlePersonHelptext = () => {
    checkMobileNumber(mymobileno);
    setShowPersonName(true);
    setShowBusinesstext(false);
    setshowMobiletext(false);
    setShowPrefixText(false);
    setshowAddressText(false);
    setshowCityText(false);
    setshowPincodeText(false);
    setshowProductText(false);
    setshowLandlineText(false);
    setshowStdText(false);
    setshowEmailText(false);
    setshowPromoText(false);
  };
  const handleRadio = () => {
    setShowPersonName(false);
    setShowBusinesstext(false);
    setshowMobiletext(false);
    setShowPrefixText(true);
    setshowAddressText(false);
    setshowCityText(false);
    setshowPincodeText(false);
    setshowProductText(false);
    setshowLandlineText(false);
    setshowStdText(false);
    setshowEmailText(false);
    setshowPromoText(false);
  };
  const handleAddress = () => {
    setshowAddressText(true);
    setShowPersonName(false);
    setShowBusinesstext(false);
    setshowMobiletext(false);
    setShowPrefixText(false);
    setshowCityText(false);
    setshowPincodeText(false);
    setshowProductText(false);
    setshowLandlineText(false);
    setshowStdText(false);
    setshowEmailText(false);
    setshowPromoText(false);
  };
  const handleCity = () => {
    setshowAddressText(false);
    setShowPersonName(false);
    setShowBusinesstext(false);
    setshowMobiletext(false);
    setShowPrefixText(false);
    setshowCityText(true);
    setshowPincodeText(false);
    setshowProductText(false);
    setshowLandlineText(false);
    setshowStdText(false);
    setshowEmailText(false);
    setshowPromoText(false);
  };
  const handlePincode = () => {
    setshowAddressText(false);
    setShowPersonName(false);
    setShowBusinesstext(false);
    setshowMobiletext(false);
    setShowPrefixText(false);
    setshowCityText(false);
    setshowPincodeText(true);
    setshowProductText(false);
    setshowLandlineText(false);
    setshowStdText(false);
    setshowEmailText(false);
    setshowPromoText(false);
  };
  const handleProduct = () => {
    setshowAddressText(false);
    setShowPersonName(false);
    setShowBusinesstext(false);
    setshowMobiletext(false);
    setShowPrefixText(false);
    setshowCityText(false);
    setshowPincodeText(false);
    setshowProductText(true);
    setshowLandlineText(false);
    setshowStdText(false);
    setshowEmailText(false);
    setshowPromoText(false);
  };
  const handleLandLine = () => {
    setshowAddressText(false);
    setShowPersonName(false);
    setShowBusinesstext(false);
    setshowMobiletext(false);
    setShowPrefixText(false);
    setshowCityText(false);
    setshowPincodeText(false);
    setshowProductText(false);
    setshowLandlineText(true);
    setshowStdText(false);
    setshowEmailText(false);
    setshowPromoText(false);
  };
  const handleStdCode = () => {
    setshowAddressText(false);
    setShowPersonName(false);
    setShowBusinesstext(false);
    setshowMobiletext(false);
    setShowPrefixText(false);
    setshowCityText(false);
    setshowPincodeText(false);
    setshowProductText(false);
    setshowLandlineText(false);
    setshowStdText(true);
    setshowEmailText(false);
    setshowPromoText(false);
  };
  const handleEmail = () => {
    setshowAddressText(false);
    setShowPersonName(false);
    setShowBusinesstext(false);
    setshowMobiletext(false);
    setShowPrefixText(false);
    setshowCityText(false);
    setshowPincodeText(false);
    setshowProductText(false);
    setshowLandlineText(false);
    setshowStdText(false);
    setshowEmailText(true);
    setshowPromoText(false);
  };
  const handlePromoCode = () => {
    setshowAddressText(false);
    setShowPersonName(false);
    setShowBusinesstext(false);
    setshowMobiletext(false);
    setShowPrefixText(false);
    setshowCityText(false);
    setshowPincodeText(false);
    setshowProductText(false);
    setshowLandlineText(false);
    setshowStdText(false);
    setshowEmailText(false);
    setshowPromoText(true);
  };

  return (

    <KeyboardAvoidingView
  behavior={Platform.OS === "ios" ? "padding" : "height"}
  style={{ flex: 1 }}
>
    <View style={styles.container}>
    {/* Gradient Background Only at the Top */}
    <LinearGradient colors={["#FF69B4", "#FFFFFF"]} style={styles.topSection}>
      <Image
        source={require('../src/assets/images/comaany-logo.png')} // Replace with your logo
        style={styles.logo}
        resizeMode="contain"
      />
    </LinearGradient>

    {/* White Card Covering Bottom Section */}
    <View style={styles.card}>
      <Text style={styles.header}>
        <Text style={styles.signupText}>Sign Up</Text> to create an account.
      </Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>

        <Text style={styles.label}>Mobile Number :</Text>
        <TextInput
          placeholder="Mobile Number"
          keyboardType="number-pad"
          maxLength={10}
          style={styles.input}
          value={mymobileno}
          onChangeText={(text) => setMobileno(text)}
          onEndEditing={() => checkMobileNumber(mymobileno)}
        />

        <Text style={styles.label}> Business Name :</Text>
        <TextInput
          placeholder="Person/Business Name"
          style={styles.input}
          onChangeText={(text) => setBusinessname(text)}
          value={mybusinessname}
        />
        <Text style={styles.label}> Business Name :</Text>
        <TextInput
          placeholder="Person/Business Name"
          style={styles.input}
          onChangeText={(text) => setBusinessname(text)}
          value={mybusinessname}
        />

        <Text style={styles.label}>Prefix:</Text>
        <RadioButton.Group
          onValueChange={(value) => setPrefix(value)}
          value={myprefix}
        >
          <View style={styles.radioContainer}>
            <View style={styles.radioOption}>
              <RadioButton value="Mr." />
              <Text>Mr.</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="Ms." />
              <Text>Ms.</Text>
            </View>
            
          </View>
        </RadioButton.Group>

        <Text style={styles.label}>Address :</Text>
        <TextInput
          placeholder="Address"
          style={[styles.input, { height: 80 }]}
          multiline
          onChangeText={(text) => setDoorno(text)}
          value={mydoorno}
        />

        <Text style={styles.label}>City :</Text>
        <TextInput
          placeholder="City"
          style={styles.input}
          onChangeText={(text) => setCity(text)}
          value={mycity}
        />

        <Text style={styles.label}>Pincode :</Text>
        <TextInput
          placeholder="Pincode"
          keyboardType="number-pad"
          maxLength={6}
          style={styles.input}
          onChangeText={(text) => setPincode(text)}
          value={mypincode}
        />

        <Text style={styles.label}>Product / Service :</Text>
        <TextInput
          placeholder="Product"
          style={styles.input}
          onChangeText={(text) => setProduct(text)}
          value={myproduct}
        />

        <Text style={styles.label}>Landline Number :</Text>
        <TextInput
          placeholder="Landline Number"
          keyboardType="number-pad"
          style={styles.input}
          onChangeText={(text) => setLandLine(text)}
          value={mylandLine}
        />

        <Text style={styles.label}>STD Code :</Text>
        <TextInput
          placeholder="STD Code"
          keyboardType="number-pad"
          style={styles.input}
          onChangeText={(text) => setLcode(text)}
          value={myLcode}
        />

        <Text style={styles.label}>Email :</Text>
        <TextInput
          style={styles.input}
          placeholder="example@mail.com"
          keyboardType="email-address"
          value={myemail}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.signupButton} onPress={insertRecord}>
          <Text style={styles.signupButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  </View>

  </KeyboardAvoidingView>
  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  
  topSection: {
    height: "20%", // Covers the top area
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    width: 150,
    height: 50,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginTop: -20,
    alignItems: "center",
    elevation: 5,
    minHeight: "75%",  // Ensure enough space
  },
  
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  signupText: {
    color: "#FF69B4",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
    marginBottom: 10,
    width: "100%",
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  signupButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#FF69B4",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  signupButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    
  },
  loginText: {
    color: "#888",
  },
  loginLink: {
    color: "#FF69B4",
    fontWeight: "bold",
  },
});


export default Signup;
