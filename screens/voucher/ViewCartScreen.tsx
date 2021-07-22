import { StackScreenProps } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { Footer } from "native-base";
import {
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  FlatList,
  TouchableHighlight,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../types";
import Images from "../../constants/Images";
import Colors from "../../constants/Colors";
import MyWindow from "../../constants/Layout";
import { Card } from "react-native-paper";
import NumericInput from "react-native-numeric-input";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Block, Button, Text, Icon, Input, theme } from "galio-framework";
import FarmerProfileScreen from "./AddToCartScreen";
import AlertComponent from '../../constants/AlertComponent';
export default function ViewCartScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "ViewCartScreen">) {
  const params = route.params;
  const [data, setData] = useState([]);
  const [new_cart, setNewCart] = useState([]);
  const [total, setTotal] = useState(0.0);
  
  const [spiel, setSpiel] = useState({
    message: "",
    status: "success",
    item_name:""
  });
  let sum = 0;
  useEffect(() => {    
    setData(params.cart);
    
    setTotal(
      params.cart
        .reduce((prev, current) => prev + current.total_amount, 0)
        .toFixed(2)
    );
  });

  // RIGHT CONTENT OF CARD
  const rightContent = (delete_index) => (
    <View style={{ top: 20 }}>
      <Icon
        name="trash"
        family="entypo"
        color={Colors.danger}
        size={40}
        onPress={() => {
          let new_data = data;
          new_data.splice(delete_index, delete_index + 1);
          setNewCart(new_data);
          if(data.length  == 0){
            navigation.goBack();
          }          
        }}
      />
  
    </View>
  );

  // quantity function
  const handleQuantity = (item,index,value)=> {
    
    var total_amount = parseFloat(item.price) * value;

    let compute_total = data.map((prev) => {
      sum += prev.total_amount;
      return sum;
    });
          
    // set condition when total amount of item exceed in ceiling amount
    if(total_amount <= item.ceiling_amount ){  
      setData((prevState) => {
        if (prevState[index].name == item.name) {
          prevState[index].total_amount = total_amount;
          prevState[index].quantity = value;
          prevState[index].status = "success";
        }
      });
    

    setTotal(compute_total);  
  }else{

    setData((prevState) => {
      if (prevState[index].name == item.name) {
        prevState[index].total_amount = total_amount;
        prevState[index].quantity = value;
        prevState[index].status = "error";
        prevState[index].message = "Your total amount of "+item.name+" exceed in limit amount of ₱"+item.ceiling_amount; 
      }
    });
  }    
  }

  // QUANTITY INPUT TEXTBOX
  const numericInput = (item, index) => (
    <NumericInput
      editable={FarmerProfileScreen}
      value={item.quantity}
      onChange={(value) =>handleQuantity(item,index,value)}
      minValue={1}
      maxValue={99999}
      totalWidth={150}
      totalHeight={40}
      iconSize={25}
      initValue={item.quantity}
      step={1}
      valueType="integer"
      rounded
      iconStyle={{ color: "white" }}
      rightButtonBackgroundColor={Colors.add}
      leftButtonBackgroundColor={Colors.add}
    />
  );

  // RENDER ITEM INSIDE FLATLIST
  const renderItem = (item, index) => (
    <Swipeable renderRightActions={() => rightContent(index)}>
      <Card elevation={20} style={styles.card}>
        <Card.Title
          title={item.name + " (" + item.unit_measure + ")"}
          left={() => (
            <Image
              source={{ uri: "data:Image/jpeg;base64," + item.image }}
              style={styles.commodity_image}
            />
          )}
          subtitle={"₱" + parseFloat(item.total_amount)}
          subtitleStyle={{
            fontFamily: "calibri-light",
            color: Colors.base,
            fontSize: 15,
          }}
          titleStyle={{ fontFamily: "calibri-light", fontWeight: "bold" }}
          right={() => numericInput(item, index)}
        />
        <Card.Content style={{marginTop:20}}>  
          {item.status == "error" ? (
            <Text style={styles.spiel}> {item.message} </Text>
            ) : null}
        </Card.Content>
      </Card>
    </Swipeable>
  );


  const checkOut = ()=>{
    
    let dataToSend = {
      voucher_info: params.voucher_info[0],
      cart:data,
      total_amount:total,
      supplier_id: params.supplier_id,
      full_name: params.full_name,
      user_id: params.user_id
    }



    let count_error= 0 ;

    data.map(prevState => prevState.status  == 'error' ? count_error++ : 0);
    console.warn(total);
    if (count_error == 0 ){
      if(Number(total) <= Number(params.available_balance)){
        navigation.navigate('AttachmentScreen',dataToSend);
      } else{
        AlertComponent.spiel_message_alert("Message",`Your total amount of ₱${total} exceed in you current balance of ₱${params.available_balance}`,"I understand")
      }
    }else{
      AlertComponent.spiel_message_alert("Message","Commodities price exceed to your limit price.","I understand")
    }   

    
  }


  return (
    <View style={styles.container}>
      <FlatList
        nestedScrollEnabled
        data={data}
        extraData={data}
        style={styles.flat_list}
        renderItem={({ item, index }) => renderItem(item, index)}
        keyExtractor={(item) => item.name}
      />


    {/* Cart Summary Details */}
      <Card style={styles.cart_details}>
        <Card.Title title="Details" titleStyle={styles.details_title} />
        <Card.Content>
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.detail_info_title}>Current Balance:</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detail_info_value}>₱{params.available_balance}</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.detail_info_title}>Total:</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detail_info_value}>₱{total}</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.detail_info_title}>
                - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                -
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.detail_info_title}>Remaining Balance:</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.remaining_balance}>₱ {(params.available_balance - total).toFixed(2)}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Footer style={{ backgroundColor: "white" }}>
        <Button uppercase color={Colors.base} style={styles.cart_button} onPress={checkOut}>
          Checkout
        </Button>
      </Footer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundMuted,
  },
  flat_list: {
    marginTop: (MyWindow.Height / 100) * 10,
    marginBottom: (MyWindow.Height / 100) * -2,
    width: (MyWindow.Width / 100) * 92,
    alignSelf: "center",
  },
  cart_details: {
    height: (MyWindow.Height / 100) * 30,
    marginHorizontal: (MyWindow.Width / 100) * 2,
    borderRadius: 20,
    marginBottom: 20,
  },
  commodity_image: {
    top: 5,
    height: 60,
    width: 60,
    overflow: "hidden",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  cart_button: {
    width: (MyWindow.Width / 100) * 95,
  },
  detail_info_title: {
    color: "#9E9FA0",
    justifyContent: "flex-start",
    fontFamily: "calibri-light",
    fontSize: 20,
  },
  detail_info_value: {   
    fontFamily: "calibri-light",
    fontSize: 20,
    justifyContent: "flex-start",
  },
  details_title: {
    fontFamily: "calibri-light",
    fontSize: 25,
    fontWeight: "bold",
  },
  remaining_balance: {
    color: Colors.base,
    fontFamily: "calibri-light",
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: "flex-start",
  },
  card: {
    marginTop: 10,
    marginHorizontal: 2,
    marginBottom: 20,
    borderRadius: 10,
  },spiel: {    
    bottom: 10,
    fontFamily: "calibri-light",
    color: Colors.white,
    backgroundColor:'#ff5b57cc',
    borderRadius:5,     
    padding:10 
  }
});
