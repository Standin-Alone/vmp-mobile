import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  FlatList,
  Alert,    
  Modal
} from "react-native";
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

export default function HomeScreen() {
  const [form, setForm] = useState({});
  const [refreshing, setRefreshing]           = useState(false);
  const [scannedVouchers, setScannedVouchers] = useState([]);



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
    NetInfo.fetch().then((response: any) => {
      if (response.isConnected) {
        axios
          .get(
            ip_config.ip_address + "e_voucher/api/get-scanned-vouchers/"+supplier_id
          )
          .then((response) => {
            if (response.status == 200) {
              console.warn(response.data);
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



  useEffect(() => {
    const fetchData = async () => {
      const supplier_id = await AsyncStorage.getItem("supplier_id");
      console.warn(supplier_id);
      setRefreshing(true);

      NetInfo.fetch().then(async (response: any) => {
        if (response.isConnected) {
          const result = await axios.get(
            ip_config.ip_address + "e_voucher/api/get-scanned-vouchers/"+supplier_id,         
          );
          if (result.status == 200) {
            setScannedVouchers(result.data);
            console.warn(result.data);
            setRefreshing(false);
          }
        } else {
          Alert.alert("Message", "No Internet Connection.");
          setRefreshing(false);
        }
      });
    };

    fetchData();
  }, []);



  const filteredVouchers = scannedVouchers.filter(
    createFilter(search, KEYS_TO_FILTERS)
  );

  const leftComponent = () =>(  <Icon name="user" family="entypo" color={Colors.base} size={30} />)
  const rightComponent = () =>(  <Icon name="right" family="antDesign" color={Colors.base} size={30}  style={{right:10}} onPress={()=>{alert('helo')}}/>)
  const renderItem =  (item) =>  
  (
    <Card
      elevation = {10}
      style     = {styles.card}
      onPress   = {()=>showImage(item.base64)}
    >
      <Card.Cover source={{uri:'data:image/jpeg;base64,'+item.base64}}  
        
        resizeMode="contain"
      />
      <Card.Title
        title    = {item.reference_no}
        subtitle = {<Moment element={Text}  
        style    = {{color:Colors.muted}} fromNow>{item.transac_date}</Moment>}        
        left     = {leftComponent}
        // right={rightComponent}
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
            nestedScrollEnabled
            onRefresh={getScannedVouchers}
            refreshing={refreshing}                                  
            data={scannedVouchers ? filteredVouchers : null}
            ListEmptyComponent={() => emptyComponent()}
            renderItem={({ item, index }) =>renderItem(item,index)}               
            contentContainerStyle={{flexGrow:0,paddingBottom:90,paddingTop:100}}
            keyExtractor={(item)=>item}
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
