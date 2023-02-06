// Components
import React, { Component } from 'react';
import { View, Text, Picker, TouchableOpacity, TextInput, Platform, Keyboard, ScrollView } from 'react-native';
import { Icon, Col, Row, Grid } from 'native-base';
import { Button } from 'react-native-elements';

// Packages
import XDate from 'xdate';
import TimePicker from "react-native-24h-timepicker";
import * as Localization from 'expo-localization';
import { KeyboardAccessoryView, KeyboardAccessoryNavigation  } from 'react-native-keyboard-accessory';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

// Actions


// Localization
import i18n from 'i18n-js';
import { da, en } from '../../../services/translations';
i18n.fallbacks = true;
i18n.translations = { da, en };
i18n.locale = Localization.locale;

// Global imports
import { convertTimeToSeconds, getTimeInterval, toTimestamp, convertSecondsToTime } from '../../../services/common';

// Local imports
import styles from './styles/AddDailyNoteStyle';


class EditDailyNote extends Component {
  state = {
    startTime: '8:00',
    endTime: '16:00',
    breakTime: '1:00',
    total: '0:00',
    comment: '',
    loaded: false,
  }

  UNSAFE_componentWillMount() {
    const { data, selectedDate } = this.props;
    this.setState({
      startTime: data.start,
      endTime: data.end,
      total: data.total,
      comment: data.description,
      loaded: true,
    })
  }

  onCancelStartTime() {
    this.TimePickerStartTime.close();
  }

  onConfirmStartTime(hour, minute) {
    const { endTime, breakTime } = this.state;
    this.setState({ startTime: `${hour}:${minute}` });

    if (endTime !== '0:00') {
      const total = getTimeInterval(`${hour}:${minute}`, endTime, convertTimeToSeconds(breakTime));
      this.setState({
        total,
      });
    }

    this.TimePickerStartTime.close();
  }

  onCancelEndTime() {
    this.TimePickerEndTime.close();
  }

  onConfirmEndTime(hour, minute) {
    const { startTime, breakTime } = this.state;
    this.setState({ endTime: `${hour}:${minute}` });

    if (startTime !== '0:00') {
      const total = getTimeInterval(startTime, `${hour}:${minute}`, convertTimeToSeconds(breakTime));
      this.setState({
        total,
      });
    }

    this.TimePickerEndTime.close();
  }

  onConfirmBreak(hour, minute) {
    const { startTime, endTime } = this.state;
    this.setState({ breakTime: `${hour}:${minute}` });

    const total = getTimeInterval(startTime, endTime, convertTimeToSeconds(`${hour}:${minute}`));
    this.setState({
      total,
    });

    this.TimePickerBreak.close();
  }

  render() {
    // const { selectedDate, selectedDateFormatted, userId } = this.props;
    const { selectedDate, selectedDateFormatted, data, userId } = this.props;

    const {
      startTime, endTime, total, comment, loaded, breakTime,
    } = this.state;

    if (!loaded) {
      return null;
    }

    const startTimeHourMin = startTime.split(':');
    const endTimeHourMin = endTime.split(':');
    const breakTimeHourMin = breakTime.split(':');

    return (
      <View style={styles.container}>
        <ScrollView>
          <Row style={{
            height: 50, borderBottomWidth: 0.5, borderBottomColor: '#ccc', backgroundColor: 'white', padding: 10,
          }}>
            <Col>
              <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>{new XDate(selectedDateFormatted).toString('dd MMMM, yyyy')}</Text>
            </Col>
          </Row>

          <Row style={styles.dailyNoteItemContainer}>
            <Col style={styles.dailyNoteLabel}>
              <Text>{i18n.t('from')}:</Text>
            </Col>
            <Col style={styles.dailyNoteClock}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={styles.dailyNoteTime}>
                  <Text
                    onPress={() => this.TimePickerStartTime.open()}
                    style={{fontWeight: 'bold', fontSize: 18}}>
                    {startTime.length > 5 ? startTime.substring(0, 5) : startTime }
                  </Text>
                </View>
                <View style={styles.dailyNoteClockIcon}>
                  <TouchableOpacity
                    onPress={() => this.TimePickerStartTime.open()}>
                    <Icon name="clock" />
                  </TouchableOpacity>
                  <TimePicker
                    minuteInterval={15}
                    selectedHour={Number(startTimeHourMin[0]).toString()}
                    selectedMinute={`${startTimeHourMin[1]}`}
                    ref={(ref) => {
                      this.TimePickerStartTime = ref;
                    }}
                    onCancel={() => this.onCancelStartTime()}
                    onConfirm={(hour, minute) => this.onConfirmStartTime(hour, minute)} />
                </View>
              </View>
            </Col>
          </Row>

          <Row style={styles.dailyNoteItemContainer}>
            <Col style={styles.dailyNoteLabel}>
              <Text>{i18n.t('to')}:</Text>
            </Col>
            <Col style={styles.dailyNoteClock}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={styles.dailyNoteTime}>
                  <Text
                    onPress={() => this.TimePickerEndTime.open()}
                    style={{fontWeight: 'bold', fontSize: 18}}>
                    {endTime.length > 5 ? endTime.substring(0, 5) : endTime }
                  </Text>
                </View>
                <View style={styles.dailyNoteClockIcon}>
                  <TouchableOpacity
                    onPress={() => this.TimePickerEndTime.open()}>
                    <Icon name="clock" />
                  </TouchableOpacity>
                  <TimePicker
                    minuteInterval={15}
                    selectedHour={Number(endTimeHourMin[0]).toString()}
                    selectedMinute={`${endTimeHourMin[1]}`}
                    ref={(ref) => {
                      this.TimePickerEndTime = ref;
                    }}
                    onCancel={() => this.onCancelEndTime()}
                    onConfirm={(hour, minute) => this.onConfirmEndTime(hour, minute)} />
                </View>
              </View>
            </Col>
          </Row>

          <Row style={styles.dailyNoteItemContainer}>
            <Col style={styles.dailyNoteLabel}>
              <Text>{i18n.t('break')}:</Text>
            </Col>
            <Col style={styles.dailyNoteClock}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={styles.dailyNoteTime}>
                  <Text
                    onPress={() => this.TimePickerBreak.open()}
                    style={{fontWeight: 'bold', fontSize: 18}}>
                    {breakTime}
                  </Text>
                </View>
                <View style={styles.dailyNoteClockIcon}>
                  <TouchableOpacity
                      onPress={() => this.TimePickerBreak.open()}>
                      <Icon name="clock" />
                    </TouchableOpacity>
                  <TimePicker
                    selectedHour={Number(breakTimeHourMin[0]).toString()}
                    selectedMinute={`${breakTimeHourMin[1]}`}
                    minuteInterval={15}
                    ref={(ref) => {
                      this.TimePickerBreak = ref;
                    }}
                    onCancel={() => this.onCancelBreak()}
                    onConfirm={(hour, minute) => this.onConfirmBreak(hour, minute)} />
                </View>
              </View>
            </Col>
          </Row>

          <Row style={styles.dailyNoteItemContainer}>
            <Col style={styles.dailyNoteLabel}>
              <Text>{i18n.t('total')}:</Text>
            </Col>
            <Col style={styles.dailyNoteClock}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={styles.dailyNoteTime}>
                  <Text
                    style={{fontWeight: 'bold', fontSize: 18}}>
                    {total.length > 5 ? total.substring(0, 5) : total }
                  </Text>
                </View>
                <View style={styles.dailyNoteClockIcon} />
              </View>
            </Col>
          </Row>

          <Row style={{height: 150, backgroundColor: '#FAF9FE', marginTop: 5}}>
            <Col style={styles.dailyNoteLabel}>
              <Text>{i18n.t('comment')}:</Text>
            </Col>
            <Col style={{ backgroundColor: 'white'}}>
              {/* <View style={styles.textAreaContainer} >
                <TextInput
                  style={styles.textArea}
                  underlineColorAndroid="transparent"
                  placeholder={i18n.t('typeyourcomment')}
                  placeholderTextColor="grey"
                  numberOfLines={10}
                  multiline={true}
                  onChangeText={(value) => this.setState({comment: value})}
                />
              </View> */}

              <AutoGrowingTextInput
                // minHeight={100}
                blurOnSubmit
                style={styles.textAreaContainer}
                underlineColorAndroid="transparent"
                value={comment}
                onChangeText={(text) => {
                  this.setState({
                    comment: text,
                  });
                }}
                placeholder={i18n.t('typeyourcomment')} />
            </Col>
          </Row>

          <View style={{
            height: 5, borderBottomWidth: 0.5, borderBottomColor: '#ccc', padding: 10,
          }} />

          <Button
            buttonStyle={{margin: 10, height: 46}}
            title={i18n.t('save')}
            titleStyle={{fontWeight: 'bold'}}
            onPress={() => {
              // const postData = {
              //   id: data.uid,
              //   comment,
              //   day: XDate(selectedDate).toString('yyyy-MM-dd'),
              //   start: `${XDate(selectedDate).toString('yyyy-MM-dd')} ${startTime}:00`,
              //   end: `${XDate(selectedDate).toString('yyyy-MM-dd')} ${endTime}:00`,
              //   total_hours: convertTimeToSeconds(total),
              //   is_billable: 0,
              // }

              const postData = {
                user_id: userId,
                job_id: 0,
                day: selectedDate,
                total: convertTimeToSeconds(`${total}:00`),
                record_id: data.id,
                note: comment,
                start: `${selectedDate} ${startTime}:00`,
                end: `${selectedDate} ${endTime}:00`,
                is_billable: 0,
                break: breakTime,
              };
              console.log('postData', postData)
              this.props.updateDailyNoteProp(postData);
            }} />

          <Button
            buttonStyle={{margin: 10, marginTop: 0, height: 46}}
            onPress={() => this.props.closeModal()}
            titleStyle={{fontWeight: 'bold'}}
            title={i18n.t('cancel')} />

        </ScrollView>

        {Platform.OS === 'ios' ? (
          <KeyboardAccessoryNavigation
            avoidKeyboard
            nextHidden
            previousHidden
            inSafeAreaView="true"
            onDone={Keyboard.dismiss} />
        ) : (
          <View />
        )}
      </View>
    );
  }
}

export default EditDailyNote;
