import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Modal,
  Alert,
  Text,
  ScrollView,
} from "react-native";
import facade from "./serverFacade";

export default function CreateEvent(props) {
  const { visible, onClose, address, marker } = props;

  useEffect(() => {
    //TODO should check for the users position if an address on the map isn't selected
    if (props.address) {
      let onClickEventData = {
        streetName: address.road,
        streetNumber: address.house_number,
        cityCode: address.postcode,
        eventName: "",
        ticketAmount: "",
        ticketPrice: "",
      };
      setCreateEvent({ ...onClickEventData });
    }
  }, [props.address]);
  const [createEvent, setCreateEvent] = useState("");

  function changeHandler(value, id) {
    setCreateEvent({ ...createEvent, [id]: value });
  }

  const submit = () => {
    if (createEvent.ticketAmount < marker.ticketAmount) {
      Alert.alert(createEvent.ticketAmount, " Tickets Bought");
      marker.ticketAmount - createEvent.ticketAmount;
    }
  };

  async function createEventPost(username, eventInfo, date, time) {
    try {
      const eventResponse = await facade.createEvent(
        username,
        eventInfo,
        date,
        time
      );
      if (eventResponse == "Event was created") {
        Alert.alert(`Event has been created.`);
        let blankEvent = {
          streetName: "",
          streetNumber: "",
          cityCode: "",
          eventName: "",
          ticketAmount: "",
          ticketPrice: "",
        };
        setCreateEvent({ ...blankEvent });
      }
    } catch (err) {
      const msg = `${JSON.stringify(err)}`;
      Alert.alert("Something went wrong", msg);
    }
  }

  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView>
        <View style={styles.inputContainer}>
          <Text style={styles.titleText}>
            {"Address"}
            {"\n"}
          </Text>

          <Text style={styles.titleText}>
            {"\n"}
            {"Ticket Amount"}
            {"\n"}
          </Text>

          <TextInput
            placeholder="Ticket Amount"
            keyboardType="number-pad"
            value={createEvent.ticketAmount}
            style={styles.input}
            onChangeText={(event) => changeHandler(event, "ticketAmount")}
            required
          />

          <Text style={styles.titleText}>
            {"\n"}
            {"Total Price"}
            {"\n"}
          </Text>
          <Text>{createEvent.ticketAmount * marker.ticketPrice}.- </Text>
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button title="Buy Tickets" color="green" onPress={submit} />
            </View>
            <View style={styles.button}>
              <Button title="Close" color="red" onPress={onClose} />
            </View>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //Added to fix scrollview so the content isn't off screan
    marginTop: 120,
  },
  input: {
    width: "80%",
    borderColor: "black",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  inputLocked: {
    width: "80%",
    borderColor: "black",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#C0C0C0",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
  },
  button: {
    width: "50%",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollView: {
    backgroundColor: "pink",
    marginHorizontal: 20,
  },
});
