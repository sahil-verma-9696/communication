import { View } from "react-native";
import ShimmerLine from "./ShimmerLine";

const ChatItemSkeleton = () => (
  <View style={{ padding: 16, backgroundColor: "white", marginBottom: 1 }}>
    <View
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: "#e0e0e0",
          marginRight: 12,
        }}
      />
      <View style={{ flex: 1 }}>
        <ShimmerLine width="60%" height={18} />
        <View style={{ height: 6 }} />
        <ShimmerLine width="40%" height={14} />
      </View>
    </View>
  </View>
);

export default ChatItemSkeleton;
