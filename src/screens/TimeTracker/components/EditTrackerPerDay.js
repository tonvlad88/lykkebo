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
import { convertTimeToSeconds, getTimeInterval, toTimestamp, convertSecondsToTimeNoSeconds } from '../../../services/common';

// Local imports
import styles from './styles/AddDailyNoteStyle';


class EditTrackerPerDay extends Component {
  state = {
    startTime: '8:00',
    endTime: '20:00',
    breakTime: '1:00',
    total: '0:00',
    comment: '',
    loaded: false,
    // selectedBooking: {},
    selectedTrackerData: {},
  }

  UNSAFE_componentWillMount() {
    const { selectedTrackerID, selectedTrackerData, selectedBooking, selectedDate } = this.props;
    // console.log('selectedTrackerData', selectedTrackerData)
    const startTimeHourMin = XDate(selectedTrackerData.start).toString('HH:mm').split(':');
    const endTimeHourMin = XDate(selectedTrackerData.end).toString('HH:mm').split(':');

    this.setState({
      startTime: `${startTimeHourMin[0]}:${startTimeHourMin[1]}`,
      endTime: `${endTimeHourMin[0]}:${endTimeHourMin[1]}`,
      total: convertSecondsToTimeNoSeconds(selectedTrackerData.total),
      comment: selectedTrackerData.description,
      loaded: true,
    })
  }

  onCancelStartTime() {
    this.TimePickerStartTime.close();
  }

  onConfirmStartTime(hour, minute) {
    const { endTime, breakTime} = this.state;
    this.setState({ startTime: `${hour}:${minute}` });

    // console.log('breakTime', breakTime)

    // if (endTime !== '0:00') {
      const total = getTimeInterval(`${hour}:${minute}`, endTime, convertTimeToSeconds(breakTime));
      this.setState({
        total,
      });
    // }
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
    const {
      selectedBooking,
      selectedDateFormatted,
      jobId,
      userId,
      selectedDateForAPI,
      selectedTrackerData,
    } = this.props;

    console.log('selectedDateForAPI', selectedDateForAPI)
    const {
      startTime, endTime, total, comment, loaded, breakTime,
    } = this.state;

    if (!loaded) {
      return null;
    }

    const startTimeHourMin = startTime.split(':');
    const endTimeHourMin = endTime.split(':');
    const breakTimeHourMin = breakTime.split(':');

    // console.log('startTimeHourMin', startTimeHourMin)
    // console.log('endTimeHourMin', endTimeHourMin)

    return (
      <View style={styles.container}>
        <ScrollView>
          <Row style={{
            height: 50, borderBottomWidth: 0.5, borderBottomColor: '#ccc', backgroundColor: 'white', padding: 10,
          }}>
            <Col>
              <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>{selectedDateFormatted}</Text>
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
                        {`${startTimeHourMin[0]}:${startTimeHourMin[1]}`}
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
                    {`${endTimeHourMin[0]}:${endTimeHourMin[1]}`}
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
                    {total}
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

              const [y, m, d] = selectedDateForAPI.split('-');
              const [hS, miS] = (startTime).split(':');
              const [hE, miE] = (endTime).split(':');
              const [bH, bM] = (breakTime).split(':');
              const newStartDate = (new Date(y, m - 1, d, hS, miS, '00').getTime() / 1000);
              const newEndDate = (new Date(y, m - 1, d, hE, miE, '00').getTime() / 1000);
              const newBreak = (new Date(y, m - 1, d, bH, bM, '00').getTime() / 1000);

              // console.log('y, m, d', `${y}-${m}-${d}`);
              // console.log('hS, miS, sS', `${hS}-${miS}-00`);
              // console.log('hE, miE, sE', `${hE}-${miE}-00`);

              // console.log('newStartDate', newStartDate)
              // console.log('newEndDate', newEndDate)
              
              const postData = {
                user_id: userId,
                job_id: Number(jobId),
                day: selectedDateForAPI.toString('yyyy-MM-dd'),
                total: convertTimeToSeconds(getTimeInterval(startTime, endTime, convertTimeToSeconds(breakTime))),
                record_id: Number(selectedTrackerData.id),
                note: comment,
                start: XDate(newStartDate * 1000).toString('yyyy-MM-dd HH:mm:00'),
                end: XDate(newEndDate * 1000).toString('yyyy-MM-dd HH:mm:00'),
                break: breakTime,
                is_billable: Number(jobId) > 0 ? '1' : '0'
              };
              console.log('postData', postData)
              this.props.updateTracker(postData);
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

export default EditTrackerPerDay;