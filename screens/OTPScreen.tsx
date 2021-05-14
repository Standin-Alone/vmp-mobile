import { StackScreenProps } from '@react-navigation/stack';
import React,{useState} from 'react';
import { StyleSheet, 
                  
          View, 
          Image,           
          KeyboardAvoidingView,                  
          AsyncStorage
         } from 'react-native';

import { RootStackParamList } from '../types';
import Images from '../constants/Images';
import Colors from '../constants/Colors';
import MyWindow from '../constants/Layout';
import {  Block, Button,Text  } from "galio-framework";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
 


const form = {
  username:'',
  password:''
}



export default function OTPScreen({navigation,} : StackScreenProps <RootStackParamList, 'Login'>) {

  const [is_loading,setLoading]  = useState(false);
  const [is_error,setError]  = useState(false);
  const [code,setCode]  = useState('');
  

  const CELL_COUNT = 4;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });



  
  const verifyOTP = async ()=>{


    const get_otp = await AsyncStorage.getItem('otp_code');    
    setLoading(true);
    setError(false);
    if(code == get_otp){
      navigation.replace('Root');
      setLoading(false);
    }else{      
      setLoading(false);
      setCode('');
      setError(true);
    }

      
  }
  return (
      <View style={styles.container}>
        <View style={styles.second_container}>

          <KeyboardAvoidingView style={{flex:1}}>
          <Block  >          
              <Image source={Images.DA_Logo} style={styles.logo}/>                
          </Block>
          <Block>
            <Text style={styles.otp}>One Time Password</Text>
            <Text style={styles.otp_desc}>Your one time password will be sent to your email.</Text>
          </Block>
          <Block>                  
            
          <CodeField
              ref={ref}
              {...props}
              
              value={code}
              onChangeText={(my_code)=>{setCode(my_code)}}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({index, symbol, isFocused}) => (
                <Text
                  key={index}
                  style={[styles.cell, isFocused && styles.focusCell]}
                  onLayout={getCellOnLayoutHandler(index)}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              )}
          />  


          </Block>
          
        
              {is_error == true ? 
                <Block center>
                  <Text h6 style={{color:Colors.danger}}>
                  Incorrect OTP.</Text>                    
                </Block>
                  :                  
                null                   
                }
        

              
          <Block> 
                <Button
                  round uppercase color="#66BB6A" style={styles.button}                
                  onPress={verifyOTP} loading={is_loading}>
                  Verify
                 </Button>
            </Block>

            </KeyboardAvoidingView>
        </View>
      </View>
 
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.base,    
    
  },
  second_container: {
    flex:1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    borderTopEndRadius:40,
    borderTopStartRadius:40,
    resizeMode:'contain',
    top:150,
    justifyContent: 'center',    
  },
  form_container:{
    alignItems:'center',
    marginTop:200
    
  },
  logo:{
        width:150,
        height:150,
        borderRadius:40,        
        left:MyWindow.Width / 2 - 100,
        top:MyWindow.Height / 2 - 465 ,
        resizeMode:'center', 
        alignItems: 'center'     
      },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  }, 
  button:{
    height: 50,
    width:MyWindow.Width - 50,
    position:'relative'
  }
  ,
  otp:{textAlign: 'center', fontSize: 25},
  otp_desc:{textAlign: 'center', fontSize: 18},
  root: {flex: 1, padding: 20},  
  codeFieldRoot: {marginTop: 20},
  cell: {
    width: 60,
    height: 60,
    lineHeight: 58,
    fontSize: 28,
    borderWidth: 2,
    borderColor: '#00000030',
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#000',
  }
});
