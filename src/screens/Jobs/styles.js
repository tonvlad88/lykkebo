import { Dimensions } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default {
  container: {
    backgroundColor: '#FFF',
  },
  text: {
    alignSelf: 'center',
    marginBottom: 7,
  },
  mb: {
    marginBottom: 15,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: SCREEN_HEIGHT - 40,
  },
  emptyText: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
  },
};
