/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, } from '@react-navigation/stack';
import {useNavigation,useNavigationState} from '@react-navigation/native';
import React,{useState,useEffect,} from 'react';

import {StyleSheet, Alert, AsyncStorage,BackHandler} from 'react-native';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import HomeScreen from '../screens/HomeScreen';
import QRCodeScreen from '../screens/QRCodeScreen';
import { BottomTabParamList, TabOneParamList, TabTwoParamList } from '../types';
import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";
import {Button,Block,Icon} from "galio-framework";
import {ConfirmDialog} from 'react-native-simple-dialogs';

const BottomTab = AnimatedTabBarNavigator<BottomTabParamList>();




export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const [isLogout,setLogout] = useState(false);
  const navigation = useNavigation();
  const navigation_state = useNavigationState((state) => state.routes[state.index].name);
  useEffect(() => {
    if(navigation_state == 'QRCodeScreen' || navigation_state == 'HomeScreen' ){
    const backAction = ()=>{
      Alert.alert("Message","Do you really want to logout?",[
        {
          text:"No"
        },
        {
          text:"Yes",
          onPress:()=>
          {
            AsyncStorage.clear();
            navigation.reset({routes: [{ name: 'Login' }]});
            
          }
        }

      ]
      )
      return true;
    }
    const backHandler = BackHandler.addEventListener("hardwareBackPress",backAction);
    return ()=>{
      backHandler
    }
  }
  }, [])
  return (
    <BottomTab.Navigator

      initialRouteName="TabOne"
      tabBarOptions={{ 
        activeTintColor: Colors.base,
        activeBackgroundColor :Colors.background        
      }}

      appearance={{
        floating:true
      }}
      
      >


      <BottomTab.Screen
        name="HomeScreen"
        component={TabOneNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          tabBarLabel:'Home',
          
          
        
        }}
        
        />




      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="qr-code" color={color} />,
          tabBarLabel:'Scan Voucher'            
        }
      }
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
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
        options={({navigation})=>({ 
          headerTitle: 'Home' ,          
          headerRight:props=>{return(<Icon
          name="logout" family="FontAwesome" 
          color={Colors.base} 
          size={50}       
          style={styles.button}
          onPress={()=>Alert.alert("Message","Do you really want to logout?",
          [            
            {text:"No"},
            {text:"Yes",onPress:()=>{ 
              AsyncStorage.clear()
              navigation.navigate.replace('Login')
            
            }}
          ])}
          
          />) }
      
      })}
      />
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="QRCodeScreen"
        component={QRCodeScreen}
        options={{ headerTitle: 'Scan Voucher' }}
      />
    </TabTwoStack.Navigator>
  );
}



const styles = StyleSheet.create({

  button:{

  marginRight:10

  }
})