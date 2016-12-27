/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
'use strict';


import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,  
  StatusBar,
  ScrollView,
  Dimensions,
  AsyncStorage,
  Platform,
} from 'react-native';

import TimerMixin from 'react-timer-mixin';
import TabNavigator from 'react-native-tab-navigator';
import {FBLogin, FBLoginManager} from 'react-native-facebook-login';
import SQLite from 'react-native-sqlite-storage';

import Index from './Index.js';
import History from './History.js';
import Activitys from './Activitys.js';
import Recording from './Recording.js';
import Drawer from 'react-native-drawer';

import Login from './Login.js';
let Global = require('../Global');

let img1 = require('../../resource/images/TabBar1.png');
let img2 = require('../../resource/images/TabBar2.png');
let logout_img = require('../../resource/images/logout.png');
let home_img = require('../../resource/images/home.png');
let home_img_o = require('../../resource/images/home_o.png');
let Historyicon = require('../../resource/images/progress.png');
let Historyicon_o = require('../../resource/images/progress_o.png');
let Activity = require('../../resource/images/sound_icon.png');
let Team = require('../../resource/images/team.png');
let Team_o = require('../../resource/images/team_o.png');
let Book = require('../../resource/images/bookclub.png');
let Book_o = require('../../resource/images/bookclub_o.png');
var that;
var recTimer, recTimer_min=0, recTimer_sec=0;

var {height, width} = Dimensions.get('window');

export default class Home extends Component {
  constructor(props) {
        super(props);        
        this.state = {
            selectedTab: 'Index',
            header:<Text style={styles.HeaderText}>Thriveful</Text>,
            photo: '',
            name: '',
        };  
    }

  ios_statusbar(){
    if(Platform.OS==='ios'){
      return <View style={{height:Global.imgScale(20),backgroundColor:"#CA5F6F"}}></View>
    }
  }

  render() {    
    return (  
      <View style={styles.container}>   
         
      <StatusBar
            backgroundColor="#CA5F6F"
            /*translucent={true}
            hidden={true}*/
        />  
        {this.ios_statusbar()}       
       <Drawer
        ref={(ref) => this._drawer = ref}
        type="overlay"
        content={this.loadmenu()}
        tapToClose={true}
        openDrawerOffset={0.4} // 20% gap on the right side of drawer
        panCloseMask={0.4}
        closedDrawerOffset={-3}
        styles={drawerStyles}
        tweenHandler={/*(ratio) => ({
          main: { style: { opacity:(2-ratio)/2,height:height+10} },
        })}
          {*/(ratio) => ({
              main: {
              opacity: 1,
              },
              mainOverlay: {
              opacity: ratio / 1.7,
              backgroundColor: '#ef8a8e',
              height:height+1000,
              },
              })
            }
        >
       <View style={styles.HeaderComtext}>   
      <TouchableOpacity onPress={() => {this._drawer.open()}}>
      <Image
        style={styles.Headermenu/*{marginLeft:4,paddingRight:4,flex:1,alignSelf:'center',justifyContent: 'center',}*/}
        source={require('../../resource/images/menu_06.png')}
      />
      </TouchableOpacity>
      {this.state.header}
      </View>
      <TabNavigator
        tabBarStyle={styles.tabBarStyle}
      >  
  <TabNavigator.Item
    selected={this.state.selectedTab === 'Index'}
    title="Home"
    titleStyle={styles.TabNavigatorTitle}  
    selectedTitleStyle={styles.TabNavigatorSelectedTitle}  
    renderIcon={() => <Image style={styles.barIcon} source={home_img} />}
    renderSelectedIcon={() => <Image style={styles.barIcon} source={home_img_o} />}
    onPress={() => this.loadIndex(1)}>
   <Index ref={'pageIndex'} />
  </TabNavigator.Item>
  <TabNavigator.Item
    selected={this.state.selectedTab === 'p2'}
    title="Progress"
    titleStyle={styles.TabNavigatorTitle}
    selectedTitleStyle={styles.TabNavigatorSelectedTitle}  
    renderIcon={() => <Image style={styles.barIcon} source={Historyicon} />}
    renderSelectedIcon={() => <Image style={styles.barIcon} source={Historyicon_o} />}
    onPress={() => this.loadIndex(2)}>
    <History HomeChangeIndex={(val) => this.loadIndex(val)}/>
  </TabNavigator.Item>
  {/* 
  <TabNavigator.Item
    selected={this.state.selectedTab === 'p3'}
    title="Team"
    titleStyle={styles.TabNavigatorTitle}
    selectedTitleStyle={styles.TabNavigatorSelectedTitle}  
    renderIcon={() => <Image style={styles.barIcon} source={Team} />}
    renderSelectedIcon={() => <Image style={styles.barIcon} source={Team_o} />}
    onPress={() => this.loadIndex(3)}>
    {this.getView("Team")}
  </TabNavigator.Item>
  <TabNavigator.Item
    selected={this.state.selectedTab === 'p4'}
    title="Book"
    titleStyle={styles.TabNavigatorTitle}
    selectedTitleStyle={styles.TabNavigatorSelectedTitle}  
    renderIcon={() => <Image style={styles.barIcon} source={Book} />}
    renderSelectedIcon={() => <Image style={styles.barIcon} source={Book_o} />}    
    onPress={() => this.loadIndex(4)}>
    {this.getView("Book")}
  </TabNavigator.Item>
  
  <TabNavigator.Item
    selected={this.state.selectedTab === 'loadIndex'}
    title="loadIndex"
    renderIcon={() => <Image source={img2} />}
    renderSelectedIcon={() => <Image source={img2} />}
    tabStyle={styles.hideTitle}
    onPress={() => this.setState({ selectedTab: 'loadIndex' })}>    
        <Index ref={'pageIndex'} />   
  </TabNavigator.Item>
  */}
</TabNavigator>
</Drawer>
</View>
    );
  }


  rendHeader(tag){
    return(
      <Text>{tag}</Text>
    )
  }

  
  onRECPress(data){  
    if(data==true){
      recTimer_min=0;
      recTimer_sec=0;
      console.log(data);
         recTimer = TimerMixin.setInterval(()=>{
            var dp_min, dp_sec;
            recTimer_sec++;
            if(recTimer_sec==60){
                recTimer_min++;
                recTimer_sec=0;
            }
            dp_sec=recTimer_sec;
            dp_min=recTimer_min;
            if(recTimer_sec<10)
                dp_sec='0'+recTimer_sec;
            if(recTimer_min<10)
                dp_min='0'+recTimer_min;   

            this.state.recDuration=dp_min+":"+dp_sec;
            this.state.header=<Text style={styles.HeaderText}>Recording    {this.state.recDuration}</Text>;
            this.setState({  });
            
            //that.state.recDuration=dp_min+":"+dp_sec
            console.log(dp_min+":"+dp_sec);
        },1000);
        /*
      that.state.recDuration=data;
      () => this.setState({  });
      */
    }else{
        TimerMixin.clearInterval(recTimer);
    }
  }

  ggggg(aaa){    
      this.setState({ selectedTab: 'p1' });
      this.state.recDuration=aaa;
  }

  loadmenu(){
    return(
    <View style={{flex:1}}>  
    <View>   
    <Image style={{width:width*0.6,height:Global.imgScale(110) }} 
        source={require('../../resource/images/menu_bg.png')}>   
        <View style={{flex:1,
                  justifyContent:'center',
                  alignSelf:'center',
                paddingRight:Global.imgScale(15)}}>     
                { this.state.photo.length>0?
    <Image style={{width:Global.imgScale(70),
                  height:Global.imgScale(70),
                  borderRadius:50}} 
           source={{uri: this.state.photo}} />:
           <View style={{
                  justifyContent:'center',
                  alignItems:'center',
                  backgroundColor: '#fff',
                  borderBottomColor: '#000000',
                  width:Global.imgScale(70),
                  height:Global.imgScale(70),
                  borderRadius:50,
                  marginTop:10,
                }}/>
                }
    <Text style={styles.menuUserName}>{this.state.name} </Text>
    </View>
    </Image> 
    </View>
    <View style={{flex:1}}>
    <ScrollView
        automaticallyAdjustContentInsets={false}
        showsVerticalScrollIndicator={true}
        onScroll={() => { console.log('onScroll!'); }}
        scrollEventThrottle={200}
        contentContainerStyle={styles.scrollContent}>
    <View style={styles.menuRowView}>
      <TouchableOpacity style={styles.menuRow} onPress={() =>this.loadIndex(1)}>
        <Image  style={styles.menuItemIMG} resizeMode={Image.resizeMode.contain} source={home_img} />
        <Text style={styles.menuText}>Homepage</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuRow} onPress={() =>this.loadIndex(2)}>
        <Image  style={styles.menuItemIMG} resizeMode={Image.resizeMode.contain} source={Historyicon} />
        <Text style={styles.menuText}>Progress</Text>
      </TouchableOpacity>
      {/* 
      <TouchableOpacity style={styles.menuRow} onPress={() =>this.loadIndex(3)}>
        <Image  style={styles.menuItemIMG} resizeMode={Image.resizeMode.contain} source={Team} />
        <Text style={styles.menuText}>My Team</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuRow} onPress={() =>this.loadIndex(4)}>
        <Image  style={styles.menuItemIMG} resizeMode={Image.resizeMode.contain} source={Book} />
        <Text style={styles.menuText}>Book Club</Text>
      </TouchableOpacity>     
      */} 
      <TouchableOpacity style={styles.menuRow} onPress={() =>this.loadIndex(5)}>
        <Image  style={styles.menuItemIMG} resizeMode={Image.resizeMode.contain} source={require('../../resource/images/activities.png')} />
        <Text style={styles.menuText}>Activities</Text>
      </TouchableOpacity>
      {/* 
      <TouchableOpacity style={styles.menuRow} onPress={() =>this.loadIndex(5)}>
        <Image  style={styles.menuItemIMG} resizeMode={Image.resizeMode.contain} source={require('../../resource/images/settings.png')} />
        <Text style={styles.menuText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuRow} onPress={() =>this.loadIndex(6)}>
        <Image  style={styles.menuItemIMG} resizeMode={Image.resizeMode.contain} source={require('../../resource/images/about.png')} />
        <Text style={styles.menuText}>About</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuRow} onPress={() =>this.loadIndex(0)}>
        <Image  style={styles.menuItemIMG} resizeMode={Image.resizeMode.contain} source={require('../../resource/images/flag.png')} />
        <Text style={styles.menuText}>Support</Text>
      </TouchableOpacity>
      */}
      { /*
      <TouchableOpacity style={styles.menuRow} onPress={() =>this.loadIndex(0)}>
        <Image  style={styles.menuItemIMG} resizeMode={Image.resizeMode.contain} source={require('../../resource/images/menu_icons_06.png')} />
        <Text style={styles.menuText}>Share Thriveful</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.menuRowView}>
      <TouchableOpacity style={styles.menuRow} onPress={() =>this.loadIndex(0)}>
        <Image  style={styles.menuItemIMG} resizeMode={Image.resizeMode.contain} source={require('../../resource/images/menu_icons_07.png')} />
        <Text style={styles.menuText}>Thriveful Tour</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuRow} onPress={() =>this.loadIndex(0)}>
        <Image  style={styles.menuItemIMG} resizeMode={Image.resizeMode.contain} source={require('../../resource/images/menu_icons_08.png')} />
        <Text style={styles.menuText}>Thriveful Assessment</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuRow} onPress={() =>this.loadIndex(0)}>
        <Image  style={styles.menuItemIMG} resizeMode={Image.resizeMode.contain} source={require('../../resource/images/menu_icons_09.png')} />
        <Text style={styles.menuText}>Thriveful Newsletter</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuRow} onPress={() =>this.loadIndex(0)}>
        <Image  style={styles.menuItemIMG} resizeMode={Image.resizeMode.contain} source={require('../../resource/images/menu_icons_10.png')} />
        <Text style={styles.menuText}>Thriveful Events</Text>
      </TouchableOpacity>      
    </View>
    <View style={styles.menuRowView}>
      <TouchableOpacity style={styles.menuRow} onPress={() =>this.loadIndex(0)}>
        <Image  style={styles.menuItemIMG} resizeMode={Image.resizeMode.contain} source={require('../../resource/images/menu_icons_11.png')} />
        <Text style={styles.menuText}>About Us</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuRow} onPress={() =>this.loadIndex(0)}>
        <Image  style={styles.menuItemIMG} resizeMode={Image.resizeMode.contain} source={require('../../resource/images/menu_icons_12.png')} />
        <Text style={styles.menuText}>The Science</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuRow} onPress={() =>this.loadIndex(0)}>
        <Image  style={styles.menuItemIMG} resizeMode={Image.resizeMode.contain} source={require('../../resource/images/menu_icons_13.png')} />
        <Text style={styles.menuText}>Help & Feedback</Text>
      </TouchableOpacity> */ }            
    </View>  
    <View style={{marginTop:Global.imgScale(5),marginLeft: Global.imgScale(6),}}>    
    <TouchableOpacity style={styles.menuRow} onPress={() =>this.logout()}>
    <Image  style={styles.menuItemIMG} resizeMode={Image.resizeMode.contain} source={require('../../resource/images/logout.png')} />
    <Text style={styles.menuText}>Log Out </Text>
    </TouchableOpacity>
    </View>  
    </ScrollView>
    </View>
    </View>
    )
  }

  logout(){ 
    FBLoginManager.logout(function(data){
      console.log("logout!");
    });

    /*
    AsyncStorage.removeItem("username");
    AsyncStorage.removeItem("name");
    AsyncStorage.removeItem("bday");
    AsyncStorage.removeItem("sex");
    AsyncStorage.removeItem("openid");
    AsyncStorage.removeItem("pw");
    AsyncStorage.removeItem("userID");
    AsyncStorage.removeItem("badyID");
    */
    Global.isLogout=1;
    this.setState({selectedTab: 'loadIndex'});

    AsyncStorage.clear(()=>{
      Global.username='';
      Global.openid='';
      Global.userID='';
      Global.badyID='';
      Global.pw='';
      Global.setUserID(-999999);
      Global.setBadyID(-999999);
      
      if(Global.navigator) {
        Global.navigator.replace({
            name: 'Login',
            component: Login,
        });
      }
    })
    
     /* 
    Global.navigator.replace({
        name: 'Login',
        component: Login,
    })}*/
  }

  loadIndex(index){
    this._drawer.close();
    switch (index) {
      case 1:
        that=this;
        this.state.header=<Text style={styles.HeaderText}>Thriveful</Text>;
        this.setState({ selectedTab: 'Index' });
        break;
      case 2:
        this.state.header=<Text style={styles.HeaderText}>Progress</Text>;
        this.setState({ selectedTab: 'p2' }); 
        break;
      case 3:
        this.state.header=<Text style={styles.HeaderText}>Team</Text>;
        this.setState({ selectedTab: 'p3' }); 
        break;
      case 4:
        this.state.header=<Text style={styles.HeaderText}>Book</Text>;
        this.setState({ selectedTab: 'p4' }); 
        break;
      case 5:
        if(Global.navigator) {
          Global.navigator.push({
              name: 'Activitys',
              component: Activitys,
          })
        }
        break;
      default:
        /*
        this._drawer.close();
        this.refs.pageIndex.setDisplayData(0.5, 0.8);
        this.refs.pageIndex.doanimation();
        this.setState({ selectedTab: 'loadIndex' });
        this.state.header=<Text style={styles.HeaderText}>Thriveful</Text>;
        */
        break;
    }
    
  }

  componentWillMount() {
   
     AsyncStorage.getItem("name").then((value) => {
       if(value)
        this.setState({name: value});
    }).done();
    AsyncStorage.getItem("photo").then((value) => {
      if(value)
        this.setState({photo: value});          
    }).done();
    Global.db = SQLite.openDatabase({name : "leslieW2016B.db", createFromLocation : 1}, ()=>Global.successCB(), ()=>Global.errorCB());   
  }

  componentDidMount(){
    this.refs.pageIndex.setDisplayData(0.6, 1);
    this.refs.pageIndex.doanimation();
  }

  getRecordTime(){
    if(!this.state.recDuration)
      return (
        "00:00"
      )
    else
      return (
       this.state.recDuration
      )
  }

 
  getView(tag){
    return (
      <View style={{flex:1,backgroundColor:'#00baff',alignItems:'center',justifyContent:'center'}}>
          <Text style={{fontSize:22}}>{tag}</Text>
      </View>
    );
  }

/*
  _toggleTabBarVisibility() {
      this.setState(state => ({
          showTabBar: !state.showTabBar,
      }));
  }
  */
}

const styles = StyleSheet.create({
  container: {
    flex: 1,    
    backgroundColor: '#F5FCFF',
    flexDirection: 'column',
  },
  viewpage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flexDirection: 'column',
  },
  container_top: {
    flex: 0.2,
  },
  barIcon:{
      height:Global.imgScale(25),
      width:Global.imgScale(25),
  },
  container_bottom: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flexDirection: 'column',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  scene: {
      backgroundColor: '#1e2127',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  button: {
      color: '#007aff',
      fontWeight: '600',
  },
  hideTitle: {
    height: 0, 
    opacity: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  HeaderComtext:{
    flexDirection: 'row',
    backgroundColor: '#CA5F6F',
  },
  Headermenu:{
    flex:1,
    alignSelf:'center',
    justifyContent: 'center',
    width:Global.fontscale1(70),
    height:Global.fontscale1(70),
  },
  HeaderText:{
    flex: 1,
    fontSize: Global.fontscale1(36),
    textAlign: 'center',
    margin: 5,
    color: '#FFF',
    fontWeight: '600',
  },
  TabNavigatorTitle:{
    fontSize: Global.fontscale1(20),
    color: '#0d0631',
  },
  TabNavigatorSelectedTitle:{
    color: '#ef8a8e',
  },
  tabBarStyle:{
    height:68,
  },
  menuRowView:{
    marginTop: Global.imgScale(5),
    marginLeft: Global.imgScale(5),
    paddingBottom: Global.imgScale(5),
    /*borderBottomColor:'rgba(230,230,230,0.8)',
    borderBottomWidth:1
    */
  },
  menuRow:{
    flexDirection: 'row',    
    margin: Global.imgScale(8),
    marginLeft: Global.imgScale(2),
  },
  menuText:{
    fontSize: Global.fontscale1(18),
    justifyContent:"center",
    alignSelf:"center",
    color: '#737373',
    /* fontWeight: '600', */
    marginLeft: Global.imgScale(15),
  },
  menuUserName:{
    fontSize: Global.fontscale1(26),
    color: '#FFF',
    textAlign:"center",
    backgroundColor:'rgba(0,0,0,0)',
  },
  menuItemIMG:{
    height:Global.imgScale(22),
    justifyContent:"center",
    alignSelf:"center"
  }
});

const drawerStyles = {
  drawer: { 
    shadowColor: '#000000', 
    shadowOpacity: 0.2, 
    shadowRadius: 3, 
    backgroundColor:'#fff', 
    marginTop: 0,
    opacity:1,
    height:height-100
  },
  /*main: {paddingLeft: 3},*/
  main: {shadowColor: '#000000', shadowOpacity: 0.3, shadowRadius: 15,opacity:1,height:height-100},
  drawerOverlay:{opacity:1,height:height-100},
  mainOverlay:{opacity:1,height:height-100},
}


