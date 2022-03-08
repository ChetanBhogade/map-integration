import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {API_KEY} from '@env';
import axios from 'axios';
import MapScreen from './Components/MapScreen';

// Formula from - http://www.movable-type.co.uk/scripts/latlong.html
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres
  return d / 1000;
};

const App = () => {
  const [tableData, setTableData] = useState([]);
  const [rangeLocations, setRangeLocations] = useState([]);
  const [showMap, setShowMap] = useState(false);

  const callAPI = () => {
    axios
      .post('http://94.237.72.174/AUDITRESTAPI/api/Values/Login', {
        UserName: 'admin',
        Password: 'admin123',
      })
      .then(response => {
        // console.log('response from API: - ', response.data.Table2);
        setTableData(response.data.Table2);
      })
      .catch(err => {
        console.log('Got an error: - ', err);
      });
  };

  useEffect(() => {
    console.log('Env variables: - ', API_KEY);
    callAPI();
  }, []);

  useEffect(() => {
    const backAction = () => {
      console.log('Back button press: - ', !showMap);
      if (!showMap) {
        BackHandler.exitApp();
      } else {
        setShowMap(false);
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [showMap]);

  const grabNearLocations = () => {
    let nearestLocations = [];
    for (let index = 0; index < tableData.length; index++) {
      const element = tableData[index];
      const distance = calculateDistance(
        19.4445035, // my location
        72.8235646, // my location
        element.Latitude,
        element.Longitude,
      );
      if (distance <= 50) {
        nearestLocations.push(element);
      }
    }
    console.log('Nearest Locations are: - ', nearestLocations);
    setRangeLocations(nearestLocations);
  };

  const renderItem = ({item}) => (
    <View style={styles.item}>
      <Text style={styles.title}>
        Name: {item.LocationName} - {item.Latitude}, {item.Longitude}
      </Text>
    </View>
  );

  return showMap ? (
    <MapScreen listOfData={tableData} />
  ) : (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btnWrapper}
        onPress={() => {
          grabNearLocations();
        }}>
        <Text style={styles.btnText}>Grab 50 KM range locations</Text>
      </TouchableOpacity>
      {rangeLocations.length > 0 && (
        <View style={{height: 100}}>
          <FlatList
            data={rangeLocations}
            renderItem={renderItem}
            keyExtractor={item => item.LocationID}
          />
        </View>
      )}

      <TouchableOpacity
        style={styles.btnWrapper}
        onPress={() => {
          setShowMap(true);
        }}>
        <Text style={styles.btnText}>Show all data on map</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1, //the container will fill the whole screen.
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnWrapper: {
    margin: 10,
    padding: 15,
    borderWidth: 1,
  },
  btnText: {
    fontSize: 20,
  },
  item: {
    backgroundColor: '#81ecec',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 15,
  },
});
