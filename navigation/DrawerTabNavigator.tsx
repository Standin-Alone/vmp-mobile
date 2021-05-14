/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/drawer-tab
 */

 import { Ionicons } from '@expo/vector-icons';
 import { createDrawerNavigator } from '@react-navigation/drawer';

 import * as React from 'react';
 
 
 import Colors from '../constants/Colors';
 import useColorScheme from '../hooks/useColorScheme';
 import BottomTabNavigator from './BottomTabNavigator';
 import SettingsScreen from '../screens/drawer/SettingsScreen'
import TabOneScreen from '../screens/TabOneScreen';
import CustomSidebarMenu from './CustomSidebarMenu';
 

 
 
 const  DrawerTab = createDrawerNavigator();
 

 export default function DrawerTabNavigator() {
   const colorScheme = useColorScheme();

   return (
      <DrawerTab.Navigator
      drawerContent={(props)=> <CustomSidebarMenu {...props}/>
      
    
    }
      
      drawerContentOptions ={{
              activeTintColor: Colors.base,          
              itemStyle: { marginVertical: 10 },              
            }}      
      >
          <DrawerTab.Screen name="Logout" component={BottomTabNavigator}/>
          
      </DrawerTab.Navigator>
   
    )}