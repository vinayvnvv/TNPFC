import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Header, Left, Button, Icon, Body, Title, Right, Text } from 'native-base';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { THEME } from '../../../../config';
import utils from '../../../services/utils';

const Terms = ({
    navigation,
}) => {
    const goBack = () => {
        navigation.goBack();
    }
    return (
        <Container>
            <Header>
                <Left>
                    <Button transparent onPress={goBack}>
                        <Icon name='arrow-back' />
                    </Button>
                </Left>
                <Body>
                    <Title>Terms and Conditions</Title>
                </Body>
                <Right />
            </Header>
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Terms & Conditions</Text>
                <Text style={[styles.p, styles.head]}>
                    Registration, login and online services
                </Text>
                <Text style={styles.p}>
                    Depositors can login on TNPF & IDCL’s webportal and mobile application using PAN/Aadhaar number and access deposit 
                    information and can initiate the following activities through online channels 1) opening of fixed deposits,  2) 
                    renewal, 3) closure, 4) loan against FD, 5) nomination change, 6) KYC updation, 7) Submission of form 15G/H, 8) 
                    Change in bank details, 9) Download Fixed Deposit Receipt conformation and 10) Download form 16. 
                </Text>
                <Text style={styles.p}>
                    TNPF and IDCL may decide the nature and extent of services to be provided from time to time through 
                    web portal and mobile application. The availability/non-availability of a particular service shall 
                    be communicated to the depositor through email, web page of TNPF and IDCL or in writing as may be 
                    deemed fit.  
                </Text>
                <Text style={styles.p}>
                    TNPF and IDCL shall be entitled at its sole discretion to accept or reject any transaction or service 
                    request as may be submitted by the depositors. In case a deposit is rejected by TNPF and IDCL, the  
                    amount in relation to such rejected request will not earn any interest and the said amount will be 
                    refunded as is within 30 (thirty) business days. In case of payment gateway failure or user initiated 
                    cancellation, TNPF & IDCL may be reached to obtain transaction details and refund maybe followed up with 
                    respective banks and refund polices and timelines may vary depending on the bank in question. 
                </Text>
                <Text style={styles.p}>
                    By applying for or availing of online services, the depositor acknowledges and accepts these Terms. 
                    All the services/ products purported to be offered hereunder will be denominated in Indian Currency. 
                    No foreign currency transactions or products denominated in foreign currency shall be offered.   
                    Notwithstanding anything contained herein, all terms and conditions stipulated by the TNPF and IDCL 
                    pertaining to the Accounts shall continue to be applicable to the depositors. These terms will be in 
                    addition to and not in derogation of the terms and conditions relating to any account of the depositor.
                </Text>
                <Text style={styles.p}>
                    The information provided to the depositor through online channels is not updated continuously but at 
                    regular intervals. Consequently, any information supplied to the depositor through online channels 
                    will pertain to the date and time when it was last updated and not as the date and time when it is 
                    supplied to the depositor. TNPF and IDCL shall not be liable for any loss that the depositor may 
                    suffer by relying on or acting on such information.
                </Text>
                <Text style={styles.p}>
                    Any request for any service, which is offered as a part of online services, shall be binding on the 
                    depositor as and when TNPF & IDCL receives such a request. If any request for a service is such that 
                    it cannot be given effect to unless it is followed up by requisite documentation on part of the 
                    depositor, TNPF & IDCL shall not be required to act on the request until it receives such 
                    documentation from the depositor.
                </Text>
                <Text style={styles.p}>
                    The depositor shall ensure that online services is not used for any purpose which is illegal, 
                    improper or which is not authorised under these Terms.
                </Text>
                <Text style={styles.p}>
                    The depositor shall take all necessary precautions to prevent unauthorized and illegal use of 
                    Internet Banking and unauthorized access to the Accounts provided by Internet Banking.
                </Text>
                <TouchableOpacity 
                    style={styles.linkC} 
                    onPress={() => utils.openLink('https://www.tnpowerfinance.com')}>
                        <Text style={styles.linkB}>
                            For more details, visit 
                        </Text>
                        <Text style={styles.linkText}>https://www.tnpowerfinance.com</Text>
                </TouchableOpacity>
                
            </ScrollView>
        </Container>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: THEME.LAYOUT_PADDING,
    },
    title: {
        fontSize: 16,
        color: '#000',
        fontWeight: '700',
        textAlign: 'center',
        marginVertical: 11,
    },
    p: {
        marginVertical: 9,
        fontSize: 12,
        color: '#333',
    },
    head: {
        fontWeight: '700',
        marginBottom: 0,
    },
    linkB: {
        fontSize: 12,
        color: '#333',
    },
    linkText: {
        color: THEME.PRIMARY,
        fontSize: 12,
    }
})


export default Terms;