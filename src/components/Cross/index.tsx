import { Box, View } from "native-base";

export function Cross() {
  return (
    <Box top="50%" left="0" zIndex={10}>
      <View
        w="full"
        h={2}
        bg="red.500"
        style={{
          transform: [{ rotate: "45deg" }],
        }}
      ></View>

      <View
        w="full"
        h={2}
        bg="red.500"
        style={{
          transform: [{ rotate: "-45deg" }],
        }}
      ></View>
    </Box>
  );
}
