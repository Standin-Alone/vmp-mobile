import { StackScreenProps } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../types";
import { Footer, Body, Item } from "native-base";
import Images from "../../constants/Images";
import Colors from "../../constants/Colors";
import MyWindow from "../../constants/Layout";
import { Card } from "react-native-paper";
import DraggablePanel from "react-native-draggable-panel";
import { Block, Button, Text, Icon, Input, theme } from "galio-framework";
import NumberFormat from "react-number-format";
import NumericInput from "react-native-numeric-input";


import * as ip_config from "../../ip_config";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import { color, interpolate } from "react-native-reanimated";

export default function FarmerProfileScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "FarmerProfileScreen">) {
  const params = route.params;
  const [data, setData] = useState([]);
  const [isShowPanel, setShowPanel] = useState(false);
  const [showCart,setShowCart] = useState(false);
  const [selectedCommodity, setSelectedCommodity] = useState({
    name: "",
    ceiling_amount: 0,
    quantity: 1,
    price: 0,
    total_amount: 0.0,
  });

  let sum = 0;


  const [spiel, setSpiel] = useState({
    message: "",
    color: theme.COLORS.ERROR,
  });
  const [cart, setCart] = useState([]);
  useEffect(() => {
    const fetch_commodities = () => {
      axios
        .post(ip_config.ip_address + "vmp-web/api/get-items", params)
        .then((response) => {
          setData(response.data);
        });
    };

    fetch_commodities();
  }, []);

  //  open add to cart panel
  const openAddPanel = (item_name, amount) => {
    setShowPanel(true);
    setSelectedCommodity({
      name: item_name,
      ceiling_amount: amount,
      total_amount: 0.0,
      quantity: 1,
    });
    console.warn(cart)
  };

  //  add to cart
  const addToCart = () => {
 
    setCart((prevState) => [...prevState, selectedCommodity]);
    setShowPanel(false);
  };
  return (
    <View style={styles.container}>
      <FlatList
        nestedScrollEnabled
        data={data}
        style={styles.flat_list}
        ListEmptyComponent={() => (
          <Card elevation={20} style={styles.card}>
            <Card.Cover resizeMode="contain" source={Images.tray_egg} />
            <Card.Title title="None" />
            <Card.Content></Card.Content>
          </Card>
        )}
        renderItem={({ item, index }) => (
          <Card elevation={10} style={styles.card}>
            <Card.Cover resizeMode="contain" source={Images.egg} />
            <Card.Title
              title={item.item_name}
              subtitle={"₱" + item.ceiling_amount}
              right={() => (
                <Button
                  size="small"
                  icon="add"
                  iconFamily="material"
                  iconSize={20}
                  color={Colors.add}
                  style={{ right: 0 }}
                  onPress={() =>
                    openAddPanel(item.item_name, item.ceiling_amount)
                  }
                >
                  Add
                </Button>
              )}
            />
            <Card.Content></Card.Content>
          </Card>
        )}
      />

      {/* Draggable Panel Add Commodity */}

      <DraggablePanel
        visible={isShowPanel}
        hideable={false}
        onDismiss={() => {
          setShowPanel(false);
        }}
        initialHeight={MyWindow.Height + 200}
        animationDuration={300}
      >
        <Text style={styles.draggable_panel_title}>{selectedCommodity.name}</Text>
        {/* close button of add commodity */}
        <Icon
          name="close"
          family="FontAwesome"
          color={Colors.base}
          size={40}
          style={styles.close_button}
          onPress={() => setShowPanel(false)}
        />

        <Image source={Images.egg} style={styles.commodity_image} />

        <View style={{ alignItems: "center", top: 20 }}>
          {/* Add Quantity */}
          <NumericInput
            value={selectedCommodity.quantity}
            onChange={(value) => {
              var total_amount = parseFloat(selectedCommodity.price) * value;
              setSelectedCommodity((prevState) => ({
                name: prevState.name,
                ceiling_amount: prevState.ceiling_amount,
                quantity: value,
                price: prevState.price,
                total_amount: total_amount,
              }));
            }}
            minValue={1}
            maxValue={99999}
            totalWidth={240}
            totalHeight={50}
            iconSize={25}
            initValue={selectedCommodity.quantity}
            step={1}
            valueType="integer"
            rounded
            iconStyle={{ color: "white" }}
            rightButtonBackgroundColor={Colors.add}
            leftButtonBackgroundColor={Colors.add}
          />

          {/* Amount Textbox */}
          <NumberFormat
            value={selectedCommodity.price}
            displayType={"text"}
            decimalScale={2}
            thousandSeparator={true}
            onValueChange={(values) => {
              const { formattedValue, value } = values;

              var converted_value = parseFloat(value);
              var total_amount = converted_value * selectedCommodity.quantity;

              if (converted_value <= selectedCommodity.ceiling_amount) {
                setSelectedCommodity((prevState) => ({
                  name: prevState.name,
                  ceiling_amount: prevState.ceiling_amount,
                  quantity: prevState.quantity,
                  price: converted_value,
                  total_amount: total_amount,
                }));
              }
            }}
            renderText={(values, props) => {
              return (
                <Input
                  placeholder="0"
                  color={Colors.muted}
                  style={styles.amount_input}
                  label="Enter Amount:"
                  help={
                    "Your ceiling amount is  ₱" +
                    selectedCommodity.ceiling_amount
                  }
                  bottomHelp={true}
                  rounded
                  type="numeric"
                  onChangeText={(orig_val) => {
                    setSelectedCommodity((prevState) => ({
                      name: prevState.name,
                      ceiling_amount: prevState.ceiling_amount,
                      quantity: prevState.quantity,
                      price: orig_val,
                    }));
                  }}
                  value={values}
                />
              );
            }}
          />

          <View style={styles.details_content}>
            <View style={{ flexDirection: "row", marginBottom: 50 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.detail_info_title}>Total Amount</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.detail_info_value}>
                  {" "}
                  ₱{" "}
                  {isNaN(selectedCommodity.total_amount)
                    ? 0.0
                    : selectedCommodity.total_amount}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <Button
          size="small"
          icon="add-shopping-cart"
          iconFamily="material"
          iconSize={20}
          color={Colors.add}
          style={styles.add_to_cart_button}
          onPress={() => addToCart()}
        >
          Add To Cart
        </Button>
      </DraggablePanel>            
      <Footer style={{ backgroundColor: "white" }}>
        <Button uppercase color={Colors.base} style={styles.cart_button}
          // onPress={()=>navigation.navigate('ViewCartScreen')}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.cart_title_button}>
              View your cart{" "}
              <Text style={styles.cart_sub_title_button}>- {cart.length} item</Text>
              {/* <Text style={styles.cart_total_amount}>{cart.map(item => { sum += item.total_amount;  return  sum})}</Text>      */}
            </Text>
          </View>
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
  cart_button: {
    width: (MyWindow.Width / 100) * 95,
  },
  add_to_cart_button: {
    width: (MyWindow.Width / 100) * 95,
    position: "absolute",
    bottom: 0,
  },
  cart_title_button: {
    fontWeight: "bold",
    fontFamily: "calibri-light",
    fontSize: 18,
    color: "white",
    display: "flex",
  },
  cart_sub_title_button: {
    fontWeight: "normal",
    fontFamily: "calibri-light",
    fontSize: 20,
    color: "white",
  },
  cart_total_amount:{
    
  },
  card: {
    marginTop: 10,
    marginHorizontal: 2,
    marginBottom: 20,
    borderRadius: 25,
  },
  flat_list: {
    marginTop: (MyWindow.Height / 100) * 10,
    marginBottom: (MyWindow.Height / 100) * -2,
    width: (MyWindow.Width / 100) * 92,
    alignSelf: "center",
  },
  commodity_image: {
    top: 5,
    height: (MyWindow.Height / 100) * 40,
    width: (MyWindow.Width / 100) * 100,
    overflow: "hidden",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  unit_input: {
    borderColor: Colors.border,
    height: 50,
    width: MyWindow.Width - 500,
    fontSize: 20,
    backgroundColor: Colors.light.background,
    opacity: 0.8,
  },
  close_button: {
    left: (MyWindow.Width / 100) * 85,
    right: 0,
    top: 0,
    bottom: 0,
    position: "relative",
  },
  amount_input: {
    width: (MyWindow.Width / 100) * 95,
  },
  details_content: {
    flex: 1,
    flexDirection: "row",
    marginLeft: 20,
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  detail_info_value: {
    color: Colors.add,
    fontFamily: "calibri-light",
    fontSize: 30,
    justifyContent: "flex-start",
  },
  detail_info_title: {
    color: "#9E9FA0",
    justifyContent: "flex-start",
    fontFamily: "calibri-light",
    fontSize: 26,
  },
  draggable_panel_title:
  {  left: 20,
    right: 0,
    top: 20,
    bottom: 0,
    fontSize:20,
    fontWeight:'bold',
    fontFamily:'calibri-light',
    position: "relative"}
});
