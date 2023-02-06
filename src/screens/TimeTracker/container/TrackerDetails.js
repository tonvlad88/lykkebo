// Main Packages
import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, ActivityIndicator, Alert } from 'react-native';

// Packages
import {
    Container,
    Header,
    Title,
    Button,
    Left,
    Right,
    Body,
    Icon,
    Grid,
    Col,
    Row,
  } from 'native-base';
import * as Localization from 'expo-localization';
import XDate from 'xdate';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';
  import Modal from 'react-native-modal';

// Actions
import { getTracker, deleteTrackerData, updateTrackerByID } from '../../../redux/actions/tracker';

// Localization
import i18n from 'i18n-js';
import { da, en } from '../../../services/translations';
i18n.fallbacks = true;
i18n.translations = { da, en };
i18n.locale = Localization.locale;

// Global imports
import CustomHeader from '../../../common/Header';
import CustomLoading from '../../../common/Loading';
import { weekdaysShort } from 'moment';
import { convertTimeToSeconds, convertSecondsToTime } from '../../../services/common';

// Local imports
import EditTrackerPerDay from '../components/EditTrackerPerDay';

class TrackerDetails extends Component {
    state = {
        selectedBooking: [],
        selectedDate: '',
        selectedTrackerData: {},
        loaded: false,
        showEditTrackerModal: false,
        userId: 0,
        jobId: 0,
        selectedDateForAPI: '',
    }

    async componentDidMount() {
        const selectedBooking = this.props.navigation.getParam('selectedTimeRec');
        const selectedDate = this.props.navigation.getParam('selectedDate');
        const userId = this.props.navigation.getParam('userId');
        const jobId = this.props.navigation.getParam('job_id');
        const selectedDateForAPI = this.props.navigation.getParam('selectedDateForAPI');

        console.log('selectedDate', selectedDate)
        console.log('selectedDateForAPI', selectedDateForAPI)

        const data = await this.props.getTracker(userId, XDate(selectedDate).toString('yyyy-MM-dd'));
        // console.log('trackerBookings', this.props.tracker.trackerBookings)
        // console.log('selectedBooking', this.props.tracker.trackerBookings[0].time_entry_details.filter(booking => booking.job_id === jobId))
        this.setState({
            selectedBooking: data.data.filter(booking => booking.job_id === jobId),
            selectedDate,
            loaded: true,
            userId,
            jobId,
            selectedDateForAPI,
        });
    }

    render() {
        const {
            loaded,
            selectedBooking,
            selectedDate,
            showEditTrackerModal,
            selectedTrackerData,
            jobId,
            userId,
            selectedDateForAPI,
        } = this.state;
        const { navigation } = this.props;

        if (!loaded) {
            return (
                <Container style={styles.container}>
                    <StatusBar hidden />
                    <Header style={styles.headerBG}>
                        <Left>
                            <Button transparent>
                                <Icon
                                style={{color: '#ffffff'}}
                                size={40}
                                name="arrow-back"
                                onPress={() => navigation.navigate('TimeTracker')} />
                            </Button>
                        </Left>
                        <Body style={{flex: 3, justifyContent: 'center', alignItems: 'center'}} />
                        <Right />
                    </Header>
                    <View style={styles.headerBorder} />

                    <View style={[styles.contentBG, {justifyContent: 'center', alignItems: 'center'}]}>
                        <ActivityIndicator />
                    </View>
                </Container>
            )
        }

        console.log('selectedBooking', selectedBooking)

        if (selectedBooking.length < 1) {
            return (
                <Container style={styles.container}>
                    <StatusBar hidden />
                    <Header style={styles.headerBG}>
                        <Left>
                            <Button transparent>
                                <Icon
                                style={{color: '#ffffff'}}
                                size={40}
                                name="arrow-back"
                                onPress={() => navigation.navigate('TimeTracker')} />
                            </Button>
                        </Left>
                        <Body style={{flex: 3, justifyContent: 'center', alignItems: 'center'}} />
                        <Right />
                    </Header>
                    <View style={styles.headerBorder} />

                    <View style={[styles.contentBG, {justifyContent: 'center', alignItems: 'center'}]}>
                        
                    </View>
                </Container>
            )
        }

        return (
            <Container style={styles.container}>
                <StatusBar hidden />
                <Header style={styles.headerBG}>
                    <Left>
                        <Button transparent>
                            <Icon
                            style={{color: '#ffffff'}}
                            size={40}
                            name="arrow-back"
                            onPress={() => navigation.navigate('TimeTracker')} />
                        </Button>
                    </Left>
                    <Body style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
                        <Title style={styles.colorWhite}>{XDate(this.state.selectedDate).toString('dd MMMM yyyy')}</Title>
                    </Body>
                    <Right />
                </Header>
                <View style={styles.headerBorder} />

                <View style={styles.contentBG}>
                    <View elevation={5} style={[styles.contentHeader, styles.shadowBox]}>
                        <Text style={[styles.colorWhite, {fontSize: 26}]}>
                            Booking {jobId}
                        </Text>
                        <Text style={[styles.colorWhite]}>
                            {selectedBooking[0].customer_name}
                        </Text>
                    </View>
                    <View style={styles.content}>
                        {
                            selectedBooking[0].time_entry_details.length < 1 ? (
                                <View style={[styles.contentBG, {justifyContent: 'center', alignItems: 'center'}]}>
                                    <Text>{i18n.t('noresultfound')}...</Text>
                                </View>
                            ) : null
                        }
                        {
                            selectedBooking[0].time_entry_details.map(time => {
                                // let tStart = moment(new Date(time.start * 1000));
                                // let tEnd = moment(new Date(time.end * 1000));
                                // let duration = moment.duration(tEnd.diff(tStart));
                                // let hours = duration.asSeconds();
                                // console.log('time', time)

                                return (
                                    <View style={styles.contentContainer} key={time.id}>
                                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                            <MaterialCommunityIcons name="timetable" size={24} color="black" />
                                        </View>
                                        <View style={{flex: 1, marginLeft: 10}}>
                                            <View>
                                                <View>
                                                    <Text style={{fontWeight: 'bold'}}>{time.description}</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <View>
                                                    <Text style={{color: '#B9B9B9'}}>{XDate(time.start).toString('HH:mm')} - {XDate(time.end).toString('HH:mm')}</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <View>
                                                    <Text style={{color: '#B9B9B9'}}>{i18n.t('break')}: {time.break}</Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                            <Text style={{fontWeight: 'bold'}}>{convertSecondsToTime(time.total)}</Text>
                                        </View>

                                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                            <Menu>
                                                <MenuTrigger>
                                                    <MaterialCommunityIcons name="dots-vertical" size={24} color="#B9B9B9" />    
                                                
                                                </MenuTrigger>
                                                <MenuOptions>
                                                    <MenuOption onSelect={() => {
                                                        this.setState({
                                                            showEditTrackerModal: true,
                                                            selectedTrackerData: time,
                                                        })
                                                    }}>
                                                        <Text style={{ padding: 5}}>{i18n.t('edit')}</Text>
                                                    </MenuOption>
                                                    <MenuOption onSelect={() => {
                                                        Alert.alert(
                                                            '',
                                                            `${i18n.t('condeleteclient')}?`,
                                                            [
                                                              {
                                                                text: i18n.t('cancel'),
                                                                onPress: () => console.log('Cancel Pressed'),
                                                                style: 'cancel',
                                                              },
                                                              {
                                                                text: i18n.t('delete'),
                                                                onPress: () => {
                                                                  const params = {
                                                                    record_id: Number(time.id),
                                                                    user_id: userId, 
                                                                  };
                                                                  this.props.deleteTrackerData(params).then(resDelete => {
                                                                    console.log('resDelete', resDelete)
                                                                    this.props.getTracker(userId, XDate(selectedDate).toString('yyyy-MM-dd')).then(resTracker => {
                                                                        this.setState({
                                                                            selectedBooking: resTracker.data.filter(booking => booking.job_id === jobId),
                                                                        });
                                                                    })
                                                                  });
                                                                },
                                                              },
                                                            ],
                                                            {cancelable: false},
                                                          );
                                                        }} >
                                                        <Text style={{color: 'red', padding: 5}}>{i18n.t('delete')}</Text>
                                                    </MenuOption>
                                                </MenuOptions>
                                            </Menu>
                                        </View>

                                        <Modal
                                            isVisible={showEditTrackerModal}>
                                            <EditTrackerPerDay
                                                internalOnly={false}
                                                selectedDateForAPI={XDate(selectedDate).toString('yyyy-MM-dd')}
                                                selectedTrackerData={selectedTrackerData}
                                                selectedBooking={selectedBooking[0]}
                                                jobId={jobId}
                                                userId={userId}
                                                selectedDate={XDate(selectedDate).toString('yyyy-MM-dd')}
                                                selectedDateFormatted={XDate(selectedDate).toString('dd MMMM yyyy')}
                                                updateTracker={async (data) => {
                                                    this.setState({
                                                        showEditTrackerModal: false,
                                                    });
                                                    await this.props.updateTrackerByID(data);
                                                    const res = await this.props.getTracker(userId, XDate(selectedDate).toString('yyyy-MM-dd'));
                                                    this.setState({
                                                        selectedBooking: res.data.filter(booking => booking.job_id === jobId),
                                                    });
                                                }}
                                                closeModal={() => this.setState({showEditTrackerModal: false})} />
                                            </Modal>
                                    </View>
                                )
                            })
                        }
                    </View>
                    <View style={{height: 60, justifyContent: 'center', alignItems: 'center', }}>
                        <View
                            style={{ flex: 1, flexDirection: 'row', paddingTop: 5, justifyContent: 'center', alignItems: 'center',}}>
                            <View
                                style={{ borderTopWidth: 1, borderColor: '#4B5C63', width: 100, height: 60, backgroundColor: '#4B5C63', padding: 10, justifyContent: 'center', alignItems: 'center',}}>
                                <Text style={{
                                    fontSize: 20, color: 'white', fontWeight: 'bold', textAlign: 'center', }}>
                                    TOTAL
                                </Text>
                            </View>
                           
                            <View
                                style={{ borderTopWidth: 1, borderColor: '#4B5C63', flex: 1, height: 60, backgroundColor: '#DFE3E6', paddingTop: 5, justifyContent: 'center', alignItems: 'center', }}>
                                <Text
                                    style={{ fontSize: 30, fontWeight: 'bold', color: '#2E3D43', textAlign: 'center', }}>
                                    {convertSecondsToTime(selectedBooking[0].total_time)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Container>
          );
    }

}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: '#FFF',
    },
    headerBG: {
        backgroundColor: '#2E3D43',
    },
    colorWhite: {
        color: '#ffffff',
    },
    headerBorder: {
        width: '100%',
        height: 3,
        backgroundColor: '#323248',
        marginBottom: 1,
    },
    content: {
        margin: 15,
        flex: 1,
    },
    contentContainer: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
    },
    contentBG: {
        backgroundColor: '#fff',
        flex: 1,
    },
    contentHeader: {
        padding: 15,
    },
    shadowBox: {
        padding:20,
        backgroundColor:'#2E3D43',
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
          height: 1,
          width: 1
        }
    },
})

const mapStateToProps = state => ({
    tracker: state.tracker,
    // loaded: state.tracker.loaded,
    // bookings: state.tracker.bookings,
    // isLoading: state.tracker.isLoading,
    // gettingTracker: state.tracker.gettingTracker,
  });
  
  const mapDispatchToProps = dispatch => ({
    getTracker: (userId, date) => dispatch(getTracker(userId, date)),
    deleteTrackerData: params => dispatch(deleteTrackerData(params)),
    updateTrackerByID: params => dispatch(updateTrackerByID(params)),
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(TrackerDetails)