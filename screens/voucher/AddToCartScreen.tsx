import { StackScreenProps } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, FlatList } from "react-native";

import { RootStackParamList } from "../../types";
import { Footer } from "native-base";
import AlertComponent from "../../constants/AlertComponent";
import Colors from "../../constants/Colors";
import MyWindow from "../../constants/Layout";
import { Card } from "react-native-paper";
import DraggablePanel from "react-native-draggable-panel";
import { Button, Text, Icon, Input, theme } from "galio-framework";
import NumberFormat from "react-number-format";
import NumericInput from "react-native-numeric-input";

export default function FarmerProfileScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "FarmerProfileScreen">) {
  const params = route.params;
  const [data, setData]             = useState([]);
  const [isShowPanel, setShowPanel] = useState(false);
  const [new_csf_commodities,setCsfCommodities]       = useState([]);

  const [selectedCommodity, setSelectedCommodity] = useState({
    sub_id:"",
    image: "",
    name: "",
    ceiling_amount: 0,
    quantity: 1,
    price: 0,
    total_amount: 0.0,
  });

  const [spiel, setSpiel] = useState({
    message: "",
    status: "success",
  });
  const [cart, setCart] = useState([]);

  let csf_commodities = data.filter((item) =>
  !item.item_name.toLowerCase().match("fertilizer") &&
  !cart.find((value) => value.name === item.item_name)
  ? item : null
  );

  
  const returnCart = (new_cart)=>{
    console.warn(new_cart);
    setCart(new_cart); 
    
    setCsfCommodities(data.filter((item) =>
    !item.item_name.toLowerCase().match("fertilizer") &&
    !cart.find((value) => value.name === item.item_name)
    ? item : null
    ))
  }


  useEffect(() => {
  
     setData(params.program_items);
  
  
     // refresh cart when go back
     const refresh_cart =   navigation.addListener('focus', ()=>{
        
        setData(params.program_items);        
        setCsfCommodities(data.filter((item) =>
        !item.item_name.toLowerCase().match("fertilizer") &&
        !cart.find((value) => value.name === item.item_name)
        ? item : null
        ))
      })
      
      return refresh_cart
     
  }, [data]);

  let sum = 0.00;
  //  open add to cart panel
  const openAddPanel = (sub_id,item_name, amount, image, unit_measure) => {
    setShowPanel(true);
    setSelectedCommodity({
      sub_id:sub_id,
      image: image,
      name: item_name,
      unit_measure: unit_measure,
      ceiling_amount: amount,
      total_amount: 0.0,
      quantity: 1,
    });
  };

  //  add to cart
  const addToCart = (price, limit_price) => {
    if (price <= limit_price) {
      setCart((prevState) => [...prevState, selectedCommodity]);
      setShowPanel(false);
    } else if (isNaN(price)) {
      AlertComponent.spiel_message_alert(
        "Message",
        "Please enter your amount and quantity of commodity.",
        "I understand."
      );
    }
  };
 

  

  const renderCommodity = (item, index) => (
    <Card elevation={10} style={styles.card}>
      <Card.Cover
        resizeMode="contain"
        source={{ uri: "data:image/jpeg;base64," + item.base64 }}
      />
      <Card.Title
        title={item.item_name + " (" + item.unit_measure + ")"}
        subtitle={"???" + item.ceiling_amount}
        right={() => (
          <Button
            size="small"
            icon="add"
            iconFamily="material"
            iconSize={20}
            color={Colors.add}
            style={{ right: 0 }}
            onPress={() =>
              openAddPanel(
                item.sub_id,
                item.item_name,
                item.ceiling_amount,
                item.base64,
                item.unit_measure
              )
            }
          >
            Add
          </Button>
        )}
      />
      <Card.Content></Card.Content>
    </Card>
  );

  const emptyCommodity = () => (
    <Card elevation={20} style={styles.card}>
      <Card.Title title="None" />
    </Card>
  );

  const handleQuantity = (value) => {
    var total_amount = parseFloat(selectedCommodity.price) * value;
    
    if (
      isNaN(selectedCommodity.price) ||
      total_amount <= selectedCommodity.ceiling_amount
    ) {
      setSelectedCommodity((prevState) => ({
        sub_id: prevState.sub_id,
        image: prevState.image,
        name: prevState.name,
        unit_measure: prevState.unit_measure,
        ceiling_amount: prevState.ceiling_amount,
        quantity: value,
        price: prevState.price,
        total_amount: total_amount,
      }));
      setSpiel({ message: "", status: "success" });
    } else {
      setSelectedCommodity((prevState) => ({
        sub_id: prevState.sub_id,
        image: prevState.image,
        name: prevState.name,
        unit_measure: prevState.unit_measure,
        ceiling_amount: prevState.ceiling_amount,
        quantity: value,
        price: prevState.price,
        total_amount: total_amount,
      }));
      setSpiel({
        message: "You exceed on the limit price ",
        status: "error",
      });
    }
  };

  // view cart button
  const viewCartButton = () =>{
      if(cart.length !=0){
        
        navigation.navigate("ViewCartScreen", {
            cart: cart,
            available_balance: params.data[0].Available_Balance,
            voucher_info:params.data,
            supplier_id: params.supplier_id,
            full_name: params.full_name,
            user_id: params.user_id,
            return_cart : returnCart.bind(this)
        })
      }else{
        AlertComponent.spiel_message_alert('Message','Please add commodity.','I understand')
      }
  }

  // amount textbox value change
  const amountValueChange = (values) =>  {
    const { formattedValue, value } = values;

    var converted_value = parseFloat(value);
    var total_amount = converted_value * selectedCommodity.quantity;

    if (
      isNaN(converted_value) ||
      total_amount <= selectedCommodity.ceiling_amount
    ) {
      setSelectedCommodity((prevState) => ({
        sub_id: prevState.sub_id,
        image: prevState.image,
        name: prevState.name,
        unit_measure: prevState.unit_measure,
        ceiling_amount: prevState.ceiling_amount,
        quantity: prevState.quantity,
        price: converted_value,
        total_amount: total_amount,
      }));
      setSpiel({ message: "", status: "success" });
    } else {
      setSelectedCommodity((prevState) => ({
        sub_id: prevState.sub_id,
        image: prevState.image,
        name: prevState.name,
        unit_measure: prevState.unit_measure,
        ceiling_amount: prevState.ceiling_amount,
        quantity: prevState.quantity,
        price: converted_value,
        total_amount: total_amount,
      }));
      setSpiel({
        message: "You exceed on the limit price ",
        status: "error",
      });
    }
  } 

  const renderAmountText = (values) => {
              return (
                <Input
                  placeholder="0"
                  color={Colors.muted}
                  style={[
                    styles.amount_input,
                    spiel.status == "error"
                      ? { borderColor: Colors.danger }
                      : { borderColor: Colors.base },
                  ]}
                  label="Enter Amount:"
                  help={
                    "Your limit amount is  ???" + selectedCommodity.ceiling_amount
                  }
                  bottomHelp={true}
                  rounded
                  type="numeric"
                  onChangeText={(orig_val) => {
                    setSelectedCommodity((prevState) => ({
                      sub_id: prevState.sub_id,
                      image: prevState.image,
                      name: prevState.name,
                      unit_measure: prevState.unit_measure,
                      ceiling_amount: prevState.ceiling_amount,
                      quantity: prevState.quantity,
                      price: orig_val,
                    }));
                  }}
                  value={values}
                />
              );
            }


  // render design start here
  return (
    <View style={styles.container}>
      {/* COMMODITIES LIST */}
      <FlatList
        nestedScrollEnabled
        data={csf_commodities}
        extraData={new_csf_commodities}
        style={styles.flat_list}
        ListEmptyComponent={() => emptyCommodity()}
        renderItem={({ item, index }) => renderCommodity(item, index)}
        keyExtractor={(item) => item.name}
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
        <Text style={styles.draggable_panel_title}>
          {selectedCommodity.name} ({selectedCommodity.unit_measure})
        </Text>
        {/* close button of add commodity */}
        <Icon
          name="close"
          family="FontAwesome"
          color={Colors.base}
          size={40}
          style={styles.close_button}
          onPress={() => setShowPanel(false)}
        />

        <Image
          source={{ uri: "data:image/jpeg;base64," + selectedCommodity.image }}
          style={styles.commodity_image}
          resizeMode="contain"
        />

        <View style={{ alignItems: "center", top: 20 }}>
          {/* Add Quantity */}
          <NumericInput
            value={selectedCommodity.quantity}
            onChange={(value) => handleQuantity(value)}
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
            onValueChange={(values) =>amountValueChange(values)}
            renderText={(values, props) => renderAmountText(values)}
          />
          {spiel.status == "error" ? (
            <Text style={styles.spiel}> {spiel.message} </Text>
          ) : null}

          <View style={styles.details_content}>
            <View style={{ flexDirection: "row", marginBottom: 50 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.detail_info_title}>Total Amount</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.detail_info_value}>
                  {" "}
                  ???{" "}
                  {isNaN(selectedCommodity.total_amount)
                    ? 0.0
                    : selectedCommodity.total_amount.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* ADD TO CART BUTTON */}
        <Button
          size="small"
          icon="add-shopping-cart"
          iconFamily="material"
          iconSize={20}
          color={Colors.add}
          style={styles.add_to_cart_button}
          onPress={() =>
            addToCart(
              selectedCommodity.total_amount,
              selectedCommodity.ceiling_amount
            )
          }
        >
          Add To Cart
        </Button>
      </DraggablePanel>
      {/* VIEW CART BUTTON */}
      <Footer style={{ backgroundColor: "white" }}>
        <Button
          uppercase
          color={Colors.base}
          style={styles.cart_button}
          onPress={() => viewCartButton()}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.cart_title_button}>
              View your cart{" "}
              <Text style={styles.cart_sub_title_button}>
               ??? {cart.length} item ??? ???{cart.map((prev) => {
                                                sum += prev.total_amount;
                                                return sum;
                                          }) == 0 ? "0.00": sum.toFixed(2)} 
              </Text>
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
  cart_total_amount: {},
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
    height: (MyWindow.Height / 100) * 35,
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
    fontSize: 25,
    justifyContent: "flex-start",
  },
  detail_info_title: {
    color: "#9E9FA0",
    justifyContent: "flex-start",
    fontFamily: "calibri-light",
    fontSize: 26,
  },
  draggable_panel_title: {
    left: 20,
    right: 0,
    top: 20,
    bottom: 0,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "calibri-light",
    position: "relative",
  },
  spiel: {    
    bottom: 10,
    fontFamily: "calibri-light",
    color: Colors.white,
    backgroundColor:'#ff5b57cc',
    borderRadius:5,     
    padding:10 
  },
});
