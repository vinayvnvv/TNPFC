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
    depositeRenewFD(depositNumber, withDrawalAmt, newDepositAmt, depositTenure, depositPayFrequency, prodId) {
        const data = {
            customerId: this.customerId,
            purpose: 'CLOSED',
            depositNumber,
            withDrawalAmt,
            newDepositAmt,
            depositTenure,
            depositPayFrequency,
            prodId,
        }
        console.log(data, this.customerId);
        return axios.post(HOST + 'depositRenewFd', data, this.getConfig());
    }
    applyLoan(depositNumber, loanAmt) {
        const data = {
            customerId: this.customerId,
            purpose: 'LOAN_ON_DEPOSIT',
            depositNumber,
            loanAmt,
        }
        return axios.post(HOST + 'loanAgainstDeposit', data, this.getConfig());
    }
    depositClosure(depositNumber) {
        const data = {
            customerId: this.customerId,
            purpose: 'CLOSED',
            depositNumber,
        }
        return axios.post(HOST + 'depositClosure', data, this.getConfig());
    }
    fetchRequestStatus() {
        return axios.post(HOST + 'requestStatus', {customerId: this.customerId}, this.getConfig());
    }
}
export default new APIService();