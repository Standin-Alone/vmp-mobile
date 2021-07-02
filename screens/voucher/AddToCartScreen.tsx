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
import { ScrollView } from "react-native-gesture-handler";
import { Block, Button, Text, Icon } from "galio-framework";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { ProgressDialog } from "react-native-simple-dialogs";
import * as ip_config from "../ip_config";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";

export default function FarmerProfileScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "FarmerProfileScreen">) {
  const params = route.params;

  useEffect(() => {
    const fetch_commodities = ()=>{

    }
  }, [])
  return (
    <View style={styles.container}>
      
        <ScrollView  style={{top:MyWindow.Height / 100 * 10}}>  
        <View style={{flex:1,left:20, width:350}}>
            <FlatList   

                
                
                ListEmptyComponent={()=>
                (
                    
                        <Card
                            elevation={20}    
                            onPress={() => alert("sample")}
                            style={styles.card}

                           
                        >
                            <Card.Cover resizeMode="contain" source={Images.tray_egg} />
                            <Card.Title title="Egg"   right = {()=>(
                                <Button
                                size="small"
                                icon="add"
                                iconFamily="material"
                                iconSize={20}
                                color="success"
                                style={{ right: 0 }}
                            
                            >
                            Add
                            </Button>
                            )}/>
                            <Card.Content>
                            <Card.Actions>
                               
                            </Card.Actions>
                            
                            </Card.Content>
                            
                        </Card>
                    
                )}
            />
            
        </View>
        </ScrollView>

      <Footer style={{ backgroundColor: "white" }}>
        <Button uppercase color={Colors.base} style={styles.cart_button}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.cart_title_button}>
              Cart <Text style={styles.cart_sub_title_button}>- 1 item</Text>
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
  cart_title_button: {
    fontWeight: "bold",
    fontFamily: "calibri-light",
    fontSize: 20,
    color: "white",
    display: "flex",
  },
  cart_sub_title_button: {
    fontWeight: "normal",
    fontFamily: "calibri-light",
    fontSize: 20,
    color: "white",
  },
  card:{
    marginTop:90,
    position:'relative'
  }
});
