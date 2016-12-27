'use strict';
import React, { Component } from 'react';

import {
  StyleSheet,
  Image,
  Text,
  View,
  TextInput,
  AsyncStorage,
  TouchableWithoutFeedback,
  ScrollView, 
  Platform,
  NetInfo,
  InteractionManager,
  findNodeHandle,
} from 'react-native';

import {NativeModules, Dimensions} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import DatePicker from 'react-native-datepicker';
import { SegmentedControls } from 'react-native-radio-buttons'
import {requestPermission, checkPermission} from 'react-native-android-permissions';
import Button from 'react-native-button';
import Modal from 'react-native-modalbox';
import Toast from 'react-native-root-toast';
import Spinner from 'react-native-spinkit';
import BackgroundTimer from 'react-native-background-timer';
//import Popup from 'react-native-popup';

import Home from './Home.js';

let Global = require('../Global');
var RCTUIManager = require('NativeModules').UIManager;
var REQUEST_URL = 'http://thriveful.leslie-works.cu.cc/setData.php';

let img_t3=require('../../resource/images/reg_t3.png');
let reg_cam=require('../../resource/images/reg_cam.png');
let img_next=require('../../resource/images/reg_done.png');

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var c1=false;

var saveInfoInterval;
var req;

let img_btn = [
        [require('../../resource/images/reg_girl_btn.png'),require('../../resource/images/reg_girl_btn_o.png')],
        [require('../../resource/images/reg_boy_btn.png'),require('../../resource/images/reg_boy_btn_o.png')],        
    ];

export default class Register2 extends Component {
    constructor(props){
        super(props);
        this.state = {
            img_btn : 0,
            date:null,
            baby:'',
            dob:'',
        }
    }

    componentDidMount() {
        Global.checkNetwork();
        /*
        AsyncStorage.getItem("babyPhoto").then((value) => {
            this.setState({babyPhoto: value});
            Global.babyPhoto=value;
        }).done();
        */
        Global.baby="";
        Global.dob="";
        Global.babyRole="";
    }

    saveData(s, data){
        switch (s) {
            case "baby":
                Global.baby=data;
                break;
            case "dob":                
                this.setState({date: data});
                Global.dob=data;
                break;
            default:
                break;
        }
        AsyncStorage.setItem(s, data);
    }

    onInputFocus(refName) {
        setTimeout(() => {
            let scrollResponder = this.refs.scrollView.getScrollResponder()
            scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
            findNodeHandle(this.refs[refName]),
            20, // additionalOffset
            true
            )
        }, 100)
    }

    onSnbmit(val){
        console.log("onnSnbmit"+val);
        if(val == 2)
        {
            this.refs[val].onPressDate();
        }
        this.resetWindowHeight();
    }

    save(){
        if(Global.babyRole.length<=0){
            alert("Is Girl or Boy?");
            return false;
        }
        if(Global.baby.length<=0){
            alert("Your baby name?");
            return false;
        }
        if(Global.dob.length<=0){
            alert("Date of birth?");
            return false;
        }        
        InteractionManager.runAfterInteractions(() => {
            this.refs.modal2.open();
            this.sendData();
        });
    }

    timeLoopSaveInfo(){
        InteractionManager.runAfterInteractions(() => {
            saveInfoInterval = BackgroundTimer.setInterval(() => {  
                 BackgroundTimer.clearInterval(saveInfoInterval);
                 //console.log("saveInfoInterval");
                 this.sendData();
            }, 10000);  
        });
    }

    sendData(){  
        //console.log("sendData");
        NetInfo.isConnected.fetch().then().done(() => {
            if(Global.getConnected()){
                req = fetch(REQUEST_URL, 
                    { method: "POST",
                      headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                         },
                       body: JSON.stringify(
                        {
                            username:Global.username,
                            openid:Global.openid,
                            pw:Global.pw,
                            openidType:Global.openidType,
                            userRole: Global.userRole, 
                            name: Global.name, 
                            age: Global.age,
                            /*
                            planning: Global.planning, 
                            expecting: Global.expecting, 
                            already: Global.already,
                            */
                            choose: Global.choose,
                            photo: Global.photo, 
                            baby: Global.baby, 
                            dob: Global.dob,
                            babyRole: Global.babyRole, 
                            babyPhoto: Global.babyPhoto,
                        }),
                      deadline:Global.getDeadline(),
                    })
                .then((response) => response.json())
                .then((responseData) => {
                    BackgroundTimer.clearInterval(saveInfoInterval);
                    //console.log("responseData:"+responseData.status);
                    //console.log("responseDataError:"+responseData.error);
                    //console.log("sql1:"+responseData.sql1);
                    //console.log("sql2:"+responseData.sql2);
                    this.refs.modal2.close();
                    
                    if(responseData.status=="succeed"){
                        AsyncStorage.setItem("username", ""+Global.username);
                        AsyncStorage.setItem("openid", ""+Global.openid);
                        AsyncStorage.setItem("pw", ""+Global.pw);
                        AsyncStorage.setItem("openidType", ""+Global.openidType);
                        AsyncStorage.setItem("userID", ""+responseData.userid);
                        AsyncStorage.setItem("badyID", ""+responseData.babyid);
                        this.refs.modal2.close();
                        console.log("succeed login");
                        if(Global.navigator) {
                            Global.navigator.replace({
                                name: 'Home',
                                component: Home,
                            })
                        }
                    } else {
                        this.showToast("Update Error! Please call our Admin.");
                    }
                    /*
                    if(Global.navigator) {
                        Global.navigator.replace({
                            name: 'Home',
                            component: Home,
                        })
                    }
                    */
                }).catch((error) => {
                    console.log(error);
                });
            } else {
                //console.log("responseData:"+responseData);
                this.refs.modal2.close();
                alert("No network access. Your data can't update.")
                //this.timeLoopSaveInfo();
                //this.showToast("Error! Please check to make sure your phone is connected to a network in order for app to update properly.");
            }
        });
    }

    toSetPhoto(){
        return(
            <View style={styles.photoWrapper}>
            <TouchableWithoutFeedback onPress={()=>this.openModal1()}>
            <View style={styles.photorow}>
                {this.rendPhotoText()}
            </View>
            </TouchableWithoutFeedback>
            </View>
        )
    }

    rendPhotoText(){
        if(this.state.babyPhoto==null)
        return(
            <Image style={{height:Global.imgScale(50),margin:Global.imgScale(5),
                                justifyContent:'center'}}
                            resizeMode='contain'
                            source={reg_cam}
                        />
        );
        else
        return (
            <Image
            style={{height:Global.imgScale(140),width:Global.imgScale(140),borderRadius:Global.imgScale(100),
                                justifyContent:'center'}}
            resizeMode='contain'
            source={{uri: this.state.babyPhoto}}
            />
        );       
    }

    onPickCamera(){
        if(Platform.OS='ios'){
            this.pickSingleWithCamera(true);
        }else{
            if(c1==false){
                checkPermission("android.permission.WRITE_EXTERNAL_STORAGE").then((result) => {
                    //console.log("Already Granted!");
                    //console.log(result);
                    this.pickSingleWithCamera(true);
                    c1=true;
                }, (result) => {
                    //console.log("Not Granted!");
                    //console.log(result);
                    requestPermission("android.permission.WRITE_EXTERNAL_STORAGE").then((result) => {
                        //console.log("Granted!", result);
                        this.pickSingleWithCamera(true);
                        c1=true;
                        // now you can set the listenner to watch the user geo location
                    }, (result) => {
                        //console.log("Not Granted!");
                    // console.log(result);
                    });
                });
            }else{
                this.pickSingleWithCamera(true);
            }
        }
    }

    pickSingleWithCamera(cropping) {        
        ImagePicker.openCamera({
        width: 400,
        height: 400,        
        mime:'image/jpeg',
        cropping: cropping,
        includeBase64: true
        }).then(image => {
            //console.log('received image', image.path);
            this.setState({
                babyPhoto: `data:${image.mime};base64,`+ image.data,
            });
            AsyncStorage.setItem("babyPhoto", `data:${image.mime};base64,`+ image.data);
            this.refs.modal1.close();
            Global.babyPhoto=`data:${image.mime};base64,`+ image.data;
            ImagePicker.clean().then(() => {
                //console.log('removed all tmp images from tmp directory');
                }).catch(e => {
                alert(e);
            });
        }).catch(e => alert(e));
    }

    pickSingleBase64(cropit) {
        Global.setPermission();
        ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: cropit,
        includeBase64: true
        }).then(image => {
        //console.log('received image', image);
        this.setState({
            babyPhoto: `data:${image.mime};base64,`+ image.data,
        });
        AsyncStorage.setItem("babyPhoto", `data:${image.mime};base64,`+ image.data);
        this.refs.modal1.close();
        Global.babyPhoto=`data:${image.mime};base64,`+ image.data;
        ImagePicker.clean().then(() => {
        //console.log('removed all tmp images from tmp directory');
        }).catch(e => {
        alert(e);
        });
        }).catch(e => {});
    }

    onClick(val){
        this.setState({img_btn: val});
        if(val==1){
            Global.babyRole="Girl";
        }else if(val==2){
            Global.babyRole="Boy";
        }
       //this.refs.modal1.open();
    }

    tackPhoto(){
        this.refs.modal1.open();
    }
    

    render() {
        return(
            <Image 
                style={{width:deviceWidth+5,height:deviceHeight+5}}
                source={require('../../resource/images/bg_01.png')}
            >
             <ScrollView  keyboardDismissMode="on-drag" ref="scrollView" style={styles.wrapper}>
                <View style={{alignItems:'center', marginTop:Global.imgScale(10)}}>
                    <Image style={{height:Global.imgScale(40)}}
                        resizeMode='contain'
                        source={img_t3}
                    />
                </View>
                <TouchableWithoutFeedback onPress={()=>this.tackPhoto()}>
                <View style={{height:Global.imgScale(150),width:Global.imgScale(150),alignSelf:'center',
                            marginTop:Global.imgScale(30), marginBottom:Global.imgScale(30),
                            backgroundColor:'rgba(255,255,255,0.3)',borderRadius:Global.imgScale(100),}}>               
                    <View style={{alignItems:'center',justifyContent:'center',flex:1}}>
                        {this.rendPhotoText()}
                    </View>
                </View>
                </TouchableWithoutFeedback>    
                <View style={{}}>
                    <View style={{flexDirection:'row',justifyContent:'center',}}>
                        <TouchableWithoutFeedback onPress={()=>this.onClick(1)}>
                            <Image style={{height:Global.imgScale(65),margin:Global.imgScale(5),marginBottom:Global.imgScale(30)}}
                                resizeMode='contain'
                                source={this.state.img_btn==1?img_btn[0][0]:img_btn[0][1]}
                            />
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>this.onClick(2)}>
                            <Image style={{height:Global.imgScale(65),margin:Global.imgScale(5),marginBottom:Global.imgScale(30)}}
                                resizeMode='contain'
                                source={this.state.img_btn==2?img_btn[1][0]:img_btn[1][1]}
                            />
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.textRow}>
                        <TextInput
                            style={styles.textFiled}
                            onChangeText={(text) => this.saveData("baby", text)}
                            placeholder="Name"
                            placeholderTextColor={'#fff'}
                            ref="1"
                            onSubmitEditing={()=>this.onSnbmit(2)}
                            onFocus={()=>this.onInputFocus(1)}
                            
                        />
                    </View>
                    <View style={styles.textRow}>
                        <DatePicker
                            style={styles.text2Filed}
                            date={this.state.date}
                            customStyles={{
                                dateText: {
                                    fontSize: Global.fontscale1(34),
                                    color:'#fff',
                                    textAlign:'center',                                    
                                    justifyContent:'center',
                                    borderWidth: 0,
                                },
                                placeholderText: {
                                    fontSize: Global.fontscale1(34),
                                    color:'#fff',
                                    textAlign:'center',
                                    justifyContent:'center',
                                },
                                dateInput: {
                                    borderWidth: 0,
                                },
                            }}
                            mode="date"
                            placeholder="Date of birth"
                            placeholderTextColor={'#fff'}
                            format="YYYY-MM-DD"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"                   
                            onDateChange={(date) => this.saveData("dob", date)}
                            showIcon={false}
                            ref="2"
                        />
                    </View>                    
                </View>                
            <Modal 
                    style={[styles.modal, styles.modal1]} 
                    position={"center"} 
                    ref={"modal1"} 
                    isDisabled={this.state.isDisabled}
                    backdropPressToClose={true}
                    swipeToClose={true}
                >                
                <Button onPress={()=>this.onPickCamera(true)}  
                        containerStyle={styles.PopbtnContainer}
                        style={styles.Popbtn}>Take a photo</Button>
                <Button onPress={()=>this.pickSingleBase64(true)}  
                        containerStyle={styles.PopbtnContainer}
                        style={styles.Popbtn}>Choose a photo</Button>                
            </Modal>  
            <Modal 
                style={styles.modal2} 
                position={"center"} 
                ref={"modal2"} 
                isDisabled={this.state.isDisabled}
                backdropPressToClose={false}
                swipeToClose={false}
            > 
                <Spinner style={styles.spinner} isVisible={true} size={100} type={'Wave'} color={"#fff"}/>
            </Modal>        
            </ScrollView>
            <View style={{position:'absolute',right:0,left:0,bottom:Global.imgScale(40),flexDirection:'row',}}>
                <View style={{position:'absolute',right:0,left:0,justifyContent:'center',alignItems:'center',flex:1}}>
                    <Text style={styles.bottomText}>3 out of 3</Text>
                </View>
                <View style={{justifyContent:'flex-end',alignItems: 'flex-end',flex:1}}>
                    <TouchableWithoutFeedback onPress={()=>this.save()} >
                    <Image style={{height:Global.imgScale(40)}}
                        resizeMode='contain'
                        source={img_next}
                    />                    
                </TouchableWithoutFeedback>
                </View>
            </View>
            </Image>
        )
    }

    resetWindowHeight() {
        let scrollView = this.refs.scrollView
        let screenHeight = Dimensions.get('window').height
        setTimeout(() => {
            RCTUIManager.measure(scrollView.getInnerViewNode(), (...data) => { 
            // data[3] is the height of the ScrollView component with content.
            scrollView.scrollTo({ y: data[3] - (screenHeight-Global.imgScale(90)), animated: true })
            })
        }, 100)
    }

    showToast(msg){
      Toast.show(msg, {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          onShow: () => {
              // calls on toast\`s appear animation start
          },
          onShown: () => {
              // calls on toast\`s appear animation end.
          },
          onHide: () => {
              // calls on toast\`s hide animation start.
          },
          onHidden: () => {
              // calls on toast\`s hide animation end.
          }
      });
    }
}

var styles = StyleSheet.create({
    wrapper:{
        flex: 1,
    },
    Container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent:'center',
    },
    textRow:{

    },
    textFiled:{
        margin:Global.imgScale(5),
        marginLeft:Global.imgScale(20),
        marginRight:Global.imgScale(20),
        fontSize: Global.fontscale1(34),
        height: Global.fontscale1(70),
        color:'#fff',
        backgroundColor:'rgba(255,255,255,0.3)',
        textAlign:'center',
    },
    text2Filed:{
        width: Global.imgScale(324),
        margin:Global.imgScale(5),
        marginLeft:Global.imgScale(20),
        marginRight:Global.imgScale(20),
        height: Global.fontscale1(70),
        backgroundColor:'rgba(255,255,255,0.3)',
        justifyContent:'center',
        borderWidth: 0,
    },    
    PopText: {    
        fontSize: Global.fontscale1(24),
        margin:Global.imgScale(10),
        marginLeft:Global.imgScale(20),
        color:'#ef8a8e',
        borderBottomWidth: 2,
        borderBottomColor: "#ef8a8e",
        fontWeight:'bold',
    },    
    PopbtnContainer:{        
        borderTopWidth: 1,
        borderTopColor: "#d9d9d9"  
    },
    Popbtn:{
        margin:Global.imgScale(20),
        marginLeft:Global.imgScale(20),
        fontSize: Global.fontscale1(20),
        color:'#000',
        textAlign:'left',
    }, 
    modal1: {
        height: Global.imgScale(100),
        width: Global.imgScale(240),
    }, 
    modal2: {
        height: deviceHeight+10,
        width: deviceWidth+10,
        backgroundColor:'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft:-6,
        marginTop:-6,
    },  
    modal: {
        justifyContent: 'center',
        borderRadius: 5,
    },  
    Dday:{    
        padding: 5,
        margin:Global.imgScale(5),
        marginLeft:Global.imgScale(20),
        marginRight:Global.imgScale(20),
        fontSize: Global.fontscale1(34),
        height: Global.fontscale1(70),
        color:'#fff',
        backgroundColor:'rgba(255,255,255,0.3)',
        textAlign:'center',
    },
    spinner: {
        marginBottom: 50,
        alignSelf:'center',
        opacity:0.9,
    },
    bottomText:{
        marginTop:Global.imgScale(3),
        fontSize: Global.fontscale1(40),
        color:'#333',
        textAlign:'center',
        fontWeight:'bold',
    },
    
})