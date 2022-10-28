import { useEffect, useRef, useState } from "react";
import { Dimensions, SafeAreaView } from "react-native";
import {
  ScrollView,
  NativeBaseProvider,
  Box,
  View,
  Image,
  TextArea,
  ZStack,
} from "native-base";
import { Camera, CameraType } from "expo-camera";

import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { PositionChoice } from "../components/PositionChoice";

import { styles } from "./styles";
import { Cross } from "../components/Cross";

import { POSITIONS, PositionProps } from "../utils/positions";

export function Home() {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [photoURI, setPhotoURI] = useState<null | string>(null);
  const [playerName, setPlayerName] = useState("");
  const [positionSelected, setPositionSelected] = useState<PositionProps>(
    POSITIONS[0]
  );

  const cameraRef = useRef<Camera>(null);

  async function handleTakePicture() {
    const photo = await cameraRef.current.takePictureAsync();
    setPhotoURI(photo.uri);
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
          <View>
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
                />
              </View>
            </View>
          </View>

          <PositionChoice
            onChangePosition={setPositionSelected}
            positionSelected={positionSelected}
          />

          <Button title="Compartilhar" onPress={handleTakePicture} />
        </ScrollView>
      </SafeAreaView>
    </NativeBaseProvider>
  );
}
