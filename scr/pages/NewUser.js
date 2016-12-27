'use strict';
import React, { Component } from 'react';

import {
  StyleSheet,
  Image,
  Text,
  View,
  TextInput,
  AsyncStorage,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  InteractionManager,
  findNodeHandle,
  NetInfo
} from 'react-native';

import Button from 'react-native-button';
import Register from './Register1.js';

let Global = require('../Global');
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var RCTUIManager = require('NativeModules').UIManager;
let back_img = require('../../resource/images/back.png');

var REQUEST_URL = 'http://thriveful.leslie-works.cu.cc/loadData.php';


export default class NewUser extends Component {
    constructor(props){
        super(props);
        this.state = {
        username : '',
        password : '',
        password2 : '',
        onLogin: deviceHeight,
        }
    }

    ios_statusbar(){
        if(Platform.OS==='ios'){
        return <View style={{height:Global.imgScale(20),backgroundColor:"#CA5F6F"}}></View>
        }
    }

    render() {
      return (
        <View style={styles.container}>   
           {this.ios_statusbar()}  
           <View style={styles.HeaderComtext}>   
                <TouchableOpacity onPress={() => Global.navigator.pop()}>
                <Image
                    style={{alignSelf:'center',justifyContent:'center'}}
                    source={back_img}
                />
                </TouchableOpacity>
                <Text style={styles.HeaderText}>New User</Text>
            </View>           
          <ScrollView  keyboardDismissMode="on-drag" ref="scrollView" style={[styles.loginContainer]}>
          <View style={styles.textRow}>
            <TextInput
                style={styles.textFiled}
                onChangeText={(text) => this.setState({username:text})}
                placeholder="User name"
                placeholderTextColor={'#ccc'}
                ref="1"
                onSubmitEditing={()=>this.onSnbmit(2)}
                onFocus={()=>this.onInputFocus(1)}
            />
            <TextInput
                style={styles.textFiled}
                onChangeText={(text) => this.setState({password:text})}
                placeholder="Password"
                placeholderTextColor={'#ccc'}
                secureTextEntry={true}
                ref="2"
                onSubmitEditing={()=>this.onSnbmit(3)}
                onFocus={()=>this.onInputFocus(2)}
            />
            <TextInput
                style={styles.textFiled}
                onChangeText={(text) => this.setState({password2:text})}
                placeholder="Confirm Password"
                placeholderTextColor={'#ccc'}
                secureTextEntry={true}
                ref="3"
                onFocus={()=>this.onInputFocus(3)}
            />
            <Button onPress={()=>this.newUserSend()}  
                        containerStyle={styles.PopbtnContainer}
                        style={styles.Popbtn}>Create an account
            </Button>
          </View>
          </ScrollView>
          </View>
        )
    }

    onInputFocus(refName) {
        setTimeout(() => {
            let scrollResponder = this.refs.scrollView.getScrollResponder()
            scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
            findNodeHandle(this.refs[refName]),
            120, // additionalOffset
            true
            )
        }, 100)
    }

    onSnbmit(val){
        console.log("onnSnbmit"+val);
        if(val < 4)
        {
            this.refs[val].focus();
        }
    }

    newUserSend(){
     if(this.state.password!=""&&this.state.username!="")
        if(this.state.password==this.state.password2){
            InteractionManager.runAfterInteractions(() => {
                NetInfo.isConnected.fetch().then().done(() => {
                if(Global.getConnected()){
                    fetch(REQUEST_URL+"?action=adduser", 
                        { method: "POST",
                            headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                                },
                            body: JSON.stringify(
                            {
                                user:this.state.username,
                                pw:this.state.password,
                            }),
                            deadline:Global.getDeadline(),
                            
                        })
                    .then((response) => response.json())
                    .then((data) => {                        
                        console.log(JSON.stringify(data));
                        //console.log("data.data:"+data.data);
                        if(data.status=="succeed"){
                            Global.username=this.state.username;
                            Global.openid=data.openid;
                            Global.pw=this.state.password;
                            Global.openidType=0;
                            if(Global.navigator) {
                              Global.navigator.replace({
                                  name: 'Register',
                                  component: Register,
                              })
                            }
                        } else {
                            console.log("failed!");
                            //this.showToast("failed!");
                            alert(data.code);
                        }
                    }).catch((error) => {
                        if(error.message=='request timeout'){
                        Alert.alert(
                            'Network Alert',
                            'Request timeout, \nPlease contact administrator! \nOr click "OK" to try it again.',
                            [
                            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                            {text: 'OK', onPress: () => this.LoginSend()},
                            ]
                        )
                        return false;
                        }
                        console.log(error);
                        return false;
                    });      
                } else {
                    console.log("checkLogin else");
                    //console.log("responseData:"+responseData);
                    alert("No network access.");
                }
                });
            });
        }else{
            alert("Please check your Password or re-input it.");
        }
    }

}

var styles = StyleSheet.create({
    container: {
    flex: 1,
    paddingBottom:5,
    backgroundColor:'#f5f5f5',
  },
  loginContainer: {
    height: deviceHeight+10,
    width: deviceWidth+10,
    backgroundColor:'rgba(255,255,255,0.0)',
  },
    wrapper:{
        flex: 1,
    },
    HeaderComtext:{
    flexDirection: 'row',
    backgroundColor:"#c75c6e",
  },
  HeaderText:{
    flex: 1,
    fontSize: Global.fontscale1(36),
    textAlign: 'center',
    margin: 5,
    color: '#FFF',
    fontWeight: '600',
  },
  textFiled:{
        marginTop:Global.imgScale(60),
        marginLeft:Global.imgScale(20),
        marginRight:Global.imgScale(20),
        fontSize: Global.fontscale1(20),
        height: Global.fontscale1(40),
        color:'#000',
        backgroundColor:'rgba(255,255,255,0.3)',
        textAlign:'center',
        alignSelf:'center',
        width:Global.imgScale(320),
    },
    Popbtn:{
        margin:Global.imgScale(20),
        marginLeft:Global.imgScale(20),
        fontSize: Global.fontscale1(20),
        paddingTop:Global.imgScale(10),
        paddingBottom:Global.imgScale(10),
        color:'#000',
        textAlign:'center',
        backgroundColor:'rgba(120,120,255,0.8)',
        borderRadius:5,

    },
})