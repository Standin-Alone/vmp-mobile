/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

// screens
import NotFoundScreen from '../screens/NotFoundScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import OTPScreen from '../screens/OTPScreen';
import ClaimVoucherScreen from '../screens/ClaimVoucherScreen';


import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import DrawerTabNavigator from './DrawerTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import {View,Text} from 'react-native';

import {ApplicationProvider} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    
      <NavigationContainer
        linking={LinkingConfiguration}
        theme={DefaultTheme}>
        <RootNavigator  />      
      </NavigationContainer>
    

  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();


var Custom_Header = (props) => {return ( <View style={{ backgroundColor: "white" }}>
<Text
  style={[
    { color: "black" },
    // Platform.OS === "android" ? { fontSize: 20 } : { fontSize: 1 }
  ]}
>
Helloworld
</Text>
</View>

)
 } 



function RootNavigator() {
  return (

    <Stack.Navigator screenOptions={{ headerShown: false }}  initialRouteName="QRCodeScreen" mode="modal" >
      <Stack.Screen name="Root" component={DrawerTabNavigator}   options={{ headerTitle: props => <Custom_Header {...props} /> }}  />      
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Forgot Password' }} />
      <Stack.Screen name="OTPScreen" component={OTPScreen} options={{ title: 'OTP Screen' }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />      
      <Stack.Screen name="ClaimVoucher" component={ClaimVoucherScreen} options={{ 
        title: 'Claim Voucher',
        headerShown: true, 
               
      }}
      
        
      />      
    </Stack.Navigator>
  );
}
