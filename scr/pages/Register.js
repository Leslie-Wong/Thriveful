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
//import Popup from 'react-native-popup';

import Home from './Home.js';

let Global = require('../Global');

let img_t1=require('../../resource/images/reg_t1.png');
let img_next=require('../../resource/images/reg_next.png');
let img_btn = [
        [require('../../resource/images/reg_father_btn.png'),require('../../resource/images/reg_father_btn_o.png')],
        [require('../../resource/images/reg_mother_btn.png'),require('../../resource/images/reg_mother_btn_o.png')],
        [require('../../resource/images/reg_other_btn.png'),require('../../resource/images/reg_other_btn_o.png')],
    ];

export default class Register extends Component {
    constructor(props){
        super(props);
        this.state = {
        name : null,
        bday : null,
        sex : null,
        photo: null,
        images: null,
        }
    }

    componentDidMount() {
        AsyncStorage.getItem("photo").then((value) => {
            this.setState({photo: value});
        }).done();
    }

    setSelectedOption(option){
      this.saveData("sex", option);
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

    openModal1(id) {
       this.refs.modal1.open();
       console.log("openModal1");
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
        console.log('received image', image);
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
        console.log('received image', image);
        this.setState({
            photo: `data:${image.mime};base64,`+ image.data,
            images: null
        });
        AsyncStorage.setItem("photo", `data:${image.mime};base64,`+ image.data);
        this.refs.modal1.close();
        }).catch(e => {});
    }

    save(){
        if(this.state.name==null){
            alert("What is your Child's first name");
            return false;
        }
        if(this.state.bday==null){
            alert("What is your child's date of birth");
            return false;
        }
        if(this.state.sex==null){
            alert("Boy or Girl?");
            return false;
        }
        if(Global.navigator) {
            Global.navigator.replace({
                name: 'Home',
                component: Home,
            })
        }
    }

    render() {
        const options = [
        'Boy',
        'Girl',
        ];
        return(
            <View style={styles.wrapper}>
            <ScrollView>
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
            </ScrollView>
            <Modal style={[styles.modal, styles.modal1]} position={"center"} ref={"modal1"} isDisabled={this.state.isDisabled}>
            <Text style={styles.pickImgText}>Pick photo from?</Text>
            <Button onPress={()=>this.pickSingleWithCamera(true)} style={styles.btn}>Take a photo</Button>
            <Button onPress={()=>this.pickSingleBase64(true)} style={styles.btn}>Choose a photo</Button>
            </Modal>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    wrapper:{
        flex: 1,
    },
    Container: {
        flexDirection: 'row',
        marginTop: 50,
    },
    root: {    
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',    
    },
    infoWrapper:{
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        padding: 40,
        paddingTop: 10,
        paddingBottom: 30,
        backgroundColor: '#ffffff',
        borderRadius: 30,
    },
    inputRow:{
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: "#ACACAC"
    },
    textEdit:{
        fontSize: 20,
        borderColor: 'grey', 
        backgroundColor: 'white',
        margin: 10,
        padding: 5,
    },
    Dday:{    
        borderColor: 'grey', 
        backgroundColor: 'white',
        margin: 10,
        padding: 5,
        borderWidth: 0,
    },
    cellfixed: {
        width: 40,
    },
    modal1: {
        height: 150,
        width: 300
    },
    modal: {
        justifyContent: 'center',
        borderRadius: 10,
    },
    btn: {
        flex: 1,
        backgroundColor: "#3B5998",
        color: "white",
        padding: 10,
    },
    photoWrapper:{  
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    photorow:{
        flex: 1,
        width:250,
        height:250,
        borderRadius:125,
        borderWidth: 4,
        borderColor: '#FFFF00', 
        backgroundColor: "#FFFFFF",
        flexDirection: 'column',
        justifyContent: 'center',
    },
    phototext:{
        textAlign: 'center',
        marginTop: 0,
        fontSize: 20,
    },
    photoimg:{
        width: 246, 
        height: 246, 
        resizeMode: 'contain',
        borderRadius:125,
    },
    saveRow:{
        backgroundColor: "#3333FF",
        marginTop: 15,
        borderRadius:10,
    },
    saveText:{     
        textAlign: 'center',   
        color: "white",
        padding: 10,        
        fontSize: 20,        
    },
})