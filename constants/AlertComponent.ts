import {Alert} from 'react-native';

const spiel_message_alert = (title,message,confirm_button_title)=>{
    Alert.alert(title,message,[{
      text:confirm_button_title,      
    }])
  }
  
const discard_transaction_alert = (navigation)=>{
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
          navigation.reset({ routes: [{ name: "Root" }] });
        },
      },
    ]
  );
}


export default {spiel_message_alert,discard_transaction_alert};