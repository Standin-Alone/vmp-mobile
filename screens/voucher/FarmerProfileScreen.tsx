import { StackScreenProps } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image,FlatList,BackHandler,Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../types";
import Images from "../../constants/Images";
import Colors from "../../constants/Colors";
import MyWindow from "../../constants/Layout";
import { Card } from "react-native-paper";
import AlertComponent from '../../constants/AlertComponent';
import { Button, Text,Icon } from "galio-framework";
import Moment from 'react-moment';


export default function FarmerProfileScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "FarmerProfileScreen">) {
  
  // get passed values from qr code screen
  const params = route.params;

  const history = params.history;


  useEffect(()=>{
    navigation.addListener("transitionEnd", () => {
      if (navigation.isFocused()) {
        const backAction = () => {
          AlertComponent.discard_transaction_alert(navigation);
          return true      
        };
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          backAction
        );

        return () => {
          backHandler.remove() 
          BackHandler.removeEventListener("hardwareBackPress", backAction); 
        
        };
      }
    });
  })
  const claimVoucher = () => { 
    let get_program = params.data[0].shortname;   
    
    if(get_program == 'CFSMFF'){      
      navigation.navigate('AddToCartScreen',params);    
    }else if(get_program == 'RRP2' ){
      navigation.navigate('FertilizerScreen',params);    
    }
    
  }

  // render history component
  const renderHistory = (item,index)=>(
    <Card elevation={10} style={styles.card}>
        <Card.Title title={item.transac_by_fullname}  subtitle={<Moment element={Text} fromNow>{item.transac_date}</Moment>} 
          left={()=>
            <Icon
            name="history"
            family="FontAwesome"
            color={Colors.base}
            size={30}
          />  
          }/>
        <Card.Content>
              <Text style={{left:55}}>Total Amount of  &#8369;{item.total_amount}</Text>
        </Card.Content>
    </Card>

  )

  const emptyComponent = ()=>(             
     <Card elevation={10} style={styles.card}>
            <Card.Title title="No history of Claiming" />            
      </Card> 
    )

  // card left component
  const leftComponent  = ()=>
                     <Text  style={styles.left_component}>
                      &#8369;
                    </Text>

  return (
    <View style={styles.container}>
      
      <View style={styles.farmer_header} > 
          <Image source={Images.farmer} style={styles.logo} />
          <View style={styles.name_view}>
          <Text style={styles.name}>{params.data[0].first_name} {params.data[0].last_name}</Text>
          </View>
          <Card
            elevation={10}
            style={styles.balance_card}  
            mode="outlined"             
            >
                <Card.Title title={params.data[0].Available_Balance}  subtitle="Current Balance" 
                  left={leftComponent}/>                
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
                <Text style={styles.detail_info_value}>{params.data[0].reference_no}</Text>    
            </View>
        </View>
        
        <View style={{flexDirection:"row",marginBottom:50}}>
            <View style={{flex:1}}>
                <Text style={styles.detail_info_title} >Region </Text>     
            </View>
            <View style={{flex:1}}>
                <Text style={styles.detail_info_value}>{params.data[0].Region}</Text>    
            </View>
        </View>

        <View style={{flexDirection:"row",marginBottom:40}}>
            <View style={{flex:1}}>
                <Text style={styles.detail_info_title} >Province </Text>     
            </View>
            <View style={{flex:1}}>
                <Text style={styles.detail_info_value}>{params.data[0].Province}</Text>    
            </View>
        </View>

        <View style={{flexDirection:"row",marginBottom:40}}>
            <View style={{flex:1}}>
                <Text style={styles.detail_info_title} >Municipality </Text>     
            </View>
            <View style={{flex:1}}>
                <Text style={styles.detail_info_value}>{params.data[0].Municipality}</Text>    
            </View>
        </View>

        <View style={{flexDirection:"row",marginBottom:40}}>
            <View style={{flex:1}}>
                <Text style={styles.detail_info_title} >Barangay </Text>     
            </View>
            <View style={{flex:1}}>
                <Text style={styles.detail_info_value}>{params.data[0].Barangay}</Text>    
            </View>
        </View>

        </View>
      </View> 



      <View style={styles.history_view}>
        <Text style={styles.history_text}>Recent Claiming</Text>        
        
        <View style={styles.history_content}>

          <FlatList
            horizontal
            data={history}
            ListEmptyComponent={()=>emptyComponent()}
            renderItem={({item,index})=>renderHistory(item,index)}
            nestedScrollEnabled
            style={styles.flat_list}
          />      
        </View>
      </View> 

      <Button    
          uppercase
          color={Colors.base}
          style={styles.next_button}
          onPress = {claimVoucher}
          >
          Next
      </Button>
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundMuted,
  },
  logo: {
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
    fontSize:23,
    fontFamily:'calibri-light',    
    alignSelf:'flex-end',
    fontWeight:'bold'
  },
  name_view:{
    top:70,
    right:20
  },
  left_component :{color:Colors.base,
    fontFamily:'calibri-light',
    fontSize:50,fontWeight:'bold'
  },
  balance_card:{
    marginTop:90
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
    top:(MyWindow.Height / 100) * -23,
    
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
  history_view:{
    fontFamily:'calibri-light',
    left:20,
    display:'flex',    
    top:(MyWindow.Height / 100) * 3,

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
  card: {
    marginTop: 10,
    marginHorizontal: 1,
    marginBottom: 40,
    borderRadius: 15,
    
    width: (MyWindow.Width / 100) * 90,
  },
  flat_list:{
    width:(MyWindow.Width /100) * 92
  }


  
});
