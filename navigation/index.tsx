/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useNavigation,
} from "@react-navigation/native";
import {
  createStackNavigator,
  CardStyleInterpolators,
  HeaderBackButton,
} from "@react-navigation/stack";
import React, {
  useState,
  useEffect,
  createContext,
  useMemo,
  AuthContextValue,
} from "react";
import {
  BackHandler,
  ColorSchemeName,
  StyleSheet,
  AsyncStorage,
  Alert,
} from "react-native";

// screens
import NotFoundScreen from "../screens/NotFoundScreen";
import LoginScreen from "../screens/LoginScreen";

import AuthenticationScreen from "../screens/AuthenticationScreen";
import OTPScreen from "../screens/OTPScreen";
import ClaimVoucherScreen from "../screens/ClaimVoucherScreen";



import FarmerProfileScreen from "../screens/voucher/FarmerProfileScreen";


// CCSF
import FertilizerScreen from "../screens/voucher/FertilizerScreen";

// CCSF
import AddToCartScreen from "../screens/voucher/AddToCartScreen";
import ViewCartScreen from "../screens/voucher/ViewCartScreen";



import { RootStackParamList } from "../types";
import BottomTabNavigator from "./BottomTabNavigator";
import DrawerTabNavigator from "./DrawerTabNavigator";
import LinkingConfiguration from "./LinkingConfiguration";
import { View, Text } from "react-native";
import { Button, Block } from "galio-framework";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer linking={LinkingConfiguration} theme={DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();


//  const navigation = useNavigation();



function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        
      }}
      initialRouteName="Root"
      mode="modal"
    >
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: "Login",
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
      />
      <Stack.Screen
        name="OTPScreen"
        component={OTPScreen}
        options={{ title: "OTP Screen" }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Screen
        name="AuthenticationScreen"
        component={AuthenticationScreen}
        options={{ title: "AuthenticationScreen" }}
      />
      
      <Stack.Screen
        name="ClaimVoucher"
        component={ClaimVoucherScreen}
        options={{
          title: "Claim Voucher",
          headerShown: true,
        }}
      />


      <Stack.Screen
        name="FarmerProfileScreen"
        component={FarmerProfileScreen}
        options={{ title: "Farmer Profile ",
                    headerTransparent: true,
                    headerShown: true, 
                    headerTitleAlign: 'center'}}
      />

      {/* CCSF */}
      <Stack.Screen
        name="AddToCartScreen"
        component={AddToCartScreen}
        options={{ title: "Commodities",
                    headerTransparent: true,
                    headerShown: true, 
                    headerTitleAlign: 'center'}}
      />
  
  
    {/* CCSF */}
      <Stack.Screen
        name="ViewCartScreen"
        component={ViewCartScreen}
        options={{ title: "My Cart",
                    headerTransparent: true,
                    headerShown: true, 
                    headerTitleAlign: 'center',
                    cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS                    
                  
                  }}
      />

    {/* RRP */}
       <Stack.Screen
        name="FertilizerScreen"
        component={FertilizerScreen}
        options={{ title: "Claim Fertilizer",
                    headerTransparent: true,
                    headerShown: true, 
                    headerTitleAlign: 'center',                                        
                  
                  }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  button: {},
});
