import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  FlatList,
  Alert,    
  Modal
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View } from "../components/Themed";
import axios from "axios";
import { createFilter } from "react-native-search-filter";
import { Block, Input, Icon} from "galio-framework";
import { Card } from "react-native-paper";
import Colors from "../constants/Colors";
import MyWindow from "../constants/Layout";
import * as ip_config from "../ip_config";
import NetInfo from "@react-native-community/netinfo";
import Spinner from "react-native-loading-spinner-overlay";
import Moment from 'react-moment';
import ImageViewer from "react-native-image-zoom-viewer";
import AlertComponent from "../constants/AlertComponent";

export default function HomeScreen() {
  const [form, setForm]                       = useState({});
  const navigation                            = useNavigation();
  const [refreshing, setRefreshing]           = useState(false);
  const [scannedVouchers, setScannedVouchers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);



  const [search, setSearch]          = useState("");
  const hasMounted                   = useRef(false);
  const KEYS_TO_FILTERS              = ["reference_no", "fullname"];

  // show image variable
  const [isShowImage, setShowImage]  = useState(false);
  const [imageURI, setImageURI]      = useState("");


  const getScannedVouchers = async () => {
    const supplier_id = await AsyncStorage.getItem("supplier_id");

    setForm({ ...form, supplier_id: supplier_id });

    setRefreshing(true);

    
    setCurrentPage(1);
    NetInfo.fetch().then((response: any) => {
      if (response.isConnected) {
        axios
          .get(
            ip_config.ip_address + "evoucher/api/get-scanned-vouchers/"+supplier_id+"/"+1
          )
          .then((response) => {
            if (response.status == 200) {
              
              setScannedVouchers(response.data);

            }

            setRefreshing(false);
          })
          .catch((error) => {
            Alert.alert('Error!','Something went wrong.')
            console.warn(error.response);
            setRefreshing(false);
          });
      } else {
        Alert.alert("Message", "No Internet Connection.");
      }
    });

  };


   // show image
   const showImage = (uri: any) => {
    setShowImage(true);
    setImageURI(uri);
  };


  const fetchData = async () => {
    const supplier_id = await AsyncStorage.getItem("supplier_id");

    setRefreshing(true);    
    NetInfo.fetch().then(async (response: any) => {
      if (response.isConnected) {
       
      const  result = await axios.get(
          ip_config.ip_address + "evoucher/api/get-scanned-vouchers/"+supplier_id+"/"+currentPage,         
        ).catch((error)=>error.response);
        if (result.status == 200) {
          setScannedVouchers(result.data);
            
          setRefreshing(false);
        }else{
          // console.warn(result);
        }
        
      } else {
        Alert.alert("Message", "No Internet Connection.");
        setRefreshing(false);
      }

    
    });
  };

  
  // load more scanned vouchers
  const loadMore = async ()=>{
    
    let addPage = currentPage + 1;
    const supplier_id = await AsyncStorage.getItem("supplier_id");
    NetInfo.fetch().then((response: any) => {
      if (response.isConnected) {
        axios
          .get(
            ip_config.ip_address + "evoucher/api/get-scanned-vouchers/"+supplier_id+"/"+addPage
          )
          .then((response) => {
            if (response.status == 200) {              
              if(response.data.length){
                
                let new_data = response.data;                
                setScannedVouchers([...scannedVouchers,new_data[0]]);
                
              } 
            }

            setRefreshing(false);
          })
          .catch((error) => {
            Alert.alert('Error!','Something went wrong.')
            console.warn(error.response);
            setRefreshing(false);
          });
      } else {
        Alert.alert("Message", "No Internet Connection.");
      }
    });
  }

  useEffect(() => {


    

   fetchData()
  }, []);



  // got to summary 
  const goToSummary = (reference_no,fullname,current_balance) =>{  
    
    NetInfo.fetch().then(async (response: any) => {
      setRefreshing(true)
      if (response.isConnected) {
        
        axios.get(ip_config.ip_address + "evoucher/api/get-transaction-history/"+reference_no).then((response)=>{                    
          // push to summary screen 
          setRefreshing(false)
          navigation.push('SummaryScreen',{transactions:response.data,fullname:fullname,current_balance:current_balance});
        }).catch(err=>{
          setRefreshing(false)
          console.warn(err.response)
          AlertComponent.spiel_message_alert("Message","Something went wrong. Please try again later.","ok")
        })        
      } else {
        Alert.alert("Message", "No Internet Connection.");
        setRefreshing(false);
      }

    });
  }

  const filteredVouchers = scannedVouchers.filter(
    createFilter(search, KEYS_TO_FILTERS)
  );

  const leftComponent = () =>(  <Icon name="user" family="entypo" color={Colors.base} size={30} />)
  const rightComponent = (reference_no,fullname,current_balance) =>(  <Icon name="right" family="antDesign" color={Colors.base} size={30}  style={{right:10}} onPress={()=>goToSummary(reference_no,fullname,current_balance)}/>)
  const renderItem =  (item,index) =>  
  ( 
    <Card
      elevation = {10}
      style     = {styles.card}
      onPress   = {()=>showImage(item.base64)}
    >
      <Card.Cover source={{uri:'data:image/jpeg;base64,'+item.base64}}          
        
        style={{resizeMode:'cover'}}
        
      />
      <Card.Title        
        title    = {item.reference_no}
        subtitle = {<Moment element={Text}  
        style    = {{color:Colors.muted}}  fromNow>{item.transac_date}</Moment>}        
        left     = {leftComponent}
        right    = {()=>rightComponent(item.reference_no,item.fullname,item.amount_val)}
      />
      
      <Card.Content>
        <Text style = {styles.name}>{item.fullname}</Text>
      </Card.Content>
    </Card>
  )


  const emptyComponent = () =>(
    <Card
      elevation = {10}
      style     = {styles.card}      
    >
      <Card.Title title="No existing vouchers scanned." />
      <Card.Content></Card.Content>
    </Card>
  )


  return (
    <View style={styles.container}>
      <Spinner visible={refreshing} color={Colors.base} />

      <Modal
            visible={isShowImage}
            transparent={true}
            onRequestClose={() => setShowImage(false)}
            animationType="fade"
          >
            <ImageViewer
              imageUrls={[{ url: "data:image/jpeg;base64," + imageURI }]}
              index={0}
            />
      </Modal>
      
      <View style={{flex:1,backgroundColor:Colors.back,position:'absolute',top:0,left:0,right:0,bottom:0}}>
      
          <FlatList       
       
            onRefresh={getScannedVouchers}
            refreshing={refreshing}                                  
            data={scannedVouchers ? filteredVouchers : null}
            extraData = {scannedVouchers}
            ListEmptyComponent={() => emptyComponent()}
            renderItem={({ item, index }) =>{return renderItem(item,index)}}               
            contentContainerStyle={{flexGrow:0,paddingBottom:90,paddingTop:100}}
            keyExtractor={(item,index)=>index}
            
            initialNumToRender={1}

            onEndReachedThreshold={0.1} // so when you are at 5 pixel from the bottom react run onEndReached function
            onEndReached={async ({distanceFromEnd}) => {     
              

               if (distanceFromEnd > 0) 
                {

                  
                  await setCurrentPage((prevState)=>prevState+1);
                  loadMore();
                }
                
              
          
          }}
            
          />
      
      </View>
      <Block>
        <Input
          style={styles.searchInput}
          placeholderTextColor={Colors.muted}
          color={Colors.header}
          family="FontAwesome"
          icon="search"
          iconColor={Colors.base}
          iconSize={20}
          onChangeText={(value) => {
            setSearch(value);
          }}
          placeholder="Search here..."
          icon="search"
          family="FontAwesome"
          iconSize={14}
          iconColor={Colors.base}
        />
      </Block>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.back,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  searchInput: {
    padding: 10,
    borderColor: "#ddd",
    borderWidth: 2,
    margin: 20,
    width: MyWindow.Width - 50,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  card: {
    flex: 1,
    borderRadius: 5,    
    width: MyWindow.Width - 20,
    alignSelf: "center",
    marginBottom: 20,
  },
  button: {
    height: 50,
    width: MyWindow.Width - 65,
    position: "relative",
  },
  name: {
    color: "black",
  },
});
