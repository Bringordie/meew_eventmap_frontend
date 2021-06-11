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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";

export default function CreateEvent(props) {
  const { visible, onClose, address, username } = props;

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
    createEventPost(username, createEvent, dateChoosen, timeChoosen);
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
        setDateChoosen();
        setTimeChoosen();
      }
    } catch (err) {
      const msg = `${JSON.stringify(err)}`;
      Alert.alert("Something went wrong", msg);
    }
  }

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const [dateChoosen, setDateChoosen] = useState();
  const [timeChoosen, setTimeChoosen] = useState();

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirmTime = (time) => {
    setTimeChoosen(format(time, "HH:mm"));
    hideTimePicker();
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date) => {
    setDateChoosen(format(date, "dd-MM-yyyy"));
    hideDatePicker();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView>
        <View style={styles.inputContainer}>
          <Text style={styles.titleText}>
            {"Address"}
            {"\n"}
          </Text>
          <TextInput
            placeholder="Enter Street Name"
            value={createEvent.streetName}
            onChangeText={(event) => changeHandler(event, "streetName")}
            style={styles.input}
            required
          />
          <TextInput
            placeholder="Enter Street Number"
            value={createEvent.streetNumber}
            onChangeText={(event) => changeHandler(event, "streetNumber")}
            style={styles.input}
            required
          />
          <TextInput
            placeholder="Enter City Code"
            keyboardType="number-pad"
            maxLength={4}
            value={createEvent.cityCode}
            style={styles.input}
            onChangeText={(event) => changeHandler(event, "cityCode")}
            required
          />
          <Text style={styles.titleText}>
            {"\n"}
            {"Event Info"}
            {"\n"}
          </Text>
          <TextInput
            placeholder="Event Name"
            value={createEvent.eventName}
            style={styles.input}
            onChangeText={(event) => changeHandler(event, "eventName")}
            required
          />
          <TextInput
            placeholder="Ticket Amount"
            keyboardType="number-pad"
            value={createEvent.ticketAmount}
            style={styles.input}
            onChangeText={(event) => changeHandler(event, "ticketAmount")}
            required
          />
          <TextInput
            placeholder="Ticket Price"
            keyboardType="number-pad"
            value={createEvent.ticketPrice}
            style={styles.input}
            onChangeText={(event) => changeHandler(event, "ticketPrice")}
            required
          />
          <Button title="Date of event" onPress={showDatePicker} />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={hideDatePicker}
          />
          {dateChoosen != undefined && (
            <TextInput
              value={dateChoosen}
              style={styles.inputLocked}
              required
              editable={false}
            />
          )}
          <Button title="Time of event" onPress={showTimePicker} />
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleConfirmTime}
            onCancel={hideTimePicker}
            locale="en_GB"
            date={new Date()}
          />
          {timeChoosen != undefined && (
            <TextInput
              value={timeChoosen}
              style={styles.inputLocked}
              required
              editable={false}
            />
          )}
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button title="Create" color="green" onPress={submit} />
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
    width: "40%",
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
