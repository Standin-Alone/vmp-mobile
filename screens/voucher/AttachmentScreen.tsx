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
import { Button, Text, Icon } from "galio-framework";
import Images from "../../constants/Images";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import ImageViewer from "react-native-image-zoom-viewer";
import { ProgressDialog } from "react-native-simple-dialogs";
import axios from "axios";
import * as ip_config from "../../ip_config";
import Spinner from "react-native-loading-spinner-overlay";
import SwipeButton from "rn-swipe-button";

export default function FertilizerScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "FertilizerScreen">) {
  // Initialize variables
  const params = route.params;

  const [isShowProgress, setShowProgress] = useState(false);

  const [isShowProgSubmit, setShowProgrSubmit] = useState(false);

  const thumbIconArrow = () => (
    <Icon name="arrow-right" family="entypo" color={Colors.base} size={50} />
  );
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

  const confirmDialog = (message, question, confirm) =>
    Alert.alert(message, question, [
      {
        text: "No",
        onPress: () => {
          setShowProgrSubmit(false);
        },
      },
      {
        text: "Yes",
        onPress: confirm,
      },
    ]);

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
      file: [{ front: null, back: null }],
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

  // Claim Voucher Button
  const claim_voucher = () => {
    setShowProgrSubmit(true);

    let check_null = 0;
    let formData = new FormData();

    let voucher_info = {
      reference_no: params.data.reference_no,
      supplier_id: params.supplier_id,
      fund_id: params.data.fund_id,
      user_id: params.user_id,
      full_name: params.full_name,
      current_balance: params.data.amount_val,
    };

    formData.append("voucher_info", JSON.stringify(voucher_info));
    formData.append("commodity", JSON.stringify(params.commodity_info));
    formData.append("attachments", JSON.stringify(attachments));

    // check attachments
    attachments.map((item) => {
      if (item.name == "Valid ID") {
        if (item.file[0].front == null) {
          check_null++;
        }
        if (item.file[0].back == null) {
          check_null++;
        }
      } else {
        if (item.file == null) {
          check_null++;
        }
      }
    });

    if (check_null == 0) {
      axios
        .post(ip_config.ip_address + "vmp-web/api/submit-voucher-rrp", formData)
        .then((response) => {       
          console.warn(response) 
          setShowProgrSubmit(false);

          alert("Successfully claimed by farmer!");
          // navigation.reset({
          //   routes: [{ name: "Root" }],
          // });
        })
        .catch(function (error) {          
          alert("Error occured!." + error.response);
          setShowProgrSubmit(false);
        });
    } else {
      setShowProgrSubmit(false);
      alert("Please upload all your attachments for proof of transaction.");
    }
  };

  // submit button
  const submit = () => {
    confirmDialog(
      "Message",
      "Do you want to confirm your transaction?",
      claim_voucher
    );
  };

  const imagePickerOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    base64: true,
    quality: 0.5,
    exif: true,
    aspect: [8000, 8000],
  };
  // Take Photo Button
  const openCamera = async (document_type) => {
    setShowProgrSubmit(true);
    let location = await Location.getCurrentPositionAsync({});
    let lat = location.coords.latitude;
    let long = location.coords.longitude;
    let getImagePicker = ImagePicker.launchCameraAsync(imagePickerOptions).then(
      async (response) => {
        if (response.cancelled != true) {
          attachments.map((item, index) => {
            if (document_type == item.name) {
              let attachmentState = [...attachments];
              attachmentState[index].file = response.base64;
              attachmentState[index].latitude = lat;
              attachmentState[index].longitude = long;
              setAttachments(attachmentState);
            } else if (document_type == item.name + "(front)") {
              //set file of front page of id
              let attachmentState = [...attachments];
              attachmentState[index].file[0].front = response.base64;
              attachmentState[index].latitude = lat;
              attachmentState[index].longitude = long;
              setAttachments(attachmentState);
            } else if (document_type == item.name + "(back)") {
              // set file of back page of id
              let attachmentState = [...attachments];
              attachmentState[index].file[0].back = response.base64;
              setAttachments(attachmentState);
            }
          });
        }
      }
    );

    if (getImagePicker) {
      setShowProgrSubmit(false);
    }
  };

  // render card in flatlist
  const renderItem = (item, index) => {
    return item.file == null ? (
      <View>
        <Text style={styles.title}>{item.name}</Text>
        <Button
          color={Colors.base}
          style={styles.card_none}
          onPress={() => openCamera(item.name)}
        >
          <Image
            source={Images.add_photo}
            style={{ height: 50, resizeMode: "contain" }}
          />
          <Text>Click to add picture</Text>
        </Button>
      </View>
    ) : // valid id condition if both front and back is null
    item.name == "Valid ID" &&
      item.file[0].front == null &&
      item.file[0].back == null ? (
      <View>
        <Text style={styles.title}>{item.name}</Text>
        <Button
          color={Colors.base}
          style={styles.card_none}
          onPress={() => openCamera(item.name + "(front)")}
        >
          <Image
            source={Images.add_photo}
            style={{ height: 50, resizeMode: "contain" }}
          />
          <Text>Click to add front page of id</Text>
        </Button>

        <Button
          color={Colors.base}
          style={styles.card_none}
          onPress={() => openCamera(item.name + "(back)")}
        >
          <Image
            source={Images.add_photo}
            style={{ height: 50, resizeMode: "contain" }}
          />
          <Text>Click to add back page of id</Text>
        </Button>
      </View>
    ) : // valid id condition
    item.name == "Valid ID" ? (
      <View>
        <Text style={styles.title}>{item.name}</Text>
        {/* valid id front component */}
        {item.file[0].front == null ? (
          <Button
            color={Colors.base}
            style={styles.card_none}
            onPress={() => openCamera(item.name + "(front)")}
          >
            <Image
              source={Images.add_photo}
              style={{ height: 50, resizeMode: "contain" }}
            />
            <Text>Click to add front page of id.</Text>
          </Button>
        ) : (
          <Card
            elevation={10}
            style={styles.card}
            onPress={() => showImage(item.file[0].front)}
          >
            <Card.Cover
              resizeMode="contain"
              source={{ uri: "data:image/jpeg;base64," + item.file[0].front }}
            />
            <Card.Actions>
              <Text
                style={styles.retake}
                onPress={() => openCamera(item.name + "(front)")}
              >
                Click here to retake photo...
              </Text>
            </Card.Actions>
          </Card>
        )}
        {/* valid id back component */}
        {item.file[0].back == null ? (
          <Button
            color={Colors.base}
            style={styles.card_none}
            onPress={() => openCamera(item.name + "(back)")}
          >
            <Image
              source={Images.add_photo}
              style={{ height: 50, resizeMode: "contain" }}
            />
            <Text>Click to add back page of id.</Text>
          </Button>
        ) : (
          <Card
            elevation={10}
            style={styles.card}
            onPress={() => showImage(item.file[0].back)}
          >
            <Card.Cover
              resizeMode="contain"
              source={{ uri: "data:image/jpeg;base64," + item.file[0].back }}
            />
            <Card.Actions>
              <Text
                style={styles.retake}
                onPress={() => openCamera(item.name + "(back)")}
              >
                Click here to retake photo...
              </Text>
            </Card.Actions>
          </Card>
        )}
      </View>
    ) : (
      <View>
        <Text style={styles.title}>{item.name}</Text>
        <Card
          elevation={10}
          style={styles.card}
          onPress={() => showImage(item.file)}
        >
          <Card.Cover
            resizeMode="contain"
            source={{ uri: "data:image/jpeg;base64," + item.file }}
          />
          <Card.Actions>
            <Text style={styles.retake} onPress={() => openCamera(item.name)}>
              Click here to retake photo...
            </Text>
          </Card.Actions>
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
      <ProgressDialog
        message="Opening the camera..."
        visible={isShowProgress}
      />
      <Spinner
        visible={isShowProgSubmit}
        color={Colors.base}
        size="large"
        indicatorStyle={{ height: 1 }}
      />
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
          <View style={{ flex: 1, marginBottom: 20 }}>
            <SwipeButton
              containerStyle={styles.submit_button}
              railBorderColor="white"
              railBackgroundColor={"#dcedc8"}
              titleColor={Colors.base}
              railFillBackgroundColor={"#dcedc8"}
              railStyles={{ borderColor: Colors.muted, borderWidth: 1 }}
              thumbIconBorderColor="white"
              thumbIconStyles={{ height: 10 }}
              thumbIconBackgroundColor={Colors.white}
              thumbIconComponent={thumbIconArrow}
              onSwipeSuccess={submit}
              shouldResetAfterSuccess={true}
              resetAfterSuccessAnimDelay={0}
            >
              Swipe to Submit
            </SwipeButton>
          </View>
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
    backgroundColor: "#ddd",
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

    width: (MyWindow.Width / 100) * 92,
  },
  card_none: {
    backgroundColor: '#ddd',
    marginTop: 10,
    marginHorizontal: 2,
    marginBottom: 20,
    borderRadius: 15,
    height: 200,
    width: (MyWindow.Width / 100) * 92,
  },
  title: {
    color: Colors.light.text,
    justifyContent: "flex-start",
    fontFamily: "calibri-light",
    fontSize: 26,
  },
  retake: {
    color: Colors.base,
    fontFamily: "calibri-light",
    fontSize: 16,
    fontWeight: "100",
    left: (MyWindow.Width / 100) * 40,
  },
});
