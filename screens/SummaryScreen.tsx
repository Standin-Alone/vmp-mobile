import { StackScreenProps } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, BackHandler } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import Images from "../constants/Images";
import Colors from "../constants/Colors";
import MyWindow from "../constants/Layout";
import { Text } from "galio-framework";
import moment from "moment";

import { List, Card, Divider } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";

export default function SummaryScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "SummaryScreen">) {
  const params: any = route.params;
  
  const transactions = params.transactions;
  const convertedDate = (raw_date) => {
    let split_date = raw_date.split(/[- :]/);
    let convert_date = new Date(
      Date.UTC(
        split_date[0],
        split_date[1] - 1,
        split_date[2],
        split_date[3],
        split_date[4],
        split_date[5]
      )
    ).toDateString();

    return moment(convert_date).format("MMMM DD YYYY");
  };

  // filter transactions by date
  const transactionFilterByDate = transactions.filter(
    (item, index) =>
      transactions.findIndex(
        (obj) =>
          obj.transac_by_fullname === item.transac_by_fullname &&
          convertedDate(obj.transac_date) === convertedDate(item.transac_date)
      ) === index
  );

  // const backAction = ()=>{navigation.goBack()}

  // useEffect(() => {
  //   BackHandler.addEventListener("hardwareBackPress", backAction);
  //   return () =>
  //     BackHandler.removeEventListener("hardwareBackPress", backAction);
  // }, []);

  // card left component
  const leftComponent = () => (
    <Text style={styles.left_component}>&#8369;</Text>
  );

  return (
    <View style={styles.container}>
      <View style={styles.farmer_header}>
        <Image source={Images.farmer} style={styles.logo} />
        <View style={styles.name_view}>
          <Text style={styles.name}>{params.fullname}</Text>
          {/* <Text style={styles.name}>John Azure</Text> */}
        </View>
        <Card elevation={10} style={styles.balance_card}>
          <Card.Title
            title={params.current_balance}
            subtitle="Current Balance"
            left={leftComponent}
          />
        </Card>
      </View>
    <ScrollView>
      <List.AccordionGroup>
        {transactionFilterByDate.map((item,index) => {
          let sum = 0;
          return (
          <List.Accordion
            title={moment(item.transac_date).format("MMMM DD, YYYY")}
            id={index+1}
            description={"transacted by " + item.transac_by_fullname}
            expanded={true}
            titleStyle={{ color: Colors.base }}
            left={(props) => (
              <List.Icon {...props} icon="history" color={Colors.base} />
            )}
          >
            {transactions.map((value) =>{

            return  convertedDate(value.transac_date)  ==  convertedDate(item.transac_date)  &&  item.transac_by_fullname == value.transac_by_fullname  ? (
                <View>
                  <List.Item
                    title={value.item_name + "(" + value.quantity + ")"}
                    titleStyle={{ fontFamily: "calibri-light" }}
                    description={ 
                      "₱" + value.amount + " per " + value.unit_measure 
                    }

                    
                    right={() => (
                      <Text style={{ top: 10 }}>
                        {"₱" + value.total_amount}
                      </Text>
                    )}
                  />
                  <Divider />
                </View>
              ) : null;
            }
            )}
              
            <List.Item  title={"Total Amount"}               
              titleStyle={{fontFamily:'calibri-light',fontWeight:'bold'}}              
              right={()=>              
               {                 
                let filter_transaction = transactions.filter((transaction_value)=> convertedDate(item.transac_date)  ==  convertedDate(transaction_value.transac_date) && transaction_value.transac_by_fullname == item.transac_by_fullname );
                return (<Text style={{top:10}}>{"₱"+
                            filter_transaction.reduce((val,index) => { return convertedDate(index.transac_date)  ==  convertedDate(item.transac_date)  ? val += Number( index.total_amount)  : null }, 0 ).toFixed(2)                            
                    }</Text>)
                    
                }} 
              />                           
          </List.Accordion>
        )})}
      </List.AccordionGroup>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundMuted,
    alignContent: "center",
    top: (MyWindow.Height / 100) * 10,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 40,
    borderColor: "#ddd",
  },
  farmer_header: {
    left: 20,
    width: (MyWindow.Width / 100) * 90,
  },
  name: {
    fontSize: 23,
    fontFamily: "calibri-light",
    alignSelf: "flex-end",
    fontWeight: "bold",
  },
  name_view: {
    bottom: 40,
    right: 20,
  },
  left_component: {
    color: Colors.base,
    fontFamily: "calibri-light",
    fontSize: 50,
    fontWeight: "bold",
  },
  balance_card: {
    marginBottom: 30,
  },
});
