import React, { useEffect, useState } from 'react';
import {View, StyleSheet, Dimensions, Platform, Image} from 'react-native';
import { THEME } from '../../../../config';
import ListItemPanel from '../../common/components/list-item-panel';
import { Button, Text, Toast, Spinner, Icon } from 'native-base';
import utils from '../../../services/utils';
import SuccessScreen from '../../common/components/success-screen';
import { createForm } from '../../../lib/form';
import FormItem from '../../common/components/form-item';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { COMMON_STYLES } from '../../common/styles';
import Modal from 'react-native-modal';
import SpaceBox from '../../common/components/space-box';
import { CREATE_FD_STYLES } from '../../create-fd/common-styles';
import { NAVIGATION } from '../../../navigation';
import { TEXTS } from '../../../constants';
const TEXT_INPUT_TRIGGER = Platform.OS === 'web' ? 'onChange' : 'onChangeText';
const width = Dimensions.get('window').width;
const Closure = ({
    fdSummary,
    depositClosure,
    TopMostElement,
    status,
    navigation,
}) => {
    const {
        interestAmount,
        depositAmount,
        productDesc,
        interestPaid,
        intpayFrequency,
        isDepositClosable,
        maturityDate,
        interestRatePercent,
        maturityAmount,
        openDate,
        tenure,
        accountNumber,
    } = fdSummary.length > 0 ? fdSummary[0] : {};
    const closeFD = () => {
        if(isDepositClosable === 'Y') {
            depositClosure();
        } else {
            Toast.show({
                text: "Closing this Deposit through online is not possible. Please. contact Branch.",
                buttonText: "Okay",
                duration: 3000,
                type: "warning"
            })
        }
    }
    const ClosureModal = createForm({
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
        <ClosureModalComponent 
            {...props} 
            navigation={navigation}
            onSubmit={onClosureSubmit}
            accountNumber={accountNumber} 
            onClose={() => TopMostElement.close('ClosureModal')}/>
    ));
    useEffect(() => {
        TopMostElement.register([
            {key: 'ClosureModal', component: ClosureModal}
        ]);
    }, []);
    const openClosureModal = () => {
        TopMostElement.show('ClosureModal');
    }
    const onClosureSubmit = values => {
        const data = {
            ...values,
            depositNumber: accountNumber,
        };
        depositClosure(data);
        TopMostElement.close('ClosureModal');
    }
    const successData = status && status.data;
    return (
        <View>
            {status && status.type === 'depositClosure' && status.status === 'success' ? (
                <SuccessScreen 
                    warning={!successData.acknowledgementId}
                    successText={successData.acknowledgementId ? 'Your FD Closure request been submitted successfully' : successData} 
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
                                ['Deposited Amount', utils.convertToINRFormat(depositAmount)],
                                ['Maturity Amount', utils.convertToINRFormat(maturityAmount)],
                                ['Interest Rate', interestRatePercent + '%'],
                                ['Duration', tenure + ' Months']
                            ]}
                            panelTitleLabel={'Closure'}
                            panelTitleValue={productDesc}/>
                    </View>
                    <View style={styles.actions}>
                        <View style={{flexGrow: 1}}>
                            {status && status.type === 'depositClosure' && status.status === 'loading' ? (
                                    <Spinner />
                                ) : (
                                    <Button 
                                        primary 
                                        // onPress={closeFD}
                                        onPress={openClosureModal}
                                        danger 
                                        style={styles.actionsBtn}>
                                            <Text>Close FD</Text>
                                    </Button>
                                )
                            }
                        </View>
                    </View>
                </View>
            )}
        </View>
    )
};  


const ClosureModalComponent = ({
    onClose,
    accountNumber,
    navigation,
    onSubmit,
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
                        <Text style={COMMON_STYLES.modalHeaderText}>Close FD</Text>
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
                                <Text>Cancel</Text>
                            </Button>
                            <SpaceBox horizontal={18} />
                            <Button block danger onPress={onSubmitForm} style={COMMON_STYLES.modalActionsBtn}>
                                <Text>Close FD</Text>
                            </Button>
                        </View>
                    </View>
                </ScrollView>
            </Modal>
        </View>
    );
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
        width: '100%',
        marginTop: 9,
    },
    actionsBtn: {
        flexDirection: 'row', 
        justifyContent: 'center'
    }
});

export default Closure;

