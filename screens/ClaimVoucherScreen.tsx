import { StackScreenProps } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  Picker,
  FlatList,
  BackHandler,
  Alert,
  Modal,  
  TextInput
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card } from "react-native-paper";
import { RootStackParamList } from "../types";
import Colors from "../constants/Colors";
import MyWindow from "../constants/Layout";
import { Input, Block, Button, Text, Icon } from "galio-framework";
import { Footer, Body, Item } from "native-base";
import axios from "axios";
import * as ip_config from "../ip_config";
import StepIndicator from "react-native-step-indicator";
import ViewPager from "@react-native-community/viewpager";
import { ScrollView } from "react-native-gesture-handler";
import DraggablePanel from "react-native-draggable-panel";
import { ConfirmDialog } from "react-native-simple-dialogs";
import * as ImagePicker from "expo-image-picker";
import { ProgressDialog } from "react-native-simple-dialogs";
import { Dialog } from "react-native-simple-dialogs";
import NetInfo from "@react-native-community/netinfo";
import ImageViewer from "react-native-image-zoom-viewer";
import * as Location from "expo-location";
import NumberFormat from 'react-number-format';

import Spinner from "react-native-loading-spinner-overlay";

const labels = ["Claimer Profile", "Add Commodity", "Import Document"];

const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 1,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: Colors.base,
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: Colors.base,
  stepStrokeUnFinishedColor: "#aaaaaa",
  separatorFinishedColor: Colors.base,
  separatorUnFinishedColor: "#aaaaaa",
  stepIndicatorFinishedColor: Colors.base,
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: Colors.base,
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "#aaaaaa",
  labelColor: "#999999",
  labelSize: 13,
  fontWeight: "bold",
  currentStepLabelColor: Colors.base,
};

const commodity_list = ["Chicken", "Rice", "Egg"];

export default function ClaimVoucherScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "ClaimVoucher">) {
  const params = route.params;
  const [form, setForm] = useState({
    commodity_txt: "",
    unit_txt: "",
    quantity_txt: 1,
    amount_txt: 0.0,
    total_amount_txt: 0.0,
    id: "",
  }); // For Edit Commodity Form

  const [isShowProgSubmit, setShowProgSubmit] = useState(false); // for progress dialog of submit voucher

  const [isShowModal, setShowModal] = useState(false); // show modal of select document

  const [isShowImage, setShowImage] = useState(false);

  const [imageURI, setImageURI] = useState("");

  const [typeOfDocument, setTypeofDocument] = useState(null);

  const [isDeleteDialog, setDeleteDialog] = useState(false); // Delete Dialog Boolean (Commodity)

  const [cardInfo, setCardInfo] = useState({
    Commodity: "Chicken",
    Unit: "Kilograms",
    Quantity: 1,
    Amount: 0.0,
    Total_Amount: 0.0,
  }); // For Add Commodity Form

  const [cardValues, setCardValues] = useState([
    { Commodity: "", Unit: "", Quantity: 1, Amount: 0.0, Total_Amount: 0.0 },
  ]); // For FlatList Element

  const [is_loading, setLoading] = useState(false); // Loading Boolean

  const [images, setImages] = useState([]); //Images JSON
  const [isDeleteImageDialog, setDeleteImageDialog] = useState(false); // Delete Dialog Boolean (Image)
  const [imageId, setImageId] = useState({ id: "" });

  var [viewPager, setPage] = useState(); // View Pager
  var [isShowPanel, setShowPanel] = useState(false); // Show Add Commodity Form Panel
  var [isShowEditPanel, setEditShowPanel] = useState(false); // Show Edit Commodity Form Panel
  var [currentPage, setCurrentPage] = useState(1); // index of current page

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

  var renderViewPage = (data: any) => {
    return data;
  };

  // Show Add Commodity Panel or Form
  const addCommodity = () => {
    setShowPanel(true);
  };

  // Save Button
  const saveCommodity = () => {
    if (cardInfo.Quantity! >= 0 && cardInfo.Amount! >= 0) {
      setCardValues([
        ...cardValues,
        {
          Commodity: cardInfo.Commodity,
          Unit: cardInfo.Unit,
          Quantity: cardInfo.Quantity,
          Amount: cardInfo.Amount,
          Total_Amount: cardInfo.Total_Amount,
        },
      ]);
      cardInfo.Quantity = 1;
      cardInfo.Amount = 0;
      cardInfo.Total_Amount = 0;
      setShowPanel(false);
    } else {
      alert("Please enter valid the values.");
    }
  };

  // UPDATE COMMODITY
  const updateCommodity = (id) => {
    cardValues.map((item, index) => {
      if (index == id) {
        if (form.quantity_txt! >= 0 && form.amount_txt! >= 0) {
          item.Commodity = form.commodity_txt;
          item.Unit = form.unit_txt;
          item.Quantity = form.quantity_txt;
          item.Amount = form.amount_txt;
          item.Total_Amount = form.total_amount_txt;
          setEditShowPanel(false);
        } else {
          alert("Please enter valid the values.");
        }
      }
    });
  };

  // Take Photo Button
  const openCamera = async () => {
    let location = await Location.getCurrentPositionAsync({});

    ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0,
      exif: true,
      aspect: [8000, 8000],
    }).then(async (response) => {
      console.warn(response.exif);
      if (response.cancelled != true) {
        setImages([
          ...images,
          {
            uri: response.base64,
            latitude: location.latitude,
            longitude: location.longitude,
            typeOfDocument: "",
          },
        ]);
        setShowModal(true);
      }
    });
  };

  const showDeleteImageDialog = ({ index, item }) => {
    setDeleteImageDialog(true);
    setImageId({ ...imageId, id: index.toLocaleString() });
  };

  const closeAddPanel = () => {
    if (isShowPanel != true) {
      setShowPanel(true);
    } else {
      setShowPanel(false);
    }
  };

  const closeEditPanel = () => {
    if (isShowEditPanel != true) {
      setEditShowPanel(true);
    } else {
      setEditShowPanel(false);
    }
  };

  // Select button for type of  document function
  const selectTypeOfDocument = () => {
    setShowModal(false);

    let imagesState = [...images];
    imagesState[images.length - 1].typeOfDocument =
      typeOfDocument == null ? 1 : typeOfDocument;
    setImages(imagesState);
  };

  // show image
  const showImage = (uri: any) => {
    setShowImage(true);
    setImageURI(uri);
  };
  // THIRD FORM
  const importProofScreen = () => {
    return (
      <Block>
        <Button
          icon="camera"
          iconFamily="FontAwesome"
          iconSize={20}
          round
          uppercase
          color={Colors.info}
          style={styles.add_button}
          loading={is_loading}
          onPress={openCamera}
        >
          Take a photo
        </Button>

        <View style={styles.divider} />
        <Body>
          <ScrollView>
            {/* Modal for type of document */}
            <Dialog
              visible={isShowModal}
              title="Select type of document"
              animationType="fade"
            >
              <Block>
                <Picker
                  onValueChange={(value) => setTypeofDocument(value)}
                  selectedValue={typeOfDocument}
                >
                  <Picker.Item label="Farmer with commodity" value="1" />
                  <Picker.Item label="Valid ID with signature" value="2" />
                  <Picker.Item label="Other documents" value="3" />
                </Picker>
              </Block>
              <Block row>
                <Button
                  style={styles.modal_cancel_button}
                  color="danger"
                  onPress={() => {
                    images.map((item, index) => {
                      console.warn(index);
                      if (index == images.length - 1) {
                        images.splice(index, Number(imageId.id) + 1);
                      }
                    });
                    setShowModal({ flag: false });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color={Colors.base}
                  style={styles.modal_select_button}
                  onPress={() => selectTypeOfDocument()}
                >
                  Select
                </Button>
              </Block>
            </Dialog>

            <FlatList
              data={images}
              renderItem={({ item, index }) => (
                <Card
                  elevation={10}
                  style={styles.card}
                  onPress={() => showImage(item.uri)}
                >
                  <Card.Title
                    title={
                      item.typeOfDocument == 1
                        ? "Farmer with commodity"
                        : item.typeOfDocument == 2
                        ? "Valid ID with signature"
                        : item.typeOfDocument == 3
                        ? "Other documents"
                        : null
                    }
                  />
                  <Card.Cover
                    source={{ uri: "data:image/jpeg;base64," + item.uri }}
                    resizeMode={"contain"}
                  />
                  <Card.Actions>
                    <Button
                      size="small"
                      icon="delete"
                      iconFamily="material"
                      iconSize={20}
                      color="danger"
                      style={{ right: 0 }}
                      onPress={() => showDeleteImageDialog({ index, item })}
                    >
                      Remove
                    </Button>
                  </Card.Actions>
                </Card>
              )}
            />
          </ScrollView>

          {/* SHOW IMAGE MODAL */}
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

          {/* Delete Confirm Dialog (Commodity) */}
          <ConfirmDialog
            title="Do you want to remove this photo?"
            visible={isDeleteImageDialog}
            positiveButton={{
              title: "Yes",
              onPress: () => {
                setDeleteImageDialog(false);

                images.map((item, index) => {
                  console.warn(index);
                  if (index.toLocaleString() == imageId.id) {
                    images.splice(index, Number(imageId.id) + 1);
                  }
                  console.warn(images);
                });
              },
            }}
            negativeButton={{
              title: "No",
              onPress: () => setDeleteImageDialog(false),
            }}
          />
        </Body>
      </Block>
    );
  };

  // Commodity buttons function edit and delete

  const showEditForm = ({ index, item }) => {
    setEditShowPanel(true);
    setForm({
      ...form,
      id: index.toLocaleString(),
      commodity_txt: item.Commodity,
      unit_txt: item.Unit,
      quantity_txt: item.Quantity.toLocaleString(),
      amount_txt: item.Amount.toLocaleString(),
      total_amount_txt: item.Total_Amount,
    });
  };

  const showDeleteDialog = ({ index, item }) => {
    setDeleteDialog(true);
    setForm({ ...form, id: index.toLocaleString() });
  };

  // SECOND FORM
  const addCommodityScreen = () => {
    return (
      <Block>
        <Button
          icon="add"
          iconFamily="FontAwesome"
          iconSize={20}
          round
          uppercase
          color={Colors.info}
          style={styles.add_button}
          loading={is_loading}
          onPress={addCommodity}
        >
          Add Item
        </Button>
        <View style={styles.divider} />
        <Body>
          <ScrollView keyboardShouldPersistTaps="handled">
            <FlatList
              data={cardValues}
              renderItem={({ item, index }) =>
                index == 0 ? null : (
                  <Card elevation={10} style={styles.card}>
                    <Card.Title
                      title={
                        index +
                        ". " +
                        item.Commodity +
                        " ( " +
                        item.Quantity +
                        " " +
                        item.Unit +
                        " )"
                      }
                    />
                    <Card.Content>
                      <Text style={[styles.title, { color: Colors.danger }]}>
                        Total Amount: ₱{item.Total_Amount}{" "}
                      </Text>
                    </Card.Content>
                    <Card.Actions>
                      <Button
                        size="small"
                        icon="edit"
                        iconFamily="material"
                        iconSize={20}
                        color="warning"
                        style={{ alignSelf: "flex-end", display: "flex" }}
                        onPress={() => showEditForm({ index, item })}
                      >
                        Edit
                      </Button>

                      <Button
                        size="small"
                        icon="delete"
                        iconFamily="material"
                        iconSize={20}
                        color="danger"
                        style={{ right: 0 }}
                        onPress={() => showDeleteDialog({ index, item })}
                      >
                        Remove
                      </Button>
                    </Card.Actions>
                  </Card>
                )
              }
            />
          </ScrollView>
        </Body>

        {/* Delete Confirm Dialog (Commodity) */}
        <ConfirmDialog
          title="Do you want to remove this commodity?"
          visible={isDeleteDialog}
          positiveButton={{
            title: "Yes",
            onPress: () => {
              setDeleteDialog(false);
              cardValues.map((item, index) => {
                if (index.toLocaleString() == form.id) {
                  cardValues.splice(index, Number(form.id));
                }
              });
            },
          }}
          negativeButton={{
            title: "No",
            onPress: () => setDeleteDialog(false),
          }}
        />

        {/* Add Commodity Form */}
        <DraggablePanel
          visible={isShowPanel}
          onDismiss={() => {
            setShowPanel(false);
          }}
          initialHeight={600}
          animationDuration={200}
        >
          <Block
            width={MyWindow.Width}
            style={{ marginVertical: 20, zIndex: 1 }}
            space="between"
          >
            <Block center>
              <Text style={styles.title}>Add Commodity</Text>
            </Block>
            <View style={styles.commodity_panel}>
              <Block>
                <Text style={styles.commodity}>Select an Commodity</Text>
                <Picker
                  onValueChange={(value) =>
                    setCardInfo({ ...cardInfo, Commodity: value })
                  }
                  selectedValue={
                    cardInfo.Commodity == "" ? "CHICKEN" : cardInfo.Commodity
                  }
                >
                  <Picker.Item label="Chicken" value="CHICKEN" />
                  <Picker.Item label="Egg" value="EGG" />
                  <Picker.Item label="Rice" value="RICE" />
                </Picker>
              </Block>

              <Block>
                <Text style={styles.commodity}>Select an Unit</Text>
                <Picker
                  onValueChange={(value) =>
                    setCardInfo({ ...cardInfo, Unit: value })
                  }
                  selectedValue={
                    cardInfo.Unit == "" ? "Kilograms" : cardInfo.Unit
                  }
                >
                  <Picker.Item label="Kilograms" value="Kilograms" />
                  <Picker.Item label="Pieces" value="Pieces" />
                  <Picker.Item label="Sacks" value="Sacks" />
                  <Picker.Item label="Trays" value="Trays" />
                </Picker>
              </Block>

              <Block>
                <Input
                  placeholder="0"
                  color={Colors.muted}
                  style={styles.unit_input}
                  help="Quantity"
                  rounded
                  type="numeric"
                  onChangeText={(value) => {
                    setCardInfo({ ...cardInfo, Quantity: value });
                    setCardInfo((prevState) => ({
                      ...prevState,
                      Total_Amount: prevState.Amount * prevState.Quantity,
                    }));
                  }}
                  value={cardInfo.Quantity.toLocaleString()}
                />
              </Block>

              <Block>                
              
                

                <NumberFormat
                    value={cardInfo.Amount}
                    displayType={'text'}
                    thousandSeparator={true}
                    
                    renderText = {(values)=>{
                      
                      return (
                        <Input
                        placeholder="0"
                        color={Colors.muted}
                        style={styles.unit_input}
                        help="Amount"
                        rounded
                        type="numeric"
                        onChangeText={(value) => {
                          setCardInfo({ ...cardInfo, Amount:value});
                          setCardInfo((prevState) => ({
                            ...prevState,
                            Total_Amount: prevState.Amount * prevState.Quantity,
                          }));
                        }}
                        value={values}
                      />
                      )
                    }}
                
                />


                {/* old */}

                {/* <Input
                    placeholder="0"
                    color={Colors.muted}
                    style={styles.unit_input}
                    help="Amount"
                    rounded
                    type="numeric"
                    onChangeText={(value) => {
                      setCardInfo({ ...cardInfo, Amount:value});
                      setCardInfo((prevState) => ({
                        ...prevState,
                        Total_Amount: prevState.Amount * prevState.Quantity,
                      }));
                    }}
                    value={cardInfo.Amount.toLocaleString()}
                  /> */}
              

                
              </Block>

              <Block>
                <Text style={(styles.title, { color: "red" })} h4>
                  Total Amount : PHP{cardInfo.Total_Amount}
                </Text>
                
                
              </Block>

              <Block>
                <Button
                  icon="save"
                  iconFamily="FontAwesome"
                  iconSize={20}
                  round
                  uppercase
                  color={Colors.base}
                  style={styles.panel_save_button}
                  loading={is_loading}
                  onPress={saveCommodity}
                >
                  Save
                </Button>

                <Button
                  icon="close"
                  iconFamily="FontAwesome"
                  iconSize={20}
                  iconColor={Colors.dark.text}
                  round
                  uppercase
                  style={styles.close_button}
                  loading={is_loading}
                  onPress={closeAddPanel}
                >
                  Close
                </Button>
              </Block>
            </View>
          </Block>
        </DraggablePanel>

        {/* Edit Commodity Form */}

        <DraggablePanel
          visible={isShowEditPanel}
          onDismiss={() => {
            setEditShowPanel(false);
          }}
          initialHeight={600}
          animationDuration={200}
        >
          <Block
            width={MyWindow.Width}
            style={{ marginVertical: 10, zIndex: 1 }}
            space="between"
          >
            <Block center>
              <Text style={styles.title}>Edit Commodity</Text>
              <Input style={{ display: "none" }} defaultValue={form.id} />
            </Block>
            <View style={styles.commodity_panel}>
              <Block>
                <Text style={styles.commodity}>Select an Commodity</Text>
                <Picker
                  onValueChange={(value) =>
                    setForm({ ...form, commodity_txt: value })
                  }
                  selectedValue={form.commodity_txt}
                >
                  <Picker.Item label="Chicken" value="CHICKEN" />
                  <Picker.Item label="Egg" value="EGG" />
                  <Picker.Item label="Rice" value="RICE" />
                </Picker>
              </Block>

              <Block>
                <Text style={styles.commodity}>Select an Unit</Text>
                <Picker
                  onValueChange={(value) =>
                    setForm({ ...form, unit_txt: value })
                  }
                  selectedValue={form.unit_txt}
                >
                  <Picker.Item label="Kilograms" value="Kilograms" />
                  <Picker.Item label="Pieces" value="Pieces" />
                  <Picker.Item label="Sacks" value="Sacks" />
                  <Picker.Item label="Trays" value="Trays" />
                </Picker>
              </Block>

              <Block>
                <Input
                  placeholder="0"
                  color={Colors.muted}
                  style={styles.unit_input}
                  help="Quantity"
                  rounded
                  type="numeric"
                  onChangeText={(value) => {
                    setForm({ ...form, quantity_txt: value });
                    setForm((prevState) => ({
                      ...prevState,
                      total_amount_txt:
                        prevState.amount_txt * prevState.quantity_txt,
                    }));
                  }}
                  value={form.quantity_txt}
                />
              </Block>

              <Block>
                <Input
                  placeholder="0"
                  color={Colors.muted}
                  style={styles.unit_input}
                  help="Amount"
                  rounded
                  type="decimal-pad"
                  onChangeText={(value) => {
                    setForm({ ...form, amount_txt: value });
                    setForm((prevState) => ({
                      ...prevState,
                      total_amount_txt:
                        prevState.amount_txt * prevState.quantity_txt,
                    }));
                  }}
                  value={form.amount_txt}
                />
              </Block>
              <Block>
                <Text style={(styles.title, { color: "red" })} h4>
                  Total Amount : ₱{form.total_amount_txt}
                </Text>
              </Block>

              <Block>
                <Button
                  icon="update"
                  iconFamily="FontAwesome"
                  iconSize={20}
                  round
                  uppercase
                  color={Colors.base}
                  style={styles.panel_save_button}
                  loading={is_loading}
                  onPress={() => updateCommodity(form.id)}
                >
                  Update
                </Button>

                <Button
                  icon="close"
                  iconFamily="FontAwesome"
                  iconSize={20}
                  iconColor={Colors.dark.text}
                  round
                  uppercase
                  style={styles.close_button}
                  loading={is_loading}
                  onPress={closeEditPanel}
                >
                  Close
                </Button>
              </Block>
            </View>
          </Block>
        </DraggablePanel>
      </Block>
    );
  };

  // FIRST FORM
  const claimerProfileScreen = () => {
    return (
      <ScrollView>
        <Block space="between" middle>
          <Card>
            <Card.Content>
              <Block width={MyWindow.Width * 0.8} space="evenly" flex={0.9}>
                <Text h7>Reference Number</Text>
                <Input
                  placeholderTextColor={Colors.muted}
                  color={Colors.header}
                  style={styles.input}
                  onChangeText={(value) => {
                    form.username = value;
                  }}
                  editable={false}
                  value={params[0]["REFERENCE_NO"]}
                />
              </Block>

              <Block
                width={MyWindow.Width * 0.8}
                style={{ marginVertical: 20 }}
                space="between"
              >
                <Block>
                  <Text h7>Last Name</Text>

                  <Input
                    placeholderTextColor={Colors.muted}
                    color={Colors.header}
                    style={styles.input}
                    value={params[0]["INFO_NAME_L"]}
                    editable={false}
                  />
                </Block>

                <Block>
                  <Text h7>First Name</Text>

                  <Input
                    placeholderTextColor={Colors.muted}
                    color={Colors.header}
                    style={styles.input}
                    value={params[0]["INFO_NAME_F"]}
                    editable={false}
                  />
                </Block>

                <Block>
                  <Text h7>Middle Name</Text>

                  <Input
                    placeholderTextColor={Colors.muted}
                    color={Colors.header}
                    style={styles.input}
                    value={params[0]["INFO_NAME_M"]}
                    editable={false}
                  />
                </Block>

                <Block>
                  <Text h7>Extension Name</Text>

                  <Input
                    placeholderTextColor={Colors.muted}
                    color={Colors.header}
                    style={styles.input}
                    value={params[0]["INFO_NAME_EXT"]}
                    editable={false}
                  />
                </Block>

                <Block>
                  <Text h7>Permanent Address</Text>

                  <Input
                    placeholderTextColor={Colors.muted}
                    color={Colors.header}
                    style={styles.textArea}
                    value={
                      (params[0]["INFO_PERM_ADD_A"] == null
                        ? " "
                        : params[0]["INFO_PERM_ADD_A"] + ", ") +
                      params[0]["INFO_PERM_BRGY"] +
                      ", " +
                      params[0]["INFO_PERM_CITY"] +
                      ", " +
                      params[0]["INFO_PERM_PROV"]
                    }
                    editable={false}
                  />
                </Block>

                <Block>
                  <Text h7>Province Name</Text>

                  <Input
                    placeholderTextColor={Colors.muted}
                    color={Colors.header}
                    style={styles.textArea}
                    value={params[0]["INFO_PERM_PROV"]}
                    editable={false}
                  />
                </Block>

                <Block>
                  <Text h7>Municipality</Text>

                  <Input
                    placeholderTextColor={Colors.muted}
                    color={Colors.header}
                    style={styles.textArea}
                    value={params[0]["INFO_NAME_REG"]}
                    editable={false}
                  />
                </Block>
              </Block>
            </Card.Content>
          </Card>
        </Block>
      </ScrollView>
    );
  };

  const PAGES = [
    claimerProfileScreen(),
    addCommodityScreen(),
    importProofScreen(),
  ];

  var renderLabel = ({ position, stepStatus, label, currentPosition }) => {
    return (
      <Text
        style={
          position === currentPosition
            ? styles.stepLabelSelected
            : styles.stepLabel
        }
      >
        {label}
      </Text>
    );
  };

  // FINAL SUBMIT VOUCHER
  const submit_voucher = async () => {
    let location = await Location.getCurrentPositionAsync({});
    // validate current balance
    var checkTotalAmount = 0;
    var currentBalance = params[0].Available_Balance;
    var computeBalance = 0;

    //  ADD COMMODITY NEXT BUTTON
    if (currentPage == 1) {
      var checkCommodity = cardValues.some((item) => item.Commodity != "");
      // Calculate total amount
      cardValues.map((item: any) => {
        checkTotalAmount = checkTotalAmount + item.Total_Amount;
      });

      computeBalance = currentBalance - checkTotalAmount;

      if (checkCommodity == false) {
        Alert.alert("Message", "Please add commodities.");
      } else if (computeBalance >= 0 && checkCommodity == true) {
        setCurrentPage(currentPage + 1);
        viewPager.setPage(currentPage + 1);
      } else {
        Alert.alert(
          "Message",
          "The total amount of commodities exceed in your current balance."
        );
      }
    }

    //  IMPORT DOCUMENT SUBMIT BUTTON
    if (currentPage == 2) {
      var fd = new FormData();
      setShowProgSubmit(true);

      var checkFarmerWithCommodity = images.some(
        (item) => item.typeOfDocument == 1
      );
      var checkValidID = images.some((item) => item.typeOfDocument == 2);
      var lat = location.coords.latitude;
      var long = location.coords.longitude;
      const supplier_id = await AsyncStorage.getItem("supplier_id");
      console.log(supplier_id);
      fd.append("reference_num", params[0].REFERENCE_NO);
      fd.append("supplier_id", supplier_id);
      fd.append("latitude", lat);
      fd.append("longitude", long);

      //form append commodities
      cardValues.map((item: any) => {
        if (item.Commodity != "") {
          fd.append(
            "commodities[]",
            JSON.stringify({
              commodity: item.Commodity,
              unit: item.Unit,
              quantity: item.Quantity,
              amount: item.Amount,
              total_amount: item.Total_Amount,
            })
          );
        }
      });

      // form append images
      images.map((item, index) => {
        fd.append("image" + index, "data:image/jpeg;base64," + item.uri);
        fd.append("type" + index, "image/jpeg");
        fd.append("document_type" + index, item.typeOfDocument);
      });

      fd.append("images_count", images.length.toLocaleString());

      NetInfo.fetch().then((response: any) => {
        if (response.isConnected) {
          if (checkFarmerWithCommodity && checkValidID) {
            if (lat != undefined && long != undefined) {
              axios
                .post(
                  ip_config.ip_address + "vmp-web/public/api/submit-voucher",
                  fd,
                  {
                    headers: {
                      "content-type": "multipart/form-data",
                      accept: "application/json",
                    },
                  }
                )
                .then((response) => {
                  let message = response.data[0]["Message"];

                  if (message == "true") {
                    setShowProgSubmit(false);
                    Alert.alert("Message", "Successful! Voucher redeemed.");

                    navigation.goBack();
                  } else {
                    alert("Error!Something went wrong.");
                    console.warn(response);
                    setShowProgSubmit(false);
                  }
                })
                .catch((error) => {
                  setShowProgSubmit(false);
                  console.warn(error.response);
                });
            } else {
              Alert.alert("Message", "Please turn on your location first");
            }
          } else {
            setShowProgSubmit(false);
            Alert.alert(
              "Message",
              "Please add pictures of valid ID and picture of farmer with commodity. "
            );
          }
        } else {
          setShowProgSubmit(false);
          alert("No internet Connection");
        }
      });
    }
  };

  // STEP FORM BUTTON

  const goToNextPage = async () => {
    if (currentPage == 0) {
      if (labels.length - 1 != currentPage) {
        setCurrentPage(currentPage + 1);
        viewPager.setPage(currentPage + 1);
      }
    }

    submit_voucher();
  };

  const goBackPage = async () => {
    setCurrentPage(currentPage - 1);
    viewPager.setPage(currentPage - 1);
  };

  return (
    <View style={styles.container}>
      <Spinner visible={isShowProgSubmit} color={Colors.base} />
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <Block center space="between">
          {/* <Text style={styles.title}>Claimer Profile</Text> */}
        </Block>
        <Block center space="between">
          <Text style={styles.title}>
            Available Balance:
            <Text style={{ color: Colors.info }}>
              PHP{params[0].Available_Balance}
            </Text>
          </Text>
        </Block>
        <StepIndicator
          customStyles={customStyles}
          stepCount={3}
          labels={labels}
          currentPosition={currentPage}
          renderLabel={renderLabel}
        />

        <ViewPager
          style={{ flexGrow: 1 }}
          scrollEnabled={false}
          ref={(viewPager: any) => {
            setPage(viewPager);
          }}
          onPageSelected={(page: any) => {
            setCurrentPage(page.nativeEvent.position);
          }}
        >
          {PAGES.map((page) => renderViewPage(page))}
        </ViewPager>
      </KeyboardAvoidingView>

      <Footer style={{ backgroundColor: "white" }}>
        <Block middle row>
          {currentPage == 1 || currentPage == 2 ? (
            <Button
              round
              uppercase
              color={Colors.base}
              style={styles.go_back_button}
              onPress={goBackPage}
              loading={is_loading}
            >
              Go Back
            </Button>
          ) : null}

          <Button
            round
            uppercase
            color="#66BB6A"
            style={styles.button}
            onPress={goToNextPage}
            loading={is_loading}
          >
            {currentPage == 2 ? "Submit" : "Next"}
          </Button>
        </Block>
      </Footer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  second_container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    borderTopEndRadius: 40,
    borderTopStartRadius: 40,
    resizeMode: "contain",
    top: 150,
    justifyContent: "center",
  },
  form_container: {
    alignItems: "center",
    marginTop: 200,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 40,
    left: MyWindow.Width / 2 - 100,
    top: MyWindow.Height / 2 - 465,
    resizeMode: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    marginRight: 20,
    height: 50,
    width: MyWindow.Width - 220,
    position: "relative",
  },
  go_back_button: {
    marginRight: 20,
    height: 50,
    width: MyWindow.Width - 220,
    position: "relative",
  },
  add_button: {
    height: 50,
    width: MyWindow.Width - 20,
  },
  panel_save_button: {
    height: 50,
    width: MyWindow.Width - 55,
  },
  close_button: {
    height: 50,
    width: MyWindow.Width - 55,
  },
  input: {
    borderColor: Colors.border,
    height: 50,
    width: MyWindow.Width - 500,
    fontSize: 20,
    backgroundColor: "#ddd",
    opacity: 0.8,
  },
  unit_input: {
    borderColor: Colors.border,
    height: 50,
    width: MyWindow.Width - 500,
    fontSize: 20,
    backgroundColor: Colors.light.background,
    opacity: 0.8,
  },
  textArea: {
    borderColor: Colors.border,
    height: 100,
    width: MyWindow.Width - 500,
    fontSize: 20,
    backgroundColor: "#ddd",
  },
  stepLabelSelected: {},
  stepLabel: {},
  commodity: {
    marginVertical: 10,
    color: Colors.muted,
  },
  commodity_panel: {
    marginLeft: MyWindow.Width - 370,
    marginRight: MyWindow.Width - 370,
  },
  card: {
    flex: 1,
    borderRadius: 5,
    width: MyWindow.Width - 20,
    alignSelf: "center",
    marginBottom: 20,
  },
  divider: {
    marginLeft: 25,
    marginRight: 20,
    marginBottom: 20,
    paddingTop: 5,
    paddingBottom: 10,
    borderBottomColor: "#000",
    borderBottomWidth: 1,
  },
  modal_select_button: {
    marginLeft: 50,
    width: 100,
  },
  modal_cancel_button: {
    marginRight: -20,
    width: 100,
  },
  price:{
    borderWidth:1,
    borderColor:'#ddd',
    borderRadius:20,
    padding:10,
    backgroundColor:Colors.light.background
  }
});
