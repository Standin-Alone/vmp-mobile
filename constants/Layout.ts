import { Dimensions } from 'react-native';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

export default {
  Width,
  Height,
  isSmallDevice: Width < 375,
};
