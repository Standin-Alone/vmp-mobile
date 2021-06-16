import { StackScreenProps } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../types";
import Images from "../constants/Images";
import Colors from "../constants/Colors";
import MyWindow from "../constants/Layout";
import { Input, Block, Button, Text, Icon } from "galio-framework";
import axios from "axios";
import * as ip_config from "../ip_config";
import * as LocalAuthentication from "expo-local-authentication";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import NetInfo from "@react-native-community/netinfo";
import MaskInput,{createNumberMask } from 'react-native-mask-input';

export default function LoginScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "Login">) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [is_loading, setLoading] = useState(false);
  const [price,setPrice] = useState('');
  const [is_error, setError] = useState(false);
  const [is_warning, setWarning] = useState(false);
  const [is_biometrics_loading, setBiometricsLoading] = useState(false);
  const [isFingerPrint, setFingerPrint] = useState(false);

  useEffect(() => {
    const checkFingerPrint = async () => {
      const is_finger_print = await AsyncStorage.getItem("is_fingerprint");
      if (is_finger_print == "true") {
        setFingerPrint(true);
      } else {
        setFingerPrint(false);
      }
    };

    checkFingerPrint();
  }, []);

  const biometricsAuth = async (param_supplier_id, is_fp_btn) => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    const result = await LocalAuthentication.authenticateAsync();

    if (!compatible) {
      alert("this device is not compatible for biometric.");
    }

    if (!enrolled) {
      alert("This devices doesn't have  biometric authentication enabled. ");
    }

    if (result.success) {
      if (is_fp_btn == false) {
        AsyncStorage.setItem("supplier_id", param_supplier_id.toLocaleString());
        setBiometricsLoading(false);
        navigation.replace("OTPScreen", { supplier_id: param_supplier_id });
      } else {
        setBiometricsLoading(false);
        const supplier_id = await AsyncStorage.getItem("supplier_id");
        AsyncStorage.setItem("supplier_id", supplier_id);
        navigation.replace("Root");
      }
    } else {
      throw `${result.error} - Authentication unsuccessful.`;
    }
  };

  const scanbiometrics = (param_supplier_id, is_fp_btn) => {
    biometricsAuth(param_supplier_id, is_fp_btn);
  };
  const signIn = () => {
    setLoading(true);
    setError(false);

    //Check internet connection
    NetInfo.fetch().then((response: any) => {
      if (response.isConnected) {
        if (form.username != "" && form.password != "") {
          setWarning(false);
          setError(false);
          axios
            .post(ip_config.ip_address + "vmp-web/public/api/sign_in", form)
            .then((response) => {
              console.warn(response);
              let get_supplier_id = response.data[0]["SUPPLIER_ID"];

              if (response.data[0]["Message"] == "true") {
                AsyncStorage.setItem(
                  "otp_code",
                  response.data[0]["OTP"].toLocaleString()
                );
                AsyncStorage.setItem(
                  "email",
                  response.data[0]["EMAIL"].toLocaleString()
                );
                if (isFingerPrint == false) {
                  AsyncStorage.setItem("is_fingerprint", "false");
                  Alert.alert(
                    "Message",
                    "Do you want to enable login with fingerprint?",
                    [
                      {
                        text: "Disable",
                        onPress: () => {
                          navigation.replace("OTPScreen", {
                            supplier_id: get_supplier_id,
                          });
                          AsyncStorage.setItem("is_fingerprint", "false");
                        },
                      },
                      {
                        text: "Enable",
                        onPress: () => {
                          AsyncStorage.setItem("is_fingerprint", "true");
                          scanbiometrics(get_supplier_id, false);
                        },
                      },
                    ]
                  );
                } else {
                  navigation.replace("OTPScreen", {
                    supplier_id: get_supplier_id,
                  });
                }
                setWarning(false);
                setLoading(false);
                setError(false);
              } else {
                setError(true);
                setWarning(false);
                setLoading(false);
              }
            })
            .catch((error) => {
              setLoading(false);
              console.warn(error.response);
            });
        } else {
          setError(false);
          setWarning(true);
          setLoading(false);
        }
      } else {
        Alert.alert("Message", "No Internet Connection.");
        setLoading(false);
      }
    });
  };

  const goToForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <Block>
          <Image source={Images.DA_Logo} style={styles.logo} />
        </Block>
      
        <Block>
          <Input
            placeholder="Username..."
            placeholderTextColor={Colors.muted}
            color={Colors.base}
            style={styles.input}
            family="FontAwesome"
            right
            icon="account-circle"
            iconColor={Colors.muted}
            iconSize={20}
            rounded
            onChangeText={(value) => setForm({ ...form, username: value })}
          />
        </Block>
        <Block>
          <Input
            placeholder="Password..."
            placeholderTextColor={Colors.muted}
            color={Colors.base}
            style={styles.input}
            viewPass
            password
            rounded
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
        </Block>

        <Block style={{ backgroundColor: "#F2F3F4" }}>
          {/* <Text
                    style={styles.fp_button}               
                  onPress={goToForgotPassword}>
                  Forgot your password?
                 </Text> */}

          {is_error == true ? (
            <Text h7 style={{ color: Colors.danger }}>
              Incorrect Username or password.
            </Text>
          ) : null}

          {is_warning == true ? (
            <Text h7 style={{ color: Colors.danger, marginLeft: 5 }}>
              Please enter your username and password.
            </Text>
          ) : null}
        </Block>

        <Block>
          <Button
            icon="login"
            iconFamily="FontAwesome"
            iconSize={20}
            round
            color="#66BB6A"
            style={styles.button}
            onPress={signIn}
            loading={is_loading}
          >
            Sign In
          </Button>

          <Block row>
            <View style={styles.sidebarDivider}></View>

            <View style={styles.sidebarDivider}></View>
          </Block>
          {/*                 
                  <Button
                  icon="fingerprint" 
                  iconFamily="FontAwesome" 
                  iconSize={20}                                    
                  round
                  color={Colors.info} 
                  style={styles.fp_button}
                  onPress={scanbiometrics} loading={is_biometrics_loading}                  
                  >
                  Use Fingerprint
                 </Button> */}

          {isFingerPrint == true ? (
            <Icon
              name="fingerprint"
              family="fontawesome"
              color={Colors.base}
              size={60}
              style={styles.fp_icon}
              onPress={() => scanbiometrics(0, true)}
            />
          ) : null}
        </Block>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignSelf: "center",
    justifyContent: "center",
  },
  form_container: {
    alignItems: "center",
    marginTop: 200,
  },  
  logo: {
    width: 150,
    height: 150,
    borderRadius: 40,
    left: MyWindow.Width / 2 - 100,
    top: (MyWindow.Height / 100) * -10,
    resizeMode: "center",
    alignItems: "center",
    marginVertical: (MyWindow.Height / 100) * 25,
    marginBottom: MyWindow.Height / 100,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  fp_icon: {
    marginHorizontal: (MyWindow.Width / 100) * 35,
  },
  input: {
    borderColor: Colors.border,
    height: 50,
    width: MyWindow.Width - 40,
    backgroundColor: "#FFFFFF",
    fontFamily:'playfair-regular'
  },
  button: {
    height: 50,
    width: MyWindow.Width - 55,
    position: "relative",
  },
  fp_button: {
    height: 50,
    width: MyWindow.Width - 65,
    position: "relative",
  },
  sidebarDivider: {
    height: 1,

    width: "46.5%",
    backgroundColor: "lightgray",
    marginVertical: 20,
  },
});
