import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Modal,
  Alert,
  Text,
} from "react-native";
import facade from "./serverFacade";
import Registration from "./Registration";

export default function GetLoginData(props) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
  const { visible, onClose, setEvents, loggedUser } = props;

  const closeRegistrationDialog = () => {
    setShowRegistrationDialog(false);
  };

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
        <Text style={flattenStyle}>Login</Text>
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
            <Button
              title="REGISTER"
              onPress={() => setShowRegistrationDialog(true)}
            />
          </View>
          <Registration
            visible={showRegistrationDialog}
            onClose={closeRegistrationDialog}
          />
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

const typography = StyleSheet.create({
  header: {
    color: "#61dafb",
    fontSize: 30,
    marginBottom: 36,
  },
});

const flattenStyle = StyleSheet.flatten([styles.text, typography.header]);
