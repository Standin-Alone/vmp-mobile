import React , {useState, useEffect}from 'react';
import { StyleSheet,Button,Image,Dimensions,Alert,BackHandler,AsyncStorage } from 'react-native';
import {useNavigation, useNavigationState} from '@react-navigation/native';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Images from '../constants/Images';
import axios from 'axios';
import * as ip_config from '../ip_config';
import { Toast } from 'galio-framework';
import {ProgressDialog} from 'react-native-simple-dialogs';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import NetInfo from '@react-native-community/netinfo';
const {width} = Dimensions.get('window');
const qrSize = width * 0.7;


export default function QRCodeScreen() {

  var form = {};
  const navigation = useNavigation();
  const navigation_state = useNavigationState((state) => state.routes[state.index].name);

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned,setScanned] = useState(false);
  const [isShow,setIsShow] = useState(false);
  


  useEffect(() => {
    (async () => {
      if(navigation_state != 'QRCodeScreen'){
        setScanned(true);
      }else{
        setScanned(false); 
      }
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
    
      
    form ={reference_num : data};
    setScanned(true);
    setIsShow(true);
  
    // check internet connection
    NetInfo.fetch().then((response:any)=>{ 
      
    if(response.isConnected){ 
        axios.post(ip_config.ip_address+'vmp-web/public/api/get_voucher_info',form)
        .then((response)=>{                          
          
          if(response.data[0]['Message'] == 'true'){
            
            // navigation.navigate('ClaimVoucher',response.data[0]['data']);                    
            // setScanned(false);
            // setIsShow(false);
            // Test Available Balance
            if(response.data[0]['data'].Available_Balance != 0){
              setScanned(false);
              setIsShow(false);
              navigation.navigate('ClaimVoucher',response.data[0]['data']);        
              
            }else{
              alert('Not Enough Balance.')
              setScanned(false);
              setIsShow(false);
            }
            
          }else{        
            alert("Reference Number doesn't exist.")
            setScanned(false);
            setIsShow(false);
          }        
            
        }).catch((error)=>{      
          console.warn(error)    
          setScanned(false)
          setIsShow(false)
        })
      }else{
        alert('No Internet Connection.')
        setScanned(false)
        setIsShow(false)
  
      }
    });
    
  }
  return (
    
      <View style={styles.container}>
        <ProgressDialog message="Scanning QR code..."  visible={isShow}/>
      
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleQRCodeScanned}
        style={[StyleSheet.absoluteFillObject,styles.container]}     
  
      >            
        
        <Image
          style={styles.qr}
          source={Images.qr_frame}
        />
      </BarCodeScanner>

      </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',    
    justifyContent:'center',    
    
        
  },
  barcodescanner:{
    
    alignItems: 'center',    
    backgroundColor: '#ecf0f1', 
    width: width,
    height: width,   
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
  qr: {
    marginTop: '20%',
    marginBottom: '20%',
    width: qrSize,
    height: qrSize,
  },
});
