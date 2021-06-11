import React from "react";
import { StyleSheet, Text, View, ScrollView, Button, Modal, TouchableOpacity, Alert } from "react-native";

  export default function ShowEvents(props) {
    const { onClose, events, visible, goToEvent } = props;  
    
    alertItemName = (item) => {
      Alert.alert(
        "Event Info",
        "Event: " + item.eventName + "\nTickets Available: " + item.ticketAmount + "\nTicket Price: " + item.ticketPrice + "\nEvent Time: " + item.eventSchedule.substr(8,2) + 
        "-" + item.eventSchedule.substr(5, 2) + "-" + item.eventSchedule.substr(0, 4),
        [
          {text: 'Go to Event', onPress: () => goToEvent(item.coordinate.coordinates[0], item.coordinate.coordinates[1])}, 
          {text: 'OK', onPress: () => console.log('OK Pressed'),
        },
        ],
      );
    }

  return (
    <Modal visible={visible} animationType="slide">
      <View>
        <Text style={flattenStyle}>Events</Text>
        <ScrollView style={styles.scrollView}>
          <View>
            {
               events.map((event) => (
                  <TouchableOpacity
                     key = {event._id}
                     style = {styles.container}
                     onPress = {() => this.alertItemName(event)}>
                     <Text style = {styles.text}>
                        {event.eventName}
                     </Text>
                  </TouchableOpacity>
               ))
            }
          </View> 
          
        </ScrollView>
        <View style={styles.button}>
          <Button title="Close" color="red" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  scrollView: {
    marginHorizontal: 0,
    height: 480
  },
  button: {
    width: "40%",
    paddingTop: 10,
    alignSelf: "center",
  },
  container: {
    padding: 10,
    marginTop: 3,
    backgroundColor: '#4169e1',
    alignItems: 'center',
 },
 text: {
    color: '#000000'
 },
});

const typography = StyleSheet.create({
  header: {
    alignSelf: "center",
    color: "#4169e1",
    fontSize: 30,
  },
});

const flattenStyle = StyleSheet.flatten([styles.text, typography.header]);