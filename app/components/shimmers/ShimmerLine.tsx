import { StyleSheet, View } from "react-native";

const ShimmerLine = ({ width = "100%", height = 16 }) => (
  <View style={styles.container}>
    <View
      className="animate-pulse"
      style={{ width: "100%", height: "100%", backgroundColor: "#f0f0f0" }}
    />
  </View>
);

export default ShimmerLine;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
});
