import { StackScreenProps } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, KeyboardAvoidingView,FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../types";
import Images from "../../constants/Images";
import Colors from "../../constants/Colors";
import MyWindow from "../../constants/Layout";
import { Card } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { Block, Button, Text,Icon } from "galio-framework";
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

  const params = route.params;

  const claimVoucher = () => { 
    navigation.navigate('AddToCartScreen',params);    
  }

  return (
    <View style={styles.container}>
      
      <View style={styles.farmer_header} > 
          <Image source={Images.farmer} style={styles.logo} />
          <Text style={styles.name}>John Edcel Zenarosa</Text>
          <Card
            elevation={10}
            style={styles.balance_card}  
            mode="outlined"             
            >
                <Card.Title title={params[0].Available_Balance}  subtitle="Current Balance" 
                  left={()=>
                    <Text style={{color:Colors.base,fontFamily:'calibri-light',fontSize:50,fontWeight:'bold'}}>
                          &#8369;
                    </Text>
                  }/>                
        </Card>
      </View>
      <View style={styles.details_view}>
        <Text style={styles.details_text}>Details</Text>        
    
        <View style={styles.details_content}>

        <View style={{flexDirection:"row",marginBottom:40}}>
            <View style={{flex:1}}>
                <Text style={styles.detail_info_title} >Reference No</Text>     
            </View>
            <View style={{flex:1}}>
                <Text style={styles.detail_info_value}>{params[0].reference_no}</Text>    
            </View>
        </View>
        
        <View style={{flexDirection:"row",marginBottom:50}}>
            <View style={{flex:1}}>
                <Text style={styles.detail_info_title} >Region </Text>     
            </View>
            <View style={{flex:1}}>
                <Text style={styles.detail_info_value}>{params[0].Region}</Text>    
            </View>
        </View>

        <View style={{flexDirection:"row",marginBottom:40}}>
            <View style={{flex:1}}>
                <Text style={styles.detail_info_title} >Province </Text>     
            </View>
            <View style={{flex:1}}>
                <Text style={styles.detail_info_value}>{params[0].Province}</Text>    
            </View>
        </View>

        <View style={{flexDirection:"row",marginBottom:40}}>
            <View style={{flex:1}}>
                <Text style={styles.detail_info_title} >Municipality </Text>     
            </View>
            <View style={{flex:1}}>
                <Text style={styles.detail_info_value}>{params[0].Municipality}</Text>    
            </View>
        </View>

        <View style={{flexDirection:"row",marginBottom:40}}>
            <View style={{flex:1}}>
                <Text style={styles.detail_info_title} >Barangay </Text>     
            </View>
            <View style={{flex:1}}>
                <Text style={styles.detail_info_value}>{params[0].Barangay}</Text>    
            </View>
        </View>

        </View>
      </View> 



      <View style={styles.history_view}>
        <Text style={styles.history_text}>Recent Claiming</Text>        
        
        <View style={styles.history_content}>
        <ScrollView style={{backgroundColor:'red',height:100}}> 
          <Card
              elevation={10}
              style={styles.card}  
              mode="outlined"             
              >
                  <Card.Title title="Total Amount "  subtitle="June 26, 2021" 
                    left={()=>
                      <Icon
                      name="history"
                      family="FontAwesome"
                      color={Colors.base}
                      size={30}
                    />  
                    }/>
                  <Card.Content>
                        <Text >
                          
                        </Text>
                  </Card.Content>
          </Card>
          {/* <Card
              elevation={10}
              style={styles.card}                
              >
                  <Card.Title title="No history of Claiming" />
                  <Card.Content></Card.Content>
          </Card> */}
        </ScrollView> 
        </View>
      </View> 


      <Button
    
          uppercase
          color={Colors.base}
          style={styles.next_button}
          onPress = {claimVoucher}
            >
             Claim Voucher
    </Button>
    
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
    top:(MyWindow.Height / 100) * -43,
    
  },
  details_text:{
    fontSize:25,
    marginBottom:20
    
  },
  details_info:{
    top:20,
    alignContent:'space-between',
    color:'#9E9FA0',
    flexDirection:'row',    
  },
  detail_info_title:{
   
    color:'#9E9FA0',
    justifyContent:'flex-start', 
    fontFamily:'calibri-light',
    fontSize:20,

  },
  detail_info_value:{
    color:'#000000',
    fontFamily:'calibri-light',
    fontSize:20,    
    justifyContent:'flex-start', 
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
    top:(MyWindow.Height / 100) * -20,
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
  },
  next_button :{
    width:(MyWindow.Width) / 100 * 95,
  },
  balance_card:{
    marginTop:90
  }



  
});
