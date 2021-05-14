import * as React from 'react';
import { StyleSheet,TouchableOpacity} from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import * as ipconfig from '../ip_config';
import axios from 'axios';

var test_api =  ( )=>{
  
  axios.get(ipconfig.ip_address+'vmp-mobile/public/api/show').then((response)=>{
    
    console.warn(response.data['message'])
    
  }).catch((error)=>{
    console.warn(error);
  });
  
  
}
export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <TouchableOpacity onPress={test_api}><Text style={styles.title}>Press Here</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {  
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
