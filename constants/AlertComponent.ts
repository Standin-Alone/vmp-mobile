import {Alert,BackHandler} from 'react-native';
import axios from "axios";
import * as ip_config from "../ip_config";
const spiel_message_alert = (title,message,confirm_button_title)=>{
    Alert.alert(title,message,[{
      text:confirm_button_title,      
    }])
  }
  
const discard_transaction_alert = (navigation,data)=>{
  Alert.alert(
    "Message",
    "Do you really want to discard your transaction?",
    [
      {
        text: "No",
      },
      {
        text: "Yes",
        onPress: () => {
          axios.post(ip_config.ip_address + "e_voucher/api/discard_transaction", data).then(()=>{
            navigation.reset({ routes: [{ name: "Root" }] });  
          }).catch((error)=>{
            console.warn(error)
              alert('Error! Please try again.');
          })
          
          return true;
        },
      },
    ]
  );
}


export default {spiel_message_alert,discard_transaction_alert};