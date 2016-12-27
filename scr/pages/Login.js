'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
  InteractionManager,
  NetInfo,
  Dimensions,
  AsyncStorage,
  Platform,
  Alert,
  TextInput,
  ScrollView,
  findNodeHandle,
  TouchableOpacity,
} from 'react-native';

import Spinner from 'react-native-spinkit';
import Modal from 'react-native-modalbox';
import Toast from 'react-native-root-toast';

import Button from 'react-native-button';

import Home from './Home.js';
import Register from './Register1.js';
import Loading from './Loading.js';
import NewUser from './NewUser.js';

var RCTUIManager = require('NativeModules').UIManager;
let Global = require('../Global');
var itypeof = require('itypeof');

import {FBLogin, FBLoginManager} from 'react-native-facebook-login';
//var FBLoginMock = require('./facebook/FBLoginMock.js');
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

var REQUEST_URL = 'http://thriveful.leslie-works.cu.cc/loadData.php';
let login_img = require('../../resource/images/login.png');

export default class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            name : null,
            status : 0,
            onLogin: deviceHeight,
            username:'',
            password:'',
            temp_view_height:1,
        }
        console.log("Login");
        NetInfo.isConnected.addEventListener('change', (isConnected) => {
            isConnected
        });
    }

    componentDidMount(){
        Global.checkNetwork();
    }

    componentWillMount() {
      //const  {navigator}  = this.props;
      //this.checkLogin();
      console.log("Login componentWillMount");
    }
    
    onSnbmit(val){
        console.log("onnSnbmit"+val);
        if(val < 3)
        {
            this.refs[val].focus();
        }
    }

    ios_statusbar(){
       // if(Platform.OS==='ios'){
        return <View style={{height:Global.imgScale(280),backgroundColor:"#FFF"}}></View>
       // }
    }

    render() {
    var _this = this;
    var user = this.state.user;
    console.log("render");      
      return (  
          <Image
                style={{width:deviceWidth, height:deviceHeight, alignSelf:"center"}}
                source={login_img}
            >   
            <ScrollView  keyboardDismissMode="on-drag" ref="scrollView">
        <View style={styles.loginContainer}>          
           {this.ios_statusbar()} 
                 
          
          <View style={styles.loginContainer}> 
          <View ref="temp_view" style={{height:Global.imgScale(this.state.temp_view_height),backgroundColor:"#FFF"}}></View>
          <View style={styles.textRow}>
            <View style={styles.TextInputRow}>
            <TextInput
                style={styles.textFiled}
                onChangeText={(text) => this.setState({username:text})}
                placeholder="User name"
                placeholderTextColor={'#eee'}
                ref="1"
                onSubmitEditing={()=>this.onSnbmit(2)}
                onFocus={()=>this.onInputFocus(1)}
            />
            </View>
            <View style={styles.TextInputRow}>
            <TextInput
                style={styles.textFiled}
                onChangeText={(text) => this.setState({password:text})}
                placeholder="Password"
                placeholderTextColor={'#eee'}
                secureTextEntry={true}
                ref="2"
                onSubmitEditing={()=>this.onSnbmit(2)}
                onFocus={()=>this.onInputFocus(2)}
            />
            </View>
            <Button onPress={()=>this.LoginSend()}  
                        containerStyle={styles.PopbtnContainer}
                        style={styles.Popbtn}>Log in
            </Button>
          </View>
          <View style={[{width: 175,height: 30,borderRadius:5,backgroundColor:'rgba(0,0,0,0)'}]}>
          <FBLogin style={styles.fblogin}
          loginBehavior={FBLoginManager.LoginBehaviors.Web}
          permissions={["email","user_friends"]}
          onLogin={function(data){
            //console.log("Logged in!");            
              console.log(JSON.stringify(data));
              Global.username=data.name;
              Global.openid=data.credentials.userId;
              Global.pw=data.credentials.token;
              Global.openidType=1;      
              AsyncStorage.setItem("username", ""+data.name);
              AsyncStorage.setItem("pw", ""+data.credentials.token);
              AsyncStorage.setItem("openid", ""+data.credentials.userId);
              _this.setState({ user : data.credentials, status : 1, onLogin:1, temp_view_height: Global.imgScale(1000) });
              _this.getUserInfo();
          }}
          onLogout={function(){
            console.log("Logged out.");
            _this.setState({ user : null });
          }}
          onLoginFound={
            function(data){
              console.log("onLoginFound!");
              Global.openid=data.credentials.userId;
              Global.pw=data.credentials.token;
              Global.openidType=1;
              AsyncStorage.setItem("pw", ""+data.credentials.token);
              AsyncStorage.setItem("openid", ""+data.credentials.userId);
              _this.setState({ user : data.credentials, status : 2, onLogin:1, temp_view_height: Global.imgScale(1000) });
              _this.refs.modal2.open();
              _this.getUserInfo();
            }
              /*(data) => this.onLoginFound(data)
              
        this.setState({temp_view_height: Global.imgScale(1000)});
            */
          }
          onLoginNotFound={function(){
            console.log("No user logged in.");
            _this.setState({ user : null, status : 3 });
          }}
          onError={function(data){
            console.log("ERROR");
            console.log(data);
            _this.setState({ user : data.credentials, status : 4 });
          }}
          onCancel={function(){
            console.log("User cancelled.");
          }}
          onPermissionsMissing={function(data){
            console.log("Check permissions!");
            console.log(data);
          }}
        />
        </View>
        <View style={{marginTop:Global.imgScale(20)}}>
            <TouchableOpacity onPress={()=>this.newuser()}>
            <Text>No account?</Text>
            </TouchableOpacity>
        </View>
        </View>
        <Modal 
            style={styles.modal2} 
            position={"center"} 
            ref={"modal2"} 
            isDisabled={true}
            backdropPressToClose={false}
            swipeToClose={false}
        > 
            <Spinner style={styles.spinner} isVisible={true} size={100} type={'Wave'} color={"#000"}/>
        </Modal>
        </View>
        
        </ScrollView>
        </Image>
      )    
    }

    newuser(){
        if(Global.navigator) {
            Global.navigator.push({
                name: 'NewUser',
                component: NewUser,
            })
        }
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

    LoginSend(){
        if(this.state.username.length>0 &&this.state.password.length>0){
                InteractionManager.runAfterInteractions(() => {
                NetInfo.isConnected.fetch().then().done(() => {
                if(Global.getConnected()){
                    fetch(REQUEST_URL+"?action=userlogin", 
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
                        console.log("data.data:"+data.data);
                        if(data.status=="succeed"){
                            if(data.data.hasOwnProperty('user_id')){
                                Global.username=this.state.username;
                                Global.openid=data.data.openid;
                                Global.pw=this.state.password;
                                Global.openidType=data.data.openidType;
                                this.setState({ user : this.state.username, status : 1, onLogin:1 });
                                this.getUserInfo();
                            }else{
                                alert("Incorrect username or password!\nYou can register it.");
                            }   
                        } else {
                            console.log("Login failed!");
                            this.showToast("Login failed!");
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
        }  
    }

    onLoginFound(data){
      console.log("Existing login found.");
      console.log(data);
      this.refs.modal2.open();
      this.showToast("Login Error!");
      Global.openid=data.credentials.userId;
      Global.pw=data.credentials.token;
      Global.openidType=1;
      //_this.setState({ user : data.credentials });
      const  {navigator}  = this.props;
      this.getUserInfo();
      this.setState({ user : data.credentials });
      //<Home />;
      /*
      const  {navigator}  = _this.props;
      if(navigator) {
        navigator.replace({
            name: 'Home',
            component: Home,
        })
      }
      */
    }

    openModal(){
      console.log("openModal");
      this.refs.modal2.open();
    }

    getUserInfo(){
      //console.log("checkLogin");
      
      if(this.state.status==1 || this.state.status==2){
        this.openModal();
      InteractionManager.runAfterInteractions(() => {
        NetInfo.isConnected.fetch().then(isConnected => {
          if(Global.getConnected()){
              fetch(REQUEST_URL+"?action=getUserInfo", 
                  { method: "POST",
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                        },
                      body: JSON.stringify(
                      {
                          openid:Global.openid,
                          pw:Global.pw,
                          openidType:Global.openidType,                          
                      }),
                      deadline:Global.getDeadline(),
                  })
              .then((response) => response.json())
              .then((data) => {
                  //console.log("responseData:"+responseData.status);
                  //console.log("responseDataError:"+responseData.error);
                  //console.log("sql1:"+responseData.sql1);
                  //console.log("sql2:"+responseData.sql2);
                  //console.log("checkLogin");
                  //console.log(data.status);
                  //console.log("data.data:"+data.data);
                  //console.log("itypeof:"+itypeof(data.data));
                  //this.refs.modal2.close();
                  if(data.status=="succeed"){                 
                      if(itypeof(data.data)=='object'){
                          AsyncStorage.setItem("openid", ""+Global.openid);
                          AsyncStorage.setItem("pw", ""+Global.pw);
                          AsyncStorage.setItem("openidType", ""+Global.openidType);
                          AsyncStorage.setItem("userID", data.data.user_id);
                          AsyncStorage.setItem("userRole", data.data.userRole);
                          AsyncStorage.setItem("name", data.data.name);
                          AsyncStorage.setItem("age", ""+data.data.age);
                          /*
                          AsyncStorage.setItem("planning", ""+data.data.planning);
                          AsyncStorage.setItem("expecting", ""+data.data.expecting);
                          AsyncStorage.setItem("already", ""+data.data.already);
                          */
                          AsyncStorage.setItem("choose", data.data.choose);
                          AsyncStorage.setItem("photo", data.data.photo);
                          Global.setUserID(data.data.user_id);
                          console.log("user_id:"+Global.getUserID());
                          this.getBabyInfo();
                      }else{
                        if(Global.navigator) {
                              Global.navigator.replace({
                                  name: 'Register',
                                  component: Register,
                              })
                          }
                      }
                  } else {
                      console.log("Login failed!");
                      this.showToast("Login failed!");
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
                console.error(error);
            });
          } else {
              console.log("checkLogin else");
              //console.log("responseData:"+responseData);
              this.timeLoopSaveInfo();
              this.showToast("Error! Please check to make sure your phone is connected to a network in order for app to update properly.");
          }
        });
      });
    }else{
      if(Global.navigator) {
            Global.navigator.replace({
                name: 'Register',
                component: Register,
            })
        }
    }
    }

    getBabyInfo(){
      console.log("checkLogin");
      if(this.state.status==1 || this.state.status==2){
      InteractionManager.runAfterInteractions(() => {
          NetInfo.isConnected.fetch().then().done(() => {
            if(Global.getConnected()){
                fetch(REQUEST_URL+"?action=getBabyInfo", 
                    { method: "POST",
                        headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                            },
                        body: JSON.stringify(
                        {
                            userid:Global.getUserID(),                    
                        }),
                        deadline:Global.getDeadline(),
                    })
                .then((response) => response.json())
                .then((data) => {
                    //console.log("responseData:"+responseData.status);
                    //console.log("responseDataError:"+responseData.error);
                    //console.log("sql1:"+responseData.sql1);
                    //console.log("sql2:"+responseData.sql2);
                    //console.log("getBabyInfo");
                    //console.log(data.status);
                    console.log("data.data:"+data.data);
                    console.log("itypeof:"+itypeof(data.data));  

                    if(data.status=="succeed"){
                        if(itypeof(data.data)=='object'){
                                AsyncStorage.setItem("badyID", ""+data.data.baby_id);
                                AsyncStorage.setItem("baby", data.data.baby);
                                AsyncStorage.setItem("dob", data.data.dob);
                                AsyncStorage.setItem("babyRole", data.data.babyRole);
                                AsyncStorage.setItem("babyPhoto", data.data.babyPhoto);
                                Global.setBadyID(data.data.baby_id);
                                console.log("baby_id:"+Global.getBadyID());
                                this.refs.modal2.close();
                                if(Global.navigator) {
                                    Global.navigator.replace({
                                        name: 'Home',
                                        component: Home,
                                    })
                                }
                            }else{
                            if(Global.navigator) {
                                    Global.navigator.replace({
                                        name: 'Register',
                                        component: Register,
                                    })
                                }
                            }
                    } else {
                        console.log("Login Error!");
                        this.showToast("Login Error!");
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
                    console.error(error);
                });
            } else {
                console.log("checkLogin else");
                //console.log("responseData:"+responseData);
                this.timeLoopSaveInfo();
                this.showToast("Error! Please check to make sure your phone is connected to a network in order for app to update properly.");
            }
        });
      });
    }else{
      if(Global.navigator) {
            Global.navigator.replace({
                name: 'Register',
                component: Register,
            })
        }
    }
    }

    timeLoopSaveInfo(){
        setTimeout(() => {this.getUserInfo();}, 5000)
    }

    showToast(msg){
      Toast.show(msg, {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM, //BOTTOM , CENTER ,  TOP 
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
  loginContainer: {
    height: deviceHeight+10,
    width: deviceWidth+10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'rgba(255,255,255,0.0)',
  },
  fblogin: {
    /*
    marginLeft: 50,
    marginRight: 50,
    */
    //margin:Global.imgScale(20),
    //marginLeft:Global.imgScale(20),
    height: 30,
    width: 175,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:5,
  },
  bottomBump: {
    marginBottom: 15,
  },
  spinner: {
      marginBottom: 50,
      alignSelf:'center',
      opacity:0.9,
  },
  modal2: {
      height: deviceHeight+10,
      width: deviceWidth+10,
      backgroundColor:'rgba(0,0,0,0.4)',
      alignItems: 'center',
      justifyContent: 'center',
      position:'absolute',
      top:-3,
      left:-3,
      marginLeft:-6,
      marginTop:-6,
  },
  TextInputRow:{      
        borderBottomColor:"#eee",
        borderBottomWidth:Platform.OS==='ios'?2:0,
  },
  textFiled:{
        margin:Global.imgScale(5),
        marginLeft:Global.imgScale(20),
        marginRight:Global.imgScale(20),
        fontSize: Global.fontscale1(20),
        height: Global.fontscale1(40),
        color:'#000',
        backgroundColor:'rgba(255,255,255,0.0)',
        textAlign:'center',
        width:Global.imgScale(220),
    },
    Popbtn:{
        margin:Global.imgScale(20),
        marginLeft:Global.imgScale(20),
        fontSize: Global.fontscale1(20),
        paddingTop:Global.imgScale(5),
        paddingBottom:Global.imgScale(5),
        color:'#fcfcfc',
        textAlign:'center',
        backgroundColor:'rgba(255,255,255,0.4)',
        borderRadius:5,
    },
});
