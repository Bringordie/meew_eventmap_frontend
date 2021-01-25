import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  TouchableHighlight,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import Constants from "expo-constants";
import facade from "./serverFacade";
import GetLoginData from "./GetLoginData";
import CreateEvent from "./CreateEvent";
import { StatusBar } from "expo-status-bar";

const MyButton = ({ txt, onPressButton }) => {
  return (
    <TouchableHighlight style={styles.touchable} onPress={onPressButton}>
      <Text style={styles.touchableTxt}>{txt}</Text>
    </TouchableHighlight>
  );
};

export default App = () => {
  //HOOKS
  const address_obj = { road: null, house_number: null, postcode: null };
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [myPosition, setMyPosition] = useState(address_obj);
  const [errorMessage, setErrorMessage] = useState(null);
  const [events, setEvents] = useState([]);
  const [region, setRegion] = useState(null);
  const [userHasClicked, setUserHasClicked] = useState(false);
  const [address, setAddress] = useState(address_obj);
  const [username, setUsername] = useState("");
  let mapRef = useRef(null);

  useEffect(() => {
    getLocationAsync();
  }, []);

  getLocationAsync = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      setErrorMessage("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });

    const result = await facade.getAddressFromCoordinates(
      location.coords.latitude,
      location.coords.longitude
    );

    setPosition({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    const house_number_name = result.address.house_number;
    const road_name = result.address.road;
    const postcode_name = result.address.postcode;

    setMyPosition({
      road: road_name,
      house_number: house_number_name,
      postcode: postcode_name,
    });

    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  /*
  When a press is done on the map, coordinates (lat,lon) are provided via the event object
  */
  onMapPress = async (event) => {
    // TODO preventing reload / changing logic.
    if (event.nativeEvent.coordinate != undefined) {
      //Get location from where user pressed on map, and check it against an address
      const coordinate = event.nativeEvent.coordinate;
      const lon = coordinate.longitude;
      const lat = coordinate.latitude;
      try {
        //Backend request taking LAT and LON and giving an address back
        const result = await facade.getAddressFromCoordinates(lat, lon);
        showStatusFromServer(setAddress, result, setUserHasClicked);
      } catch (err) {
        const err_msg = JSON.stringify(err);
        Alert.alert("Error", err_msg);
        setUserHasClicked(false);
      }
    }
  };

  const [showLoginDialog, setShowLoginDialog] = useState(true);

  const [showCreateEvent, setShowCreateEvent] = useState(false);

  const closeLoginDataDialog = () => {
    setShowLoginDialog(false);
  };

  const closeCreateEventDialog = () => {
    setShowCreateEvent(false);
  };

  const updateEvents = useCallback(
    (props) => {
      setEvents(props);
    },
    [setEvents]
  );

  function showStatusFromServer(setAddress, result, setUserHasClicked) {
    const house_number_name = result.address.house_number;
    const road_name = result.address.road;
    const postcode_name = result.address.postcode;

    setAddress({
      road: road_name,
      house_number: house_number_name,
      postcode: postcode_name,
    });
    setUserHasClicked(true);
  }

  const info = userHasClicked
    ? `You clicked on: ${address.road} ${address.house_number}, ${address.postcode}`
    : "Click on a location to see or create an event";

  return (
    <View style={{ flex: 1, paddingTop: 20 }}>
      {/* TODO real loading screen */}
      {!region && <Text style={styles.fetching}>.. Fetching data</Text>}

      {region && position.longitude != undefined && (
        <MapView
          ref={mapRef}
          style={{ flex: 14 }}
          onPress={onMapPress}
          mapType="standard"
          region={region}
        >
          {/*App MapView.Marker to show users current position*/}
          <MapView.Marker
            coordinate={{
              longitude: position.longitude,
              latitude: position.latitude,
            }}
            description={"This is where you are currently located."}
          />
          {/*Map over all events in the database*/}
          {events.map((marker, index) => (
            <MapView.Marker
              key={index}
              coordinate={{
                latitude: marker.coordinate.coordinates[0],
                longitude: marker.coordinate.coordinates[1],
              }}
              pinColor={"green"}
            >
              <MapView.Callout>
                <View style={{ height: 100, width: 200 }}>
                  <Text>Event: {marker.eventName} </Text>
                  <Text>
                    Date: {marker.eventSchedule.substr(8, 2)}/
                    {marker.eventSchedule.substr(5, 2)} -{" "}
                    {marker.eventSchedule.substr(0, 4)}
                  </Text>
                  <Text>Time: {marker.eventSchedule.substr(11, 5)}</Text>
                  <Text>Tickets available: {marker.ticketAmount} </Text>
                  <Text>Ticket price: {marker.ticketPrice}.- </Text>
                </View>
              </MapView.Callout>
            </MapView.Marker>
          ))}
        </MapView>
      )}

      <Text style={{ flex: 1, textAlign: "center", fontWeight: "bold" }}>
        Your location: {myPosition.road} {myPosition.house_number},{" "}
        {myPosition.postcode}
      </Text>
      <Text style={{ flex: 1, textAlign: "center" }}>{info}</Text>
      {address.road != null && (
        <>
          <MyButton
            style={{ flex: 2 }}
            onPressButton={() => setShowCreateEvent(true)}
            txt="Create Event"
          />
          <CreateEvent
            visible={showCreateEvent}
            address={address}
            onClose={closeCreateEventDialog}
            username={username}
          />
        </>
      )}
      <Button title="logout" onPress={() => setShowLoginDialog(true)} />
      <GetLoginData
        visible={showLoginDialog}
        setEvents={updateEvents}
        onClose={closeLoginDataDialog}
        loggedUser={setUsername}
      />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
  },
  touchable: { backgroundColor: "#4682B4", margin: 3 },
  touchableTxt: { fontSize: 22, textAlign: "center", padding: 5 },

  fetching: {
    fontSize: 35,
    flex: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Constants.statusBarHeight,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: "center",
  },
});
