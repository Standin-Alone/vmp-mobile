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
import { min } from 'react-native-reanimated';
import DraggablePanel from 'react-native-draggable-panel';
import {ConfirmDialog} from 'react-native-simple-dialogs';


const form = {
  username:'',
  password:''
}

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


  
export default function ClaimVoucherScreen({navigation,route} : StackScreenProps <RootStackParamList, 'ClaimVoucher'>) {


  const params= route.params;  
  const [open,setOpen] = useState(false);
  const [value, setValue] = useState('CHICKEN');
  const [commodities,setCommodities] = useState([]);
  
  const [isDeleteDialog,setDeleteDialog] = useState(false)
  
  const [cardInfo,setCardInfo] = useState([
      {Commodity:'Chicken', Unit:'Kilogram', Quantity:'2',Amount:5.00 }
    ]);

  const [is_loading,setLoading]  = useState(false);
  var [viewPager,setPage]  = useState();
  var [isShowPanel,setShowPanel]  = useState(false);  
  var [currentPage,setCurrentPage]  = useState(1);
  
  

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

  
  const addCommodity = () => {

        setShowPanel(true);
       

  }

  const saveCommodity = () =>{
    setShowPanel(false);

    setCardInfo((prevState)=>[...prevState,{commodity:'Egg', Unit:'kg', Quantity:'2',Amount:5.00 }])

    // setCommodities(prevState=>[...prevState, ( 
    //   <Card>
    //     <Card.Title>Chicken ( 2 Kilogram )      
    //     </Card.Title>
    //     <Card.Divider/>
    //     <Card.FeaturedTitle>
    //       <Text style={{color:Colors.danger}}>Amount: 2,000</Text>
    //       <Block>
    //       <Button  size="small" 
                  
    //               icon="edit" 
    //               iconFamily="material" 
    //               iconSize={10} 
    //               color="warning" 
    //               onlyIcon
    //               style={{alignSelf:'flex-end',fontSize:10}}
    //               >Edit</Button>

    //       <Button  size="small" 
                
    //             icon="delete" 
    //             iconFamily="material" 
    //             iconSize={10} 
    //             color="danger" 
    //             style={{alignSelf:'flex-end'}}
    //             onlyIcon
    //             >Remove</Button>
    //       </Block>
        
    //     </Card.FeaturedTitle>            
    //   </Card>
      
      
    //   )]);
  }

  // THIRD FORM
  const importFileScreen = () =>{
    return(
      <Block>
        <Text>Sample</Text>
      </Block>
    )
  }



  const showPanel = () => {
    if(isShowPanel == true)
    {
      setShowPanel(false)
    }else{
      setShowPanel(true)
    }
  }
 // SECOND FORM
 const addFertilizerScreen = () =>{
  return(
    <ScrollView keyboardShouldPersistTaps='handled'>
      
      <Block>
          
        

          




      <FlatList
        data={cardInfo}
        renderItem={(item:any)=>{
          <Block>
            <Card elevation={1}>
            <Card.Title title={item.Commodity + ' ( ' + item.Quantity + ' ' + item.Unit + ' )'  }    />
            <Card.Content>
              <Text style={[styles.title,{color:Colors.danger}]}>Amount:  {item.Amount} </Text>
            </Card.Content>              
            <Card.Actions >
            <Button  size="small" 
                      
                      icon="edit" 
                      iconFamily="material" 
                      iconSize={10} 
                      color="warning" 
                      onlyIcon
                      style={{alignSelf:'flex-end',display:'flex'}}
                      >Edit</Button>

              <Button  size="small" 
                    
                    icon="delete" 
                    iconFamily="material" 
                    iconSize={10} 
                    color="danger" 
                    style={{right:0}}
                    onlyIcon
                    onPress={()=>setDeleteDialog(true)}
                    >Remove</Button>
            </Card.Actions>
          </Card>  
          </Block>
        }}
        
      />

          
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
                        Add  Item
          </Button>


          {/* Delete COnfirm Dialog */}

          <ConfirmDialog
            title="Do you want to remove this commodity?"
            visible={isDeleteDialog}            
            positiveButton={{
                title: "Yes",
                onPress: () => alert("yes")
            }} 
            negativeButton={{
              title:'No',
              onPress: () => setDeleteDialog(false)
            }}
            ></ConfirmDialog>







          {/* Add Commodity Form */}

            <DraggablePanel visible={isShowPanel} onDismiss={()=>{setShowPanel(false)}} initialHeight={500}  >
              <Block   
                width={MyWindow.Width } 
                style={{ marginVertical: 20,zIndex:1}}
                space="between"                        
                >   
                <Block center>
                  <Text style={styles.title}>Add Commodity Form</Text>

                </Block>
                
                <Block  >
                  <Text style={styles.commodity}>Select an Commodity</Text>
                  <Picker
                  onValueChange={(value)=>setValue(value)}
                  selectedValue={value}                 
                  >
                    <Picker.Item label="Chicken" value="CHICKEN" />
                    <Picker.Item label="Egg" value="EGG" />
                    <Picker.Item label="Rice" value="RICE" />
                    
                  </Picker>
                           
                </Block>


                <Block  >
                  <Text style={styles.commodity}>Select an Unit</Text>
                  <Picker
                  onValueChange={(value)=>setValue(value)}
                  selectedValue={value}                 
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
                  // onChangeText={(value)=>setForm({...form,password:value})}
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
                  // onChangeText={(value)=>setForm({...form,password:value})}
                  />

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
      </Block>
    </ScrollView>
  )
}



 

  // FIRST FORM
  const claimerScreen = () =>{
    return(
      <ScrollView>
              {/* <Block space="between"  middle>
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
                            value={params[0]['RSBSA_CTRL_NO']}
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
                                value={params[0]['INFO_NAME_L']}
                                editable={false}
                                
                            />
                        </Block>                      

                        <Block >
                            <Text h7>First Name</Text>

                            <Input                            
                                placeholderTextColor={Colors.muted}                 
                                color={Colors.header}
                                style={styles.input}                                 
                                value={params[0]['INFO_NAME_F']}
                                editable={false}
                            />
                        </Block>   

                        <Block >
                            <Text h7>Middle Name</Text>

                            <Input                            
                                placeholderTextColor={Colors.muted}                 
                                color={Colors.header}
                                style={styles.input}                                 
                                value={params[0]['INFO_NAME_M']}
                                editable={false}
                            />
                        </Block>   


                        <Block >
                            <Text h7>Extension Name</Text>

                            <Input                            
                                placeholderTextColor={Colors.muted}                 
                                color={Colors.header}
                                style={styles.input}                                 
                                value={params[0]['INFO_NAME_EXT']}
                                editable={false}
                            />
                        </Block>   

                        <Block >
                            <Text h7>Permanent Address</Text>

                            <Input                            
                                placeholderTextColor={Colors.muted}                 
                                color={Colors.header}
                                style={styles.textArea}                                 
                                value={params[0]['INFO_PERM_ADD_A'] + ','
                                      + params[0]['INFO_PERM_BRGY'] + ',' 
                                      + params[0]['INFO_PERM_CITY'] + ',' 
                                      + params[0]['INFO_PERM_PROV'] + ',' 
                                       }
                                editable={false}
                            />
                        </Block>   

                        
                        <Block >
                            <Text h7>Province Name</Text>

                            <Input                            
                                placeholderTextColor={Colors.muted}                 
                                color={Colors.header}
                                style={styles.textArea}                                 
                                value={params[0]['INFO_PERM_PROV']}
                                editable={false}
                            />
                        </Block>   

                        
                        <Block >
                            <Text h7>Municipality</Text>

                            <Input                            
                                placeholderTextColor={Colors.muted}                 
                                color={Colors.header}
                                style={styles.textArea}                                 
                                value={params[0]['INFO_NAME_REG']}
                                editable={false}
                            />
                        </Block>   
                  </Block>        
                </Block> */}
              </ScrollView>
    )
  }

  const PAGES = [claimerScreen(),addFertilizerScreen(),importFileScreen()];


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
                        <Text style={styles.title}>Available Balance: <Text style={{color:Colors.info}}>2,000</Text></Text>
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

                  { currentPage == 1 ? 
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
                        Next
                    </Button>
            </Block>
        </Footer>
    </View>
      
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',    
    
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
  }

});
