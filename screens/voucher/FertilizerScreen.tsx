import { StackScreenProps } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Footer, Body, Item } from "native-base";
import { RootStackParamList } from "../../types";
import Colors from "../../constants/Colors";
import MyWindow from "../../constants/Layout";
import { Card } from "react-native-paper";
import { Button, Text, Icon,Input } from "galio-framework";
import NumericInput from "react-native-numeric-input";
import NumberFormat from "react-number-format";

export default function FertilizerScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "FertilizerScreen">) {
  const params = route.params;
  let fertilizer = params.program_items.filter(
    (item) => item.item_name == "UREA Fertilizer"
  )[0];
  
  const [fertilizerInput, setFertilizerInput] = useState({
    fertilizer_amount:0.00,
    ceiling_amount:fertilizer.ceiling_amount,
    quantity:1,
    total_amount:0.00});
  const [spiel, setSpiel] = useState({
    message: "",
    status: "success",
  });

  const rightComponent = () => (
    <NumericInput
      value={fertilizerInput.quantity}
      onChange={(value) => {
        console.warn(fertilizerInput.fertilizer_amount)
        var total_amount = parseFloat(fertilizerInput.fertilizer_amount) * value;

        if (
          isNaN(fertilizerInput.fertilizer_amount) ||
          fertilizerInput.fertilizer_amount <= fertilizerInput.ceiling_amount
        ) {
          setFertilizerInput((prevState) => ({
            fertilizer_amount:prevState.fertilizer_amount,
            ceiling_amount:prevState.ceiling_amount,
            total_amount:total_amount,
            quantity:value,                        
          }));
          setSpiel({ message: "", status: "success" });
        } else {
          setSpiel({
            message: "You exceed on the limit fertilizer_amount ",
            status: "error",
          });
        }
      }}
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

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={{flex:1}}  keyboardVerticalOffset={0}
  behavior={'height'}>
    <View  style={{flex:1}} >
      <Body >
        <Card elevation={10} style={styles.balance_card}>
          <Card.Cover
            source={{ uri: "data:image/jpeg;base64," + fertilizer.base64 }}
            resizeMode="center"
            style={{ height: 400 }}
          />
          <Card.Title
            title="Fertilizer (Kgs)"
            // subtitle={"Your amount limit is ₱" + fertilizer.ceiling_amount}
            titleStyle={{
              fontFamily: "calibri-light",
              fontWeight: "bold",
              fontSize: 30,
            }}
            subtitleStyle={{ fontSize: 15 }}
            right={rightComponent}
          />
          <Card.Content>
            
            {/* Amount Textbox */}
        <NumberFormat
          value={fertilizerInput.fertilizer_amount}
          displayType={"text"}
          decimalScale={2}
          thousandSeparator={true}
          onValueChange={(values) => {
            const { formattedValue, value } = values;

            var converted_value = parseFloat(value);
            var total_amount = converted_value * fertilizerInput.quantity;

            if (
              isNaN(converted_value) ||
              converted_value <= fertilizerInput.ceiling_amount
            ) {
              setFertilizerInput((prevState) => ({                
                ceiling_amount:prevState.ceiling_amount,
                fertilizer_amount:converted_value,
                total_amount:total_amount,
                quantity:prevState.quantity,                        
              }));
              setSpiel({ message: "", status: "success" });
            } else {
              setSpiel({
                message: "You exceed on the limit fertilizer_amount ",
                status: "error",
              });
            }
          }}

          renderText={(values) => {
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
                help={"Your amount limit is  ₱" + fertilizer.ceiling_amount}
                bottomHelp={true}
                rounded
                type="numeric"
                onChangeText={(orig_val) => {

                  setFertilizerInput((prevState) => ({                
                    ceiling_amount:prevState.ceiling_amount,
                    fertilizer_amount:orig_val,
                    total_amount:prevState.total_amount,
                    quantity:prevState.quantity,                        
                  }));

                }}
                value={values}
              />
            );
          }}
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
                  ₱{" "}
                  {isNaN(fertilizerInput.total_amount)
                    ? 0.00
                    : fertilizerInput.total_amount.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
          </Card.Content>
        </Card>

        
      
      </Body>
      {/* Claim Fertilizer Button */}
      <Footer style={{ backgroundColor: "white" }}>
        <Button
          uppercase
          color={Colors.base}
          style={styles.claim_fertilizer_button}
        >
          Claim
        </Button>
      </Footer>
      </View>
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
  balance_card: {
    marginTop: 90,
    borderRadius: 20,
    width: (MyWindow.Width / 100) * 95,
    height: (MyWindow.Height / 100) * 85,
  },
  amount_input: {
    width: (MyWindow.Width / 100) * 85,
  },
  spiel: {
    color: Colors.danger,
    bottom: 10,
    fontFamily: "calibri-light",
    alignSelf:'center'
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
});
