'use strict';

import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  CustomBadgeView,
  View,
  TouchableOpacity,
  Navigator,
  TouchableHighlight,
  AsyncStorage,
} from 'react-native';

import {FBLogin, FBLoginManager} from 'react-native-facebook-login';
import {TabNavigator} from 'react-native-tab-navigator';
import {checkPermission} from 'react-native-android-permissions';
import Spinner from 'react-native-spinkit';

var itypeof = require('itypeof');

import Loading from './scr/pages/Loading.js';
import Home from './scr/pages/Home.js';
//import Home from './scr/pages/Register1.js';
import Login from './scr/pages/Login.js';

let Global = require('./scr/Global');

/*
var subscriber = RCTDeviceEventEmitter.addListener(
  "onLoginFound",
  (eventData) => {
    console.log("[onLoginFound] ", eventData);
  }
);
*/

var _props;
var _navigator;
var isLogined=0;

export default class Main extends Component{  
  constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'featured',
            loadDataStep: 0,
        };
        _props=props;        
  } 

  componentDidMount() { 
        Global.setPermission();
        Global.checkNetwork();
        AsyncStorage.getItem("userID").then((value) => {
            Global.setUserID(value);
            console.log("AsyncStorage UserID:"+Global.getUserID());
            this.setState({loadDataStep:this.state.loadDataStep+1});
        }).done();
        AsyncStorage.getItem("badyID").then((value) => {
            Global.setBadyID(value);
            console.log("AsyncStorage badyID:"+Global.getBadyID());
            this.setState({loadDataStep:this.state.loadDataStep+1});
        }).done();
        AsyncStorage.getItem("openid").then((value) => {
            Global.openid=value;
            this.setState({loadDataStep:this.state.loadDataStep+1});
        }).done();
        AsyncStorage.getItem("pw").then((value) => {
            Global.pw=value;
            this.setState({loadDataStep:this.state.loadDataStep+1});
        }).done();
        AsyncStorage.getItem("openidType").then((value) => {
            Global.openidType=value;
            this.setState({loadDataStep:this.state.loadDataStep+1});
        }).done();
    } 
  
  render() {
    
    let defaultName = "Loading";
    let defaultComponent = Loading;
    
    /*
    FBLoginManager.logout(function(data){
      console.log("logout!");
    });
    */
    /*
    FBLoginManager.getCredentials(function(data){
      console.log("DATA:"+JSON.stringify(data));
      if(isLogined==0){
    if(data &&
        itypeof(data.credentials) === 'object' &&
        itypeof(data.credentials.token) === 'string' &&
        data.credentials.token.length > 0){
      //console.log("main Logged in!");
      isLogined=1;
       if(_navigator){        
            _navigator.replace({
                name: 'Home',
                component: Home,
            })}
    }else{
      //console.log("Not Logged in!");
          if(_navigator) {
            _navigator.replace({
                name: 'Login',
                component: Login,
            })}
    }
      }
  });
  */
  console.log("loadDataStep" + this.state.loadDataStep);
  if(this.state.loadDataStep==5){
  return (
      <Navigator
      //initialRoute={routes[0]}
     // initialRouteStack={routes}
      initialRoute={{ name: defaultName, component: defaultComponent }}  
      renderScene={(route, navigator) => {
        let Component = route.component;
        _navigator = navigator;
        Global.navigator = navigator;
        return <Component {...route.params} navigator={navigator} />
      }}
      style={{flex: 1}}
    />)
  }else{
    return (
      <View style={styles.container}> 
      <Spinner style={styles.spinner} isVisible={true} size={100} type={'Wave'} color={"#fff"}/>       
      </View>
    );
  }
}  

navpage(page){
    //console.log("navpage" + page);
    return(
      <Navigator
          style={{ flex:1 }}
          initialRoute={{ name: 'Home' }}
          renderScene={ this.renderScene } />
    );
  }

  getView(tag){
    return (
      <View style={{flex:1,backgroundColor:'#00baff',alignItems:'center',justifyContent:'center'}}>
          <Text style={{fontSize:22}}>{tag}</Text>
      </View>
    );
  }

  _toggleTabBarVisibility() {
      this.setState(state => ({
          showTabBar: !state.showTabBar,
      }));
  }
}

var styles = StyleSheet.create({  
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'rgba(0,0,0,0.8)',
  },
  heading: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center', 
    backgroundColor: '#ff1046',
    marginBottom: 10
  },
  headText: {
    color: '#ffffff',
    fontSize: 22
  },
  button: {
    height: 60,
    marginTop: 10,
    justifyContent: 'center', 
    backgroundColor: '#eeeeee',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 18
  },
  spinner: {
      marginBottom: 50,
      alignSelf:'center',
      opacity:0.9,
  },
});