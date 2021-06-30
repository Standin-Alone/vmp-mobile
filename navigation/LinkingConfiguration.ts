/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          TabOne: {
            screens: {
              HomeScreen: 'one',
            },
          },
          TabTwo: {
            screens: {
              QR: 'two',
            },
          },
        },
      },
      NotFound: '*',
      Login: 'login',
      ForgotPassword: 'forgot_password',
      OTPScreen: 'otp_screen',
      FarmerProfileScreen: 'farmer_profile_screen',
      QRCodeScreen: 'qr_code_screen',
      ClaimVoucher: 'claim_voucher_screen',
      AuthenticationScreen: 'authentication_screen',
    },
  },
};
