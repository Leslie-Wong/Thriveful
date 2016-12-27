
import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  PixelRatio,
  Platform
} from 'react-native';

import Recording from './Recording.js';
let Global = require('../Global.js');

var {height, width} = Dimensions.get('window');

let back_img = require('../../resource/images/back.png');

var img = [
    [
        ["Changing Diapers",require("../../resource/images/a1.png"),1],
        ["What to Wear",require("../../resource/images/a2.png"),2],
        ["Snack Time",require("../../resource/images/a3.png"),3],
        ["Play Time",require("../../resource/images/a4.png"),4],
        ["Cleaning up",require("../../resource/images/a5.png"),5],
        ["Laundry",require("../../resource/images/a6.png"),6],
        ["Mealtime",require("../../resource/images/a7.png"),7],
        ["Bathtime Chef",require("../../resource/images/a8.png"),8],
        ["BedTime",require("../../resource/images/a9.png"),9],
    ],
    [
        ["On the bus",require("../../resource/images/b1.png"),1],
        ["Walking",require("../../resource/images/b2.png"),2],
        ["In the car",require("../../resource/images/b3.png"),3]
    ],
    [
        ["At the store",require("../../resource/images/c1.png"),1],
        ["At the park",require("../../resource/images/c2.png"),2],
        ["At an appointment",require("../../resource/images/c3.png"),3]
    ],
    [
        ["Anytime,Anywhere",require("../../resource/images/d1.png"),1]
    ]
];

export default class Home extends Component {
  constructor(props) {
        super(props);        
        this.state = {
            selectedTab: 'loadIndex',
            recDuration: "00:00",
            imgpath:"",
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
            {this.ios_statusbar()}   
            <View style={styles.HeaderComtext}>   
                <TouchableOpacity onPress={() => Global.navigator.pop()}>
                <Image
                    style={{flex:1,alignSelf:'center',justifyContent:'center'}}
                    source={back_img}
                />
                </TouchableOpacity>
                <Text style={styles.HeaderText}>Activity</Text>
            </View>
            <ScrollView
                ref={(scrollView) => { _scrollView = scrollView; }}
                automaticallyAdjustContentInsets={false}
                showsVerticalScrollIndicator={true}
                onScroll={() => { console.log('onScroll!'); }}
                scrollEventThrottle={200}
                contentContainerStyle={styles.scrollContent}>
            <View style={styles.details}>
                {this.rendActRow(0, `We're at home`)}
                {this.rendActRow(1, `We’re on the go!`)}
                {this.rendActRow(2, `We’re Out and About`)}
                {this.rendActRow(3, `We’re up for anything`)}
            </View>
            <View style={{height:30}}>
            </View>
            </ScrollView>
            </View>
        )
    }

    getDetail(index, val, img, name){
        console.log("index:" + index + " val:" + val);
        Global.ActID=index;
        Global.DetailID=val;
        Global.ActImg=img;
        Global.ActName=name;
        if(Global.navigator) {
            Global.navigator.push({
                name: 'Recording',
                component: Recording,
            })}
        
        /*
         if(_navigator) {         
            _navigator.replace({
                name: 'Home',
                component: Home,
            })}
            */
    }

    rendActItem(type,num, str){

    }

    rendActRow(type, str){
        var item = [];
        var list,item;
            item = img[type].map(function(data){
                return(<View key={type+data[2]} style={styles.actItems} >
                <TouchableOpacity key={type+data[2]} style={styles.actTouch} activeOpacity={0.7} onPress={()=>this.getDetail(type,data[2],data[1],data[0])}>
                <Image style={styles.actImg} resizeMode={Image.resizeMode.stretch} source={data[1]}>                
                </Image>
                <Text style={styles.subtitals}>{data[0]}</Text>
                </TouchableOpacity>
                </View>)
            }.bind(this));

        return(                
            <View style={styles.actcontext}>            
            <Text style={styles.titals}>{str}</Text>
            <View style={styles.actrow}>
            {item}
            </View>
            </View>            
            )
    }
    /*
    loadactivitys1(){
         return (
            <View style={styles.actcontext}>
            
            <Text style={styles.titals}>We're at home</Text>

            <View style={styles.actrow}>
            

            <TouchableOpacity style={styles.actTouch} activeOpacity={0.7} onPress={()=>this.getDetail(1,"B")}>
            <Image style={styles.actImg} resizeMode={Image.resizeMode.stretch} source={require('../../resource/images/a002.png')}>
            <Text style={styles.subtitals}>Snacktime</Text>
            </Image>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actTouch} activeOpacity={0.7} onPress={()=>this.getDetail(1,"C")}>
            <Image style={styles.actImg} resizeMode={Image.resizeMode.stretch} source={require('../../resource/images/a003.png')}>
            <Text style={styles.subtitals}>Cleaning up</Text>
            </Image>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actTouch} activeOpacity={0.7} onPress={()=>this.getDetail(1,"D")}>
            <Image style={styles.actImg} resizeMode={Image.resizeMode.stretch} source={require('../../resource/images/a004.png')}>
            <Text style={styles.subtitals}>Bedtime</Text>
            </Image>
            </TouchableOpacity>
            </View>

            </View>
         )
    }

    loadactivitys2(){
         return (
            <View style={styles.actcontext}>
            
            <Text style={styles.titals}>We're on the go</Text>

            <View style={styles.actrow}>
            <TouchableOpacity style={styles.actTouch} activeOpacity={0.7} onPress={()=>this.getDetail(2,"A")}>
            <Image style={styles.actImg} resizeMode={Image.resizeMode.stretch} source={require('../../resource/images/a005.png')}>
            <Text style={styles.subtitals}>On foot</Text>
            </Image>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actTouch} activeOpacity={0.7} onPress={()=>this.getDetail(2,"B")}>
            <Image style={styles.actImg} resizeMode={Image.resizeMode.stretch} source={require('../../resource/images/a006.png')}>
            <Text style={styles.subtitals}>In the car</Text>
            </Image>
            </TouchableOpacity>
            </View>

            </View>
         )
    }

    loadactivitys3(){
         return (
            <View style={styles.actcontext}>
            
            <Text style={styles.titals}>We're out and about</Text>

            <View style={styles.actrow}>
            <TouchableOpacity style={styles.actTouch} activeOpacity={0.7} onPress={()=>this.getDetail(3,"A")}>
            <Image style={styles.actImg} resizeMode={Image.resizeMode.stretch} source={require('../../resource/images/a007.png')}>
            <Text style={styles.subtitals}>At the store</Text>
            </Image>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actTouch} activeOpacity={0.7} onPress={()=>this.getDetail(3,"B")}>
            <Image style={styles.actImg} resizeMode={Image.resizeMode.stretch} source={require('../../resource/images/a008.png')}>
            <Text style={styles.subtitals}>At the park</Text>
            </Image>
            </TouchableOpacity>
            </View>

            </View>
         )
    }
    */
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom:5,
    backgroundColor:'#f5f5f5',
  },
  details: { 
    marginLeft: 10,
    flexDirection: 'column',    
    alignSelf:'flex-start',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  actcontext:{
    flexDirection: 'column',
    alignSelf:'flex-start',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  actrow:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    alignSelf:'flex-start',
    justifyContent: 'flex-start',
  },
  actTouch:{
    width: width / 3 - 5,
    alignSelf:'flex-start',
  },
  actImg:{
    width: width / 3 - 60,
    height: width / 3 - 60,
    margin: 5,
    alignSelf:'center',
  },
  titals:{
    width: width,
    marginTop: 30,
    alignSelf:'center',
    fontSize: Global.fontscale1(32),
    textAlign: 'center',
    color: '#002699',
    fontWeight: '600',
  },
  subtitals:{
    alignSelf:'center',
    fontSize: Global.fontscale1(20),
    color: '#333333',
    marginTop: 5,
    textAlign: 'center',
    marginBottom: 10,
  },
  actItems:{
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf:'center',
    justifyContent: 'center',
  },
  HeaderText:{
    flex: 1,
    fontSize: Global.fontscale1(36),
    textAlign: 'center',
    margin: 5,
    color: '#FFF',
    fontWeight: '600',
  },
  HeaderComtext:{
    flexDirection: 'row',
    backgroundColor:"#c75c6e",
  },
});