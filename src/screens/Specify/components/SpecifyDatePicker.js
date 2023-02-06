import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated, Switch, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import XDate from 'xdate';

// import config from '../config';
import DateTimePicker from "react-native-modal-datetime-picker";

// import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles/TodoRowItemStyles';
import DateView from './DateView';

export default class SpecifyDatePicker extends Component {
  state = {
    isOpenEndTime: false,
  }

  render() {
    // const {booking, time} = this.props;
    // const {name, date} = booking;
    //
    return (
      <View style={{flex: 1, backgroundColor: '#9EAEBC', borderRadius: 3, alignItems: 'center', justifyContent: 'center'}}>
        <DateTimePicker
          isVisible={this.state.isOpenEndTime}
          onConfirm={(date)=>{
            this.setState({
              isOpenModal:false,
              date: XDate(date).toString('yyyy-dd-MM'),
              dateToShow: XDate(date).toString('dd MMMM yyyy'),
            })
          }}
          onCancel={()=>{this.setState({isOpenEndTime:false})}}
        />
        <TouchableOpacity
          onPress={()=>this.setState({isOpenEndTime: true})}>
          <Text style={{
            borderColor:'#f2f2f2',
            textAlign:'center',
            padding:5,
            borderRadius:5,
            color:'#444',
          }}>
            {/* <Icon name="calendar" style={{fontSize:18}} /> {XDate().toString('dd MMMM yyyy')} */}
            {XDate().toString('dd MMMM yyyy')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
};
