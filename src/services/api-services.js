import axios from 'axios';
import { CONFIG } from '../../config';
const {API} = CONFIG;
const HOST = API.HOST;
class APIService {
    token;
    customerId;
    getConfig() {
        const token = this.token || {};
        const config = {
            headers: {
                'Authorization': token || '',
                'Content-Type': 'application/json',
            }
        }
        return (config);
    }
    setHeadersInfo(token, customerId) {
        console.log('setHeadersInfo', customerId)
        this.token = token;
        this.customerId = customerId;
    }
    getOTP(panNumber) {
        return axios.post(HOST + 'otplogin', {panNumber});
    }
    verifyOTP(otp, panNumber) {
        return axios.post(HOST + 'verifyotp', {otp, panNumber});
    }
    fetchAllDeposites() {
        return axios.post(HOST + 'getallFdDetails', {customerId: this.customerId}, this.getConfig());
    }
}
export default new APIService();