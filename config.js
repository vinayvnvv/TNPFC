import Constants from 'expo-constants';
import {DEV_ENV} from './environments/dev.env';
import {PROD_ENV} from './environments/prod.env';
let ENV;
const {releaseChannel} = Constants.manifest;
if(releaseChannel === 'prod') {
    ENV = PROD_ENV();
} else if(releaseChannel === 'dev-http') {
    ENV = DEV_ENV(true);
} else {
    ENV = DEV_ENV();
}
console.log('Constants', Constants);
export const CONFIG = {
    APP: {
        TITLE: 'TNPFC',
        THEME: {
            PRIMARY: '#1338a3',
            PRIMARY_INVERT: '#ffffff',
            LAYOUT_PADDING: 21,
            SUCCESS: '#36b28a',
            ORANGE: '#eb9d3f',
            DANGER: '#ce3c3e',
            INFO: '#17a2b8'
        }
    },
    API: {
        HOST: ENV.HOST,
        HDFC_TRASACTIONS_STATUS: ENV.HDFC_TRASACTIONS_STATUS,
        HDFC_FORM_PAYMENT: ENV.HDFC_FORM_PAYMENT,
    }
}
const THEME = CONFIG.APP.THEME;
export {THEME};