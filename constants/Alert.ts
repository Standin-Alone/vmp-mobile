import {Alert} from 'react-native';

const spiel_message_alert = (title,message,confirm_button_title)=>{
    Alert.alert(title,message,[{
      text:confirm_button_title,      
    }])
  }

export default {spiel_message_alert};