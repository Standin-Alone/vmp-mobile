import { StackScreenProps } from '@react-navigation/stack';
import React,{useState} from 'react';
import { StyleSheet, 
          Text,           
          View, 
          Image,           
          KeyboardAvoidingView,                  
         } from 'react-native';

import { RootStackParamList } from '../../types';
import Images from '../../constants/Images';
import Colors from '../../constants/Colors';
import MyWindow from '../../constants/Layout';
import { Input, Block, Button, Icon} from "galio-framework";
import axios from 'axios';
import * as ip_config from '../../ip_config';

const form = {
  username:'',
  password:''
}



export default function SettingsScreen({navigation,} : StackScreenProps <RootStackParamList, 'Login'>) {

  const [is_loading,setLoading]  = useState(false);

  const signIn = async ()=>{

    setLoading(true);

      axios.post(ip_config.ip_address+'rnative-web/public/api/sign_in',form)
      .then((response)=>{
            console.warn(response.data);
            navigation.replace('Root')
            setLoading(false);
      }).catch((error)=>{
        console.warn(error.response.data);
        setLoading(false);
      })

      
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
                 onChangeText={(value)=>{form.username=value}}
                 />


                <Input
                 placeholder="Password..."
                 placeholderTextColor={Colors.muted}                 
                 color={Colors.header}
                 style={styles.input}
                 viewPass
                 password
                 rounded
                 onChangeText={(value)=>{form.password=value}}
                 />
            </Block>

            <Block right>
                <Text
                    style={styles.fp_button}               
                  onPress={goToForgotPassword}>
                  Forgot your password?
                 </Text>
            </Block>

            <Block>
                <Button
                  round uppercase color="#66BB6A" style={styles.button}                
                  onPress={signIn} loading={is_loading}>
                  Sign In
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
    color:'#2e78b7' ,
    
  },
  
});
