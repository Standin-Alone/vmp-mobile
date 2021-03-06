import { StackScreenProps } from "@react-navigation/stack";
import React, { useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Footer, Body, Item } from "native-base";
import { RootStackParamList } from "../../types";
import Colors from "../../constants/Colors";
import MyWindow from "../../constants/Layout";
import { Card } from "react-native-paper";
import { Button, Text, Icon, Input } from "galio-framework";
import NumericInput from "react-native-numeric-input";
import NumberFormat from "react-number-format";
import AlertComponent from '../../constants/AlertComponent';


export default function FertilizerScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "FertilizerScreen">) {
  // Initialize variables
  // get passed values from farmer profile screen
  const params = route.params;
  let fertilizer = params.program_items.filter(
    (item) => item.item_name == "UREA Fertilizer"
  )[0];

  const [fertilizerInput, setFertilizerInput] = useState({
    sub_id: fertilizer.sub_id,
    fertilizer_amount: 0.0,
    ceiling_amount: fertilizer.ceiling_amount,
    quantity: 1,
    total_amount: 0.0,
  });



  const [spiel, setSpiel] = useState({
    message: "",
    status: "",
  });

  // proceed to next process attachment screen
  const claimFertilizer = () => {
    if (spiel.status == "success" && fertilizerInput.total_amount != 0) {
      if(Number(fertilizerInput.total_amount) <= Number(params.data[0].Available_Balance)){
     
        navigation.navigate("AttachmentScreen", {
          voucher_info: params.data[0],
          commodity_info: fertilizerInput,
          supplier_id: params.supplier_id,
          full_name: params.full_name,
          user_id: params.user_id,
        });
      
      } else{
        AlertComponent.spiel_message_alert("Message",`Your total amount of ₱${fertilizerInput.total_amount.toFixed(2)} exceed in you current balance of ₱${params.data[0].Available_Balance}`,"I understand")
      }
    }else if (fertilizerInput.fertilizer_amount == 0) {
      alert("Please enter your amount.");
    }
  };


  const quantityComponent = (value) => {
    var total_amount =
      parseFloat(fertilizerInput.fertilizer_amount) * value;

    if (
      isNaN(total_amount) ||
      (total_amount <= fertilizerInput.ceiling_amount &&
        total_amount <= params.data[0].Available_Balance)
    ) {
      setFertilizerInput((prevState) => ({
        sub_id: prevState.sub_id,
        fertilizer_amount: prevState.fertilizer_amount,
        ceiling_amount: prevState.ceiling_amount,
        total_amount: total_amount,
        quantity: value,
      }));
      setSpiel({ message: "", status: "success" });
    } else {
      setFertilizerInput((prevState) => ({
        sub_id: prevState.sub_id,
        fertilizer_amount: prevState.fertilizer_amount,
        ceiling_amount: prevState.ceiling_amount,
        total_amount: 0,
        quantity: value,
      }));
      setSpiel({
        message:
          "You exceed on the amount limit of ₱" +
          fertilizerInput.ceiling_amount,
        status: "error",
      });
    }
  }


  // Add Quantity
  const rightComponent = () => (
    <NumericInput
      containerStyle={{ borderWidth: 0 }}
      value={fertilizerInput.quantity}
      onChange={(value) => quantityComponent(value)}
      minValue={1}
      maxValue={99999}
      totalWidth={130}
      totalHeight={50}
      iconSize={25}
      initValue={fertilizerInput.quantity}
      step={1}
      valueType="integer"
      rounded
      iconStyle={{ color: "white" }}
      rightButtonBackgroundColor={Colors.add}
      leftButtonBackgroundColor={Colors.add}
    />
  );

  // amount value change 
  const amountValueChange = (values) => {
    const { formattedValue, value } = values;

    var converted_value = parseFloat(value);
    var total_amount = converted_value * fertilizerInput.quantity;
    var validated_converted_value = converted_value == "" ? 0 : value;
    
    var validated_total_amount = isNaN(total_amount)
      ? 0
      : total_amount;

    if (
      isNaN(total_amount) ||
      total_amount <= fertilizerInput.ceiling_amount
    ) {
      setFertilizerInput((prevState) => ({
        sub_id: prevState.sub_id,
        ceiling_amount: prevState.ceiling_amount,
        fertilizer_amount: validated_converted_value,
        total_amount: validated_total_amount,
        quantity: prevState.quantity,
      }));
      setSpiel({ message: "", status: "success" });
    } else {
      setFertilizerInput((prevState) => ({
        sub_id: prevState.sub_id,
        ceiling_amount: prevState.ceiling_amount,
        fertilizer_amount: converted_value,
        total_amount: 0,
        quantity: prevState.quantity,
      }));
      setSpiel({
        message:
          "You exceed on the amount limit of ₱" +
          fertilizerInput.ceiling_amount,
        status: "error",
      });
    }
  }

  // amount value render text
  const renderAmountText = (values) => {
    return (
      // Amount Textbox
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
          "Your amount limit is  ₱" + fertilizer.ceiling_amount
        }
        bottomHelp={true}
        rounded
        type="numeric"
        onChangeText={(orig_val) => {
          setFertilizerInput((prevState) => ({
            sub_id: prevState.sub_id,
            ceiling_amount: prevState.ceiling_amount,
            fertilizer_amount: orig_val,
            total_amount: prevState.total_amount,
            quantity: prevState.quantity,
          }));
        }}
        value={values}
      />
    );
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={0}>
        <Body>
          {/* FertilizerCard */}
          <Card elevation={10} style={styles.balance_card}>
            <Card.Cover
              source={{ uri: "data:image/jpeg;base64," + fertilizer.base64 }}
              resizeMode="center"
              style={{ height: 200 }}
            />
            <Card.Title
              title={"Fertilizer (" + fertilizer.unit_measure + ")"}
              titleStyle={styles.fertilizer_card_title}
              subtitleStyle={{ fontSize: 15 }}
              right={rightComponent}
            />
            <Card.Content style={{top:-20}}>
              {/* Amount Textbox */}
              <NumberFormat
                value={fertilizerInput.fertilizer_amount}
                displayType={"text"}
                decimalScale={2}
                thousandSeparator={true}
                onValueChange={(values) => amountValueChange(values)}
                renderText={(values) => renderAmountText(values)}
              />
              {spiel.status == "error" ? (
                <Text style={styles.spiel}> {spiel.message} </Text>
              ) : null}
            </Card.Content>
          </Card>

          {/* Cart Summary Details */}
          <Card style={styles.cart_details}>
            <Card.Title title="Summary" titleStyle={styles.details_title} />
            <Card.Content>
              <View style={{ flexDirection: "row", marginBottom: 20 }}>
                <View style={{ flex: 1 }}>

                  <Text style={styles.detail_info_title}>Current Balance:</Text>
                </View>
                <View style={{ flex: 1 }}>

                <NumberFormat
                  value={params.data[0].Available_Balance}
                  displayType={"text"}
                  decimalScale={2}
                  thousandSeparator={true}                
                  renderText={(values) => (
                    <Text style={styles.detail_info_value}>
                    ₱{values}
                    </Text>
                  )}
                />
             
                </View>
              </View>

              <View style={{ flexDirection: "row", marginBottom: 20 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.detail_info_title}>Total:</Text>
                </View>
                <View style={{ flex: 1 }}>
                


                  <NumberFormat
                    value={fertilizerInput.total_amount}
                    displayType={"text"}
                    decimalScale={2}
                    thousandSeparator={true}                
                    fixedDecimalScale={true}
                    renderText={(values) => (
                      <Text style={styles.detail_info_value}>
                      ₱{values}
                      </Text>
                    )}
                  />

                  
                </View>
              </View>

              <View style={{ flexDirection: "row", marginBottom: 20 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.detail_info_title}>
                    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                    -
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", marginBottom: 20 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.detail_info_title}>
                    Remaining Balance:
                  </Text>
                </View>
                <View style={{ flex: 1 }}>                
                  <NumberFormat
                    value={params.data[0].Available_Balance - fertilizerInput.total_amount}
                    displayType={"text"}
                    decimalScale={2}
                    thousandSeparator={true}                
                    fixedDecimalScale={true}
                    renderText={(values) => (
                      <Text style={styles.remaining_balance}>
                      ₱{values}
                      </Text>
                    )}
                  />
                </View>
              </View>
            </Card.Content>
          </Card>
        </Body>
        {/* Claim Fertilizer Button */}
        <Footer style={{ backgroundColor: Colors.backgroundMuted }}>
          <Button
            color={Colors.base}
            style={styles.claim_fertilizer_button}
            onPress={claimFertilizer}
            uppercase
          >
            Next
          </Button>
        </Footer>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundMuted,
  },
  claim_fertilizer_button: {
    width: (MyWindow.Width / 100) * 95,

    left: 0,
    top: 0,
    bottom: 0,
  },
  cart_details: {
    height: (MyWindow.Height / 100) * 30,
    marginHorizontal: (MyWindow.Width / 100) * 2,
    width: (MyWindow.Width / 100) * 95,
    borderRadius: 20,
    marginBottom: 30,
    marginTop: 10,
  },
  details_title: {
    fontFamily: "calibri-light",
    fontSize: 25,
    fontWeight: "bold",
  },
  balance_card: {
    marginTop: (MyWindow.Height / 100) * 10,
    borderRadius: 20,
    width: (MyWindow.Width / 100) * 95,
    height: (MyWindow.Height / 100) * 55,
  },
  amount_input: {
    width: (MyWindow.Width / 100) * 85,
  },
  spiel: {
  
    bottom: 10,
    fontFamily: "calibri-light",
    alignSelf: "center",
    color: Colors.white,
    backgroundColor:'#ff5b57cc',
    borderRadius:5,     
    padding:10 
  },

  details_content: {
    flex: 1,
    flexDirection: "row",
    marginLeft: 20,
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  detail_info_value: {
    color: Colors.dark.background,
    fontFamily: "calibri-light",
    fontSize: 25,
    justifyContent: "flex-start",
  },
  detail_info_title: {
    color: "#9E9FA0",
    justifyContent: "flex-start",
    fontFamily: "calibri-light",
    fontSize: 20,
  },
  remaining_balance: {
    color: Colors.base,
    fontFamily: "calibri-light",
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: "flex-start",
  },
  fertilizer_card_title: {
    fontFamily: "calibri-light",
    fontWeight: "bold",
    fontSize: 30,
  },
});
