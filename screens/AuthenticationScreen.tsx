import { StackScreenProps } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../types";
import Images from "../constants/Images";
import Colors from "../constants/Colors";
import MyWindow from "../constants/Layout";
import { Input, Block, Button, Text, Icon } from "galio-framework";
import axios from "axios";
import * as ip_config from "../ip_config";
import * as LocalAuthentication from "expo-local-authentication";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import NetInfo from "@react-native-community/netinfo";

export default function AuthenticationScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "Login">) {
  const [userID, setCheckUserID] = useState();

  useEffect(() => {
    let session_userID;
    const checkUserID = async () => {
      session_userID = await AsyncStorage.getItem("supplier_id");
      console.warn(session_userID);
      if (session_userID != null) {
        navigation.replace("Login");
      } else {
        navigation.replace("Login");
      }
    };
    checkUserID();
  }, []);

  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignSelf: "center",
    justifyContent: "center",
  },
});
