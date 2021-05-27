import React,{useEffect, useState,useRef} from 'react';
import { StyleSheet, FlatList, Alert, AsyncStorage,BackHandler,RefreshControl} from 'react-native';


import { Text, View } from '../components/Themed';
import * as ipconfig from '../ip_config';
import axios from 'axios';
import SearchInput, {createFilter} from 'react-native-search-filter';
import {Block,Input} from 'galio-framework';
import { ScrollView } from 'react-native-gesture-handler';
import { Card } from 'react-native-paper';
import Images from '../constants/Images';
import Colors from '../constants/Colors';
import MyWindow from '../constants/Layout';
import * as ip_config from '../ip_config';





var test_api =  ( )=>{
  
  axios.get(ipconfig.ip_address+'vmp-mobile/public/api/show').then((response)=>{
    
    console.warn(response.data['message'])
    
  }).catch((error)=>{
    console.warn(error);
  });
  
  
}


export default function HomeScreen() {  
  const [form,setForm]  = useState({});
  const [refreshing,setRefreshing]  = useState(false);
  const [scannedVouchers , setScannedVouchers] = useState([]);
  const hasMounted = useRef(false);

  const getScannedVouchers = async ()=> {
    const supplier_id =  await AsyncStorage.getItem('supplier_id');

    
    
    setForm({...form,supplier_id : 1});

    setRefreshing(true);
    
      axios.post(ip_config.ip_address+'vmp-web/public/api/get-scanned-vouchers',form)
        .then((response)=>{                                        
             if(response.status == 200){
               console.warn(response.data);
               setScannedVouchers(response.data);
             }
            
              setRefreshing(false);              
        }).catch((error)=>{
                console.warn(error.response)
                setRefreshing(false);
        })
    
    
  }



  useEffect(  ()=>{
    
    const fetchData = async()=>{   
      const supplier_id =  await AsyncStorage.getItem('supplier_id');
      setRefreshing(true);

      const result = await axios.post(ip_config.ip_address+'vmp-web/public/api/get-scanned-vouchers',{supplier_id: supplier_id})
      if(result.status == 200){

        setScannedVouchers(result.data);  
        setRefreshing(false);
        
        console.warn(scannedVouchers.length)
      }
      
    };  
    
    
    fetchData();
                
      
    },[])


  const searchVoucher = (value) =>{



  }
  return (
    <View style={styles.container}>
      <Block>
        <Input
          style={styles.searchInput}          
          placeholderTextColor={Colors.muted}                 
          color={Colors.header}          
          family="FontAwesome"          
          icon="search"                 
          iconColor={Colors.base}
          iconSize={20}                                          
          onChangeText = {(value)=>searchVoucher(value)}                    
          placeholder = "Search here..."                  
          icon="search"
          family="FontAwesome"
          iconSize={14}
          iconColor={Colors.base} 
          />
      </Block>


      <Block>            
      <ScrollView
        refreshControl={
          <RefreshControl

              refreshing={refreshing}
              onRefresh={getScannedVouchers}
              tintColor="#FFF0000"
              title="Loading.."
              color="#AF0606"
              progressBackgroundColor="#FFFF"

              />
          }
      >
        <FlatList      
          data={scannedVouchers}   
          ListEmptyComponent={()=>(
            <Card elevation={10} style={styles.card} onPress={()=>alert('sample')}>
            <Card.Title title="No existing vouchers scanned."/>              
            <Card.Content>
                              
            </Card.Content>
          </Card> 
        

          )}

          renderItem ={({item,index})=>(
            
     
            <Card elevation={10} style={styles.card} onPress={()=>alert('sample')}>
              <Card.Title title={item.REFERENCE_NO}   subtitle={item.CLAIMED_DATE} />              
              <Card.Content>
                    <Text>ASmople</Text>
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
    backgroundColor:Colors.back
    
    
  },
  title: {  
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchInput:{
    padding:10,
    borderColor:"#ddd",
    borderWidth:2,
    margin:20,
    width:MyWindow.Width - 50

  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  card:{flex:1,
    borderRadius:20, 
    backgroundColor:Colors.background,
    width:MyWindow.Width - 20, 
    alignSelf:'center',
    marginBottom:20,
    
  },
  button:{
    height: 50,
    width:MyWindow.Width - 65,
    position:'relative'
  },
});
