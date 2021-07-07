import { StackScreenProps } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, KeyboardAvoidingView,FlatList, OpaqueColorValue } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Footer, Body, Item } from "native-base";
import { RootStackParamList } from "../../types";
import Images from "../../constants/Images";
import Colors from "../../constants/Colors";
import MyWindow from "../../constants/Layout";
import { Card } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Text,Icon } from "galio-framework";
import NumericInput from "react-native-numeric-input";

export default function FertilizerScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "FertilizerScreen">) {

  
  const params = route.params;
  let fertilizer = params.program_items.filter(item => item.item_name=='UREA Fertilizer')[0];
  
  const rightComponent = ()=>(
      <NumericInput
        // value={selectedCommodity.quantity}
        // onChange={(value) => {
          
        // }}
        minValue={1}
        maxValue={99999}
        totalWidth={130}
        totalHeight={50}
        iconSize={25}
        // initValue={selectedCommodity.quantity}
        step={1}
        valueType="integer"
        rounded
        iconStyle={{ color: "white" }}
        rightButtonBackgroundColor={Colors.add}
        leftButtonBackgroundColor={Colors.add}
      />
  )

  return (
    <View style={styles.container}>
      <Body>
      
      <Card
        elevation={10}
        style={styles.balance_card}                         
        >
        <Card.Cover source={{ uri: "data:image/jpeg;base64," + fertilizer.base64}} resizeMode="center" style={{height:400}}/>
        <Card.Title 
            title="Fertilizer (Kgs)" 
            subtitle={"Your price limit is " + fertilizer.ceiling_amount}  
            titleStyle={{fontFamily:'calibri-light',fontWeight:'bold',fontSize:30}} 
            subtitleStyle={{fontSize:15}} 
            right={rightComponent}
        />
                  
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundMuted,
  }, claim_fertilizer_button :{
    width:(MyWindow.Width) / 100 * 95,

    left:0,
    top:0,
    bottom:0
  },
  balance_card:{
    marginTop:90,
    borderRadius:20,
    width:(MyWindow.Width) / 100 * 95,
    height:(MyWindow.Height) / 100 * 85
  }


  
});
