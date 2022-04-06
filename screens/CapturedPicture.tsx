import { CameraCapturedPicture } from 'expo-camera/build/Camera.types';

export declare type PictureGeo = CameraCapturedPicture & {
    longitude: number,
    latitude: number,
};