import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  FlatList,
  Alert,
  BackHandler,
  RefreshControl,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View } from "../components/Themed";
import * as ipconfig from "../ip_config";
import axios from "axios";
import SearchInput, { createFilter } from "react-native-search-filter";
import { Block, Input } from "galio-framework";
import { ScrollView } from "react-native-gesture-handler";
import { Card } from "react-native-paper";
import Images from "../constants/Images";
import Colors from "../constants/Colors";
import MyWindow from "../constants/Layout";
import * as ip_config from "../ip_config";
import NetInfo from "@react-native-community/netinfo";
import Spinner from "react-native-loading-spinner-overlay";

var test_api = () => {
  axios
    .get(ipconfig.ip_address + "vmp-mobile/public/api/show")
    .then((response) => {
      console.warn(response.data["message"]);
    })
    .catch((error) => {
      Alert.alert('Error!','Something went wrong.')
      console.warn(error.response);
    });
};

export default function HomeScreen() {
  const [form, setForm] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const [scannedVouchers, setScannedVouchers] = useState([]);

  const [search, setSearch] = useState("");
  const hasMounted = useRef(false);
  const KEYS_TO_FILTERS = ["REFERENCE_NO", "NAME"];
  const getScannedVouchers = async () => {
    const supplier_id = await AsyncStorage.getItem("supplier_id");

    setForm({ ...form, supplier_id: supplier_id });

    setRefreshing(true);
    NetInfo.fetch().then((response: any) => {
      if (response.isConnected) {
        axios
          .post(
            ip_config.ip_address + "vmp-web/api/get-scanned-vouchers",
            form
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

  useEffect(() => {
    // const fetchData = async () => {
    //   const supplier_id = await AsyncStorage.getItem("supplier_id");
    //   console.warn(supplier_id);
    //   setRefreshing(true);

    //   NetInfo.fetch().then(async (response: any) => {
    //     if (response.isConnected) {
    //       const result = await axios.post(
    //         ip_config.ip_address + "vmp-web/public/api/get-scanned-vouchers",
    //         { supplier_id: supplier_id }
    //       );
    //       if (result.status == 200) {
    //         setScannedVouchers(result.data);
    //         setRefreshing(false);
    //       }
    //     } else {
    //       Alert.alert("Message", "No Internet Connection.");
    //       setRefreshing(false);
    //     }
    //   });
    // };

    // fetchData();
  }, []);

  const searchVoucher = (value) => {};

  const filteredVouchers = scannedVouchers.filter(
    createFilter(search, KEYS_TO_FILTERS)
  );
  return (
    <View style={styles.container}>
      <Spinner visible={refreshing} color={Colors.base} />
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

      <Block>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={getScannedVouchers}
              tintColor="#FFF0000"
              title="Loading.."
              color="#AF0606"
              progressBackgroundColor="#FFFF"
            />
          }
        >
          <FlatList
            data={scannedVouchers ? filteredVouchers : null}
            ListEmptyComponent={() => (
              <Card
                elevation={10}
                style={styles.card}
                onPress={() => alert("sample")}
              >
                <Card.Title title="No existing vouchers scanned." />
                <Card.Content></Card.Content>
              </Card>
            )}
            renderItem={({ item, index }) => (
              <Card
                elevation={10}
                style={styles.card}
                onPress={() => alert("sample")}
              >
                <Card.Title
                  title={item.REFERENCE_NO}
                  subtitle={new Date(item.CLAIMED_DATE).toDateString()}
                />
                <Card.Content>
                  <Text style={styles.name}>{item.NAME}</Text>
                </Card.Content>
              </Card>
            )}
          />
        </ScrollView>
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
    borderRadius: 20,
    backgroundColor: Colors.background,
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
