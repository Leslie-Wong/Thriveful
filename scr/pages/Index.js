/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Easing,
  Animated,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  PixelRatio,
  AsyncStorage,
  NetInfo,
  InteractionManager,
} from 'react-native';

import Svg,{   
    Polygon,
    Circle,
    Defs
} from 'react-native-svg';

import TimerMixin from 'react-timer-mixin';

import ViewPager from 'react-native-viewpager';

import Recording from './Recording.js';

import Toast from 'react-native-root-toast';

let Global = require('../Global.js');
let ActivityCards = require('../../resource/data/ActivityCards.js');

var REQUEST_URL = 'http://thriveful.leslie-works.cu.cc/loadData.php';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var oldpage = 3;
var PAGES = [
  [0,''],
  [1,''],
  [2,''],
  [3,''],
  ['',null],
  ['',null],
  ['',null],
];

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

var {height, width} = Dimensions.get('window');

var laodpageInt=0;
var currentPage=3;
var laodpageArr=[0,0,0];
var currentDate = new Date();
var that;
var svgW,svgH;
var newdate = new Date();
var loadDate='';

export default class Index extends Component {
  constructor(props) {
        super(props);
        var dataSource = new ViewPager.DataSource({
          pageHasChanged: (p1, p2) => p1 !== p2,
        });
        var setPieAniControl;
        Global.barItems=null;
        this.state = {
              anim: [1,2].map(() => new Animated.Value(1.8)),  
              dataSource: dataSource.cloneWithPages(PAGES),
              disabled: false,
              getpage: {  method() { return 10; } },
              ytd:0,
              td:0,
              points:"0,50 95,0 190,50 190,200 0,200",
              svgH:400,
              svgW:380,
              He_She:'she',
              Him_Her:'her',
              His_Her:'her',
              name:'',
              Piepersend:0.00,
              chartWidth:160,              
              tWord:0,
              goalWord:10000,
              useDay:"",
              useActicity:0,
              pieStopPer:0.05,
              fristLoad:true,
              onLoadedText:false,
          };   
          
          NetInfo.isConnected.fetch().then().done(() => {
              if(Global.getConnected()){
                setTimeout(()=>{
                  console.log("Will fetchData");
                  //this.fetchData(currentDate.toISOString(),1);          
                  this.fetchData(currentDate.getFullYear()+"-"+(currentDate.getMonth()+1)+"-"+currentDate.getDate(),1);
                },0);
              }else{
                  this.showToast("Error! Please check to make sure your phone is connected to a network in order for app to update properly.");
            }
          });
          
          svgW=this.state.svgW;
          svgH=this.state.svgH;
          var cdate = new Date();
          cdate = new Date(currentDate);
          cdate.setDate(currentDate.getDate()-3);
          PAGES[0]=[this.loadActivityData(), cdate.getFullYear()+"-"+(cdate.getMonth()+1)+"-"+cdate.getDate()];
          cdate.setDate(currentDate.getDate()-2);
          PAGES[1]=[this.loadActivityData(), cdate.getFullYear()+"-"+(cdate.getMonth()+1)+"-"+cdate.getDate()];
          cdate.setDate(currentDate.getDate()-1);
          PAGES[2]=[this.loadActivityData(), cdate.getFullYear()+"-"+(cdate.getMonth()+1)+"-"+cdate.getDate()];
          PAGES[3]=[this.loadActivityData(), currentDate.getFullYear()+"-"+(currentDate.getMonth()+1)+"-"+currentDate.getDate()];
  }

  componentDidMount() {
    Global.checkNetwork();
    /*  
    this.setPieAniControl = TimerMixin.setInterval(() => {      
      this.setState({money: 10}, () => {
            this.setState({  
                  Piepersend: this.state.Piepersend + 0.01,         
            });
          });
        if(this.state.Piepersend>=1){
          TimerMixin.clearInterval(this.setPieAniControl);
          console.log("stop");      
        }  
        console.log("this.state.Piepersend:"+this.state.Piepersend);      
    },300);
    */
    
    
  }

  fetchData(date, val) {
    var d='';
    if(date!==null){
      d="&date="+date;
    }
    console.log("date=",date)
        setTimeout(() => {
          fetch(REQUEST_URL+"?action=homepage2&uid="+Global.getUserID()+"&val="+val+d,{deadline:Global.getDeadline()})        
          .then((response) => response.json())
          .then((responseData) => {      
              console.log("fetchData",responseData, "val", val)
              //var d = JSON.parse(responseData);
              //var a = responseData.words/responseData.goal;
            /**/
              if(responseData.status=="succeed"){
                Global.goal=responseData.goal;
                var w = responseData.words;
                var a = w/responseData.goal;
                this.setState({
                  useDay: responseData.date + 1,
                  goalWord: Number(responseData.goal),
                  /* tWord: responseData.words, */
                  pieStopPer: a,
                  onLoadedText:true,
                });
                Global.useDay=responseData.date + 1;
                var aa = a / 5;
                var aaa = w/ 5;
                if(responseData.histroy!=undefined){
                  Global.barItems=responseData.histroy;
                }
                InteractionManager.runAfterInteractions(() => {
                  if(w>500){
                    this.interval=setInterval(() => {              
                      if(this.state.Piepersend>=this.state.pieStopPer-0.01){
                          this.interval && clearInterval(this.interval);                
                      }else{                
                        this.setState({
                            Piepersend: this.state.Piepersend + aa,
                            tWord: this.state.tWord + aaa,
                          });                
                      }
                    },100);
                  }else{
                    this.interval=setInterval(() => {              
                      if(this.state.Piepersend>=this.state.pieStopPer){
                          this.interval && clearInterval(this.interval);                
                      }else{                
                        this.setState({
                            Piepersend: this.state.Piepersend + aa,
                            tWord: this.state.tWord + aaa,
                          });                
                      }
                    },100);
                  }
                });  
              }
            /**/
                
            }).catch((error) => {
              console.log(error);
            }); 
          },0);
  }// end fetchData

  componentWillMount() {
    console.log("index componentWillMount");
    AsyncStorage.getItem("name").then((value) => {
        if(value){
           this.setState({name: value});
        }
      }).done();
      AsyncStorage.getItem("sex").then((value) => {
        if(value){
           this.setState({sex: value});
          if(value=="Boy"){
            this.state.He_She="he";
            this.state.Him_Her="him";
            this.state.His_Her="his";
          }
        }
      }).done();
      Global.settimer();
  }

/*
  pageOne(){
    var page=3;
    switch (page) {
      case 3:
        return(
        <View style={styles.container}>
            <TouchableHighlight 
                disabled={this.state.disabled} 
                onPress={() => this._onPress()}>
            <Text>
              Press me 1!
            </Text>
          </TouchableHighlight>
          <TouchableHighlight 
                disabled={this.state.disabled}
                onPress={() => this._onPressOut()}>
            <Text>
              Press me 2!
            </Text>
          </TouchableHighlight>
          </View>
          );  
      default:
        return("page " + page);
    }
  }
  
  */
  render() {
    that=this;
    return(
      <Image 
            style={{width:deviceWidth+5,height:deviceHeight-110}}
            source={require('../../resource/images/bg_01.png')}
           >
           <View style={styles.container}>
            <View style={styles.chart_container}>
            <View style={{ flex:1, marginLeft:Global.imgScale(6), marginRight:Global.imgScale(6)}}>
              
              <View style={{flex:1}}>
                <View style={{alignSelf:'flex-start',justifyContent:'flex-start', flex:1, alignItems:'flex-start',
                    width:Global.imgScale(140),height:Global.imgScale(20),marginTop:Global.imgScale(-14)}}>
                <Text style={/*styles.STARTText*/{color:"#000"}}>START</Text> 
                </View>  
                <View style={{alignSelf:'flex-end',justifyContent:'flex-end', flex:1 ,alignItems:'flex-end',
                    marginRight:Global.imgScale(0), width:Global.imgScale(40),height:Global.imgScale(20)}}>
                <Text style={/*styles.FINISHText*/{color:"#000"}}>FINISH</Text>   
                </View>          
              </View>
                {this.draw1To10()}
            </View>
            <View style={styles.viewchartbg}>
              <View style={styles.charRowL}>
                <Text style={styles.charText}>{this.state.useDay}</Text>
                <Text style={styles.charText}>day</Text>
              </View>
              <View style={styles.charRowM} >                   
                <Svg
                    height={Global.imgScale(this.state.chartWidth)}
                    width={Global.imgScale(this.state.chartWidth)}
                >
                <Circle
                        cx={Global.imgScale(this.state.chartWidth)/2}
                        cy={Global.imgScale(this.state.chartWidth)/2}
                        originX={Global.imgScale(this.state.chartWidth)/2}
                        originY={Global.imgScale(this.state.chartWidth)/2}
                        rotate="-90"
                        r={Global.imgScale(this.state.chartWidth)/2 - Global.imgScale(6)}
                        stroke="#ddd"
                        strokeWidth={Global.imgScale(6)}
                        fill="none"
                        strokeDasharray={[Math.PI * (Global.imgScale(this.state.chartWidth) +1), Math.PI * (Global.imgScale(this.state.chartWidth) +1) ]}
                    />
                    <Circle
                        /*
                        
                        rotate="-90"
                        */
                        cx={Global.imgScale(this.state.chartWidth)/2}
                        cy={Global.imgScale(this.state.chartWidth)/2}
                        originX={Global.imgScale(this.state.chartWidth)/2}
                        originY={Global.imgScale(this.state.chartWidth)/2}
                        rotate="-90"
                        r={Global.imgScale(this.state.chartWidth)/2 - Global.imgScale(6)}
                        stroke="#0074d9"
                        strokeWidth={Global.imgScale(6)}
                        fill="none"
                        //strokeDasharray="{100 * 0.2}, 100"
                        strokeDasharray={[Math.PI * (Global.imgScale(this.state.chartWidth)-Global.imgScale(11)) * this.state.Piepersend, Math.PI * (Global.imgScale(this.state.chartWidth)) ]}
                    /> 
                    
                </Svg>
                <View style={styles.charView}>
                 <View style={styles.charwordsRow}>
                    <Text style={styles.charwordsH}>WORDS</Text>
                    <View style={styles.charwordsHRow}>
                    <Text style={styles.charwords}>{this.state.tWord.format(0)}</Text>
                    </View> 
                    <Text style={styles.chargoalH}>Daily goal</Text>
                    <Text style={styles.chargoal}>{this.state.goalWord.format(0)}</Text>
                  </View>
                </View> 
              </View>
              <View style={styles.charRowR}>
                <Text style={styles.charText}>{this.state.useActicity}</Text>
                <Text style={styles.charText}>activities</Text>
              </View>  
            {/*this.PieAni()*/}
            </View>          
           </View>           
            <View style={styles.viewpager}>
              <ViewPager
                style={{backgroundColor:'rgba(0,0,0,1)'}}
                dataSource={this.state.dataSource}
                renderPage={this._renderPage.bind(this)}
                b4renderPage={this._b4renderPage}
                fontScaleRate={Global.fontScaleRate()}
                rendImageA={() => <Image style={{width:Global.imgScale(48),height:Global.imgScale(50),marginLeft:Global.imgScale(20)}} source={require('../../resource/images/date_l.png')} />}
                rendImageB={() => <Image style={{width:Global.imgScale(48),height:Global.imgScale(50),marginRight:Global.imgScale(20)}} source={require('../../resource/images/date_r.png')} />}
                onChangePage={this._onChangePage.bind(this)}
                isLoop={true}
                isDisplayDate={true}
                initialPage={currentPage}
                autoPlay={false}/>
              </View>              
            </View>  
            </Image>
            
      );
    }

    draw1To10(){
      var item = [];
      var d1To10=[];
      day=11;
      if(this.state.onLoadedText){
        for(var i=0;i<10;i++){
          var isOld=0;
          if(i<this.state.useDay)
          {
            isOld=1;
          }
          d1To10[i]=[i+1,isOld];
        }
        item = d1To10.map(function(d) {
          if(d[1]==0){
              return (
                <View style={styles.d1to10viewF} key={d[0]}>
                <Text style={styles.d1to10TextF}>{d[0]}</Text>
                </View>
                )
            };
            return (
              <View style={styles.d1to10viewT} key={d[0]}>
              <Text style={styles.d1to10TextT}>{d[0]}</Text>
              </View>
            )
        })
        return (<View style={styles.d1to10Row}>{item}</View>);
      }
    }


    _b4renderPage(pageL2, center, pageR2){
      //console.log("pageL2 "+pageL2 + " center:" + center + " pageR2 "+pageR2);
      
      var cdate = new Date();
      
      if(currentPage!=center){
          if(center ==6 && currentPage == 0){
               currentDate.setDate(currentDate.getDate()-1);
             }else 
             if(center ==0 && currentPage == 6){
               currentDate.setDate(currentDate.getDate()+1);
             }else
             if(center>currentPage){
               currentDate.setDate(currentDate.getDate()+1);
              }else{
                currentDate.setDate(currentDate.getDate()-1);
              }
          newdate = new Date(currentDate);
          newdate.setDate(currentDate.getDate()-2);         
          //PAGES[pageL2] = newdate.toLocaleDateString();
          PAGES[pageL2] = [that.loadActivityData(), newdate.getFullYear()+"-"+(newdate.getMonth()+1)+"-"+newdate.getDate()];
          newdate = new Date(currentDate);
          newdate.setDate(currentDate.getDate()+2);
          var cdn1=new Date(cdate.toDateString()).getTime();
          var cdn2=new Date(newdate.toDateString()).getTime();
          if(cdn1 >= cdn2)
            PAGES[pageR2] = [that.loadActivityData(), newdate.getFullYear()+"-"+(newdate.getMonth()+1)+"-"+newdate.getDate()];
          else
            PAGES[pageR2] = ['',null];
      }
      currentPage = center;
    }

    loadActivityData(){
      var output=[];
      var ActID = Math.floor(Math.random() * 3);
      var DetailID;
      switch (ActID) {
        case 0:
          DetailID= Math.floor(Math.random() * 9)+1;
          output=ActivityCards.AtHome(DetailID);
          break;
        case 1:
          DetailID= Math.floor(Math.random() * 3)+1;
          output=ActivityCards.onTheGo(DetailID );         
          break;
        case 2:
          DetailID= Math.floor(Math.random() * 3)+1;
          output=ActivityCards.OutAndAbout(DetailID);
          break;
        case 3:
          DetailID=1;
          output=ActivityCards.Anything(DetailID);
          break;
        default:
          output="Changing diapers";
          break;
      }
      /*
      var ActImg=img[ActID][DetailID][1];
      var ActName=img[ActID][DetailID][0];
      */
      output[1]=output[1].replace(/\<<Name>>/g, this.state.name);
      output[1]=output[1].replace(/\<<He_She>>/g, this.state.He_She);
      output[1]=output[1].replace(/\<<Him_Her>>/g, this.state.Him_Her);
      output[1]=output[1].replace(/\<<His_Her>>/g, this.state.His_Her);
      output[1]=output[1].replace(/\n/g, "");
      output[2]=ActID;
      output[3]=DetailID;
      /*
      output[4]=ActImg;
      output[5]=ActName;
      */
      return(
        output
      )
  }

    _renderPage(data, pageID) {
      
      /*
      if(pageID == 3){
        return(
          that.pageOne()
        );
      }
      */
      //var cdn1=parseInt(cdate.getFullYear()&cdate.getUTCMonth()&cdate.getDate());
      //var cdn2=parseInt(newdate.getFullYear()&newdate.getUTCMonth()&newdate.getDate());      
      if(data[0]!=''){
        /*
        if(loadDate!=data[1]){
          NetInfo.isConnected.fetch().then(isConnected => {
            if(isConnected){
              this.fetchData(data[1]);
            }else{
                this.showToast("Error! Please check to make sure your phone is connected to a network in order for app to update properly.");
            }
          });
          loadDate=data[1];
        }
        */
        //console.log("true");
        return (
          <View style={styles.page}>
          <View style={styles.scrollView}>      
          {
            /*
            <ScrollView
              ref={(scrollView) => { _scrollView = scrollView; }}
              automaticallyAdjustContentInsets={false}
              showsVerticalScrollIndicator={true}
              onScroll={() => { console.log('onScroll!'); }}
              scrollEventThrottle={100}
            >
            
            <View style={{height:10}}>        
            <Text style={styles.text}>{data[1]}</Text>
            </View>
            <View style={{height:20}}></View>       
          </ScrollView>
          */
          }
          <View style={{flex:1,flexDirection:'row'}}>
            <View style={{flex:0.55,margin:2,overflow:'hidden'}}>
              <Text style={{fontWeight:'bold',fontSize:Global.fontscale1(26), textAlign:'center'}} numberOfLines={1}>{data[0][0]}</Text>
              <Text style={{flex: 1, fontSize:Global.fontscale1(22), textAlign:'center'}}  numberOfLines={7}>{data[0][1]}</Text>
            </View>
            <View style={{flex:0.45,justifyContent:"flex-start",flexDirection:'column',borderLeftColor:'#eee',borderLeftWidth:2}}>
              <View style={{flex:0.3,height:Global.imgScale(60),justifyContent:"center"}}>
              <TouchableWithoutFeedback onPress={() => {if(Global.navigator) {
                                                    Global.ActID=data[0][2];
                                                    Global.DetailID=data[0][3];
                                                    Global.ActImg=img[data[0][2]][data[0][3]-1][1];
                                                    Global.ActName=img[data[0][2]][data[0][3]-1][0];
                                                    Global.navigator.push({
                                                        name: 'Recording',
                                                        component: Recording,
                                                    })}}}>
              <Image
                style={{height:Global.imgScale(60), alignSelf:"center"}}
                resizeMode='contain'
                source={require('../../resource/images/home_play.png')}
              />
              </TouchableWithoutFeedback>
              </View>
              <View style={{flexDirection:'row',flex:0.55,borderTopColor:'#eee',borderTopWidth:2}}>
                <View style={{flex:0.7,justifyContent:"center"}}>
                  <Text style={{fontWeight:'bold',fontSize:Global.fontscale1(22), margin:2,textAlign:'center'}}>Duration</Text>
                  <Text style={{fontSize:Global.fontscale1(20), margin:2,textAlign:'center'}}>15 min</Text>
                </View>
                <View style={{flex:0.5,borderLeftColor:'#eee',borderLeftWidth:2,justifyContent:"center"}}>
                  <Text style={{fontWeight:'bold',fontSize:Global.fontscale1(22), margin:2,textAlign:'center'}}>Skill</Text>
                  <Text style={{fontSize:Global.fontscale1(20), margin:2,textAlign:'center'}}>Speech</Text>
                </View>
              </View>          
            </View>
          </View>
          <View style={{}}>          
          </View>
          </View>
          </View>
        )
      }else{
        // console.log("false");
        return (<View style={styles.page}></View>);
      }
    }

    _onChangePage( page ) {
      console.log("_onChangePage:"+page+' | '+PAGES[page][1]);
      
      if(this.state.fristLoad==false){
      if(PAGES[page][1]!=null){            
        NetInfo.isConnected.fetch().then().done(() => {
            if(Global.getConnected()){
              this.setState({
                Piepersend: 0,
                tWord: 0,
              });
              this.fetchData(PAGES[page][1],0);
            }else{
                this.showToast("Error! Please check to make sure your phone is connected to a network in order for app to update properly.");
            }
          });
        }
      }else{
          this.state.fristLoad=false;
      }
    }

    setDisplayData(ytd, td){
      this.state.ytd = ytd;
      this.state.td = td;
    }    

    doanimation(){
      setTimeout(() => {

        this.state.anim=[1,2].map(() => new Animated.Value(2.0)); 
        var timing = Animated.timing;
        Animated.sequence([
          Animated.stagger(100,[timing(this.state.anim[0], {
                    toValue: 2.0 - (1.3 * this.state.ytd) - 0.34
                }),
          timing(this.state.anim[1], {
              toValue: 2.0 - (1.3 * this.state.td) - 0.34
          })])]
        ).start();
        
      }, 0);
      
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

Number.prototype.format = function(n, x) {
    var re = '(\\d)(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$1,');
};


const styles = StyleSheet.create({
  chart_container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    height:Global.imgScale(svgH+50),
    paddingTop:Global.imgScale(20),
  },  
  viewcharttxt:{
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartpercent: {
    fontWeight: 'bold',
    fontSize: Global.fontscale1(36),
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    color: '#ffffff',
    marginTop: -Global.imgScale(40),
  },
  chartdatetxt: {
    fontSize: Global.fontscale1(20),
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    color: '#ffffff',
    marginTop: -Global.imgScale(6),
  },
  viewchartbg: {   
    width: width, 
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',    
    alignSelf:'center',
    height:Global.imgScale(svgH),
    marginTop:Global.imgScale(35),
    marginBottom:Global.imgScale(5),
    /*justifyContent: 'center',
    alignItems: 'right',
    marginLeft: -55,*/
  },
  blockLeft: {
    marginRight:Global.imgScale(5),
    /*
    alignItems: 'right',
    marginLeft: -55,*/
  },
  blockRight: {
    marginLeft: Global.imgScale(5),
    /*marginLeft: 55,*/
  },
  viewchartrow: {
    flex: 1,
    width: width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height:Global.imgScale(svgH),
    position: 'absolute',
    left:2,
    bottom: 0,
    alignSelf:'center',
    /*justifyContent: 'center',
    alignItems: 'right',
    marginLeft: -55,*/
  },  
  page: {
    flex: 1
  },
  scrollContent:{
    flex: 1,
  },
  scrollView:{
    flex: 1,
    backgroundColor: '#fff',
    margin:Global.imgScale(15),   
    marginTop:0,
    marginBottom:Global.imgScale(30),
    padding: Global.imgScale(2), 
    borderRadius: 10,
    shadowColor: "#111111",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: {
      height: 2,
      width: 1
    }
  },
  text: {
    marginLeft: Global.imgScale(5),
    marginRight: Global.imgScale(5),
    fontSize: Global.fontscale1(26),
    color: "#003366",
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  viewpager: {
    flex: 1,
    margin:Global.imgScale(5),
    /*
    borderColor: 'rgba(10,10,10,0.2)',
    borderWidth: 2,
    borderRadius: 10,
    */
  },
  d1to10Row:{
    flexDirection: 'row',
  },  
  d1to10viewF:{   
    minWidth:Global.fontscale1(35),
    minHeight:Global.fontscale1(35),
    width:Global.fontscale1(40),
    height:Global.fontscale1(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Global.imgScale(3),
  },
  d1to10viewT:{    
    borderBottomColor:'rgba(255,0,0,0.5)',
    borderBottomWidth: 3,
    backgroundColor:'rgba(255,0,0,0.0)',
    /*
    borderColor: 'rgba(255,0,0,0.5)',
    borderWidth: 2,
    borderRadius: 80,*/
    minWidth:Global.fontscale1(35),
    minHeight:Global.fontscale1(35),
    width:Global.fontscale1(40),
    height:Global.fontscale1(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Global.imgScale(3),
    marginRight: Global.imgScale(3),
   
  },
  d1to10TextF:{
    flex: 1, 
    fontSize: Global.fontscale1(32),    
    color:'#000',
    textAlign:'center',
    fontWeight:'bold'
  },  
  d1to10TextT:{
    flex: 1, 
    fontSize: Global.fontscale1(32),    
    color:'#000',
    textAlign:'center',
    fontWeight:'bold'
  }, 
  charRowL:{   
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  charRowR:{
    flex: 1,  
    justifyContent: 'center',
    alignItems: 'center',
  },
  charRowM:{
    width:Global.imgScale(160+2),
    height:Global.imgScale(160+2),
  },
  charRow:{
    flexDirection: 'row',
    flex: 1,
  },
  charText:{
    fontSize: Global.fontscale1(28),
    fontWeight: 'bold',
  },
  charView:{    
     position: 'absolute',
      width: Global.imgScale(150),
      height: Global.imgScale(150),
      top: Global.imgScale(5),
      left: Global.imgScale(3),
  },
  charwordsRow:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  charwordsH:{
    fontSize: Global.fontscale1(30),
    color: "#bbb",
  },
  charwordsHRow:{
    borderBottomColor: 'rgba(0,0,0,1)',
    borderBottomWidth: 2,
  },
  charwords:{
    fontSize: Global.fontscale1(50),
    fontWeight: 'bold',
    color: "#000",
  },
  chargoalH:{
    fontSize: Global.fontscale1(28),
    color: "#999",
  },
  chargoal:{
    fontSize: Global.fontscale1(30),
    fontWeight: 'bold',
  },
});
