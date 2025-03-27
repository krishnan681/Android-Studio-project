import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TotalCount = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Total Count</Text>
      <Text style={styles.text}>View total records and analytics.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#555",
  },
});

export default TotalCount;
