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
import { Input, Block, Button, Text, Icon} from "galio-framework";
import axios from 'axios';
import * as ip_config from '../ip_config';
import * as LocalAuthentication from 'expo-local-authentication';
import { DrawerContentScrollView } from '@react-navigation/drawer';




var form = {
  username:'',
  password:''
}



export default function LoginScreen({navigation,} : StackScreenProps <RootStackParamList, 'Login'>) {

  const [form,setForm]  = useState({username:'',password:''});
  const [is_loading,setLoading]  = useState(false);
  const [is_error,setError]  = useState(false);
  const [is_warning,setWarning]  = useState(false);
  const [is_biometrics_loading,setBiometricsLoading]  = useState(false);
  const biometricsAuth = async (data:any) => {
    
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    const result = await LocalAuthentication.authenticateAsync();
  
    if(!compatible)
    {
      alert('this device is not compatible for biometric.')
    }
  
    if(!enrolled)
    {
      alert("This devices doesn't have  biometric authentication enabled. ")
    }
  
    if(!result.success)
    throw `${result.error} - Authentication unsuccessfull.`
    else {
        console.warn(enrolled)
      setBiometricsLoading(false)
    }
  }
  
  const signIn =  ()=>{

    setLoading(true);  
    setError(false);

    if(form.username != "" && form.password != "" ){
      axios.post(ip_config.ip_address+'vmp-web/public/api/sign_in',form)
        .then((response)=>{                        
              
              if(response.data[0]['Message'] == 'true'){
                console.warn(response.data[0]['OTP']);
                navigation.replace('OTPScreen');              
                AsyncStorage.setItem('otp_code',response.data[0]['OTP'].toLocaleString());              
                setLoading(false);
              }else{
                setError(true);
                setLoading(false);
              }
              
        }).catch((error)=>{
          setLoading(false);
          console.warn(error.response)        
        })
    }
    else{
      setWarning(true);
      setLoading(false);

    }
      
  }

  const scanbiometrics = async ()=>{
    biometricsAuth()


  }

  const goToForgotPassword = () => {
    navigation.navigate('ForgotPassword')
  }

  return (
      <View style={styles.container}>
        <View style={styles.second_container}>

          <KeyboardAvoidingView style={{flex:1}}>
          <Block  >          
              <Image source={Images.DA_Logo} style={styles.logo}/>                
          </Block>
          
            <Block >                
                <Input
                 placeholder="Username..."
                 placeholderTextColor={Colors.muted}                 
                 color={Colors.header}
                 style={styles.input}                 
                 family="FontAwesome"
                 right
                 icon="account-circle"                 
                 iconColor={Colors.muted}
                 iconSize={20}                                
                 rounded
                 onChangeText={(value)=>setForm({...form,username:value})}                 
                 
                 />
                
            </Block>

            <Block>

              
                <Input
                 placeholder="Password..."
                 placeholderTextColor={Colors.muted}                 
                 color={Colors.header}
                 style={styles.input}
                 viewPass
                 password
                 rounded
                 onChangeText={(value)=>setForm({...form,password:value})}
                
                 />
            </Block>

            <Block  style={{backgroundColor:"#F2F3F4"}}>
                {/* <Text
                    style={styles.fp_button}               
                  onPress={goToForgotPassword}>
                  Forgot your password?
                 </Text> */}


                {is_error == true ? 
                  <Text h7 style={{color:Colors.danger}}>
                  Incorrect Username or password.</Text>                    
                  :                  
                  <Text h6 style={{color:Colors.base}}>
                  </Text>                    
                }

                {is_warning == true ? 
                  <Text h7 style={{color:Colors.warning}}>
                  Please enter your username and password.</Text>                    
                  :                  
                  null                  
                }
                
            </Block>

            <Block>
                <Button
                  icon="login" 
                  iconFamily="FontAwesome" 
                  iconSize={30}
                  round uppercase color="#66BB6A" style={styles.button}                
                  onPress={signIn} loading={is_loading}>
                  Sign In
                 </Button>
                 
                 <Block row>
                  <View style={styles.sidebarDivider}></View>
                    
                  <View style={styles.sidebarDivider}></View>
                 </Block>
                
                 <Button
                  icon="fingerprint" 
                  iconFamily="FontAwesome" 
                  iconSize={30}
                  round 
                  uppercase 
                  color={Colors.info} 
                  style={styles.fp_button}                                  
                  onPress={scanbiometrics} loading={is_biometrics_loading}
                  
                  >
                  Use Finger print
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
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },

  input: {    
    borderColor: Colors.border,
    height: 50,
    width:MyWindow.Width - 50,
    backgroundColor: '#FFFFFF'
  },
  button:{
    height: 50,
    width:MyWindow.Width - 50,
    position:'relative'
  },
  fp_button:{   
    height: 50,
    width:MyWindow.Width - 50,
    position:'relative',
    
  },  
  // fp_button:{   
  //   color:'#2e78b7' ,
    
  // },  
  sidebarDivider:{
    height:1,

    width:"45%",
    backgroundColor:"lightgray",
    marginVertical:15
  }
  
});
