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
import { initialWindowMetrics } from "react-native-safe-area-context";
export default function ViewCartScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "ViewCartScreen">) {
  const params = route.params;
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(params);
  });
  const [selectedId, setSelectedId] = useState(null);
  const leftContent = (index) => (
    <Button
      size="small"
      icon="trash"
      iconFamily="entypo"
      iconSize={20}
      color={Colors.danger}
      onlyIcon
      onPress={() => {
        setSelectedId(index);
      }}
    ></Button>
  );

  return (
    <View style={styles.container}>
      <FlatList
        nestedScrollEnabled
        data={data}
        style={styles.flat_list}
        ListEmptyComponent={() => (
          <Card elevation={10}>
            <Card.Title title="None" />
          </Card>
        )}
        extraData={selectedId}
        renderItem={({ item, index }) => (
          <Swipeable renderLeftActions={() => leftContent(index)}>
            {/* <Card elevation={20} >            
            <Card.Title 
            title={item.name}

            left={()=>
              <Image source={{uri:'data:Image/jpeg;base64,'+item.image}} style={styles.commodity_image} />
            }
            subtitle={"₱"+item.total_amount}
            subtitleStyle={{fontFamily:'calibri-light',color:Colors.base,fontSize:15}}
            titleStyle={{fontFamily:'calibri-light',fontWeight:'bold'}}

            right={()=>
                <NumericInput
                // value={selectedCommodity.quantity}
                // onChange={(value) => {
        
                // }}
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
            }
            />

        
            <Card.Content>



            </Card.Content>
          </Card> */}
          </Swipeable>
        )}
      />

      <Card style={styles.cart_details}>
        <Card.Title title="Details" />
        <Card.Content>
          <View style={{ flexDirection: "row", marginBottom: 40 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.detail_info_title}>Reference No</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detail_info_value}></Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Footer style={{ backgroundColor: "white" }}>
        <Button uppercase color={Colors.base} style={styles.cart_button}>
          Validate Documents
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
    height: (MyWindow.Height / 100) * 50,
    marginHorizontal: (MyWindow.Width / 100) * 5,
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
    color: "#000000",
    fontFamily: "calibri-light",
    fontSize: 20,
    justifyContent: "flex-start",
  },
});
