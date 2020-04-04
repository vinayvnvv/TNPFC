import React from 'react';
import { connect } from 'react-redux';
import { Container, Header, Button, Icon, Body, Title, Left, Right, View, Text, Spinner } from 'native-base';
import { StyleSheet } from 'react-native';
import FDCalc from './fd-calc';
import Steps from './../common/components/steps';
import utils from '../../services/utils';
import { ScrollView } from 'react-native-gesture-handler';
import { THEME } from '../../../config';
import { fetchProductDetails } from '../../store/actions/common-actions';
import { COMMON_STYLES } from '../common/styles';
import PersonalInfo from './personal-info';
import AddressInfo from './address-info';

const steps = [
    {label: 'Select Plan'}, {label: 'Personal Information'}, {label: 'Address Information'}, 
    {label: 'Nominee Details'}, {label: 'Payment'},
];

class CreateFD extends React.Component {
    state = {
        currentStep: 1,
        init: false,
        data: {
            fdCalc: {},
            personalInfo: {},
        }
    }
    async componentDidMount() {
        const {fetchProductDetails, productDetails} = this.props;
        if(!productDetails) await fetchProductDetails();
        this.setState({init: true});
    }
    goBack = () => {
        const {navigation} = this.props;
        navigation.goBack();
    }
    onFDCalcSubmit = validate => {
        validate((err, values) => {
            console.log('onFDCalcSubmit', err, values);
            if(!err) {
                this.setState({
                    data: {
                        ...this.state.data,
                        fdCalc: values,
                    },
                    currentStep: 1,
                })
            }
        });
    }
    onPersonalFormSubmit = validate => {
        validate((err, values) => {
            // if(!err) {
                this.setState({
                    data: {
                        ...this.state.data,
                        personalInfo: values,
                    },
                    currentStep: this.state.currentStep + 1,
                })
            // }
        })
    }
    onPreviousStep = () => {
        this.setState({
            currentStep: this.state.currentStep - 1,
        })
    }
    renderStepContainer = () => {
        const {
            currentStep,
            data: {
                fdCalc,
                personalInfo,
            }
        } = this.state;
        const {productDetails} = this.props;
        switch(currentStep) {
            case 0:
                return <FDCalc 
                        productDetails={productDetails} 
                        onSubmit={this.onFDCalcSubmit}/>
            case 1:
                return <PersonalInfo 
                        data={personalInfo}
                        onSubmit={this.onPersonalFormSubmit}
                        onPreviousStep={this.onPreviousStep} />
            case 2:
                return <AddressInfo 
                        onPreviousStep={this.onPreviousStep} />
        }
    }
    renderStep = () => {
        const {currentStep} = this.state;
        return <View style={styles.stepTitleC}>
                <Text style={styles.stepTitle}>
                    {steps[currentStep].label}
                </Text>
                <Text style={styles.stepSubTitle}>
                    Step {currentStep + 1} of {steps.length}
                </Text>
            </View>
    }
    render() {
        const {currentStep, init} = this.state;
        return (
            init ? 
                <Container>
                    <Header>
                        <Left>
                            <Button transparent onPress={this.goBack}>
                                <Icon name='arrow-back' />
                            </Button>
                        </Left>
                        <Body>
                            <Title>Create New FD</Title>
                        </Body>
                        <Right />
                    </Header>
                    <View style={styles.container}>
                        {this.renderStep()}
                        <ScrollView style={styles.stepContent}>
                            <View style={styles.stepsC}>
                                <Steps 
                                    noShadow
                                    numberIndication
                                    steps={steps}
                                    hideLabel
                                    currentStep={currentStep}/>
                            </View>
                            {this.renderStepContainer()}
                        </ScrollView>
                        
                    </View>
                </Container>
                :
                <Container>
                    <View style={COMMON_STYLES.spinnerContainerFullScreen}>
                        <Spinner />
                        <Text style={COMMON_STYLES.spinnerContainerFullScreenText}>Loading Data...</Text>
                    </View>
                </Container>
        );  
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    stepsC: {
        marginVertical: 13,
    },
    stepTitleC: {
        ...utils.getBoxShadow(4, '#000'),
        backgroundColor: '#f0f0f0',
        paddingHorizontal: THEME.LAYOUT_PADDING,
        paddingVertical: 11,
    },
    stepTitle: {
        // textAlign: 'center',
        fontWeight: '700',
        fontSize: 18,
        color: '#333',
        marginBottom: 3,
    },
    stepSubTitle: {
        fontSize: 13,   
        color: '#555',
        marginTop: -2,
    },
    stepContent: {
        flex: 1,
        flexGrow: 1,
    }
})

const mapStateToProps = state => ({
    productDetails: state.commonReducer.productDetails,
    userDetails: state.commonReducer.userDetails,
    fdSummary: state.depositeReducer.fdSummary,
})
export default connect(
    mapStateToProps,
    {fetchProductDetails}
)(CreateFD);