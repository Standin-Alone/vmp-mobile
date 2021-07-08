import { StackScreenProps } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, KeyboardAvoidingView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Footer, Body, Item } from "native-base";
import { RootStackParamList } from "../../types";
import Colors from "../../constants/Colors";
import MyWindow from "../../constants/Layout";
import { Card } from "react-native-paper";
import { Button, Text, Icon, Input } from "galio-framework";
import NumericInput from "react-native-numeric-input";
import NumberFormat from "react-number-format";

export default function FertilizerScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "FertilizerScreen">) {
  // Initialize variables
  const params = route.params;
    console.warn(params)
  const [spiel, setSpiel] = useState({
    message: "",
    status: "",
  });

  const submit = () => {
    console.warn(params);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={0}>
        <Body>


        </Body>
        {/* Submit Button */}
        <Footer style={{ backgroundColor: Colors.backgroundMuted }}>
          <Button
            uppercase
            color={Colors.base}
            style={styles.submit_button}
            onPress={submit}
          >
            Submit
          </Button>
        </Footer>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundMuted,
  },
  submit_button: {
    width: (MyWindow.Width / 100) * 95,

    left: 0,
    top: 0,
    bottom: 0,
  }
  
});
