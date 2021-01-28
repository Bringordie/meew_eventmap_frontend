import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import facade from "./serverFacade";

export default function GetLoginData(props) {
  const [userName, setUserName] = useState("Kurt");
  const [password, setPassword] = useState("Wonnegut");
  const { visible, onClose, setEvents, loggedUser } = props;

  const submit = () => {
    const loginData = { userName, password };
    loginAndGetEvents(loginData.userName, loginData.password);
  };

  async function loginAndGetEvents(username, password) {
    try {
      //Logging in and getting all events
      const events = await facade.getEvents(username, password);
      if (events == false) {
        Alert.alert("Wrong password, please try again");
      } else {
        setEvents(events);
        loggedUser(username);
        setUserName("");
        setPassword("");
        Alert.alert("Successfully logged in");
        onClose();
      }
    } catch (err) {
      const msg = `${JSON.stringify(err)}`;
      Alert.alert("Something went wrong", msg);
    }
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter Username"
          value={userName}
          onChangeText={(txt) => setUserName(txt)}
          style={styles.input}
        />
        <TextInput
          placeholder="Enter Password"
          secureTextEntry={true}
          value={password}
          style={styles.input}
          onChangeText={(txt) => setPassword(txt)}
        />
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button title="LOGIN" onPress={submit} />
          </View>
          <View style={styles.button}>
            <Button title="REGISTER" color="grey" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "80%",
    borderColor: "black",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
  },
  button: {
    width: "50%",
  },
});
