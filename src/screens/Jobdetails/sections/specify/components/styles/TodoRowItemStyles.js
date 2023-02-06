import React from 'react';
import { StyleSheet } from 'react-native';

const ROW_HEIGHT = 70;

const styles = StyleSheet.create({
  row: {
    backgroundColor: '#313842',
    // paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: ROW_HEIGHT,
  },
  timelineDate: {
    height: ROW_HEIGHT,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeline: {
    height: ROW_HEIGHT,
    width: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineVerticalLink: {
    height: ROW_HEIGHT,
    width: 1,
    backgroundColor: '#526373',
    justifyContent: 'center',
  },
  icon: {
    color: '#e7d629',
    backgroundColor: 'transparent',
    position: 'absolute',
    alignItems: 'center',
    fontSize: 6,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 10,
  },
  switch: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 10,
  },
  text: {
    fontSize: 17,
    fontWeight: '500',
    color: 'white',
  },
  time: {
    fontSize: 10,
    fontWeight: '400',
    color: '#828B7B',
  },
});

export default styles;
