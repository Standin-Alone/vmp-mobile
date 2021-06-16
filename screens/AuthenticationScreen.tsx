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
      NetInfo.fetch().then(async (response)=>{
        if(response.isConnected){

      
      session_userID = await AsyncStorage.getItem("supplier_id");
      console.warn(session_userID);
      if (session_userID != null) {
        navigation.replace("Login");
      } else {
        navigation.replace("Login");
      }
    }else{
      Alert.alert("Error", "No Internet Connection.");

    }
    })
    };

    const timeout = window.setTimeout(() => checkUserID(), 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Block>
        <Image source={Images.DA_Logo} style={styles.logo} />
      </Block>
      <View style={styles.title_container}>
        <Text style={styles.title}>Department of Agriculture</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.base,
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 40,
    left: (MyWindow.Width / 100) * 25,
    top: (MyWindow.Height / 100) * -10,    
    alignItems: "center",
    marginVertical: (MyWindow.Height / 100) * 35,
    marginBottom: MyWindow.Height / 100,
  },
  title_container: {
    marginVertical: (MyWindow.Height / 100) ,
  },
  title: {    
    fontSize: 25,    
    fontFamily:'playfair-regular',
    alignSelf: "center"
    
  },
});
