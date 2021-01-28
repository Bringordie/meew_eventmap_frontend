import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, View, ScrollView, Dimensions, Button, Modal } from "react-native";
import facade from "./serverFacade";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";


const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);


export default function ShowEvents(props) {
  const { onClose, events, visible } = props;

  return (
    <Modal visible={visible} animationType="slide">
    <View>
        <Text style={{ fontSize: 24, alignSelf: "center"}}>Events</Text>
        <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
      <FlatList
        data={events}
        // numColumns={2}
        renderItem={({ item }) => <Text style={styles.item}>{item.eventName}</Text>}
      />
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
    backgroundColor: "pink",
    marginHorizontal: 0,
    height: 480
  },
  button: {
    width: "40%",
    paddingTop: 10,
    alignSelf: "center",
  },
});