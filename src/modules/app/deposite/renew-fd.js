import React, { useEffect, useState } from 'react';
import {View, StyleSheet, Dimensions, Platform, Image} from 'react-native';
import { THEME } from '../../../../config';
import ListItemPanel from '../../common/components/list-item-panel';
import { Button, Text, Spinner, Icon, Picker } from 'native-base';
import utils from '../../../services/utils';
import SuccessScreen from '../../common/components/success-screen';
import { TouchableOpacity, ScrollView, TouchableNativeFeedback, TextInput } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import { COMMON_STYLES } from '../../common/styles';
import { createForm } from '../../../lib/form';
import SpaceBox from '../../common/components/space-box';
import FormItem from '../../common/components/form-item';
import { periodOptions } from '../../common/components/fd-calculater';
import { CREATE_FD_STYLES } from '../../create-fd/common-styles';
import { TEXTS } from '../../../constants';
import { NAVIGATION } from '../../../navigation';
const width = Dimensions.get('window').width;
const TEXT_INPUT_TRIGGER = Platform.OS === 'web' ? 'onChange' : 'onChangeText';
const RenewFD = ({
    fdSummary,
    onRenewFD,
    status,
    TopMostElement,
    navigation,
}) => {
    const InfoModal = () => (
        <View style={COMMON_STYLES.modalContainer}>
            <Modal isVisible={true} coverScreen={false}>
                <View style={[COMMON_STYLES.modalContent, styles.modal]}>
                    <Text style={styles.modalHeader}>Info</Text>
                    <View style={styles.infoContant}>
                        <Text style={styles.pg}>
                            TNPFCL allows existing Deposits to be renewed upto 90 days from date of maturity. You will not loose any interest on Deposit when renewed within 90 days of maturity date.
                        </Text>
                        <Text style={styles.pg}>
                            Due to ongoing COVID 19 restrictions, we prefer you to stay safe at home and renew your existing Deposit's online through
                        </Text>
                        <View style={styles.list}>
                            <Icon name={'radio-button-on'} style={styles.icn}/>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={styles.listText}>Webportal</Text>
                                    <TouchableOpacity onPress={() => utils.openLink('https://tnpowerfinance.com')}>
                                        <Text style={[styles.listText, {color: THEME.PRIMARY}]}> https://tnpowerfinance.com</Text>
                                    </TouchableOpacity>
                                </View>
                        </View>
                        <View style={styles.list}>
                            <Icon name={'radio-button-on'} style={styles.icn}/>
                            <Text style={styles.listText}>TNPFCL Mobile App from Google Playstore for android devices. </Text>
                        </View>
                        <Text style={styles.pg}>
                            After submitting renewal request online on webportal and mobile app, TNPF Staff will schedule video call during office business hours to confirm your possession of Original FDR and process renewal Advice which can be downloaded from webportal and mobile app.
                        </Text>
                        <Text style={styles.pg}>
                            Alternatively you can send the original FDR back filling renewal request by post/courier or drop in collection box at TNPF Office.
                        </Text>
                        <View style={{height: 21}}/>
                        <Button block onPress={() => TopMostElement.close('RenewFDInfo')}>
                            <Text style={{textAlign: "center"}}>Close</Text>
                        </Button>
                    </View>
                </View>
            </Modal>
        </View>
    );
    
    useEffect(() => {
        TopMostElement.register([
            {key: 'RenewFDInfo', component: InfoModal},
            {key: 'RenewFDModal', component: RenewFDModal}
        ]);
    }, []);
    const {
        interestAmount,
        depositAmount,
        productDesc,
        intpayFrequency,
        maturityDate,
        interestRatePercent,
        maturityAmount,
        openDate,
        tenure,
        isDepositRenewable,
        accountNumber,
        productId,
    } = fdSummary.length > 0 ? fdSummary[0] : {};
    const successData = status && status.data;
    const openInfoModal = () => {
        TopMostElement.show('RenewFDInfo');
    }
    const openRenewFDModal = () => {
        TopMostElement.show('RenewFDModal');
    }
    const RenewFDModal = createForm({
        showErrosOnInit: true,
        onValueChanges: (value, values, errors, props) => {
            console.log('hnhe-->', value, values, errors, props);
        },
        defaultValueProp: Platform.OS === 'web' ? 'value' : '=value',
        template: (field, input, form, data, props) => {
            const {error, touched, isSubmit} = field;
            return <FormItem 
                    input={input} 
                    onFocusOut={data.onFocusOut}
                    isVertical
                    label={data.label} 
                    disabled={data.disabled}
                    errText={(error) ? error[0].message : null}
                    isErr={(error && (touched || isSubmit)) ? true : false}/>
        }
    })((props) => (
        <RenewFDModalComponent 
            {...props} 
            navigation={navigation}
            onSubmit={onRenewFDSubmit}
            accountNumber={accountNumber} 
            onClose={() => TopMostElement.close('RenewFDModal')}/>
    ));
    const onRenewFDSubmit = values => {
        console.log(values);
        const data = {
            ...values,
            depositNumber: accountNumber,
            depositPayFrequency: intpayFrequency,
            newDepositAmt: maturityAmount,
            prodId: productId,
            withDrawalAmt: 0,
        }
        onRenewFD(data);
        TopMostElement.close('RenewFDModal');
    }
    return (
        <View>
            {status && status.type === 'renew' && status.status === 'success' ? (
                <SuccessScreen 
                    warning={!successData.acknowledgementId}
                    successText={successData.acknowledgementId ? 'Your FD Re-new been submitted successfully' : successData} 
                    refNumber={successData && successData.acknowledgementId}/>
            ) : (
                <View style={styles.container}>
                    <View style={styles.section}>
                        <ListItemPanel 
                            itemWidth={'50%'}
                            noHoverEffect={true}
                            lists={[
                                ['Account No', accountNumber],
                                ['Start Date', utils.getAppCommonDateFormat(openDate)],
                                ['Maturity Date', utils.getAppCommonDateFormat(maturityDate)],
                                ['Interest Payment', intpayFrequency],
                                ['Deposit Amount', utils.convertToINRFormat(depositAmount)],
                                ['Maturity Amount', utils.convertToINRFormat(maturityAmount)],
                                ['Rate of Interest', interestRatePercent + '%'],
                                ['Duration (Months)', tenure]
                            ]}
                            panelTitleLabel={'Scheme Name'}
                            panelTitleValue={productDesc}/>
                    </View>
                    {isDepositRenewable === 'Y' && (
                        <View style={styles.actions}>
                            <View style={styles.actionBtnC}>
                                {status && status.type === 'renew' && status.status === 'loading' ? (
                                    <Spinner />
                                ) : (
                                    <Button 
                                        primary 
                                        block
                                        onPress={openRenewFDModal} 
                                        // onPress={onRenewFD}
                                        >
                                        <Text style={styles.actionBtnText}>RENEW FD</Text>
                                    </Button>
                                )}
                            </View>
                        </View>
                    )}
                    <View style={styles.linkBtnC}>
                        <TouchableOpacity transparent onPress={openInfoModal}>
                            <Text style={styles.linkBtnCTitle}>
                                Notice on Renewal of Fixed Deposit Receipt (FDR) issued before 31.03.2020
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}


const RenewFDModalComponent = ({
    onClose,
    accountNumber,
    onSubmit,
    navigation,
    form: {createField, validateForm, getFieldsValue, setFieldValue, errors},
}) => {
    const [isSubmit, setSubmit] = useState(false);
    const onSubmitForm = () => {
        setSubmit(true);
        validateForm((err, values) => {
            console.log(err, values);
            if(!err) {
                if(onSubmit) onSubmit(values);
            }
        })
    }
    const renewCloseFdUrl = getFieldsValue('renewCloseFdUrl');
    {createField('renewCloseFdUrl', {
        rules: [
            {required: true, message: 'Document is required!'}
        ]
    })};
    const onUpload = (name, url) => {
        console.log('Upload - success', name, url);
        let value = getFieldsValue('renewCloseFdUrl');
        if(!value) value = [url];
        else value.push(url);
        setFieldValue('renewCloseFdUrl', value);
    }
    const uploadFile = () => {
        const addressValues = getFieldsValue('renewCloseFdUrl');
        const s3Folder = Array.isArray(addressValues) ? 'renewCloseFd-' + accountNumber + '-' + (addressValues.length + 1) : 'renewCloseFd-1' + accountNumber;
        navigation.navigate(NAVIGATION.UPLOADER, {
            name: 'address',
            onUpload: onUpload,
            s3Folder,
            accept: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
            invalidFileErrMsg: 'Please select only image/pdf file',
            helpText: '(Only Image/PDF files are allowed)',
        });
    }
    const removeFile = (idx, values) => {
        values.splice(idx, 1);
        setFieldValue('renewCloseFdUrl', values.length === 0 ? '' : values);   
    }
    console.log('renewCloseFdUrl', renewCloseFdUrl);
    return (
        <View style={COMMON_STYLES.modalContainer}>
            <Modal isVisible={true} coverScreen={false} animationIn={'fadeInUpBig'} animationInTiming={100}>
                <ScrollView style={COMMON_STYLES.modalContent}>
                    <View style={COMMON_STYLES.modalHeader}>
                        <Text style={COMMON_STYLES.modalHeaderText}>Renew-FD</Text>
                        <Button transparent small onPress={onClose}>
                            <Icon style={COMMON_STYLES.modalHeaderIcon} name={'close'} />
                        </Button> 
                    </View>
                    <View style={COMMON_STYLES.modalBody}>
                        {createField('accountNumber', {
                            trigger: TEXT_INPUT_TRIGGER,   
                            initialValue: accountNumber,  
                            rules: [
                                {required: true, message: 'Required.'},
                            ], 
                            localData: {    
                                label: 'Account Number',
                                disabled: true,
                            }
                        })(<TextInput editable={false} />)}
                        {createField('period', {
                            trigger: 'onValueChange',
                            valueProp: '=selectedValue',
                            initialValue: periodOptions[0].value,
                            rules: [
                                {required: true, message: 'Period is required.'},
                            ],
                            localData: {
                                label: 'Period',
                            }
                        })(<Picker mode={'dropdown'}>
                            {periodOptions && periodOptions.map((d, idx) =>
                                <Picker.Item 
                                    key={d.value}
                                    value={d.value} 
                                    label={d.label} />
                        )}
                        </Picker>)}

                        <View style={CREATE_FD_STYLES.sectionContent}>
                                {renewCloseFdUrl ? (
                                    <>
                                    {/* <Image 
                                        source={{uri: getFieldsValue('address_proof')}} 
                                        style={styles.panImage}/> */}
                                        {renewCloseFdUrl && Array.isArray(renewCloseFdUrl) && renewCloseFdUrl.map((doc, idx) =>
                                            <View style={COMMON_STYLES.uploadList} key={'proof-' + idx}>
                                                <View style={COMMON_STYLES.uploadListType}>
                                                    <Image style={COMMON_STYLES.uploadListTypeImage} source={
                                                        utils.getFileImage(doc)
                                                    }/>
                                                </View>
                                                <Text numberOfLines={1} style={COMMON_STYLES.uploadListText}>
                                                    upload success.
                                                </Text>
                                                <View style={COMMON_STYLES.uploadListAction}>
                                                    <TouchableOpacity style={COMMON_STYLES.uploadListActionClose} onPress={() => removeFile(idx, renewCloseFdUrl)}>
                                                        <Icon name={'close'} style={COMMON_STYLES.uploadListActionCloseIcon}/>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        )}
                                    </>
                                ) : (
                                    <TouchableOpacity onPress={() => uploadFile()}>
                                        <View style={COMMON_STYLES.uploader}>
                                            <Icon style={COMMON_STYLES.uploaderIcon} name={'cloud-upload'}/>
                                            <Text style={COMMON_STYLES.uploaderText}>Upload FD Certificate</Text>
                                            <Text style={COMMON_STYLES.uploaderHelpText}>{TEXTS.UPLOAD_AREA_MSG}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                                {renewCloseFdUrl ? (
                                    <Button block info onPress={uploadFile}>
                                        <Text>Upload another file</Text>
                                    </Button>
                                ) : <View />}
                            </View>
                            
                            {isSubmit && errors && errors['renewCloseFdUrl'] && !getFieldsValue('renewCloseFdUrl') && (
                                <Text style={COMMON_STYLES.textError}>{errors['renewCloseFdUrl'][0].message}</Text>
                            )}

                        <SpaceBox vertical={21}/>
                        <View style={COMMON_STYLES.modalActions}>
                            <Button block light onPress={onClose} style={COMMON_STYLES.modalActionsBtn}>
                                <Text>Close</Text>
                            </Button>
                            <SpaceBox horizontal={18} />
                            <Button block primary onPress={onSubmitForm} style={COMMON_STYLES.modalActionsBtn}>
                                <Text>Renew FD</Text>
                            </Button>
                        </View>
                    </View>
                </ScrollView>
            </Modal>
        </View>
    )
    
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: THEME.LAYOUT_PADDING,
    },
    section: {
        marginVertical: 0,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        width,
        marginTop: 9,
        marginLeft: -(THEME.LAYOUT_PADDING),
        // justifyContent: 'center',
    },
    actionBtnC: {
        width: '100%',
        paddingHorizontal: THEME.LAYOUT_PADDING,
    },
    actionBtn: {
        width: '100%',
    },
    actionBtnText: {
        textTransform: 'none'
    },
    linkBtnC: {
        marginTop: 11,
    },
    linkBtnCTitle: {
        fontWeight: '700',
        color: THEME.PRIMARY,
        fontSize: 14,
        textAlign: "center",
    },
    modal: {
        width: (Dimensions.get('screen').width - 42),
        marginLeft: 0,
        backgroundColor: '#fff',
    },
    modalHeader: {
        backgroundColor: THEME.PRIMARY,
        color: THEME.PRIMARY_INVERT,
        fontWeight: '700',
        paddingVertical: 11,
        paddingHorizontal: 21,
    },
    pg: {
        marginVertical: 9,
        fontSize: 12,
    },
    list: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 7,
    },
    icn: {
        marginRight: 11,
        fontSize: 9,
        color: '#555',
    },
    infoContant: {
        padding: THEME.LAYOUT_PADDING,
    },
    listText: {
        fontSize: 13,
    },
});

export default RenewFD;

