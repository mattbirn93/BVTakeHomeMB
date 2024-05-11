import * as Font from 'expo-font';

const loadFonts = async () => {
  await Font.loadAsync({
    'SF-Pro-Display-Black': require('../fonts/SF-Pro-Display-Black.otf'),
    'SF-Pro-Display-Bold': require('../fonts/SF-Pro-Display-Bold.otf'),
    'SF-Pro-Display-Heavy': require('../fonts/SF-Pro-Display-Heavy.otf'),
    'SF-Pro-Display-Light': require('../fonts/SF-Pro-Display-Light.otf'),
    'SF-Pro-Display-Medium': require('../fonts/SF-Pro-Display-Medium.otf'),
    'SF-Pro-Display-Regular': require('../fonts/SF-Pro-Display-Regular.otf'),
    'SF-Pro-Display-Semibold': require('../fonts/SF-Pro-Display-Semibold.otf'),
    'SF-Pro-Display-Thin': require('../fonts/SF-Pro-Display-Thin.otf'),
    'SF-Pro-Display-Ultralight': require('../fonts/SF-Pro-Display-Ultralight.otf'),
  });
};

export default loadFonts;