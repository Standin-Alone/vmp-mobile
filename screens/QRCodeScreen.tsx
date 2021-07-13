import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  Dimensions,    
} from "react-native";
import {
  useNavigation,
  useNavigationState,
  useIsFocused,
} from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View } from "../components/Themed";
import { BarCodeScanner } from "expo-barcode-scanner";
import Images from "../constants/Images";
import axios from "axios";
import * as ip_config from "../ip_config";
import { Toast } from "galio-framework";
import { ProgressDialog } from "react-native-simple-dialogs";
import { Colors } from "react-native/Libraries/NewAppScreen";
import NetInfo from "@react-native-community/netinfo";
import { Camera } from 'expo-camera';
const { width } = Dimensions.get("window");
const qrSize = width * 0.7;

export default function QRCodeScreen() {
  var form = {};
  const navigation = useNavigation();
  const navigation_state = useNavigationState(
    (state) => state.routes[state.index].name
  );

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isShow, setIsShow] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      navigation.addListener("focus", () => {
        if (navigation.isFocused()) {
          setScanned(false);
        } else {
          setScanned(true);
        }
      });

      if (navigation_state != "QRCodeScreen") {
        setScanned(true);
      } else {
        setScanned(false);
      }
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, [navigation_state]);

  if (hasPermission == null) {
    return <Text>Requesting for camera</Text>;
  }
  if (hasPermission === false) {
    return <Text> No Access camera</Text>;
  }
  const handleQRCodeScanned = async ({ type, data }) => {
    const get_user_id = await AsyncStorage.getItem("user_id");
    const get_supplier_id = await AsyncStorage.getItem("supplier_id");
    const get_full_name = await AsyncStorage.getItem("full_name");
    form = { reference_num: data,supplier_id:get_supplier_id };
    setScanned(true);
    setIsShow(true);
    
    // check internet connection
    NetInfo.fetch().then((response: any) => {
      if (response.isConnected) {
        axios
          .post(
            ip_config.ip_address + "vmp-web/api/get_voucher_info",
            form
          )
          .then( (response) => {
              console.warn(response.data);
            if (response.data[0]["Message"] == "true") {
              // navigation.navigate('ClaimVoucher',response.data[0]['data']);
              // setScanned(false);
              // setIsShow(false);
              // Test Available Balance

              if (response.data[0]["data"][0].Available_Balance != 0.00) {                
                setIsShow(false);
                navigation.navigate("FarmerProfileScreen",{data:response.data[0]["data"],
                program_items:response.data[0]["program_items"],
                supplier_id:get_supplier_id,
                full_name:get_full_name,
                user_id:get_user_id});
              } else {
                alert("Not Enough Balance.");
                setScanned(false);
                setIsShow(false);
              }
            } else {
              alert("Reference Number doesn't exist.");
              setScanned(false);
              setIsShow(false);
            }
          })
          .catch((error) => {
            console.warn(error.response);
            setScanned(false);
            setIsShow(false);
          });
      } else {
        alert("No Internet Connection.");
        setScanned(false);
        setIsShow(false);
      }
    });
  };
  return (
    <View style={styles.container}>
      <ProgressDialog         
        activityIndicatorColor={Colors.base}
        activityIndicatorSize="large"
        animationType="slide"
        message="Scanning QR code..."      
      visible={isShow}  
      />



      {scanned == false ? (        

        <Camera
        onBarCodeScanned={scanned ? undefined : handleQRCodeScanned}
        ratio='16:9'
        style={[StyleSheet.absoluteFillObject,styles.container]}
        >
        <Image style={styles.qr} source={Images.qr_frame} />
        </Camera>

      ) : (
        <Text> No Access camera</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
      alignItems: "center",
    
    
    
  },
  
  barcodescanner: {
    marginBottom:20
    
    
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  qr: {
    marginTop: "50%",
    marginBottom: "20%",
    width: qrSize,
    height: qrSize,
  },
});
