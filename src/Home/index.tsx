import { useEffect, useRef, useState } from "react";
import { Dimensions, SafeAreaView } from "react-native";
import {
  ScrollView,
  NativeBaseProvider,
  View,
  Image,
  TextArea,
  ZStack,
  Pressable,
  Text,
} from "native-base";
import { Camera, CameraType } from "expo-camera";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";

import { styles } from "./styles";

// COMPONENTS
import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { PositionChoice } from "../components/PositionChoice";
import { Cross } from "../components/Cross";

// UTILS
import { POSITIONS, PositionProps } from "../utils/positions";

export function Home() {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [photoURI, setPhotoURI] = useState<null | string>(null);
  const [playerName, setPlayerName] = useState("");
  const [positionSelected, setPositionSelected] = useState<PositionProps>(
    POSITIONS[0]
  );

  const cameraRef = useRef<Camera>(null);
  const screenshotRef = useRef(null);

  async function handleTakePicture() {
    const photo = await cameraRef.current.takePictureAsync();
    setPhotoURI(photo.uri);
  }

  async function shareScreenshot() {
    const screenshot = await captureRef(screenshotRef);
    // console.log(screenshotRef.current);
    await Sharing.shareAsync("file://" + screenshot);
  }

  useEffect(() => {
    (async () => {
      const response = await Camera.requestCameraPermissionsAsync();
      if (!response.granted) {
        alert(
          "Conceda a permissção de acesso à câmera, para personalizar o seu sticker!"
        );

        return;
      }

      setHasCameraPermission(true);
    })();
  }, []);

  return (
    <NativeBaseProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View ref={screenshotRef}>
            <Header position={positionSelected} />

            <View style={styles.picture}>
              {!hasCameraPermission || photoURI ? (
                <ZStack width="full" h={300}>
                  <Image
                    zIndex={2}
                    alt={`Image of ${playerName}`}
                    source={{
                      uri: photoURI
                        ? photoURI
                        : "https://cdn.pixabay.com/photo/2018/11/13/21/43/instagram-3814055_960_720.png",
                    }}
                    onLoad={shareScreenshot}
                    style={styles.camera}
                  />

                  {!photoURI && <Cross />}
                </ZStack>
              ) : (
                <Camera
                  ref={cameraRef}
                  style={{
                    width: Dimensions.get("screen").width - 58,
                    height: 300,
                  }}
                  type={CameraType.front}
                />
              )}

              <View style={styles.player}>
                <TextArea
                  autoCompleteType={"none"}
                  autoCorrect={false}
                  placeholder="Digite seu nome aqui"
                  style={styles.name}
                  numberOfLines={1}
                  fontSize={6}
                  fontWeight="bold"
                  color="#000"
                  textTransform="uppercase"
                  h="12"
                  borderWidth={0}
                  onChangeText={setPlayerName}
                  textAlign="center"
                  keyboardAppearance="dark"
                />
              </View>
            </View>
          </View>

          <PositionChoice
            onChangePosition={setPositionSelected}
            positionSelected={positionSelected}
          />

          <View alignItems="center" mt="4">
            <Pressable onPress={() => setPhotoURI(null)}>
              <Text color="white" fontWeight="semibold">
                Nova Foto
              </Text>
            </Pressable>
          </View>

          <Button title="Compartilhar" onPress={handleTakePicture} />
        </ScrollView>
      </SafeAreaView>
    </NativeBaseProvider>
  );
}
