'use strict'

import React, { PropTypes,Component } from 'react';
import {  
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
  Dimensions
} from 'react-native';


import Global from "../Global.js";
const tooltipWidth = 100;
const barWidth = Global.imgScale(13);
const high = Global.imgScale(80);

export default class HistoryBarItem extends Component {

  constructor (props) {
    super(props)
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

  render () {
      
    const {date, unitHeight, wordCountHeight} = this.props
    const {isHover, isHoverCoveredLeft, isHoverCoveredRight} = this.state
/*
    let entity
    let empty
    let wrapperStyle = {}
    if (value >= 0) {
      entity = value
      empty = high - value
    } else {
      entity = Math.abs(value)
      empty = Math.abs(low) - entity
      wrapperStyle = {
        top: high * unitHeight,
        right: barInterval,
        transform: [{
          rotate: '180deg'
        }]
      }
    }
*/

    /* Prevent tooltip covered by the edge */
/*
    let tooltipPosition = {
      left: -(tooltipWidth / 2),
      marginLeft: barWidth / 2
    }
    let tooltipMark = {
      left: tooltipWidth / 2,
      marginLeft: -6,
      borderLeftWidth: 6,
      borderRightWidth: 6
    }
    if (isHoverCoveredLeft) {
      tooltipPosition.left = 0
      tooltipPosition.marginLeft = 0
      tooltipMark.left = 5
      tooltipMark.marginLeft = 0

      delete tooltipMark.borderLeftWidth
    } else if (isHoverCoveredRight) {
      delete tooltipPosition.left
      delete tooltipPosition.marginLeft
      delete tooltipMark.left
      delete tooltipMark.marginLeft

      tooltipPosition.right = 3
      delete tooltipMark.borderRightWidth
      tooltipMark.right = 5
    }

    const baseStyle = {
      backgroundColor: color,
      marginRight: barInterval
    }
*/
    let wrapperStyle = {}
    wrapperStyle = {
        alignItems:'center',
        transform: [{
            rotate: '180deg'
        }]
    }

    return (
        
      <TouchableHighlight>
        <View style={[styles.container]}>
          <View style={[wrapperStyle]}>
           <View style={[styles.bar, styles.empty, {height:high }]}>
                <View style={[styles.actBar, {opacity:1*unitHeight, height:high* 0.4 / (3-unitHeight), marginBottom:-0.1}]} /> 
                <View style={[styles.triangle, styles.bar, {opacity:1*unitHeight}]} />
                 <View style={{              
                position: 'absolute',
                top:0,}}>
                <View style={[styles.bar, styles.wordCountBar, {height:high * wordCountHeight }]} />
            </View>
            </View>
           
          </View>
          <View>
            <Text style={styles.tooltipContent}>{date}</Text>
          </View>
        </View>
      </TouchableHighlight>
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

HistoryBarItem.propTypes = {
  date: PropTypes.string,
  unitHeight: PropTypes.number,
  wordCountHeight: PropTypes.number
}
