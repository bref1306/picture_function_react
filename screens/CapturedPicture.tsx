import { CameraCapturedPicture } from 'expo-camera/build/Camera.types';
import * as Location from 'expo-location';
import { useState } from 'react';

// const [location, setLocation] = useState(Object||null);
//   const [errorMsg, setErrorMsg] = useState(String||null);
// const getCoordinates = async () =>{
//     let location = await Location.getCurrentPositionAsync({});
//       setLocation(location);
// };
export declare type PictureGeo = CameraCapturedPicture & {
    longitude: number,
    latitude: number,
};