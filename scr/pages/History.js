
import React, { PropTypes, Component } from 'react';

import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  NetInfo,
  PixelRatio
} from 'react-native';

import Activitys from './Activitys.js';
import Recording from './Recording.js';
import HistoryBarItem from '../components/HistoryBarItem.js';
import ProgressDailyItme from '../components/ProgressDailyItme.js';
let Global = require('../Global.js');
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

var REQUEST_URL = 'http://thriveful.leslie-works.cu.cc/loadData.php';

var {height, width} = Dimensions.get('window');
var lastOffser = 200;
var _scrollView;
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

export default class History extends Component {
  constructor(props) {
        super(props);        
        this.state = {
            data: Global.barItems,
            isGotDailyData: false,
            DailyDataState: "Loading...",
            dailyCardItems: null,
        };
        NetInfo.isConnected.fetch().then().done(() => {          
            if(Global.getConnected()){
              setTimeout(()=>{
                console.log("Will fetchData");
                this.fetchData();              
              },0);
            }else{
                this.setState({DailyDataState:"No Network! Can't fetching data!"})                
           }
        });
    }

    componentDidMount() {
        Global.checkNetwork();
    }

    fetchData() {
        setTimeout(() => {
            fetch(REQUEST_URL+"?action=getProgressDailyCard&uid="+Global.getUserID(),{deadline:Global.getDeadline()})        
            .then((response) => response.json())
            .then((responseData) => {      
                console.log("getProgressDailyCard",responseData)
                //var d = JSON.parse(responseData);
                //var a = responseData.words/responseData.goal;
            /**/
                if(responseData.status=="succeed"){
                    this.setState({
                        dailyCardItems:responseData.dailydone,
                        isGotDailyData: true,
                    })            
                }
            /**/
                
            }).catch((error) => {
                console.log(error);
            }); 
        }, 0);
    }// end fetchData

    render() {
        const scrollHeight = Global.imgScale(80);
        return (  
        <Image 
            style={{width:deviceWidth+5,height:deviceHeight-110}}
            source={require('../../resource/images/bg_01.png')}
           >
            <View style={styles.container}>     
            <View style={styles.graphRow}>          
                <View style={styles.details}>
                    <View>
                        <View style={{position: 'absolute',
                                    width:deviceWidth+5,
                                    alignItems:'center', justifyContent:'center'}}>
                            <Image style={{width:Global.imgScale(150),alignSelf:'center'}} 
                                resizeMode={Image.resizeMode.contain} 
                                source={require("../../resource/images/progress_ele_11.png")} />                
                        </View>
                        <Text style={{marginTop:Global.imgScale(20)}}>10,000</Text>
                    </View>
                    <View style={{height: scrollHeight + Global.imgScale(15), width:deviceWidth-8,flexDirection:'column'}}>
                        <Text style={{position: 'absolute',marginLeft:Global.imgScale(5) ,marginTop:Global.imgScale(30)}}>5,000</Text>
                        <ScrollView
                        horizontal
                        /*ref={(scrollView) => { _scrollView = scrollView; }}*/
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        alwaysBounceVertical={false}
                        scrollEventThrottle={200}
                        onScroll={(eve)=>this.onActScrolled(eve)}
                        directionalLockEnabled
                        style={[styles.scrollView, {height: scrollHeight, marginLeft:Global.imgScale(40), backgroundColor:"#fafafa"}]}>
                            {this.renderBars()}
                        </ScrollView>
                    </View>
                </View>
            </View>            
            <View >
                {this.renderRewardBar()}
            </View>
            <View style={{flex:1,backgroundColor:'#fff'}}>
                {this.renderDailyCard()}                
            </View>
            </View>
            </Image>
        )
    }

    onScrolled(event){
        var currentOffset = event.nativeEvent.contentOffset.x;
        if(currentOffset-lastOffser>0){
        lastOffser=currentOffset;
        this.updateBarItems();
        }
        console.log('onScroll!'+currentOffset); 
    }

    onActScrolled(event){
        var currentOffset = event.nativeEvent.contentOffset.x;
        if(currentOffset-lastOffser>0){
        lastOffser=currentOffset;
        this.updateBarItems();
        }
        console.log('onScroll!'+currentOffset); 
    }

    renderBars () {
        if(this.state.data){
            console.log('data!'+JSON.stringify(this.state.data)); 
            return this.state.data.map((value, index) => {
            return (
                <HistoryBarItem
                key={index}
                //value={value[0]}    
                date={value.date}                
                unitHeight={Number(value.done)}
                wordCountHeight={Number(value.words/Global.goal)}
                />
            )
            });
        }
    }

    renderRewardBar(){
        if(this.state.data[0].done==0 || this.state.data[0].done==1 ){
            return(
                <View >
                <View style={{flexDirection:"row",marginTop:Global.imgScale(5),marginLeft:Global.imgScale(10,)}}>
                    <Image style={{width:Global.imgScale(60),height:Global.imgScale(65),alignSelf:'center'}} 
                        resizeMode={Image.resizeMode.contain} 
                        source={require("../../resource/images/progress_book.png")} />
                    <View style={{marginTop:Global.imgScale(1),marginLeft:Global.imgScale(10)}}>
                        <Text style={{fontSize:Global.fontscale1(26),color:"#fff",backgroundColor:'rgba(0,0,0,0)'}}>Keep up the progress!</Text>
                        <Text style={{fontSize:Global.fontscale1(20),color:"#000",backgroundColor:'rgba(0,0,0,0)'}}>You completed {Math.ceil(this.state.data[0].words/Global.goal*100)}% of your word goal!
                        {"\n"}Read a book to ypur baby to achieve the{"\n"}daily word goal!</Text>
                    </View>
                </View>
                <View style={{marginBottom:Global.imgScale(1),}}>
                    <TouchableOpacity onPress={()=>this.props.HomeChangeIndex(4)}>
                    <Image style={{width:Global.imgScale(130),alignSelf:'flex-end',marginRight:Global.imgScale(10)}} 
                        resizeMode={Image.resizeMode.contain} 
                        source={require("../../resource/images/progress_button_07.png")} />
                    </TouchableOpacity>
                </View>
                </View>
            )
        }else if(this.state.data[0].done==2 ){
            return(
                <View >
                <View style={{flexDirection:"row",marginTop:Global.imgScale(5),marginLeft:Global.imgScale(10,)}}>
                    <Image style={{width:Global.imgScale(60),height:Global.imgScale(65),alignSelf:'center'}} 
                        resizeMode={Image.resizeMode.contain} 
                        source={require("../../resource/images/reward_bar_1.png")} />
                    <View style={{marginTop:Global.imgScale(1),marginLeft:Global.imgScale(10)}}>
                        <Text style={{fontSize:Global.fontscale1(30),color:"#fff"}}>Great job!</Text>
                        <Text style={{fontSize:Global.fontscale1(20),color:"#000"}}>You completed all activities for today and{"\n"}
                            achieved {Math.ceil(this.state.data[0].words/Global.goal*100)}% of your word goal!</Text>
                    </View>
                </View>
                <View style={{marginBottom:Global.imgScale(1),}}>
                    <TouchableOpacity onPress={()=>this.goToActivity()}>
                    <Image style={{width:Global.imgScale(180),alignSelf:'flex-end',marginRight:Global.imgScale(10)}} 
                        resizeMode={Image.resizeMode.contain} 
                        source={require("../../resource/images/reward_bar_2.png")} />
                    </TouchableOpacity>
                </View>
                </View>
            )
        }
    }

    rendDailycardItem(){     
        const {unitHeight} = this
        console.log('dailyCardItems!'+JSON.stringify(this.state.dailyCardItems));    
        return this.state.dailyCardItems.map((value, index) => {
        return (
            <ProgressDailyItme
            key={index}
            //value={value[0]}    
            day={index}                
            actDone={Number(value.done)}
            onClick={(val,act,opt,actCode)=>this.onDailycardItem(val,act,opt,actCode)}            
            />
        )
        });
    }

    onDailycardItem(val,act,opt,actCode){
        if(opt==1){
            if(val==1){
                Global.ActID=actCode[0];
                Global.DetailID=actCode[1];
                Global.ActImg=img[actCode[0]][actCode[1]-1][1];
                Global.ActName=img[actCode[0]][actCode[1]-1][0];
                if(Global.navigator) {
                    Global.navigator.push({
                        name: 'Recording',
                        component: Recording,
                    })}
            }else if(val==2){
                this.props.HomeChangeIndex(4)
            }
        }
    }

    goToActivity(){
        if(Global.navigator) {
            Global.navigator.push({
                name: 'Activitys',
                component: Activitys,
            })}
    }

    onChangeed(contentWidth, contentHeight){
        console.log("onChangeed");
        var i = contentHeight/10;
        var goy = i*(Global.useDay -1) - Global.imgScale(40);
        if(goy < contentHeight){
            _scrollView.scrollTo({y: goy});
        }else{
            _scrollView.scrollTo({y: contentHeight-i*2});
        }
    }

    renderDailyCard(){
        if(this.state.isGotDailyData){            
            return(
            <ScrollView
                ref={(scrollView) => { _scrollView = scrollView; }}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                alwaysBounceVertical={false}
                scrollEventThrottle={200}
                onScroll={(eve)=>this.onScrolled(eve)}
                directionalLockEnabled
                onContentSizeChange={(contentWidth, contentHeight)=>this.onChangeed(contentWidth, contentHeight)}
                style={[styles.scrollView, {flex:1,margin:Global.imgScale(6)}]}>
                    <View style={{height:Global.imgScale(15)}}/>   
                    {this.rendDailycardItem()}
                     <View style={{height:Global.imgScale(15)}}/>  
                </ScrollView>
            )
        }else{
            return(
                <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontSize:Global.fontscale1(26),color:"#ccc",textAlign:"center"}}>{this.state.DailyDataState}</Text>
                </View>
            )
        }
    }

    updateBarItems() {
        /*
        setTimeout(() => {
        InteractionManager.runAfterInteractions(() => {
            var d=[]
            for(var i=1; i<20; i++){
            d[i]=[i, Math.random()*2, Math.random()]
            }
            this.setState({
            data:this.state.data.concat(d),
            })
        });
        }, 0);
        */
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
  },
  graphRow:{   
    paddingBottom:20,   
    backgroundColor:'#fff',
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
});

History.propTypes = {
  HomeChangeIndex: PropTypes.func
}