import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  Linking,
} from 'react-native';

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import  Images from '../constants/Images';


const CustomSidebarMenu =   (props) =>{


  return (
    <SafeAreaView style={{flex:1,}}>
      
      <Image source={Images.avatar_logo} style={styles.sideBarImage}></Image>
      <View style={styles.sidebarDivider}></View>
      <View style={{flex:1}}>
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props}>
              <DrawerItem
                label="Visit us"
              />
                
            

            </DrawerItemList>


          </DrawerContentScrollView>        
      </View>
    </SafeAreaView>

  )



}



const styles = StyleSheet.create({
sideBarImage : {
    resizeMode:'center',
    alignSelf:'center',
    borderRadius: 100/2,
    width: 100,
    height: 100,
    marginVertical:100,
    backgroundColor:'#ddd',    
},
sidebarDivider:{
  height:1,
  width:"100%",
  backgroundColor:"lightgray",
  marginVertical:5
}
  
});


export default CustomSidebarMenu;