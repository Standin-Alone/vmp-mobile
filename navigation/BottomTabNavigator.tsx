/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { Ionicons } from "@expo/vector-icons";

import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { StackActions } from "@react-navigation/native";
import { StyleSheet, Alert, BackHandler, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import HomeScreen from "../screens/HomeScreen";
import QRCodeScreen from "../screens/QRCodeScreen";
import { BottomTabParamList, TabOneParamList, TabTwoParamList } from "../types";
import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";
import { Icon } from "galio-framework";
import Images from "../constants/Images";
import ToggleSwitch from 'toggle-switch-react-native'
const BottomTab = AnimatedTabBarNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const [isLogout, setLogout] = useState(false);
  const navigation = useNavigation();
  const navigation_state = useNavigationState(
    (state) => state.routes[state.index].name
  );

  const backAction = () => {
    Alert.alert("Message", "Are you sure you want to logout?", [
      {
        text: "No",
      },
      {
        text: "Yes",
        onPress: () => {        
          AsyncStorage.removeItem("otp_code");
          AsyncStorage.removeItem("email");
          navigation.dispatch(StackActions.replace("AuthenticationScreen"));
        },
      },
    ]);
    return true;
  };

  // useEffect(() => {
  //   BackHandler.addEventListener("hardwareBackPress", backAction);
  //   return () =>
  //     BackHandler.removeEventListener("hardwareBackPress", backAction);
  // }, []);
  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      tabBarOptions={{
        activeTintColor: Colors.white,
        activeBackgroundColor: Colors.base,
      }}
      appearance={{
        floating: true,
      }}
    >
      <BottomTab.Screen
        name="HomeScreen"
        component={TabOneNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          tabBarLabel: "Home",
        }}
      />

      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="qr-code" color={color} />
          ),
          tabBarLabel: "Scan Voucher",
          
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>();

function TabOneNavigator() {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={({ navigation }) => ({
          headerTitle: "Home",
          headerRight: (props) => {
            return (
              <Icon
                name="logout"
                family="FontAwesome"
                color={Colors.base}
                size={50}
                style={styles.button}
                onPress={() =>
                  Alert.alert("Message", "Are you sure you want to logout?", [
                    { text: "No" },
                    {
                      text: "Yes",
                      onPress: () => {
                        AsyncStorage.removeItem("otp_code");
                        AsyncStorage.removeItem("email");
                        navigation.replace("AuthenticationScreen");
                      },
                    },
                  ])
                }
              />
            );
          },
          
        })}
      />
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {
  const [isSquidPay, setSquidPay] = useState(false);
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="QRCodeScreen"
        component={QRCodeScreen}
        initialParams={{isSquidPay:isSquidPay}}
        
        options={({ navigation }) => ({
          headerTitle: "Scan Voucher",
          headerRight: (props) => {
            return (              
              <ToggleSwitch            
                  isOn={isSquidPay}
                  size="large"                  
                  icon ={<Image style={styles.toggle_icon} source={Images.squid_pay} />}
                  onToggle={value => isSquidPay == true ? setSquidPay(false) : setSquidPay(true)}
                  style={{right:20}}
                />
            );
          },
          headerTransparent: true,
          headerShown: true, 
          headerTitleAlign: 'center',
          headerTintColor:Colors.white
        })}
      />
    </TabTwoStack.Navigator>
  );
}

const styles = StyleSheet.create({
  button: {
    marginRight: 10,
  },
  toggle_icon:{
    height:30,
    width:30
  }
});
