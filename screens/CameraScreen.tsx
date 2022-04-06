import { Camera } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet,  TouchableOpacity, FlatList, Image, Modal } from 'react-native';
import { Text, View} from '../components/Themed';
import { RootTabScreenProps } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import { PictureGeo } from './CapturedPicture';
import { CapturedPicture } from 'expo-camera/build/Camera.types';

export default function CameraScreen({ navigation }: RootTabScreenProps<'Camera'>) {
  const [hasPermission, setHasPermission] = useState(Boolean||null);
  const [location, setLocation] = useState(Object||null);
  const [errorMsg, setErrorMsg] = useState(String||null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef<Camera|null>();
  const [pictureArray, setTable] = useState<Array<PictureGeo>>([]);
  const [modalVisible, setModalVisible] = useState(false);

  let latitude = 0;
  let longitude = 0;
 
  // let text = 'Waiting..';
  // if (errorMsg) {
  //   text = errorMsg;
  // } else if (location) {
  //   text = JSON.stringify(location);
  //   latitude = location.coords.latitude != null ? location.coords.latitude : 0;
  //   longitude = location.coords.latitude != null ? location.coords.longitude : 0;
  // }

  async function save(key : string, value : string) {
    await AsyncStorage.setItem(key, value);
  }

  const saveGallery = async (uri : string) => {
    const res = await MediaLibrary.requestPermissionsAsync()
    if (res.granted) {
      MediaLibrary.saveToLibraryAsync(uri);
    }
  }
  const takePicture = () => {
   cameraRef.current && cameraRef.current.takePictureAsync({base64: true}).then(picture => {
     const geoPicture : PictureGeo = ({
       ...picture,
       latitude,
       longitude,
    }); 
    setTable([
      ...pictureArray,
      geoPicture,
    ]),
    saveGallery(picture.uri);
      console.log(geoPicture);
    });
  }

  useEffect(() => {
    if (pictureArray.length == 0) {
      AsyncStorage.getItem('savedPicture').then((data) => {
        data && save('savedPicture', JSON.stringify(data));
      })
    }
    if (pictureArray.length > 0) {
      save('savedPicture', JSON.stringify(pictureArray));
    }
  }, [pictureArray]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync() && await Location.requestForegroundPermissionsAsync();
      const res = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <><View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          console.log('Modal has been closed.');
          setModalVisible(!modalVisible);
        } }>
        <Camera
          type={type} style={styles.camera}
          ref={(camera) => {
            cameraRef.current = camera;
          } }
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              } }>
              <Text> Flip </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => takePicture()}
              style={styles.buttonTakePicture}>

            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonOther}>
            </TouchableOpacity>
          </View>
        </Camera>
      </Modal>
    </View>
    <View style={styles.container}>
    <FlatList
        horizontal={true}
        data={pictureArray}
        renderItem={({ item }) => {
          return (
            <View>
              <Image source={{ uri: 'data:image/jpg;base64,' + item.base64 }} style={{ width: 45, height: 45, borderColor: 'red' }}></Image>
            </View>
          );
        } }
        keyExtractor={(item) => item.uri} />
    <TouchableOpacity 
        style={styles.container}
        onPress={ () => setModalVisible(!modalVisible)}
      >
        <View style={{ flexDirection:'row', justifyContent:'center'}}>
          <View style={{ backgroundColor:'red', height:45, width:45, borderRadius: 50 }}></View>
        </View>
      </TouchableOpacity>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    margin: 10,
  },
  buttonTakePicture: {
    backgroundColor: '#fff',
    borderRadius: 40,
    height: 80,
    width: 80,
  },
  buttonOther: {
    width: 80,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: 80,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
