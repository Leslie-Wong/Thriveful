'use strict';

import React, { Component } from 'react';
//var Featured = require('./scr/Featured');
//var Search = require('./scr/Search');

import {
  StyleSheet, 
  View,
  InteractionManager,
  NetInfo,
  Alert,
  AsyncStorage
} from 'react-native'; 

import Spinner from 'react-native-spinkit';
import {FBLogin, FBLoginManager} from 'react-native-facebook-login';

import Login from './Login.js';
import Home from './Home.js';
import Register from './Register1.js';

var itypeof = require('itypeof');
let Global = require('../Global');

var REQUEST_URL = 'http://thriveful.leslie-works.cu.cc/loadData.php';

const oldfetch = fetch;
fetch = function(input, opts) {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('request timeout')), opts.deadline);
        oldfetch(input, opts).then(resolve, reject);
    });
}

export default class Loading extends Component {
  render() {
    return (
      <View style={styles.container}> 
      <Spinner style={styles.spinner} isVisible={true} size={100} type={'Wave'} color={"#fff"}/>       
      </View>
    );
  }

  componentDidMount(){
    Global.checkNetwork();
  }

  componentWillMount() {
    console.log("getUserID"+Global.getUserID()); 
    console.log("getBadyID"+Global.getBadyID()); 
    if((Global.getUserID()!=null) && (Global.getBadyID()!=null)){
      this.checklogin();
    }else{
      if(Global.navigator) {
        console.log("go to Login");     
          Global.navigator.replace({
              name: 'Login',
              component: Login,
          })
      }
    }
  }

  checklogin(){
    InteractionManager.runAfterInteractions(() => {
        NetInfo.isConnected.fetch().then().done(() => {
          if(Global.getConnected()){
              fetch(REQUEST_URL+"?action=logincheck", 
                  { method: "POST",
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                        },
                      body: JSON.stringify(
                      {
                          userid:Global.getUserID(),
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
                  console.log(JSON.stringify(data));
                  console.log("data.data:"+data.data);
                  //console.log("itypeof:"+itypeof(data.data));
                  //this.refs.modal2.close();
                  if(data.status=="succeed"){                 
                      if(itypeof(data.data)=='object'){
                          if(Global.navigator){   
                            console.log("go to Home");     
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
                          this.logout();
                      }
                  } else {
                      console.log("Login Error!");
                      this.showToast("Login Error!");
                  }
              }).catch((error) => {
                if(error.message=='request timeout'){
                  Alert.alert(
                    'Network Alert',
                    'Request timeout, \nPlease contact administrator! \nOr click "OK" to try it again.',
                    [
                      {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                      {text: 'OK', onPress: () => this.checklogin()},
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
              alert("No network access. Your data can't update.");
              if(Global.navigator){   
                console.log("go to Home");     
                Global.navigator.replace({
                    name: 'Home',
                    component: Home,
                })
              }
          }
        });
    });
  }

  logout(){     
    FBLoginManager.logout(function(data){
      console.log("logout!");
    });

    AsyncStorage.removeItem("name");
    AsyncStorage.removeItem("bday");
    AsyncStorage.removeItem("sex");
    AsyncStorage.removeItem("openid");
    AsyncStorage.removeItem("pw");
    AsyncStorage.removeItem("userID");
    AsyncStorage.removeItem("badyID");

    if(Global.navigator) {
    Global.navigator.replace({
        name: 'Login',
        component: Login,
    })}
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'rgba(0,0,0,0.8)',
  },
  spinner: {
      marginBottom: 50,
      alignSelf:'center',
      opacity:0.9,
  },
});