import moment from 'moment';
class Utils {
    getAppCommonDateFormat(date) {
        return moment().format('DD-MMM-YYYY');
    }
}

export default new Utils();