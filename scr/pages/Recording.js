
import React, { Component } from 'react';

import {
  Recorder,
  MediaStates
} from 'react-native-audio-toolkit';
//var Featured = require('./scr/Featured');
//var Search = require('./scr/Search');

import {
  StyleSheet, 
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
  AsyncStorage,
  Platform
  } from 'react-native'; // 使用简写

import BackgroundTimer from 'react-native-background-timer';
import Toast from 'react-native-root-toast';
import RNFS from 'react-native-fs';
import KeepAwake from 'react-native-keep-awake';
import Modal from 'react-native-modalbox';
import CheckBox from 'react-native-checkbox';
import Button from 'react-native-button';

var FileUpload = require('NativeModules').FileUpload;

var {height, width} = Dimensions.get('window');

let Global = require('../Global.js');
let ActivityCards = require('../../resource/data/ActivityCards.js');

let img_rec = require('../../resource/images/record.png');
let img_stop = require('../../resource/images/stop.png');
let reload = require('../../resource/images/reload.png');
let share = require('../../resource/images/share.png');
let flagge = require('../../resource/images/flagge.png');
let favorites = require('../../resource/images/favorites.png');
var recTimer;
var _props;
var filedate="";
let filename=["","",""];
let crfile=0;
let crRecorder=0;

let back_img = require('../../resource/images/back.png');
var recTimer, recTimer_min=0, recTimer_sec=0;
var dateOnStartRecord = new Date();
export default class Recording extends Component {
    constructor(props) {
        super(props);
        _props=props;
        //props.isRecording = false;
        this.state = {
            img1: props.isRecording ? require('../../resource/images/stop.png') : require('../../resource/images/record.png'),
            isRecording:false,    
            playPauseButton: 'Preparing...',
            recordButton: 'Preparing...',
            stopButtonDisabled: true,
            playButtonDisabled: true,
            recordButtonDisabled: true,
            loopButtonStatus: false,
            progress: 0,
            error: null,
            pagedata:"Hello, This is a app! it call Thriveful!",
            header:<Text style={styles.HeaderText}>Recording    00:00</Text>,         
            recDuration: "00:00",
            min:"00",
            sec:"00",
            name : null,
            bday : null,
            sex : null,
            photo: null,
            images: null,
            He_She: "she",
            Him_Her: "her",
            His_Her: "her",            
            showAgain : false,
        };        
    }

     componentDidMount() {
        AsyncStorage.getItem("RecordReminder").then((value) => {
          console.log("componentDidMount RecordReminder="+value);
            this.setState({showAgain: value});
        }).done();        
    }

  componentWillMount() {
    Global.setPermission();
    this.recorder = [null,null,null];
    this.lastSeek = 0;

    AsyncStorage.getItem("name").then((value) => {
          this.setState({name: value});
      }).done();
      AsyncStorage.getItem("sex").then((value) => {
          this.setState({sex: value});
          if(value=="Boy"){
            this.state.He_She="he";
            this.state.Him_Her="him";
            this.state.His_Her="his";
          }
      }).done();

    filedate = Global.getUserID()+"_"+Math.round((new Date()).getHours() / 4).toString() + 
            (new Date()).getMinutes().toString() +
            (new Date()).getSeconds().toString() +
            (new Date()).getMilliseconds().toString();

    this._reloadRecorder();
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
      <TouchableOpacity onPress={() => this.goback()}>
      <Image
        style={{flex:1,alignSelf:'center',justifyContent:'center'}}
        source={back_img}
      />
      </TouchableOpacity>
      {this.state.header}
      </View>

        <View style={styles.page}>          
        
          <View style={styles.scrollView}>  
          <ScrollView
          ref={(scrollView) => { _scrollView = scrollView; }}
          automaticallyAdjustContentInsets={false}
          showsVerticalScrollIndicator={true}
          onScroll={() => { console.log('onScroll!'); }}
          scrollEventThrottle={200}>
          <View style={{flexDirection: 'column',flex:1,marginBottom:10,marginTop:5}}>
          <View style={{height:width / 5,flexDirection: 'row',}}>
          <Image style={{width:width / 5 ,height:width / 5,marginLeft:10}}
            source={Global.ActImg}
          />
          <View style={{flexDirection: 'row',alignItems:'center',justifyContent:'center',marginLeft:20}}>
          <Text style={styles.nameText}>{Global.ActName}</Text>
          </View>
          </View>
          <Text style={styles.text}>{this.loadpagedata()}</Text>
          <View style={{height:30}}></View>
          </View>
          </ScrollView>
          </View>
        
        </View>

        <View style={styles.bottomBar}>
        <TouchableOpacity       
            onPress={() => this.toREC()}
            activeOpacity={0.8}>
        <View  style={styles.button}>
        <Image style={styles.img} source={this.renderBtnImg()} />
        <Text>Record</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity       
            onPress={this._onPressButton}
            activeOpacity={0.8}>
        <View  style={styles.button}>
        <Image style={styles.img} source={favorites} />
        <Text>Favorites</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity       
            onPress={this._onPressButton}
            activeOpacity={0.8}>
        <View  style={styles.button}>
        <Image style={styles.img} source={flagge} />
        <Text>flagge</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity       
            onPress={this._onPressButton}
            activeOpacity={0.8}>
        <View  style={styles.button}>
        <Image style={styles.img} source={reload} />
        <Text>Redo</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity       
            onPress={this._onPressButton}
            activeOpacity={0.8}>
        <View  style={styles.button}>
        <Image style={styles.img} source={share} />
        <Text>Share</Text>
        </View>
        </TouchableOpacity>        
        </View> 
        <Modal style={[styles.modal, styles.modal1]} position={"center"} ref={"modal1"} isDisabled={this.state.isDisabled}>
        <View style={styles.ReminderRow} >    
        <Text style={styles.ReminderClose} onPress={() => this.CloseReminder1()}>[Close]</Text>
        <Text style={styles.ReminderTitle}>Reminder 1:</Text>
        <Text style={styles.Reminder}>If you have an app-cleaner program, please remember to include our Thriveful App on your list of "Do Not Clean". Failure to do so may cause our Thriveful App to crash.{"\n\n"}</Text>
        <Text style={styles.ReminderTitle}>Reminder 2:</Text>
        <Text style={styles.Reminder}>Focus on doing the activity with your child. Do not take calls, check emails or check texts. Also please do not inadvertantly turn off your screen as this may stop Thriveful from performing it's assessment.{"\n\n"}</Text>
        </View>
        <View style={styles.checkbox} >
        <CheckBox
            label="Do't show it again."
            checked={JSON.parse(this.state.showAgain)}
            onChange={(checked) => this.changeShowAgain(checked)}
            />
        </View>
        </Modal>

        <Modal style={[styles.modal, styles.modal2]} position={"center"} ref={"modal2"} isDisabled={this.state.isDisabled}>
        <View style={styles.ReminderRow} >    
        <Text style={styles.ReminderClose} onPress={() => this.CloseReminder2()}>[Close]</Text>
        <Text style={styles.ReminderTitle}>Are you sure you want to exit? {'\n'}If so, please press the "stop" button before exiting this activity.</Text>       
        </View>
        </Modal>        
      </View>
    );
  }  

  changeShowAgain(val){
      AsyncStorage.setItem('RecordReminder', val.toString());
      this.setState({showAgain: val});
      //console.log("changeShowAgain:"+val);
  }

  CloseReminder1(){
    this.refs.modal1.close();
  }

  CloseReminder2(){
    this.refs.modal2.close();
  }


  loadpagedata(){
    var output;
    switch (Global.ActID) {
      case 0:
        output=ActivityCards.AtHome(Global.DetailID);
        break;
      case 1:
        output=ActivityCards.onTheGo(Global.DetailID);
        break;
      case 2:
        output=ActivityCards.OutAndAbout(Global.DetailID);
        break;
      case 3:
        output=ActivityCards.Anything(Global.DetailID);
        break;
      default:
        output="Changing diapers";
        break;
    }
    output[1]=output[1].replace(/\<<Name>>/g, this.state.name);
    output[1]=output[1].replace(/\<<He_She>>/g, this.state.He_She);
    output[1]=output[1].replace(/\<<Him_Her>>/g, this.state.Him_Her);
    output[1]=output[1].replace(/\<<His_Her>>/g, this.state.His_Her);
    Global.ID_Activity=output[2];
    return(
      output[0]+"\n"+output[1]
    )
  }

  _reloadRecorder() {
    if (this.recorder[crRecorder]) {
      this.recorder[crRecorder].destroy();
     // console.log("this.recorder");
    } 

    console.log("Filename:"+ filedate);  
    filename[crfile] =   filedate +`.mp4`;              
    this.recorder[crRecorder] = new Recorder(filename[crfile], {
      bitrate: 16000,
      channels: 1,
      sampleRate: 16000,
      quality: 'max',
      //format: 'amr', // autodetected
      //encoder: 'amr', // autodetected
    });
  }

  _toggleRecord() {  

    this.recorder[crRecorder].toggleRecord((err, stopped) => {
      if (err) {
        this.setState({
          error: err.message
        });
      }
      if (stopped) {
        
        this._reloadRecorder();        
        console.log("stopped");
        KeepAwake.deactivate();
        this._upload();
      }
    });
  }

  goback(){
    if(this.state.isRecording==true)
    {
      this.refs.modal2.open();      
    }else{
      Global.navigator.pop();
    }
    return true;
  }

  onReturnBtn(){
    this.state.isRecording = false;
    BackgroundTimer.clearInterval(recTimer);
    crfile=0;

    console.log("Stop Recording");
    this._toggleRecord();
    Global.navigator.pop();
  }

  renderBtnImg(){
      if(this.state.isRecording==false){
        return(
           require('../../resource/images/record.png')
        )
      }      
      else{
        return(
           require('../../resource/images/stop.png')
        )
      }
  }

  _upload(){
    //console.log("_upload");    
    Global.db.transaction((tx) => {
      /*
        var obj = {
          //uploadUrl: 'http://10.0.2.2:3000/upload',
          uploadUrl: 'http://thriveful.leslie-works.cu.cc/upload.php',
          method: 'POST', // default 'POST',support 'POST' and 'PUT'
          headers: {
              //'Accept': 'application/json',
          },
          fields: {
              'hello': 'world',
          },
          files: [
            {
              action: '',
              name: 'one', // optional, if none then `filename` is used instead
              filename: filename, // require, file name
              filepath: RNFS.DocumentDirectoryPath+"/"+filename, // require, file absoluete path
              //filetype: 'audio/x-m4a', // options, if none, will get mimetype from `filepath` extension
            },
          ]
        };
        FileUpload.upload(obj, function(err, result) {
          console.log('upload:', err, result);        
        });
      */

      Global.db.transaction(function(tx) {
        var fn ="";
        if(crfile==0){
          fn=filename[2];
        }else{
          fn=filename[crfile-1];
        }        
        tx.executeSql("INSERT INTO audio (id_activity, path,name,date_create) VALUES (?, ?,?, datetime('now', 'localtime'))", [Global.ID_Activity.toString(),RNFS.DocumentDirectoryPath+"/"+fn, fn]);
      }, function(error) {
          console.log('transaction error:', error);  
          //Toast.showShortCenter.bind(null, "Can't Save your voice. try it again")
      }, function() {       
          //Toast.showShortCenter.bind(null, "Saved your voice. And will be upload") 
          Global.settimer();
      });    
    });
  }

  toREC(){         
    if(this.state.isRecording==false){         
        if(!JSON.parse(this.state.showAgain)){
            this.refs.modal1.open();
        }
        KeepAwake.activate();
        this.state.isRecording = true;
        //_props.RECTime(true);
        //this.props.onREC(true);
        dateOnStartRecord = new Date();
        recTimer_min=0;
        recTimer_sec=0;   
        var oss = 0;
          recTimer = BackgroundTimer.setInterval(()=>{
            /*
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
              
              */
              recTimer_sec++; 
              var date2 = new Date();

              var diff = date2.getTime() - dateOnStartRecord.getTime();

              var msec = diff;
              var hh = Math.floor(msec / 1000 / 60 / 60);
              if(hh<10){
                hh = "0"+hh;
              }
              msec -= hh * 1000 * 60 * 60;
              var mm = Math.floor(msec / 1000 / 60);
              if(mm<10){
                mm = "0"+mm;
              }
              msec -= mm * 1000 * 60;
              var ss = Math.floor(msec / 1000);
              if(ss<10){
                ss = "0"+ss;
              }
              //msec -= ss * 1000;
              if(ss!=oss){
                //this.state.recDuration=mm+":"+ss;
                this.state.min=mm;
                this.state.sec=ss;
                this.state.header=<Text style={styles.HeaderText}>Recording    {this.state.min}:{this.state.sec}</Text>;
                //this.setState({ min:mm, sec:ss  });
                this.setState({money: 10}, () => {
                  this.setState({                      
                  });
                });
                oss=ss;
              }

              //if(recTimer_min>=5 && recTimer_min%5==0 && recTimer_sec==0){
              if(recTimer_sec>=1000){
                console.log("Time On 10 Min : " + mm+":"+ss);
                //this._toggleRecord();               

                crfile++;
                if(crfile>2){
                  crfile=0;
                }

                this._upload();                

                filedate = Global.getUserID()+"_"+Math.round((new Date()).getHours() / 4).toString() + 
                            (new Date()).getMinutes().toString() +
                            (new Date()).getSeconds().toString() +
                            (new Date()).getMilliseconds().toString();

                this._reloadRecorder();                
                this._toggleRecord();
                recTimer_sec=0;
              }
              
              //that.state.recDuration=dp_min+":"+dp_sec
              //console.log(dp_min+":"+dp_sec);
              //console.log(mm+":"+ss);
          },300);

        filedate = Global.getUserID()+"_"+Math.round((new Date()).getHours() / 4).toString() + 
              (new Date()).getMinutes().toString() +
              (new Date()).getSeconds().toString() +
              (new Date()).getMilliseconds().toString();

      crfile++;
      if(crfile>2){
        crfile=0;
      }
      
       this._reloadRecorder();
        this._toggleRecord();
    }      
    else{
        this.state.isRecording = false;
        //this.props.onREC(false);
        BackgroundTimer.clearInterval(recTimer);

        crfile++;
        if(crfile>2){
          crfile=0;
        }

        console.log("Stop Recording");
        this._toggleRecord();
    }
    this.setState({});
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: '#FAFAFA'
  },
  bottomBar:{
      flex: 0.2,
      marginBottom: 20,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: '#FAFAFA'
  },
  button: {
    marginLeft: 4,
    marginRight: 4,
    padding: 2,
    alignItems: 'center',
    backgroundColor: '#eaeaea',
    borderRadius: 3,
    flexDirection: 'column',
  },
  img: {
    width: width / 5 - 30,
    height: width / 5  - 30,
    margin: 5,
  },
  page: {
    flex: 1,    
    marginTop:5,
  },
  scrollContent:{
    flex: 1,
  },
  scrollView:{
    flex: 1,
    backgroundColor: '#22ADC2',
    marginLeft:25,   
    marginTop:0,
    marginRight:25,  
    padding: 5, 
    borderRadius: 10,
    shadowColor: "#111111",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: {
      height: 2,
      width: 1
    }
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
  text:{
    fontSize: Global.fontscale1(24),
    fontWeight: '600',
    padding:5,
  },
  nameText:{
    fontSize: Global.fontscale1(32),
    flex:1,
    color: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal1: {
        height: Global.imgScale(420),
        width: Global.imgScale(320)
  },
  modal: {
      justifyContent: 'center',
      borderRadius: 10,
  },
  modal2: {
        height: Global.imgScale(80),
        width: Global.imgScale(320)
  },
  ReminderTitle:{
    fontSize: Global.fontscale1(24),
    fontWeight: 'bold',
  },
  Reminder:{
    fontSize: Global.fontscale1(20),
  },  
  checkbox:{
    padding:5, 
  },  
  ReminderRow:{
    padding:10,    
  },  
  ReminderClose:{
    fontSize: Global.fontscale1(20),
    color:"#ccc",
    alignSelf: 'flex-end',
  },

});