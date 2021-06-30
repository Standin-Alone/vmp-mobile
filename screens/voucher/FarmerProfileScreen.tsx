import { StackScreenProps } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, KeyboardAvoidingView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../types";
import Images from "../../constants/Images";
import Colors from "../../constants/Colors";
import MyWindow from "../../constants/Layout";
import { Block, Button, Text } from "galio-framework";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { ProgressDialog } from "react-native-simple-dialogs";
import * as ip_config from "../ip_config";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";

export default function FarmerProfileScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "FarmerProfileScreen">) {
  return (
    <View style={styles.container}>
      <View style={styles.farmer_header} > 
          <Image source={Images.farmer} style={styles.logo} />
          <Text style={styles.name}>John Edcel Zenarosa</Text>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }}

      ></KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundMuted,
  },logo: {
    width: 140,
    height: 140,
    borderRadius: 40,    
    borderColor:'#ddd',
    top:(MyWindow.Height / 100) * 17,    
  },
  farmer_header:{
    flex:1,
    width: (MyWindow.Width / 100) * 90,    
  },
  name:{
    top:20,
    fontSize:20,
    alignSelf:'flex-end'
  }
 
});
