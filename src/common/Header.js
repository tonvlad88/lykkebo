import React from 'react'
import { View, TouchableOpacity, StatusBar } from 'react-native';
import { Header, Left, Right, Button, Icon, Body, Title, Subtitle } from 'native-base'
import { HeaderStyle } from './Styles'
// import { TouchableHighlight } from 'react-native-gesture-handler';

export default class CustomHeader extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return(
            <Header style={HeaderStyle.HeaderHolder}>
                <StatusBar hidden />
                <Left style={HeaderStyle.f1}>
                    {
                        this.props.leftIconName && this.props.onPressLeftIcon ?
                        <Button style={HeaderStyle.prpl10} transparent onPress={this.props.onPressLeftIcon}>
                        <Icon
                            style={HeaderStyle.HeaderIconColor}
                            size={40}
                            name={this.props.leftIconName}
                        />
                        </Button> : null
                    }
                </Left>
                <Body style={HeaderStyle.f1}>
                <Title style={HeaderStyle.HeaderTitle}>{this.props.title}</Title>
                {this.props.subtitle ? <Subtitle style={HeaderStyle.HeaderTitle}>{this.props.subtitle}</Subtitle> : null}
                </Body>
                <Right style={HeaderStyle.f1}>
                {
                    this.props.rightIconName && this.props.onPressRightIcon ?
                    <Icon
                        onPress={this.props.onPressRightIcon}
                        style={HeaderStyle.cWhite}
                        active
                        name={this.props.rightIconName} //person-add
                    /> : null
                }
                </Right>
            </Header>
        )
    }
}
