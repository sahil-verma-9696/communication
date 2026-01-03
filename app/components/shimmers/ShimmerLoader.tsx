import { View } from "react-native";
import ChatItemSkeleton from "./ChatItemSkeleton";

const ShimmerLoader = () => (
  <View>
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <ChatItemSkeleton key={i} />
    ))}
  </View>
);

export default ShimmerLoader;
