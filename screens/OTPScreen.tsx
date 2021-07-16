import { StackScreenProps } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, KeyboardAvoidingView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../types";
import Images from "../constants/Images";
import Colors from "../constants/Colors";
import MyWindow from "../constants/Layout";
import { Block, Button, Text } from "galio-framework";
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

const form = {
  username: "",
  password: "",
};

export default function OTPScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "Login">) {
  const params: any = route.params;
  const [is_loading, setLoading] = useState(false);
  const [is_error, setError] = useState(false);
  const [code, setCode] = useState("");
  const [isResend, setIsResend] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isShow, setIsShow] = useState(false);

  const CELL_COUNT = 6;
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  var interval: any;
  
  const otp_timer = () => {
    interval = window.setTimeout(() => {
      setTimer(timer - 1);
    });

    clearTimeout(interval);
  };

  useEffect(() => {
    if (isResend == false) {
      interval = window.setTimeout(() => {
        setTimer(timer - 1);
      }, 2000);
    }

    if (timer == 0) {
      setIsResend(true);
      clearTimeout(interval);
    }
    return () => {};
  }, [isResend, timer]);

  // verify otp
  const verifyOTP = async () => {
    const get_otp = await AsyncStorage.getItem("otp_code");
    console.warn(get_otp)
    setLoading(true);
    setError(false);
    if (code == get_otp) {      
      AsyncStorage.setItem("user_id", params.user_id.toLocaleString());
      AsyncStorage.setItem("supplier_id", params.supplier_id.toLocaleString());
      AsyncStorage.setItem("full_name", params.full_name);
      navigation.replace("Root");
      setLoading(false);
    } else {
      setLoading(false);
      setCode("");
      setError(true);
    }
  };

  // resend OTP
  const resendOTP = async () => {
    const email = await AsyncStorage.getItem("email");
    if (isResend == true) {
      setIsShow(true);

      NetInfo.fetch().then((response: any) => {
        if (response.isConnected) {
          axios
            .post(ip_config.ip_address + "e_voucher/api/resend-otp", {
              email: email,
            })
            .then((response) => {
              setTimer(60);
              setIsShow(false);
              setIsResend(false);
              otp_timer();
              alert("Your new OTP has already sent to your email.");
              AsyncStorage.setItem(
                "otp_code",
                response.data[0]["OTP"].toLocaleString()
              );
            })
            .catch((err) => console.warn(err.response));
        } else {
          setIsShow(false);
          setIsResend(false);
          setTimer(60);
          alert("No internet connection.");
        }
      });
    } else {
      alert("(" + timer + ") seconds remaining to resend OTP.");
    }
  };

  return (
    <View style={styles.container}>
      <ProgressDialog
        message="Resending otp to your email..."
        visible={isShow}
      />

      <KeyboardAvoidingView style={{ flex: 1 }}>
        <Block>
          <Image source={Images.DA_Logo} style={styles.logo} />
        </Block>
        <Block>
          <Text style={styles.otp}>One Time Pin</Text>
          <Text style={styles.otp_desc}>
            Your one time pin will be sent to your email {params.email}
          </Text>
        </Block>
        <Block>
          <CodeField
            ref={ref}
            {...props}
            value={code}
            onChangeText={(my_code) => {
              setCode(my_code);
            }}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}
              >
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
        </Block>
        {is_error == true ? (
          <Block center>
            <Text h6 style={{ color: Colors.danger }}>
              Incorrect OTP.
            </Text>
          </Block>
        ) : null}
        <Block>
          <Button
            round
            uppercase
            color="#66BB6A"
            style={styles.button}
            onPress={verifyOTP}
            loading={is_loading}
          >
            Verify Pin
          </Button>
          <Text style={styles.resend_otp} h5>
            Didn't receive your One Time Pin?
            <Text style={styles.resend_button} onPress={resendOTP}>
              Click here to resend OTP. ({timer})
            </Text>
          </Text>
        </Block>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundMuted,
  },
  second_container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    borderTopEndRadius: 40,
    borderTopStartRadius: 40,
    resizeMode: "contain",
    top: 150,
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
    left: (MyWindow.Width / 100) * 30,
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
  resend_button: {
    height: 50,
    width: MyWindow.Width - 50,
    position: "relative",
    color: "blue",
  },
  button: {
    height: 50,
    width: MyWindow.Width - 30,
    position: "relative",
  },
  otp: { textAlign: "center", fontSize: 25 },
  otp_desc: { textAlign: "center", fontSize: 18, fontFamily:'calibri-light'},
  resend_otp: { textAlign: "center", fontSize: 20, fontFamily:'calibri-light'},
  root: { flex: 1, padding: 50 },
  codeFieldRoot: { marginTop: 50, marginBottom: 50 },
  cell: {
    width: 50,
    marginHorizontal: (MyWindow.Width / 100) * 1,
    height: 50,
    lineHeight: 58,
    fontSize: 28,
    borderWidth: 3,
    borderColor: "#00000030",
    textAlign: "center",
  },
  focusCell: {
    borderColor: Colors.base,
  },
});
