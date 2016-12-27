'use strict'

import React, { PropTypes,Component } from 'react';
import {  
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Dimensions
} from 'react-native';


import Global from "../Global.js";
import ActivityCards from "../../resource/data/ActivityCards.js";
const tooltipWidth = 100;
const barWidth = Global.imgScale(13);
const high = Global.imgScale(80);

export default class ProgressDailyItme extends Component {

  constructor (props) {
    super(props);
    console.log("ProgressDailyItme");
    this.state = {
      isHover: false,
      isHoverCovered: false,
      isHoverCoveredRight: false
    }
  }

  onPressIn (e) {
    const screenWidth = Dimensions.get('window').width

    this.setState({
      isHover: true,
      isHoverCoveredLeft: e.nativeEvent.pageX < (tooltipWidth / 2 + 10),
      isHoverCoveredRight: e.nativeEvent.pageX + tooltipWidth / 2 + 20 > screenWidth
    })
  }

  onPressOut (e) {
    this.setState({
      isHover: false,
      isHoverCovered: false,
      isHoverCoveredRight: false
    })
  }

  _onClick(val){
     this.props.onClick(val);
  }

  render () {
    var ino=0.5;
    const {day, actDone} = this.props;
    let wrapperStyle = {};
    if(Global.useDay==day+1){
        ino=1;
    }
    wrapperStyle = {
        alignItems:'center',
        flexDirection:'row',
        marginTop:Global.imgScale(20)
        /*
        transform: [{
            rotate: '180deg'
        }]
        */
    }    

    return (
        <View style={[styles.container,{opacity:ino}]}>
            <View style={{width:Global.imgScale(360),position:'absolute',alignSelf:'center' }}>
            <Text style={[styles.text_align,styles.text_size1,{color:"#f38989", fontWeight: 'bold',}]}>DAY {day+1}</Text>
            <Image style={{alignSelf:'center',height:Global.imgScale(130) }}
                resizeMode={Image.resizeMode.contain}
                source={require("../../resource/images/progress_timelineicon.png")} />
            </View>
          <View style={[wrapperStyle]}>
           <View style={[styles.bar, styles.empty, {flex:0.5, marginBottom:Global.imgScale(15)}]}>
               <Text style={[styles.text_align,styles.text_size1,{fontWeight: 'bold',}]}>ACTIVITY 1</Text>
               <Text style={[styles.text_align,styles.text_size2]}>{actDone>0?"Completed":ActivityCards.All(day+1)[0]}</Text>
               {    actDone>0?                   
                    <Image style={{width:Global.imgScale(30),height:Global.imgScale(30),alignSelf:'center',marginTop:Global.imgScale(10)}} 
                        resizeMode={Image.resizeMode.contain} 
                        source={require("../../resource/images/progress_check.png")} />
                    
                    :
                    <TouchableOpacity  onPress={()=>this.props.onClick(1,day+1,ino,ActivityCards.All(day+1)[2])}>
                    <Image style={{width:Global.imgScale(30),height:Global.imgScale(30),alignSelf:'center',marginTop:Global.imgScale(10)}} 
                        resizeMode={Image.resizeMode.contain} 
                        source={require("../../resource/images/progress_play.png")} />
                    </TouchableOpacity>
               }
            </View>

            <View style={[styles.bar, styles.empty, {flex:0.5, marginBottom:Global.imgScale(15)}]}>
               <Text style={[styles.text_align,styles.text_size1,{fontWeight: 'bold',}]}>ACTIVITY 2</Text>
               <Text style={[styles.text_align,styles.text_size2]}>{actDone>1?"Completed":"Read A Book"}</Text>
               {    actDone>1?
                   
                    <Image style={{width:Global.imgScale(30),height:Global.imgScale(30),alignSelf:'center',marginTop:Global.imgScale(10)}} 
                        resizeMode={Image.resizeMode.contain} 
                        source={require("../../resource/images/progress_check.png")} />                    
                    :
                    <TouchableOpacity onPress={()=>this.props.onClick(2,day+1,ino,ActivityCards.All(day+1)[2])}>
                    <Image style={{width:Global.imgScale(30),height:Global.imgScale(30),alignSelf:'center',marginTop:Global.imgScale(10)}} 
                        resizeMode={Image.resizeMode.contain} 
                        source={require("../../resource/images/progress_play.png")} />
                    </TouchableOpacity>
               }
            </View>
          </View>
           <View style={{height:Global.imgScale(10),borderTopColor:"#dcdcdc",borderTopWidth:1}}>             
            </View>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
   /*position: 'relative'*/
   marginRight: Global.imgScale(3),
   marginLeft: Global.imgScale(3)
  }, 
  bar: {
    width: Global.imgScale(barWidth)
  },
  empty: {
    opacity: 0.8
  },
  triangle:{
    borderTopWidth: Global.imgScale(8),
    borderRightWidth: Global.imgScale(barWidth)/2,
    borderBottomWidth: 0,
    borderLeftWidth: Global.imgScale(barWidth)/2,
    borderTopColor: '#bbb',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  actBar:{
    backgroundColor: '#bbb',
  },
  text_align:{
    textAlign: 'center',
    color: '#000',
  },
  text_size1:{
      fontSize:Global.fontscale1(22),
  },
  text_size2:{
      fontSize:Global.fontscale1(16),
  },
  wordCountBar:{    
    opacity: 0.3,
    backgroundColor: '#234532',
  },
  tooltipContent: {
    color: '#000',
    fontSize: Global.fontscale1(14),
    textAlign: 'center'
  },
 
})

ProgressDailyItme.propTypes = {
  day: PropTypes.number,
  actDone: PropTypes.number,
  wordCountHeight: PropTypes.number,
  onClick:PropTypes.func,
}
