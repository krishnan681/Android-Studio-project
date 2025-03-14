import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Linking,
  StyleSheet,
  ScrollView,
} from "react-native";
import { AuthContext } from "./AuthContext";
import axios from "axios";

export default function ProductSms() {
  const { user, userData } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [productInput, setProductInput] = useState("");
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const maxLength = 290;
  const [customMessage, setCustomMessage] = useState(
    "I Saw Your Listing in SIGNPOST PHONE BOOK. I am Interested in your Products. Please Send Details/Call Me. (Sent Through Signpost PHONE BOOK)"
  );

  // Fetch all data initially (optional)
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://signpostphonebook.in/client_fetch.php"
      );
      if (Array.isArray(response.data)) {
        setData(response.data.sort((a, b) => b.id - a.id));
      } else {
        Alert.alert("Error", "Unexpected response from server.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load data: " + error.message);
    }
  };

  // Fetch filtered product data
  const fetchProductData = async (name) => {
    if (!name) return;
    try {
      const response = await axios.get(
        `https://signpostphonebook.in/client_fetch_product.php?product=${name}`
      );
      if (Array.isArray(response.data)) {
        setData(response.data);
        setShowResults(true);
      } else {
        Alert.alert("Error", "Unexpected response from server.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load product data: " + error.message);
    }
  };

  const handleSearch = () => {
    if (productInput) {
      fetchProductData(productInput);
    } else {
      Alert.alert("Search Error", "Please enter a product name.");
    }
  };

  const handleClear = () => {
    setProductInput("");
    setSelectAll(false);
    setSelectedClients([]);
    setShowResults(false);
  };

  const handleCheckboxChange = (client) => {
    setSelectedClients((prev) =>
      prev.includes(client)
        ? prev.filter((item) => item !== client)
        : [...prev, client]
    );
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedClients([]);
    } else {
      setSelectedClients(data);
    }
    setSelectAll(!selectAll);
  };

  const sendSMS = () => {
    if (selectedClients.length === 0) {
      Alert.alert("No Clients Selected", "Please select at least one client.");
      return;
    }
  
    const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    console.log("Current Date:", currentDate); // Debugging
  
    const postData = {
      user_name: userData?.bussinessname || userData?.person || "Unknown",
      date: currentDate,
      pincode: "",
      product: productInput.trim(),
      promotion_from: "CategoryWise Promotion",
      selected_count: selectedClients.length,
    };
  
    console.log("Post Data:", postData); // Debugging
  
    axios
      .post(
        "https://signpostphonebook.in/promotion_app/promotion_appliaction.php",
        postData
      )
      .then((response) => {
        console.log("Response Data:", response.data);
        if (response.data.success) {
          Alert.alert("Success", "Promotion data saved successfully.");
        } else {
          Alert.alert("Error", response.data.message || "Unknown error occurred.");
        }
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        Alert.alert("Error", "Failed to send data to the server.");
      });
  
    const mobileNumbers = selectedClients.map((client) => client.mobileno).join(",");
    const smsUri = `sms:${mobileNumbers}?body=${encodeURIComponent(customMessage)}`;
  
    Linking.openURL(smsUri).catch((err) =>
      Alert.alert("Error", "Failed to open SMS application.")
    );
  };
  

  return (
    <ScrollView style={styles.container}>
      <Text
        style={{
          fontSize: 25,
          fontWeight: "bold",
          // marginBottom: 10,
          color: "#6a0dad",
          textAlign: "center",
        }}
      >
        CATEGORYWISE PROMOTION
      </Text>

      <Text
        style={{
          // marginTop: 10,
          lineHeight: 30,
          fontSize: 16,
          textAlign: "justify",
        }}
      >
        Send messages to mobile users dealing in a specific product.{"\n"}
        1. First edit / create message to be sent. Minimum 1 Count (145
        characters),Maximum 2 counts (290 characters){"\n"}
        2. Type specific Category / product /keyword{"\n"}
        3. For error free delivery of messages, send in batches 10 each time.
        {"\n"}
      </Text>

      <Text style={{ fontWeight: "bold", marginTop: 10, fontSize: 16 }}>
        Edit / Create Message:
      </Text>
      <TextInput
        style={{
          borderWidth: 1,
          // padding: 15,
          borderRadius: 5,
          marginBottom: 10,
          fontSize: 16,
          lineHeight: 25,
        }}
        value={customMessage}
        onChangeText={setCustomMessage}
        multiline
        maxLength={maxLength}
      />
      <Text style={styles.charCount}>
        {maxLength - customMessage.length} / {maxLength}
      </Text>

      <Text
        style={{
          fontWeight: "bold",
          // marginTop: 10,
          fontSize: 16,
        }}
      >
        Category:
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Type product name..."
        value={productInput}
        onChangeText={setProductInput}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
        {showResults && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {showResults && (
        <>
          <Text style={{ fontSize: 16, color: "#333" }}>
            <Text style={{ fontWeight: "bold" }}>Results Displayed:</Text>{" "}
            {data.length}
          </Text>
          <View style={styles.checkboxRow}>
            <Text style={styles.checkboxLabel}>Select All</Text>
            <TouchableOpacity onPress={handleSelectAllChange}>
              <Text style={styles.checkbox}>{selectAll ? "☑" : "☐"}</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            style={{ marginTop: 10}}
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.businessname}</Text>
                <Text>{item.product}</Text>
                <View style={styles.checkboxRow}>
                  <Text>{item.mobileno.slice(0, -5)}xxxxx</Text>
                  <TouchableOpacity onPress={() => handleCheckboxChange(item)}>
                    <Text style={styles.checkbox}>
                      {selectedClients.includes(item) ? "☑" : "☐"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          <TouchableOpacity style={styles.button} onPress={sendSMS}>
            <Text style={styles.buttonText}>Send SMS</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f9f9f9",
  },
  charCount: {
    alignSelf: "flex-end",
    marginBottom: 10,
    fontSize: 14,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  button: {
    flex: 1,
    backgroundColor: "#007BFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  clearButton: {
    flex: 1,
    backgroundColor: "#FF4500",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  checkboxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  checkbox: {
    fontSize: 22,
    color: "#333",
  },
  card: {
    backgroundColor: "white",
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 15,
    left: 15,
    right: 15,
    backgroundColor: "#6a0dad",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
});



