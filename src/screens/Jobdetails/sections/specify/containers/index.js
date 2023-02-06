// Components
import React, { Component } from 'react';
import { View, FlatList } from 'react-native';

// Helpers
import * as SecureStore from 'expo-secure-store'
import * as Localization from 'expo-localization';
import moment from 'moment';

// Actions

// Localization
import i18n from 'i18n-js';
import { da, en } from '../../../../../services/translations';
i18n.fallbacks = true;
i18n.translations = { da, en };
i18n.locale = Localization.locale;

// Global imports

// Local imports
import TodoRowItem from '../components/TodoRowItem';
import styles from './styles';

class SpecifyScreen extends Component {
  render() {
    const { workingDays, toggleWorkingDay } = this.props;
    return (
      <FlatList
        data={workingDays}
        keyExtractor={todo => todo.date}
        enableEmptySections
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({item, index}) => (
          <TodoRowItem
            booking={{...item}}
            index={index}
            workingDaysHandler={(val, datestamp) => {
              toggleWorkingDay(val, datestamp);
            }}
            time={moment().startOf('hour').fromNow()} />
        )} />
    );
  }
}

export default SpecifyScreen;
