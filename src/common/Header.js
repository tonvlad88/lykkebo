import React from 'react';
import { View, TouchableOpacity, StatusBar } from 'react-native';
import { Icon } from 'native-base';
import { HeaderStyle } from './Styles';
// import { TouchableHighlight } from 'react-native-gesture-handler';

export default class CustomHeader extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return(
            <View style={HeaderStyle.HeaderHolder}>
                <StatusBar hidden />
                <View style={HeaderStyle.f1}>
                    {
                        this.props.leftIconName && this.props.onPressLeftIcon ?
                        <TouchableOpacity style={HeaderStyle.prpl10} transparent onPress={this.props.onPressLeftIcon}>
                        <Icon
                            style={HeaderStyle.HeaderIconColor}
                            size={40}
                            name={this.props.leftIconName}/>
                        </TouchableOpacity> : null
                    }
                </View>
                <View style={HeaderStyle.f1}>
                <Text style={HeaderStyle.HeaderTitle}>{this.props.title}</Text>
                {this.props.subtitle ? <Text style={HeaderStyle.HeaderTitle}>{this.props.subtitle}</Text> : null}
                </View>
                <View style={HeaderStyle.f1}>
                {
                    this.props.rightIconName && this.props.onPressRightIcon ?
                    <Icon
                        onPress={this.props.onPressRightIcon}
                        style={HeaderStyle.cWhite}
                        active
                        name={this.props.rightIconName}/> : null
                }
                </View>
            </View>
        );
  }
}
