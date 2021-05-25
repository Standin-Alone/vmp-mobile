import React,{useState} from 'react';
import { StyleSheet,FlatList} from 'react-native';


import { Text, View } from '../components/Themed';
import * as ipconfig from '../ip_config';
import axios from 'axios';
import SearchInput, {createFilter} from 'react-native-search-filter';
import {Block,Button,Input} from 'galio-framework';
import { ScrollView } from 'react-native-gesture-handler';
import { Card } from 'react-native-paper';
import Images from '../constants/Images';
import Colors from '../constants/Colors';
import MyWindow from '../constants/Layout';


var test_api =  ( )=>{
  
  axios.get(ipconfig.ip_address+'vmp-mobile/public/api/show').then((response)=>{
    
    console.warn(response.data['message'])
    
  }).catch((error)=>{
    console.warn(error);
  });
  
  
}


export default function HomeScreen() {


  const [scannedVouchers , setScannedVouchers] = useState([
      {
        reference_no:''
      }]);

  const searchVoucher = (value) =>{



  }
  return (
    <View style={styles.container}>
      <Block>
        <Input
          
          onChangeText = {(value)=>searchVoucher(value)}                    
          placeholder = "Search here..."
          style= {styles.searchInput}
          placeholderTextColor={Colors.muted}
          icon="search"
          family="FontAwesome"
          iconSize={14}
          iconColor={Colors.base} 
          />
      </Block>


      <Block>


            
      <ScrollView>
        <FlatList      
          data={scannedVouchers}   
          renderItem ={({item,index})=>(
            <Card elevation={10} style={styles.card} onPress={()=>alert('sample')}>
              <Card.Title title={item.reference_no} />              
              <Card.Content>
                                  
              </Card.Content>
            </Card> 
          )}        
        />
        </ScrollView>
      </Block>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor:"#ddd"
    
  },
  title: {  
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchInput:{
    padding:2,  
    width:MyWindow.Width - 20,  
    margin:10

  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  card:{flex:1,
    borderRadius:5, 
    width:MyWindow.Width - 20, 
    alignSelf:'center',
    marginBottom:20
  },
  button:{
    height: 50,
    width:MyWindow.Width - 65,
    position:'relative'
  },
});
