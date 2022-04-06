import { StyleSheet, Dimensions} from 'react-native';
import { Text, View } from '../components/Themed';
import MapView from "react-native-map-clustering";
import { Marker } from 'react-native-maps';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.container}>
      <MapView 
        initialRegion={{
          latitude: 45.2565749474502,
          longitude: 2.3099165578635086,
          latitudeDelta: 8,
          longitudeDelta: 8,
        }}
        style={styles.map} >
           {/* {state.pictureArray.map((marker, index) => (
              <Marker
                key={index}
                coordinate={marker.latlng}
                title={marker.title}
                description={marker.description}
              />
            ))} */}
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
