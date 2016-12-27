import React, { Component } from 'react';

import {
  PixelRatio,
  Dimensions,
  NetInfo,
  InteractionManager,
  Platform,
} from 'react-native';

import TimerMixin from 'react-timer-mixin';
import BackgroundTimer from 'react-native-background-timer';
import SQLite from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';
import {requestPermission, checkPermission} from 'react-native-android-permissions';

var FileUpload = require('NativeModules').FileUpload;
var db;

var {height, width} = Dimensions.get('window');

var $count = 0;
var uploading=false;
var deadline=10000;
var userID=-999999;
var badyID=-999999;
var Connected=true;

var Global = {
    
    getUserID()
    {
      return userID;
    },

    setUserID(id)
    {
      userID = id;
    },

    getBadyID()
    {
      return badyID;
    },

    setBadyID(id)
    {
      badyID = id;
    },

    getDeadline()
    {
      return deadline;
    },

    fontscale1(size){      
     //console.log("width:",width);
     //return size * (1.69 / PixelRatio.getFontScale().toFixed(2)) * PixelRatio.get().toFixed(2);
     return size * (((width / 360)-0.4) / PixelRatio.getFontScale().toFixed(2)) * PixelRatio.get().toFixed(2);
    },

    fontScaleRate(){
     //return size * (1.69 / PixelRatio.getFontScale().toFixed(2)) * PixelRatio.get().toFixed(2);
     return (((width / 360)-0.4) / PixelRatio.getFontScale().toFixed(2)) * PixelRatio.get().toFixed(2);
    },

    imgScale(size){
      return size * (width / 360);
    },

    settimer(){
      /*
      recTimer = TimerMixin.setInterval(()=>{
          NetInfo.isConnected.fetch().then(isConnected => {
            console.log('First, is ' + (isConnected ? 'online' : 'offline'));
            if(isConnected){
              this.db.transaction((tx) => {
                tx.executeSql('SELECT * FROM audio WHERE `status`=0 LIMIT 1', [], (tx, results) => {          // Get rows with Web SQL Database spec compliance.
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                      let row = results.rows.item(i);
                      console.log(`Audio Path: ${row.path}, Dept Name: ${row.name}`);
                      this.uploadfile(row.id.toString(), row.name, row.path);
                    }
                  });
              });
            }
          });
          $count++; 
          console.log("Count:",$count);
      },10000);
      */
      const intervalId = BackgroundTimer.setInterval(() => {
        NetInfo.isConnected.fetch().then().done(() => {
            //console.log('First, is ' + (isConnected ? 'online' : 'offline'));
            BackgroundTimer.clearInterval(intervalId);
            if(Global.getConnected() && uploading==false){
              this.db.transaction((tx) => {
                tx.executeSql('SELECT * FROM audio WHERE `status`=0 LIMIT 1', [], (tx, results) => {          // Get rows with Web SQL Database spec compliance.
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                      let row = results.rows.item(i);
                     // console.log(`Audio Path: ${row.path}, Dept Name: ${row.name}`);
                     this.uploadfile(row.id.toString(), row.id_activity.toString(),row.name, row.path, row.date_create);
                    }
                    if(len==0){
                      BackgroundTimer.clearInterval(intervalId);
                    }
                  });
              });
            }
          });
          $count++; 
         // console.log("Count:",$count);
    }, 10000);
    },

    uploadfile(id, id_activity, name, path, date_create){
      Global.setPermission();
      console.log("date_create:",date_create);
      uploading=true;
      let URL = 'http://thriveful.leslie-works.cu.cc/upload.php';
     
     /* if (__DEV__) {
          URL='http://thriveful.leslie-works.cu.cc/upload_test.php';
      }
      */
      var obj = {
          //uploadUrl: 'http://10.0.2.2:3000/upload',
          uploadUrl: URL,
          method: 'POST', // default 'POST',support 'POST' and 'PUT'
          headers: {
              'Accept': 'application/json',
          },
          fields: {
              'id': id,
              'id_activity':id_activity,
              'userID':this.getUserID().toString(),
              'babyID':this.getBadyID().toString(),
              'date':date_create,
          },
          files: [
            {
              action: "",
              name: 'one', // optional, if none then `filename` is used instead
              filename: name, // require, file name
              filepath: path, // require, file absoluete path
              //filetype: 'audio/x-m4a', // options, if none, will get mimetype from `filepath` extension
            },
          ]
        };
        InteractionManager.runAfterInteractions(() => {
          setTimeout(() => {
          FileUpload.upload(obj, function(err, result) {          
            //console.log('upload:', err, result);
            //var data = JSON.parse(result);          
            if(result.data!='fail'){
              console.log("result:",result);
              Global.updateDate(result);
            }else{
              console.log("result fail:",result, err);
            }
            Global.settimer();
            uploading=false;
          });
          },0);
        });
    },

    updateDate(result){
       console.log("updateDate");    
       var data = JSON.parse(result.data);
        this.db.transaction(function(tx) {
          tx.executeSql('DELETE FROM `audio` WHERE id=?', [data.id]);
        }, function(error) {
            console.log("UPDATE DB: error");
        }, function() {
            console.log("UPDATE DB: OK"); 
            RNFS.unlink(RNFS.DocumentDirectoryPath+"/"+data.file)
            .then(() => {
              console.log('FILE DELETED');
            })
            // `unlink` will throw an error, if the item to unlink does not exist
            .catch((err) => {
              console.log(err.message);
            })
        });  
    },

    errorCB(err) {
      console.log("SQL Error: " + err);
    },

    successCB() {
      console.log("SQL executed fine");
    },

    openCB() {
      console.log("Database OPENED");
    },

    setPermission() {  
      if(Platform.OS==='android'){
        console.log("setPermission");
        var permiss = [
          "android.permission.CAMERA",
          "android.permission.WRITE_EXTERNAL_STORAGE",
          "android.permission.RECORD_AUDIO",
          "android.permission.READ_PHONE_STATE"
        ]
        let pers = ['android.permission.WRITE_EXTERNAL_STORAGE','android.permission.CAMERA','android.permission.RECORD_AUDIO','android.permission.READ_PHONE_STATE'];
          setTimeout(() => {
            requestPermission(pers).then((result) => {
                console.log("Granted!", result);
                // now you can set the listenner to watch the user geo location
              }, (result) => {
                console.log("Not Granted!");
                console.log(result);
                alert("Some function can't run. Give me permission Please.");
              });
            // for the correct StatusBar behaviour with translucent={true} we need to wait a bit and ask for permission after the first render cycle
            // (check https://github.com/facebook/react-native/issues/9413 for more info)
            }, 0);
      }
    },

    checkNetwork(){      
        NetInfo.isConnected.addEventListener('change', (isConnected) => {
          this.setConnected(isConnected);
        });
    },

    setConnected(data){
      Connected=data;
    },

    getConnected(){
      return Connected;
    },
};

module.exports = Global;