import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // 🌤 light theme
  },

  list: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },

  messageWrapper: {
    marginVertical: 4,
    flexDirection: "row",
  },

  leftAlign: {
    justifyContent: "flex-start",
  },

  rightAlign: {
    justifyContent: "flex-end",
  },

  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },

  myBubble: {
    backgroundColor: "#DCF8C6", // WhatsApp light green
    borderTopRightRadius: 4,
  },

  otherBubble: {
    backgroundColor: "#F1F1F1",
    borderTopLeftRadius: 4,
  },

  messageText: {
    fontSize: 16,
    color: "#000",
  },

  timeText: {
    fontSize: 11,
    color: "#555",
    alignSelf: "flex-end",
    marginTop: 4,
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },

  input: {
    flex: 1,
    maxHeight: 120,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#F5F5F5",
    fontSize: 16,
    marginRight: 8,
  },

  sendButton: {
    backgroundColor: "#0A84FF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  sendText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default styles;
