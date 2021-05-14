import React , {useState, useEffect}from 'react';
import { StyleSheet,Button } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Images from '../constants/Images';

export default function TabTwoScreen() {

  

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned,setScanned] = useState(false);
  

  useEffect(() => {
    (async () => {
      const {status} = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission( status === 'granted');    
              
    })();
  }, [])


  if(hasPermission == null){

      return <Text>Requesting for camera</Text>
  }
  if(hasPermission === false){
    return <Text> No Access camera</Text>
  }
  const handleQRCodeScanned = ({type,  data}) =>{
    
    alert(data)
  }
  return (
    <View style={styles.container}>      
     
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleQRCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
        
      


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
