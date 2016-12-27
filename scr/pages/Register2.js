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
  PermissionsAndroid,
  findNodeHandle,
} from 'react-native';

import {NativeModules, Dimensions} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import {requestPermission, checkPermission} from 'react-native-android-permissions';

import DatePicker from 'react-native-datepicker';
import { SegmentedControls } from 'react-native-radio-buttons'
import Button from 'react-native-button';
import Modal from 'react-native-modalbox';
import Toast from 'react-native-root-toast';
//import Popup from 'react-native-popup';

import UserFile from './Register3.js';

var RCTUIManager = require('NativeModules').UIManager;
let Global = require('../Global');

let img_t2=require('../../resource/images/reg_t2.png');
let reg_cam=require('../../resource/images/reg_cam.png');
let img_next=require('../../resource/images/reg_next.png');

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var c1=false;

export default class Register2 extends Component {
    constructor(props){
        super(props);
        this.state = {
            img_btn : 0,
            permission: PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            hasPermission: 'Not Checked',
            planning:'',
            expecting:'',
            already:'',
            age:'',
            choose:0,
        }
    }

    componentDidMount() {
        /*
        AsyncStorage.getItem("photo").then((value) => {
            this.setState({photo: value});
            Global.photo=value;
        }).done();
        */
        Global.name='';
        Global.age='';
        Global.choose='';
    }

    saveData(s, data){
        let num;
        switch (s) {
            case "name":
                Global.name=data;
                break;
            case "age":
                num = this.onChange(data);
                Global.age=num;
                this.setState({age:num});
                break;
            case "planning":
                num = this.onChange(data);
                Global.planning=num;
                this.setState({planning:num});
                break;
            case "expecting":
                num = this.onChange(data);
                Global.expecting=num;
                this.setState({expecting:num});
                break;
            case "already":
                num = this.onChange(data);
                Global.already=num;
                this.setState({already:num});
                break;
            default:
                break;
        }
        AsyncStorage.setItem(s, data);
    }   

    onChange(text) {
        let newText = '';
        let numbers = '0123456789';

        for (var i = 0; i < text.length; i++) {
            if ( numbers.indexOf(text[i]) > -1 ) {
                newText = newText + text[i];
            }
        }   
        return newText;
    }

    onClick(val){
       this.refs.modal1.open();       
    }
    
    goNext(){
        if(Global.name.length<=0){
            //this.showToast("Are you a ...?")
            alert("What your name?");
            return false;
        }
        if(Global.age.length<=0){
            //this.showToast("Are you a ...?")
            alert("How old are you?");
            return false;
        }
        if(Global.choose.length<=0){
            //this.showToast("Are you a ...?")
            alert("Planning? Expecting? Already a parent?");
            return false;
        }
        /*
        if(Global.expecting.length<=0){
            //this.showToast("Are you a ...?")
            alert("Expecting a baby?");
            return false;
        }
        if(Global.already.length<=0){
            //this.showToast("Are you a ...?")
            alert("Already a mum?");
            return false;
        }
        */
        
        if(Global.navigator) {
            Global.navigator.replace({
                name: 'UserFile',
                component: UserFile,
            })
        }
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
        if(this.state.photo==null)
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
            source={{uri: this.state.photo}}
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
                        //console.log(result);
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
        cropping: true,
        includeBase64: true
        }).then(image => {
            //console.log('received image', image.path);
            this.setState({
                photo: `data:${image.mime};base64,`+ image.data,
                images: null
            });
            AsyncStorage.setItem("photo", `data:${image.mime};base64,`+ image.data);
            this.refs.modal1.close();
            Global.photo=`data:${image.mime};base64,`+ image.data;
            ImagePicker.clean().then(() => {
                //console.log('removed all tmp images from tmp directory');
                }).catch(e => {
                //console.log(e);
            });
        }).catch(e => console.log(e));
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
            photo: `data:${image.mime};base64,`+ image.data,
            images: null
        });
        AsyncStorage.setItem("photo", `data:${image.mime};base64,`+ image.data);
        this.refs.modal1.close();
        Global.photo=`data:${image.mime};base64,`+ image.data;
        ImagePicker.clean().then(() => {
        //console.log('removed all tmp images from tmp directory');
        }).catch(e => {
        alert(e);
        });
        }).catch(e => {});
    }

    choose(val){
        this.setState({ choose: val});
        Global.choose=val;
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
                        source={img_t2}
                    />
                </View>
                <TouchableWithoutFeedback onPress={()=>this.onClick(1)}>
                <View style={{height:Global.imgScale(150),width:Global.imgScale(150),alignSelf:'center',
                            marginTop:Global.imgScale(30), marginBottom:Global.imgScale(30),
                            backgroundColor:'rgba(255,255,255,0.3)',borderRadius:Global.imgScale(100),}}>               
                    <View style={{alignItems:'center',justifyContent:'center',flex:1}}>
                        {this.rendPhotoText()}
                    </View>
                </View>
                </TouchableWithoutFeedback>    
                <View style={{}}>
                    <View style={styles.textRow}>
                        <TextInput
                            style={styles.textFiled}
                            onChangeText={(text) => this.saveData("name", text)}
                            placeholder="Name"
                            placeholderTextColor={'#fff'}
                            ref="1"
                            onSubmitEditing={()=>this.onSnbmit(2)}
                            onFocus={()=>this.onInputFocus(1)}
                        />
                    </View>
                    <View style={styles.textRow}>                        
                        <TextInput
                            style={styles.textFiled}
                            keyboardType='numeric'
                            maxLength={2}
                            onChangeText={(text) => this.saveData("age", text)}
                            placeholder="Age"
                            placeholderTextColor={'#fff'}
                            value = {this.state.age.toString()}
                            ref="2"
                            onSubmitEditing={()=>this.onSnbmit(3)}
                            onFocus={()=>this.onInputFocus(2)}
                        />
                        {/* 
                        <NumTextInput 
                                style={styles.textFiled} 
                                onChangeText={(text) => this.saveData("age", text)}
                                maxLength={2}
                                keyboardType='numeric'
                                value={this.state.age.toString()}
                                placeholder={"Age"}
                                placeholderTextColor={'#fff'}
                            />
                        */}
                    </View>
                    <View style={{flexDirection:'row',marginLeft:Global.imgScale(15),
        marginRight:Global.imgScale(15),}}>
                        
                        <View style={{flex:1,}}>
                        {/* 
                            <TextInput
                                style={styles.text2Filed}
                                numberOfLines={2}
                                maxLength={2}
                                keyboardType='numeric'
                                onChangeText={(text) => this.saveData("planning", text)}
                                placeholder={"Planning\na baby"}
                                placeholderTextColor={'#fff'}
                                value = {this.state.planning.toString()}
                                ref="3"
                                onSubmitEditing={()=>this.onSnbmit(4)}
                            />
                        */}
                            <TouchableWithoutFeedback onPress={()=> this.choose(1)} >
                                <View style={[styles.text2Row,{justifyContent:'center',alignItems:'center'}]}>
                                <Text style={[styles.text2Filed, {color:this.state.choose==1?'#fff':'#898989'}]}>Planning{"\n"}a baby</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={{flex:1,}}>  
                        {/*                          
                            <TextInput
                                style={styles.text2Filed}
                                numberOfLines={2}
                                maxLength={2}
                                keyboardType='numeric'
                                onChangeText={(text) => this.saveData("expecting", text)}
                                placeholder={"Expecting\na baby"}
                                placeholderTextColor={'#fff'}
                                value = {this.state.expecting.toString()}
                                ref="4"
                                onSubmitEditing={()=>this.onSnbmit(5)}
                            /> */}
                            <TouchableWithoutFeedback onPress={()=>this.choose(2)} >
                                <View style={[styles.text2Row,{justifyContent:'center',alignItems:'center'}]}>
                                <Text style={[styles.text2Filed, {color:this.state.choose==2?'#fff':'#898989'}]}>Expecting{"\n"}a baby</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={{flex:1,}}>
                            {/* 
                            <NumTextInput 
                                style={styles.text2Filed} 
                                onChangeText={(text) => this.saveData("already", text)}
                                multiline={true}
                                maxLength={2}
                                numberOfLines={2}
                                keyboardType='numeric'
                                value={this.state.already.toString()}
                                placeholder={"Already\na mum"}
                                placeholderTextColor={'#fff'}
                            />
                            
                            
                            <TextInput
                                style={styles.text2Filed}
                                numberOfLines={2}
                                maxLength={2}
                                keyboardType='numeric'
                                onChangeText={(text) => this.saveData("already", text)}
                                placeholder={"Already\na mum"}
                                placeholderTextColor={'#fff'}
                                value = {this.state.already.toString()}
                                ref="5"
                                onSubmitEditing={()=>this.onSnbmit(6)}
                            />
                            */}
                            <TouchableWithoutFeedback onPress={()=>this.choose(3)} >
                                <View style={[styles.text2Row,{justifyContent:'center',alignItems:'center'}]}>
                                <Text style={[styles.text2Filed, {color:this.state.choose==3?'#fff':'#898989'}]}>Already{"\n"}a parent</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
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
                <Button onPress={()=>this.onPickCamera()}  
                        containerStyle={styles.PopbtnContainer}
                        style={styles.Popbtn}>Take a photo</Button>
                <Button onPress={()=>this.pickSingleBase64(true)}  
                        containerStyle={styles.PopbtnContainer}
                        style={styles.Popbtn}>Choose a photo</Button>                
            </Modal>           
            </ScrollView>
            <View style={{position:'absolute',right:0,left:0,bottom:Global.imgScale(40),flexDirection:'row',}}>
                    <View style={{position:'absolute',right:0,left:0,justifyContent:'center',alignItems:'center',flex:1}}>
                        <Text style={styles.bottomText}>2 out of 3</Text>
                    </View>
                    <View style={{justifyContent:'flex-end',alignItems: 'flex-end',flex:1}}>
                        <TouchableWithoutFeedback onPress={()=>this.goNext()} >
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
        if(val < 3)
        {
            this.refs[val].focus();
        }
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
        height:deviceHeight,
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
    text2Row:{
        margin:Global.imgScale(5),
        backgroundColor:'rgba(255,255,255,0.3)',
        height:Global.imgScale(70),
    }, 
    text2Filed:{
        fontSize: Global.fontscale1(26),
        color:'#898989',
        textAlign:'center',
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
    modal: {
        justifyContent: 'center',
        borderRadius: 5,
    },  
    bottomText:{
        marginTop:Global.imgScale(3),
        fontSize: Global.fontscale1(40),
        color:'#333',
        textAlign:'center',
    },
    
})