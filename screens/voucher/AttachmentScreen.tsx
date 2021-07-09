import { StackScreenProps } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import {
  BackHandler,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  FlatList,
  Image,
  Alert,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Footer, Body, Item } from "native-base";
import { RootStackParamList } from "../../types";
import Colors from "../../constants/Colors";
import MyWindow from "../../constants/Layout";
import { Card } from "react-native-paper";
import { Button, Text } from "galio-framework";
import Images from "../../constants/Images";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import ImageViewer from "react-native-image-zoom-viewer";
import { ProgressDialog } from "react-native-simple-dialogs";
import axios from "axios";
import * as ip_config from "../../ip_config";
import Spinner from "react-native-loading-spinner-overlay";

export default function FertilizerScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "FertilizerScreen">) {
  // Initialize variables
  const params = route.params;

  

  const [isShowProgress,setShowProgress] = useState(false);

  const [isShowProgSubmit,setShowProgrSubmit] = useState(false);
    // Set Permission of Camera
  useEffect(() => {
    
    (async () => {
      
      const status_foreground =
        await Location.requestForegroundPermissionsAsync();
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera permission to make this work.");
      }

      if (status_foreground.status !== "granted") {
        alert("Permission to access location was denied");
      }


      navigation.addListener("transitionEnd", () => {
        if (navigation.isFocused()) {
          const backAction = () => {
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
                    navigation.reset({ routes: [{ name: "QRCodeScreen" }] });
                  },
                },
              ]
            );
            return true;
          };
          const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
          );

          return () => backHandler.remove();
        }
      });
    })();
  });



  const confirmDialog =  (message,question,confirm) =>  Alert.alert(
    message,
    question,
    [
      {
        text: "No",                
      },
      {
        text: "Yes",
        onPress: confirm,
      },
    ]
  );


//   attachments variable
  const [attachments, setAttachments] = useState([
    {
      name: "Farmer with Commodity",
      file: null,
      latitude: null,
      longitude:null
    },
    {
      name: "Valid ID",
      file: null,
      latitude: null,
      longitude:null
    },
    {
      name: "Other Attachment",
      file: null,
      latitude: null,
      longitude:null
    },
  ]);


  // show image variable
  const [isShowImage, setShowImage] = useState(false);
  const [imageURI, setImageURI] = useState("");




  const claim_voucher = ()=>{
    setShowProgrSubmit(true);
    let formData = new FormData();

    let voucher_info = {
      reference_no : params.data.reference_no,
      supplier_id : params.supplier_id,
      fund_id : params.data.fund_id,      
      user_id : params.user_id,
      full_name : params.full_name,   
      current_balance : params.data.amount_val,      
    }

    
    formData.append('voucher_info',JSON.stringify(voucher_info))
    formData.append('commodity',JSON.stringify(params.commodity_info));    
    formData.append('attachments',JSON.stringify(attachments));
    

    
    axios.post(ip_config.ip_address + "vmp-web/api/submit-voucher-rrp",formData).then(response=>{
        setShowProgrSubmit(false);
        alert('Successfully claimed!')
        navigation.reset({
          routes: [{ name: 'Root' }]
        });
      }).catch(function(error) {
          alert('Error occured!.')
        });
  }
  // submit button
  const submit =  () => {

    
    confirmDialog("Message","Do you want to confirm your transaction?",claim_voucher)

  }

   // Take Photo Button
   const openCamera = async (document_type) => {
    let location = await Location.getCurrentPositionAsync({});
  
    ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.5,
      exif: true,
      aspect: [8000, 8000],
    }).then(async (response) => {
      
      if (response.cancelled != true) {
              
        attachments.map((item,index)=>{
          if(document_type == item.name){
          let attachmentState = [...attachments];  
           attachmentState[index].file = response.base64; 
          setAttachments(attachmentState)
        }
        })
      }      
      })
    };

  // render card in flatlist
  const renderItem = (item, index) => {
    return item.file == null ? (
      <View>
        <Text style={styles.title}>{item.name}</Text>
        <Button color={Colors.base} style={styles.card_none} onPress={()=>openCamera(item.name)}>
          <Image
            source={Images.add_photo}
            style={{ height: 50, resizeMode: "contain" }}
          />
          <Text>Click to add picture.</Text>
        </Button>
      </View>
    ) : (
      <View>
        <Text style={styles.title}>{item.name}</Text>
        <Card elevation={10} style={styles.card}     onPress={() => showImage(item.file)}>
          <Card.Cover resizeMode="contain" source={{ uri: "data:image/jpeg;base64," + item.file }} />
        </Card>
      </View>
    );
  };


  // show image
  const showImage = (uri: any) => {
    setShowImage(true);
    setImageURI(uri);
  };



  return (
    <View style={styles.container}>
      <ProgressDialog message="Opening the camera..." visible={isShowProgress} />
      <Spinner visible={isShowProgSubmit} color={Colors.base} />
      <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={0}>
        
        <Body>
          {/* Farmer with Commodity */}
          <FlatList
            nestedScrollEnabled
            data={attachments}
            extraData={attachments}
            style={styles.flat_list}
            ListEmptyComponent={() => (
              <View>                
                <Button
                  color={Colors.base}
                  style={styles.card_none}
                  onPress={openCamera}
                >
                  <Image
                    source={Images.add_photo}
                    style={{ height: 50, resizeMode: "contain" }}
                  />
                  <Text>Click to add picture.</Text>
                </Button>
              </View>
            )}
            renderItem={({ item, index }) => renderItem(item, index)}
            keyExtractor={(item) => item.name}
          />

          <Modal
            visible={isShowImage}
            transparent={true}
            onRequestClose={() => setShowImage(false)}
            animationType="fade"
          >
            <ImageViewer
              imageUrls={[{ url: "data:image/jpeg;base64," + imageURI }]}
              index={0}
            />

            
          </Modal>
        </Body>
        {/* Submit Button */}
        <Footer style={{ backgroundColor: Colors.backgroundMuted }}>
          <Button
            color={Colors.base}
            style={styles.submit_button}
            onPress={submit}
          >
            Submit
          </Button>
        </Footer>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundMuted,
  },
  submit_button: {
    width: (MyWindow.Width / 100) * 95,

    left: 0,
    top: 0,
    bottom: 0,
  },
  flat_list: {
    marginTop: (MyWindow.Height / 100) * 10,
    marginBottom: (MyWindow.Height / 100) * 2,
    width: (MyWindow.Width / 100) * 92,
    alignSelf: "center",
  },
  card: {
    marginTop: 10,
    marginHorizontal: 2,
    marginBottom: 20,
    borderRadius: 15,
    height: 200,
    width: (MyWindow.Width / 100) * 92,
  },
  card_none: {
    backgroundColor: "#ddd",
    marginTop: 10,
    marginHorizontal: 2,
    marginBottom: 20,
    borderRadius: 15,
    height: 200,
    width: (MyWindow.Width / 100) * 92,
  },
  title: {
    color: "#9E9FA0",
    justifyContent: "flex-start",
    fontFamily: "calibri-light",
    fontSize: 26,
  },
});
