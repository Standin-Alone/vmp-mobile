import { StackScreenProps } from '@react-navigation/stack';
import React,{useState,useEffect} from 'react';
import { StyleSheet,                  
          View, 
          Image,           
          KeyboardAvoidingView,
          Picker,
          FlatList
         } from 'react-native';
import { Card } from 'react-native-paper';
import { RootStackParamList } from '../types';
import Images from '../constants/Images';
import Colors from '../constants/Colors';
import MyWindow from '../constants/Layout';
import { Input, Block, Button ,Text} from "galio-framework";
import {Footer} from 'native-base';
import axios from 'axios';
import * as ip_config from '../ip_config';
import StepIndicator from 'react-native-step-indicator';
import ViewPager from '@react-native-community/viewpager';
import { ScrollView, State } from 'react-native-gesture-handler';
import {Layout, Select, SelectItem} from '@ui-kitten/components';
import DraggablePanel from 'react-native-draggable-panel';
import {ConfirmDialog} from 'react-native-simple-dialogs';
import * as ImagePicker from 'expo-image-picker';


const labels = ["Claimer Profile", "Add Commodity","Import Document"]

const customStyles = {    
    stepIndicatorSize: 25,
    currentStepIndicatorSize:30,
    separatorStrokeWidth: 1,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: Colors.base,
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: Colors.base,
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: Colors.base,
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: Colors.base,
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: Colors.base,
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    fontWeight:'bold',
    currentStepLabelColor: Colors.base
  }

const commodity_list = ['Chicken','Rice','Egg'];
  
export default function ClaimVoucherScreen({navigation,route} : StackScreenProps <RootStackParamList, 'ClaimVoucher'>) {


  const params= route.params;  
  const [form,setForm] = useState({
      commodity_txt: '',
      unit_txt: '',
      quantity_txt: 1,
      amount_txt: 0.00,
      total_amount_txt: 0.00,
      id:''
  }); // For Edit Commodity Form

  
  const [isDeleteDialog,setDeleteDialog] = useState(false) // Delete Dialog Boolean (Commodity)
  
  const [cardInfo,setCardInfo] = useState({Commodity:'Chicken', Unit:'Kilograms', Quantity:1 ,Amount:0.00 , Total_Amount:0.00 });  // For Add Commodity Form


  const [cardValues, setCardValues] = useState([{Commodity:'', Unit:'', Quantity:1, Amount:0.00, Total_Amount:0.00}])  // For FlatList Element

  const [is_loading,setLoading]  = useState(false); // Loading Boolean

  const [images,setImages] = useState([]); //Images JSON
  const [isDeleteImageDialog,setDeleteImageDialog] = useState(false) // Delete Dialog Boolean (Image)
  const [imageId,setImageId] = useState({id:''});

  var [viewPager,setPage]  = useState(); // View Pager
  var [isShowPanel,setShowPanel]  = useState(false);  // Show Add Commodity Form Panel
  var [isShowEditPanel,setEditShowPanel]  = useState(false);  // Show Edit Commodity Form Panel
  var [currentPage,setCurrentPage]  = useState(1);   // index of current page
  
  
  
  // Set Permission of Camera
  useEffect(() => {
    async () => {      
      const {status} = await ImagePicker.requestCameraPermissionsAsync();
      if(status !== 'granted'){
        alert('Sorry, we need camera permission to make this work.')
      }
    };
  },)


  const claimVoucher = async ()=>{
    setLoading(true);

    axios.post(ip_config.ip_address+'vmp-web/public/api/claim_voucher',form)
    .then((response)=>{
        console.warn(response.data);
        navigation.replace('Root')
        setLoading(false);
    }).catch((error)=>{
    console.warn(error.response.data);
    setLoading(false);
    })  
  }

  var renderViewPage = (data:any) =>{
    return data;
  }

  
  // Show Add Commodity Panel or Form
  const addCommodity = () => {
    setShowPanel(true);           
  }


  // Save Button
  const saveCommodity = () =>{    
    if(cardInfo.Quantity != 0 && cardInfo.Amount != 0){
     setCardValues([...cardValues,{Commodity:cardInfo.Commodity, Unit:cardInfo.Unit, Quantity:cardInfo.Quantity,Amount:cardInfo.Amount,Total_Amount:cardInfo.Total_Amount }]);
     cardInfo.Quantity = 1;
     cardInfo.Amount = 0;
     cardInfo.Total_Amount = 0;
     setShowPanel(false);    
    }else{
      alert('Please enter all the fields.')
    }
  }



  // UPDATE COMMODITY 

  const updateCommodity = (id) => {  
    cardValues.map((item,index)=>{      
      if(index == id){
        if(form.quantity_txt != 0 && form.amount_txt != 0){
          item.Commodity = form.commodity_txt;
          item.Unit = form.unit_txt;
          item.Quantity = form.quantity_txt;
          item.Amount = form.amount_txt;
          item.Total_Amount = form.total_amount_txt;          
          setEditShowPanel(false);   
        }else{
          alert("Please enter all the fields.")
        }
      }    
    })
    
}

// Take Photo Button
const openCamera = ()=>{

  ImagePicker.launchCameraAsync({mediaTypes:ImagePicker.MediaTypeOptions.Images,base64:true,quality:1}).then((response)=>{    
    if(response.cancelled != true){
     setImages([...images,{uri:response.base64}]);    
    }
  })
  
}



const showDeleteImageDialog = ({index,item}) => {
  setDeleteImageDialog(true);    
  setImageId({...imageId,id:index.toLocaleString()});
}

  // THIRD FORM
  const importProofScreen = () =>{
    return(
      <Block>
          
      <ScrollView>


        <FlatList
          data={images}
          renderItem ={({item,index})=>(
            <Card elevation={10} style={styles.card} onPress={()=>alert('sample')}>
              <Card.Title title={'Photo'} />
              <Card.Cover source={{uri:'data:image/jpeg;base64,'+item.uri}} resizeMode={'contain'}/>    
              <Card.Actions >            

                <Button  size="small"                     
                      icon="delete" 
                      iconFamily="material" 
                      iconSize={20} 
                      color="danger" 
                      style={{right:0}}                  
                      onPress={()=>showDeleteImageDialog({index,item})}
                      >Remove</Button>
              </Card.Actions>
            </Card> 
          )}        
        />
         <View style={styles.divider}/>
        <Button
                icon="camera" 
                iconFamily="FontAwesome" 
                iconSize={20}
                round uppercase 
                color={Colors.info} 
                style={styles.add_button}                
                loading={is_loading}
                onPress={openCamera }
                >
                        Take a photo
          </Button>
      </ScrollView>
        


        {/* Delete Confirm Dialog (Commodity) */}
        <ConfirmDialog
            title="Do you want to remove this photo?"
            visible={isDeleteImageDialog}            
            positiveButton={{
                title: "Yes",
                onPress: () => {                  
                  setDeleteImageDialog(false);
                  

                    images.map((item,index)=>{
                        console.warn(index);
                        if(index.toLocaleString() == imageId.id){
                          images.splice(index, Number(imageId.id) +1)
                        }
                        console.warn(images);
                    })
                }
            }} 
            negativeButton={{
              title:'No',
              onPress: () => setDeleteImageDialog(false)
            }}
            />

      </Block>
    )
  }





  const showEditForm = ({index,item}) => {
    setEditShowPanel(true);  
    setForm({...form,
              id:index.toLocaleString(),
              commodity_txt:item.Commodity,
              unit_txt:item.Unit,
              quantity_txt:item.Quantity.toLocaleString(),
              amount_txt:item.Amount.toLocaleString(),            
              total_amount_txt:item.Total_Amount,            
            });    
  }
  

  const showDeleteDialog = ({index,item}) => {
    setDeleteDialog(true);    
    setForm({...form,
              id:index.toLocaleString()                
            });
  }



 // SECOND FORM
 const addCommodityScreen = () =>{
  return(
    
  <Block >
      <View  >
        <ScrollView keyboardShouldPersistTaps='handled'>
                <FlatList
                  
                  data={cardValues}
                  renderItem={({item,index})=>(
                     index == 0 ?  null :
              

                      <Card elevation={10} style={styles.card}>
                      <Card.Title title={index  + '. '+item.Commodity + ' ( ' + item.Quantity + ' ' + item.Unit + ' )'  }    />
                      <Card.Content>
                        <Text style={[styles.title,{color:Colors.danger}]}>Total Amount:  ₱{item.Total_Amount} </Text>
                      </Card.Content>              
                      <Card.Actions >
                      <Button  size="small" 
                                
                                icon="edit" 
                                iconFamily="material" 
                                iconSize={20} 
                                color="warning" 
                                
                                style={{alignSelf:'flex-end',display:'flex'}}
                                onPress={()=>showEditForm({index,item})}
                                >Edit</Button>

                        <Button  size="small" 
                              
                              icon="delete" 
                              iconFamily="material" 
                              iconSize={20} 
                              color="danger" 
                              style={{right:0}}                              
                              onPress={()=>showDeleteDialog({index,item})}
                              >Remove</Button>
                      </Card.Actions>
                    </Card>  
                 
                  )}
                />
            </ScrollView>
        </View>
        <View style={styles.divider}/>
          <Button
                icon="add" 
                iconFamily="FontAwesome" 
                iconSize={20}
                round uppercase 
                color={Colors.info} 
                style={styles.add_button}                
                loading={is_loading}
                onPress={addCommodity}
                >
                        Add Item
          </Button>


          {/* Delete Confirm Dialog (Commodity) */}
          <ConfirmDialog
            title="Do you want to remove this commodity?"
            visible={isDeleteDialog}            
            positiveButton={{
                title: "Yes",
                onPress: () => {                  
                  setDeleteDialog(false);
                    cardValues.map((item,index)=>{
                        if(index.toLocaleString() == form.id){
                          cardValues.splice(index, Number(form.id))
                        }
                    })
                }
            }} 
            negativeButton={{
              title:'No',
              onPress: () => setDeleteDialog(false)
            }}
            />


          {/* Add Commodity Form */}
            <DraggablePanel visible={isShowPanel} onDismiss={()=>{setShowPanel(false)}} initialHeight={600}  >
              <Block   
                width={MyWindow.Width } 
                style={{ marginVertical: 20,zIndex:1}}
                space="between"                                    
                >   

                <Block center>
                  <Text style={styles.title}>Add Commodity</Text>

                </Block>
                
                <Block  >
                  <Text style={styles.commodity}>Select an Commodity</Text>
                  <Picker
                  onValueChange={(value)=>setCardInfo({...cardInfo,Commodity:value})}
                  selectedValue={cardInfo.Commodity == '' ? 'CHICKEN' : cardInfo.Commodity}                 
                  >
                    <Picker.Item label="Chicken" value="CHICKEN" />
                    <Picker.Item label="Egg" value="EGG" />
                    <Picker.Item label="Rice" value="RICE" />
                    
                  </Picker>                        

                  

                  
                </Block>


                <Block  >
                  <Text style={styles.commodity}>Select an Unit</Text>
                  <Picker
                  onValueChange={(value)=>setCardInfo({...cardInfo,Unit:value})}
                  selectedValue={cardInfo.Unit == '' ? 'Kilograms' : cardInfo.Unit}                 
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
                  onChangeText={(value)=>{
                                    setCardInfo({...cardInfo,Quantity:value})
                                    setCardInfo((prevState)=>({...prevState,Total_Amount:prevState.Amount * prevState.Quantity}))
                                  }}
                  value={cardInfo.Quantity.toLocaleString()}
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
                  onChangeText={(value)=>{                          
                                    setCardInfo({...cardInfo,Amount:value}) 
                                    setCardInfo((prevState)=>({...prevState,Total_Amount:prevState.Amount * prevState.Quantity}))
                                    }}
                  value={cardInfo.Amount.toLocaleString()}                                  
                  />

                </Block>

                <Block>
                  <Text style={styles.title,{color:'red'}} h4>Total Amount :  ₱{cardInfo.Total_Amount}</Text>
                </Block>

                <Block  >
                  <Button
                    icon="save" 
                    iconFamily="FontAwesome" 
                    iconSize={20}
                    round uppercase 
                    color={Colors.base} 
                    style={styles.add_button}                
                    loading={is_loading}      
                    onPress={saveCommodity}              
                    >
                      Save
                  </Button>      
                </Block> 

              </Block>
            </DraggablePanel>






             {/* Edit Commodity Form */}

             <DraggablePanel visible={isShowEditPanel} onDismiss={()=>{setEditShowPanel(false)}} initialHeight={600}  >
              <Block   
                width={MyWindow.Width } 
                style={{ marginVertical: 20,zIndex:1}}
                space="between"                        
                >   
                <Block center>
                  <Text style={styles.title}>Edit Commodity</Text>
                  <Input
                      style={{display:'none'}}
                      defaultValue={form.id}
                  />
                </Block>
                
                <Block  >
                  <Text style={styles.commodity}>Select an Commodity</Text>
                  <Picker
                  onValueChange={(value)=>setForm({...form,commodity_txt:value})}
                  selectedValue={form.commodity_txt} 
                  >
                    <Picker.Item label="Chicken" value="CHICKEN" />
                    <Picker.Item label="Egg" value="EGG" />
                    <Picker.Item label="Rice" value="RICE" />
                    
                  </Picker>
                           
                </Block>


                <Block  >
                  <Text style={styles.commodity}>Select an Unit</Text>
                  <Picker
                  onValueChange={(value)=>setForm({...form,unit_txt:value})}
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
                  onChangeText={(value)=>{
                                  setForm({...form,quantity_txt:value})
                                  setForm((prevState)=>({...prevState,total_amount_txt:prevState.amount_txt * prevState.quantity_txt}))                
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
                  onChangeText={(value)=>{
                                  setForm({...form,amount_txt:value})                                  
                                  setForm((prevState)=>({...prevState,total_amount_txt:prevState.amount_txt * prevState.quantity_txt}))                
                                }}                                                                
                  value={form.amount_txt}
                  />

                </Block>
                <Block>
                  <Text style={styles.title,{color:'red'}} h4>Total Amount :  ₱{form.total_amount_txt}</Text>
                </Block>

                <Block  >
                  <Button
                    icon="save" 
                    iconFamily="FontAwesome" 
                    iconSize={20}
                    round uppercase 
                    color={Colors.base} 
                    style={styles.add_button}                
                    loading={is_loading}      

                    onPress={()=>updateCommodity(form.id)}
                    >
                      Update
                  </Button>      
                </Block> 

              </Block>
            </DraggablePanel>
      </Block>
    
  )
}

 
  // FIRST FORM
  const claimerProfileScreen = () =>{
    return(
      <ScrollView >
              <Block space="between"  middle>
                <Card>
                  <Card.Content>
                      <Block  width={MyWindow.Width * 0.8} 
                          space="evenly"          
                          flex={0.9}  
                      >   
                          <Text h7>Reference Number</Text>
                          <Input                 
                              placeholderTextColor={Colors.muted}                 
                              color={Colors.header}
                              style={styles.input}                                 
                              onChangeText={(value)=>{form.username=value}}
                              editable={false}
                              // value={params[0]['RSBSA_CTRL_NO']}
                              />

                      </Block>

                      <Block   width={MyWindow.Width * 0.8} style={{ marginVertical: 20}}
                          space="between"                        
                      >   

                          <Block >
                              <Text h7>Last Name</Text>

                              <Input                            
                                  placeholderTextColor={Colors.muted}                 
                                  color={Colors.header}
                                  style={styles.input}                                 
                                  // value={params[0]['INFO_NAME_L']}
                                  editable={false}
                                  
                              />
                          </Block>                      

                          <Block >
                              <Text h7>First Name</Text>

                              <Input                            
                                  placeholderTextColor={Colors.muted}                 
                                  color={Colors.header}
                                  style={styles.input}                                 
                                  // value={params[0]['INFO_NAME_F']}
                                  editable={false}
                              />
                          </Block>   

                          <Block >
                              <Text h7>Middle Name</Text>

                              <Input                            
                                  placeholderTextColor={Colors.muted}                 
                                  color={Colors.header}
                                  style={styles.input}                                 
                                  // value={params[0]['INFO_NAME_M']}
                                  editable={false}
                              />
                          </Block>   


                          <Block >
                              <Text h7>Extension Name</Text>

                              <Input                            
                                  placeholderTextColor={Colors.muted}                 
                                  color={Colors.header}
                                  style={styles.input}                                 
                                  // value={params[0]['INFO_NAME_EXT']}
                                  editable={false}
                              />
                          </Block>   

                          <Block >
                              <Text h7>Permanent Address</Text>

                              <Input                            
                                  placeholderTextColor={Colors.muted}                 
                                  color={Colors.header}
                                  style={styles.textArea}                                 
                                  // value={params[0]['INFO_PERM_ADD_A'] + ','
                                  //       + params[0]['INFO_PERM_BRGY'] + ',' 
                                  //       + params[0]['INFO_PERM_CITY'] + ',' 
                                  //       + params[0]['INFO_PERM_PROV'] + ',' 
                                  //        }
                                  editable={false}
                              />
                          </Block>   

                          
                          <Block >
                              <Text h7>Province Name</Text>

                              <Input                            
                                  placeholderTextColor={Colors.muted}                 
                                  color={Colors.header}
                                  style={styles.textArea}                                 
                                  // value={params[0]['INFO_PERM_PROV']}
                                  editable={false}
                              />
                          </Block>   

                          
                          <Block >
                              <Text h7>Municipality</Text>

                              <Input                            
                                  placeholderTextColor={Colors.muted}                 
                                  color={Colors.header}
                                  style={styles.textArea}                                 
                                  // value={params[0]['INFO_NAME_REG']}
                                  editable={false}
                              />
                          </Block>   
                      </Block>
                    </Card.Content>
                  </Card>        
                </Block>
              </ScrollView>
    )
  }

  const PAGES = [claimerProfileScreen(),addCommodityScreen(),importProofScreen()];


  var renderLabel = ({position,stepStatus,label,currentPosition})=>{
    
    return (
      
      <Text style = {
        position === currentPosition
        ? styles.stepLabelSelected
        : styles.stepLabel

      }>

        {label}
      </Text>
    )
  }



// STEP FORM BUTTON 


const goToNextPage = async () => {
  
  if(labels.length-1 != currentPage){
    setCurrentPage(currentPage + 1);      
    viewPager.setPage(currentPage + 1)
  }
   
  if(currentPage == 2){

  }

  }

const goBackPage = async () => {
    setCurrentPage(currentPage - 1);      
    viewPager.setPage(currentPage - 1)
    
  }
  

  return (
      
    <View style={styles.container}>
        <KeyboardAvoidingView style={{flex:1}}>                         
                <Block center space="between">                  
                        {/* <Text style={styles.title}>Claimer Profile</Text> */}
                </Block>
                <Block center space="between">                  
                        <Text style={styles.title}>Available Balance: 
                          {/* <Text style={{color:Colors.info}}>₱{params[0].Available_Balance}</Text> */}
                        </Text>
                </Block>
                <StepIndicator
                    customStyles={customStyles}                    
                    stepCount={3}
                    labels={labels}
                    currentPosition={currentPage}                    
                    renderLabel= {renderLabel}                    
                />                

                <ViewPager
                  
                  style={{flexGrow:1}}
                  scrollEnabled={false}
                  ref = {(viewPager:any) =>{setPage(viewPager)}}
                  onPageSelected ={(page:any) => {
                      
                      setCurrentPage(page.nativeEvent.position)
                  }}                    
                >                  
                  {PAGES.map(page=> renderViewPage(page))}

                </ViewPager>
                
             
        </KeyboardAvoidingView>

        <Footer style={{backgroundColor:'white'}}>
       
            <Block middle row> 

                  { currentPage == 1 || currentPage == 2 ? 
                    <Button
                    round uppercase color={Colors.back} style={styles.button}                
                    onPress={goBackPage} loading={is_loading}>
                        Go back
                    </Button>
                    :
                    null                
                  
                  }                    

                    <Button
                    round uppercase color="#66BB6A" style={styles.button}                
                    onPress={goToNextPage} loading={is_loading}>
                      {currentPage == 2 ? 'Submit' : 'Next'}
                    </Button>
            </Block>
        </Footer>
    </View>
      
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBAE14',    
    
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
    marginRight:20,
    height: 50,
    width:MyWindow.Width - 220,
    position:'relative'
  }
  , 
  add_button:{
    
    height: 50,
    width:MyWindow.Width -20,    
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
  },
  input: {    
    borderColor: Colors.border,
    height: 50,
    width:MyWindow.Width - 500,
    fontSize:20,
    backgroundColor: '#ddd',
    opacity:0.8       
  },
  unit_input: {    
    borderColor: Colors.border,
    height: 50,
    width:MyWindow.Width - 500,
    fontSize:20,
    backgroundColor: Colors.light.background,
    opacity:0.8       
  },
  textArea: {    
    borderColor: Colors.border,
    height: 100,
    width:MyWindow.Width - 500,
    fontSize:20,
    backgroundColor: '#ddd'        
  },
  stepLabelSelected:{},
  stepLabel:{
  },
  commodity:{
    marginVertical:10,
    color:Colors.muted
  },
  card:{flex:1,
    borderRadius:5, 
    width:MyWindow.Width - 20, 
    alignSelf:'center',
    marginBottom:20
  },
  divider:{
    marginLeft: 25,
    marginRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
}

});
