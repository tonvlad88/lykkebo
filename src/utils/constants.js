/* eslint-disable import/prefer-default-export */
export const appColors = {
  primary: '#2E3D43',
};

export const appStrings = {
  mainStack: {
    authLoadingScreen: 'AuthLoadingScreen',
    signInScreen: 'SignInScreen',
    signUpScreen: 'SignUpScreen',
    appStack: 'AppStack',
  },
  appStack: {
    en: {
      calendar: 'Calendar',
      jobs: 'Jobs',
      time: 'Time',
      timeTracker: 'TimeTracker',
      account: 'Account',
      logout: 'Logout'
    },
    da: {
      calendar: 'Kalender',
      jobs: 'Jobs',
      time: 'Tid(Lærling)',
      timeTracker: 'Tid Rec',
      account: 'Konto',
      logout: 'Logout',
    }
  },
};

export const sideBar = [
  {
    name: 'Kalender',
    route: 'Calendar',
    icon: 'calendar',
    bg: '#C5F442',
  },
  {
    name: 'Jobs',
    route: 'Jobs',
    icon: 'home',
    bg: '#AB6AED',
  },
  {
    name: 'Tid(Lærling)',
    route: 'Time',
    icon: 'clock',
    bg: '#C5F442',
  },
  {
    name: 'Tid Rec',
    route: 'TimeTracker',
    icon: 'clock',
    bg: '#C5F442',
  },
  {
    name: 'Konto',
    route: 'Account',
    icon: 'person',
    bg: '#C5F442',
  },
  {
    name: 'Logout',
    route: 'Auth',
    icon: 'power',
    bg: '#AB6AED',
  },
];
