'use strict';
import React, { Component } from 'react';

import {
  StyleSheet,
  Image,
  Text,
  View,
  TextInput,
  AsyncStorage,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';

import {NativeModules, Dimensions} from 'react-native';
var ImagePicker = NativeModules.ImageCropPicker;

import DatePicker from 'react-native-datepicker';
import { SegmentedControls } from 'react-native-radio-buttons'
import Button from 'react-native-button';
import Modal from 'react-native-modalbox';
import Toast from 'react-native-root-toast';
//import Popup from 'react-native-popup';

import Home from './Home.js';
import UserFile from './Register2.js';

let Global = require('../Global');

let img_t1=require('../../resource/images/reg_t1.png');
let img_next=require('../../resource/images/reg_next.png');
let img_btn = [
        [require('../../resource/images/reg_father_btn.png'),require('../../resource/images/reg_father_btn_o.png')],
        [require('../../resource/images/reg_mother_btn.png'),require('../../resource/images/reg_mother_btn_o.png')],
        [require('../../resource/images/reg_other_btn.png'),require('../../resource/images/reg_other_btn_o.png')],
    ];

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

export default class Register1 extends Component {
    constructor(props){
        super(props);
        this.state = {
            img_btn : 0,
        }
    }

    componentDidMount() {
        AsyncStorage.getItem("photo").then((value) => {
            this.state.photo=value;
        }).done();
    }
  
    saveData(s, data){
        switch (s) {
            case "name":
                this.setState({name:data});
                break;
            case "bday":
                this.setState({bday:data});
                break;
            case "sex":
                this.setState({sex:data});
                break;
            default:
                break;
        }
        AsyncStorage.setItem(s, data);
    }

    toSetPhoto(){
        return(
            <View style={styles.photoWrapper}>
            <TouchableWithoutFeedback onPress={()=>this.openModal1()}>
            <View style={styles.photorow}>
                {this.rendPhotoText()}
            </View>
            </TouchableWithoutFeedback>
            </View>
        )
    }

    rendPhotoText(){
        if(this.state.photo==null)
        return(
            <Text style={styles.phototext}>Upload Photo Here</Text>
        );
        else
        return (
            <Image
            style={styles.photoimg}
            source={{uri: this.state.photo}}
            />
        );       
    }

    pickSingleWithCamera(cropping) {
        ImagePicker.openCamera({
        width: 400,
        height: 400,
        cropping: cropping,
        includeBase64: true
        }).then(image => {
        //console.log('received image', image);
        this.setState({
            photo: `data:${image.mime};base64,`+ image.data,
            images: null
        });
        AsyncStorage.setItem("photo", `data:${image.mime};base64,`+ image.data);
        this.refs.modal1.close();
        }).catch(e => alert(e));
    }

    pickSingleBase64(cropit) {
        ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: cropit,
        includeBase64: true
        }).then(image => {
        //console.log('received image', image);
        this.setState({
            photo: `data:${image.mime};base64,`+ image.data,
            images: null
        });
        AsyncStorage.setItem("photo", `data:${image.mime};base64,`+ image.data);
        this.refs.modal1.close();
        }).catch(e => {});
    }  

    onClick(val){
        this.setState({img_btn: val});
        if(val==1){
            Global.userRole="Father";
        }else if(val==2){
            Global.userRole="Mother";
        }else if(val==3){
            this.refs.modal1.open();
        }
        //console.log("userRole:"+Global.userRole);
    }

    onPopClick(val){
        //this.refs.modal1.close();
        this.refs.modal1.close();
        if(val=="Other"){
            Global.userRole="";
            this.refs.modal2.open();
        }else{
            Global.userRole=val;
        }
        //console.log("userRole:"+Global.userRole);
    }

    onPop2TextChange(txt){
        //this.refs.modal1.close();
        /*if(val=="Other"){
            this.refs.modal2.open();
        }
        */
        Global.userRole=txt;
        //console.log("txt:"+txt);
    }
    onPop2Click(val){
        //this.refs.modal1.close();
        /*if(val=="Other"){
            this.refs.modal2.open();
        }
        */
        this.refs.modal2.close();
        if(val=="cancel"){
            this.setState({img_btn: 0});
        }else if(val=="ok"){
            if(Global.userRole==""){
                this.setState({img_btn: 0});
            }            
        }
        //console.log("userRole:"+Global.userRole);
    }

    goNext(){
        if(this.state.img_btn==0){
            //this.showToast("Are you a ...?")
            alert("Are you a ...?");
            return false;
        }
        if(Global.navigator) {
            Global.navigator.replace({
                name: 'UserFile',
                component: UserFile,
            })
        }

    }

    render() {
        return(
            <Image 
                style={{width:deviceWidth+5,height:deviceHeight+5}}
                source={require('../../resource/images/bg_01.png')}
            >
            <View style={styles.wrapper}>  
                <View style={{alignItems:'center', marginTop:Global.imgScale(10)}}>
                    <Image style={{height:Global.imgScale(50)}}
                        resizeMode='contain'
                        source={img_t1}
                    />
                </View>
                <View style={{flex:1,flexDirection:'column',marginTop:Global.imgScale(-100)}}>               
                    <View style={{alignItems:'center',justifyContent:'center',flex:1}}>
                        <TouchableWithoutFeedback onPress={()=>this.onClick(1)}>
                        <Image style={{height:Global.imgScale(50),margin:Global.imgScale(5),marginBottom:Global.imgScale(50)}}
                            resizeMode='contain'
                            source={this.state.img_btn==1?img_btn[0][0]:img_btn[0][1]}
                            on
                        />
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>this.onClick(2)}>
                        <Image style={{height:Global.imgScale(50),margin:Global.imgScale(5),marginBottom:Global.imgScale(50)}}
                            resizeMode='contain'
                            source={this.state.img_btn==2?img_btn[1][0]:img_btn[1][1]}
                        />
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>this.onClick(3)}>
                        <Image style={{height:Global.imgScale(50),margin:Global.imgScale(5),marginBottom:Global.imgScale(50)}}
                            resizeMode='contain'
                            source={this.state.img_btn==3?img_btn[2][0]:img_btn[2][1]}
                        />
                        </TouchableWithoutFeedback>
                    </View>
                </View>  
                <View style={{position:'absolute',right:0,left:0,bottom:Global.imgScale(40),flexDirection:'row',}}>
                    <View style={{position:'absolute',right:0,left:0,justifyContent:'center',alignItems:'center',flex:1}}>
                        <Text style={styles.bottomText}>1 out of 3</Text>
                    </View>
                    <View style={{justifyContent:'flex-end',alignItems: 'flex-end',flex:1}}>
                        <TouchableWithoutFeedback onPress={()=>this.goNext()} >
                        <Image style={{height:Global.imgScale(40)}}
                            resizeMode='contain'
                            source={img_next}
                        />                    
                    </TouchableWithoutFeedback>
                    </View>
                </View>
            {/*
            <View style={styles.Container}>
                <View style={styles.cellfixed}>            
                </View>  
                <View style={styles.root}>
                    {this.toSetPhoto()}
                <View style={styles.infoWrapper}>
                
                <View style={styles.inputRow}>
                <TextInput
                    style={styles.textEdit}
                    onChangeText={(text) => this.saveData("name", text)}
                    placeholder="Child's first name"
                    placeholderTextColor={'#c9c9c9'}
                />
                </View>
                <View style={styles.inputRow}>
                <DatePicker                    
                    style={styles.Dday}
                    date={this.state.bday}
                    mode="date"
                    placeholder="Your child's date of birth"
                    format="YYYY-MM-DD"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"                   
                    onDateChange={(date) => this.saveData("bday", date)}
                    showIcon={false}
                />
                </View>
                <View style={{marginTop: 15, backgroundColor: 'white', borderRadius: 10}}>
                <SegmentedControls
                    options={ options }
                    onSelection={ this.setSelectedOption.bind(this) }
                    selectedOption={ this.state.sex }
                    allowFontScaling={ false }
                />
                </View>      
                </View>
                
                <TouchableWithoutFeedback onPress={()=>this.save()}>
                <View style={styles.saveRow}>
                <Text style={styles.saveText}>Save</Text>
                </View>
                </TouchableWithoutFeedback>
                
                </View>

                <View style={styles.cellfixed}>            
                </View> 
            </View>
            */}            
            <Modal 
                style={[styles.modal, styles.modal1]} 
                position={"center"} 
                ref={"modal1"} 
                isDisabled={this.state.isDisabled}
                backdropPressToClose={false}
                swipeToClose={false}
            >
            <Text style={styles.PopText}>Select your role</Text>
            <Button onPress={()=>this.onPopClick("Helper/Nanny")}  
                    containerStyle={styles.PopbtnContainer}
                    style={styles.Popbtn}>Helper/Nanny</Button>
            <Button onPress={()=>this.onPopClick("Grandmother")}  
                    containerStyle={styles.PopbtnContainer}
                    style={styles.Popbtn}>Grandmother</Button>
            <Button onPress={()=>this.onPopClick("Grandfather")}  
                    containerStyle={styles.PopbtnContainer}
                    style={styles.Popbtn}>Grandfather</Button>
            <Button onPress={()=>this.onPopClick("Other")} 
                    containerStyle={styles.PopbtnContainer}
                    style={styles.Popbtn}>Other</Button>
            </Modal>

            <Modal 
                style={[styles.modal, styles.modal2]} 
                position={"center"} 
                ref={"modal2"} 
                isDisabled={this.state.isDisabled}
                backdropPressToClose={false}
                swipeToClose={false}
            >
            <Text style={styles.Pop2Text}>State your relationship with the baby:</Text>
            
            <TextInput
                style={{height: Global.imgScale(50), margin:Global.imgScale(5), 
                            marginTop:Global.imgScale(10), 
                            borderColor: "#ef8a8e",
                            fontSize: Global.fontscale1(24),
                            borderWidth: 2}}
                onChangeText={(text) => this.onPop2TextChange(text)}
                value={this.state.text}
            />
            <View style={{flexDirection:'row',
                          marginRight:Global.imgScale(5),
                          justifyContent:'flex-end',
                          alignItems:'flex-end'
                            }}>
            <Button onPress={()=>this.onPop2Click("cancel")} 
                    containerStyle={styles.Popbtn2Container}
                    style={styles.Pop2btn}>CANCEL</Button>
            <Button onPress={()=>this.onPop2Click("ok")} 
                    containerStyle={styles.Popbtn2Container}
                    style={styles.Pop2btn}>OK</Button>
            </View>
            </Modal>            
            </View>
            </Image>
        )
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

var styles = StyleSheet.create({
    wrapper:{
        flex: 1,
    },
    Container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent:'center',
    },
    PopText: {    
        fontSize: Global.fontscale1(24),
        margin:Global.imgScale(10),
        marginLeft:Global.imgScale(20),
        color:'#ef8a8e',
        borderBottomWidth: 2,
        borderBottomColor: "#ef8a8e",
        fontWeight:'bold',
    },
    Pop2Text: {   
        fontWeight:'bold', 
        fontSize: Global.fontscale1(22),
        marginTop:Global.imgScale(20),
        margin:Global.imgScale(5),
        textAlign:"center",
    },
    PopbtnContainer:{        
        borderTopWidth: 1,
        borderTopColor: "#d9d9d9"  
    },
    Popbtn:{
        margin:Global.imgScale(20),
        marginLeft:Global.imgScale(20),
        fontSize: Global.fontscale1(20),
        color:'#000',
        textAlign:'left',
    },      
    Pop2btn:{
        margin:Global.imgScale(10),
        fontSize: Global.fontscale1(25),
        color:'#ef8a8e',
        textAlign:'center',
        fontWeight:'bold',
    }, 
    modal1: {
        height: Global.imgScale(300),
        width: Global.imgScale(240),
    },
    modal2: {
        height: Global.imgScale(150),
        width: Global.imgScale(280),
    },
    modal: {
        justifyContent: 'center',
        borderRadius: 5,
    },  
    bottomText:{
        marginTop:Global.imgScale(3),
        fontSize: Global.fontscale1(40),
        color:'#333',
        textAlign:'center',
    },
})