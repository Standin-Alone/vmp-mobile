import { StackScreenProps } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, KeyboardAvoidingView,FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../types";
import Images from "../../constants/Images";
import Colors from "../../constants/Colors";
import MyWindow from "../../constants/Layout";
import { Card } from "react-native-paper";
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
      <View style={styles.details_view}>
        <Text style={styles.details_text}>Details</Text>        
        
        <View style={styles.details_content}>

           
            <Text style={styles.detail_info_title}>Reference No</Text>        
            <Text style={styles.detail_info_value}>DASDAS</Text>    
      
            <Text style={styles.detail_info_title}>Permanent Address</Text>        
            <Text style={styles.detail_info_value}>DASDAS</Text> 

            <Text style={styles.detail_info_title}>Province Name</Text>        
            <Text style={styles.detail_info_value}>DASDAS</Text> 

            <Text style={styles.detail_info_title}>Municipality  </Text>        
            <Text style={styles.detail_info_value}>DASDAS</Text> 
            
        </View>
      </View> 



      <View style={styles.history_view}>
        <Text style={styles.history_text}>Claim History</Text>        
        
        <View style={styles.history_content}>
        <Card
            elevation={10}
            style={styles.card}                
            >
                <Card.Title title="No existing vouchers scanned." />
                <Card.Content></Card.Content>
              </Card>
            
        </View>
      </View> 

    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundMuted,
  },logo: {
    width: 70,
    height: 70,
    borderRadius: 40,    
    borderColor:'#ddd',
    top:(MyWindow.Height / 100) * 15,    
  },
  farmer_header:{
    flex:1,
    left:20,
    width: (MyWindow.Width / 100) * 90,    
  },
 
  name:{
    top:70,
    fontSize:30,
    fontFamily:'calibri-light',
    right:(MyWindow.Width / 100) * 0,
    alignSelf:'flex-end',
    fontWeight:'bold'
  },
  
  details_content:{  
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',

  },
  details_view:{
    fontFamily:'calibri-light',
    left:20,
    display:'flex',    
    top:(MyWindow.Height / 100) * -60,
  },
  details_text:{
    fontSize:25,
    marginVertical:20
  },
  details_info:{
    top:20,
    alignContent:'space-between',
    color:'#9E9FA0',
    flexDirection:'row',    
  },
  detail_info_title:{
   
    color:'#9E9FA0',
    marginRight:50,  
    fontFamily:'calibri-light',
    fontSize:20,

  },
  detail_info_value:{
    marginBottom:10,
    color:'#000000',
    fontFamily:'calibri-light',
    fontSize:20,    
    alignSelf:'flex-end',
  }, 

  history_content:{  
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',

  },
  history_view:{
    fontFamily:'calibri-light',
    left:20,
    display:'flex',    
    top:(MyWindow.Height / 100) * -40,
  },
  history_text:{
    fontSize:25,
    marginVertical:20
  },
  history_info:{
    top:20,
    alignContent:'space-between',
    color:'#9E9FA0',
    flexDirection:'row',    
  },
  history_info_title:{
   
    color:'#9E9FA0',
    marginRight:50,  
    fontFamily:'calibri-light',
    fontSize:20,

  },
  history_info_value:{
    marginBottom:10,
    color:'#000000',
    fontFamily:'calibri-light',
    fontSize:20,    
    alignSelf:'flex-end',
  }



  
});
