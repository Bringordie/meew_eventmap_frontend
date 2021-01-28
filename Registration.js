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

export default function GetLoginData(props) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const { visible, onClose } = props;

  const submit = () => {
    const loginData = { userName, password };
    if (password !== repeatPassword) {
      Alert.alert("Password did not match. Please try again.");
    } else {
      registration(loginData);
    }
  };

  async function registration(loginData) {
    try {
      //Logging in and getting all events
      const response = await facade.registerUser(
        loginData.userName,
        loginData.password
      );

      if (response.code == 400) {
        Alert.alert("Username already exists");
      } else if (response.status == "User was added") {
        Alert.alert("Account has successfull been created. You can now login.");
      }
    } catch (err) {
      const msg = `${JSON.stringify(err)}`;
      Alert.alert("Something went wrong", msg);
    }
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.inputContainer}>
        <Text style={flattenStyle}>Registration</Text>
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
        <TextInput
          placeholder="Repeat Password"
          secureTextEntry={true}
          value={repeatPassword}
          style={styles.input}
          onChangeText={(txt) => setRepeatPassword(txt)}
        />
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button title="REGISTER" onPress={submit} />
          </View>
          <View style={styles.button}>
            <Button title="LOGIN" onPress={() => onClose()} />
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

const typography = StyleSheet.create({
  header: {
    color: "#61dafb",
    fontSize: 30,
    marginBottom: 36,
  },
});

const flattenStyle = StyleSheet.flatten([styles.text, typography.header]);
