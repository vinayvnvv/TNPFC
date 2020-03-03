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
    fetchCustomerDetails() {
        return axios.post(HOST + 'getCustomerDetails', {customerId: this.customerId}, this.getConfig());
    }
    fetchFDSummary(accountNumber) {
        return axios.post(HOST + 'getFdSummary', {accountNumber}, this.getConfig());
    }
    fetchCustomerNominees() {
        return axios.post(HOST + 'getCustomerNominees', {customerId: this.customerId}, this.getConfig());
    }
    fetchFdLoans() {
        return axios.post(HOST + 'getFdLoans', {customerId: this.customerId}, this.getConfig());
    }
}
export default new APIService();