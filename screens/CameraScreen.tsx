import { Camera } from 'expo-camera';
import { CapturedPicture } from 'expo-camera/build/Camera.types';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet,  TouchableOpacity, FlatList, Image } from 'react-native';
import { Text, View} from '../components/Themed';
import { RootTabScreenProps } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MediaLibrary from 'expo-media-library';

export default function CameraScreen({ navigation }: RootTabScreenProps<'Camera'>) {
  const [hasPermission, setHasPermission] = useState(Boolean||null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef<Camera|null>();
  const [pictureArray, setTable] = useState<Array<CapturedPicture>>([]);
  //const [item, setItem] = useLocalStorage('base64', '');
 
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
    setTable([
      ...pictureArray,
      picture,
    ]),
    saveGallery(picture.uri);
      console.log(pictureArray);
    });
  }
  const getPicture = async () => {
    await AsyncStorage.getItem('savedPicture');
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
      const { status } = await Camera.requestCameraPermissionsAsync();
      const res = await MediaLibrary.requestPermissionsAsync()

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
    <View style={styles.container}>
    <Camera 
      type={type} style={styles.camera}
      ref={(camera) => {
        cameraRef.current = camera;
      }}
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
          }}>
          <Text> Flip </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => 
            {takePicture()}
          }
          style={styles.buttonTakePicture}>

        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.buttonOther}>
        </TouchableOpacity>
      </View>
    </Camera>
    <FlatList
        horizontal={true}
        data={pictureArray}
        renderItem={({item}) => { 
            return (
            <View>
              <Image source={{uri: 'data:image/jpg;base64,'+item.base64}} style={{width: 45, height: 45, borderColor:'red'}}></Image>
            </View> 
            );
        }}
        keyExtractor={(item) => item.uri}
      />
  </View>
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
