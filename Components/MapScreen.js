import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MapView, {Marker} from 'react-native-maps';

const MapScreen = props => {
  const currentLocation = {
    latitude: 19.4445035,
    longitude: 72.8235646,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  console.log("listOfData: ", props.listOfData)

  return (
    <View style={styles.container}>
      {/*Render our MapView*/}
      <MapView
        style={styles.map}
        //specify our coordinates.
        initialRegion={{
          latitude: 19.4445035,
          longitude: 72.8235646,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <Marker coordinate={currentLocation} />
        {props.listOfData && props.listOfData.map((item, index) => {
          return (
            <Marker
              key={index}
              coordinate={{latitude: item.Latitude, longitude: item.Longitude, latitudeDelta: 0.01, longitudeDelta: 0.01}}
              pinColor="#8e44ad"
            />
          );
        })}
      </MapView>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, //the container will fill the whole screen.
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
