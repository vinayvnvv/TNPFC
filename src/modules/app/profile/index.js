import React from "react";
import {connect} from 'react-redux';
import {ScrollView, StyleSheet, View, Image} from 'react-native';
import { Container, Button, Icon, Left, Right, Header, Body, Title, Text } from "native-base";

import { fetchCustomerDetails } from "../../../store/actions/common-actions";
import utils from "../../../services/utils";
import { THEME } from "../../../../config";
import icons from "../../../../assets/icons";

class Profile extends React.Component {
    goBack = () => {
        const {navigation} = this.props;
        navigation.goBack();
    }
    componentDidMount() {
        const {userDetails, fetchCustomerDetails} = this.props;
        if(!userDetails) fetchCustomerDetails();
    }
    render() {
        console.log(this.props);
        const {
            userDetails: {
                customerName,
                customerId,
                dob,
                mobileNumber,
                emailId,
                street,
                state,
                city,
                pincode,
            } = {},
        } = this.props;
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={this.goBack}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>View Profile</Title>
                    </Body>
                    <Right />
                </Header>
                <ScrollView>
                    <View style={styles.pageContainer}>
                        <View style={styles.headSection}>
                            <View style={styles.headSectionAvtr}>
                                <Image style={styles.headSectionAvtrImage} source={icons.UserIcon} />
                            </View>
                            <View style={styles.headSectionDetails}>
                                <Text style={styles.headSectionName}>{customerName}</Text>
                                <Text style={styles.headSectionSub}>Customer ID: {customerId}</Text>
                                <Text style={styles.headSectionSub}>Date of Birth: {utils.getAppCommonDateFormat(dob)}</Text>
                            </View>
                        </View>

                        <View style={styles.panelSection}>
                            <View style={styles.panelHeader}>
                                <Text style={styles.panelHeaderTitle}>Basic Details</Text>
                            </View>
                            <View style={styles.panelBody}>
                                <View style={styles.panelDRow}>
                                    <Text style={styles.panelDRowLabel}>Name</Text>
                                    <Text style={styles.panelDRowValue}>{customerName}</Text>
                                </View>
                                <View style={styles.panelDRow}>
                                    <Text style={styles.panelDRowLabel}>Date of Birth</Text>
                                    <Text style={styles.panelDRowValue}>{utils.getAppCommonDateFormat(dob)}</Text>
                                </View>
                                <View style={styles.panelDRow}>
                                    <Text style={styles.panelDRowLabel}>Mobile Number</Text>
                                    <Text style={styles.panelDRowValue}>{mobileNumber}</Text>
                                </View>
                                <View style={styles.panelDRow}>
                                    <Text style={styles.panelDRowLabel}>E-Mail</Text>
                                    <Text style={styles.panelDRowValue}>{emailId}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.panelSection}>
                            <View style={styles.panelHeader}>
                                <Text style={styles.panelHeaderTitle}>Basic Details</Text>
                            </View>
                            <View style={styles.panelBody}>
                                <View style={styles.panelDRow}>
                                    <Text style={styles.panelDRowLabel}>Name</Text>
                                    <Text style={styles.panelDRowValue}>{customerName}</Text>
                                </View>
                                <View style={styles.panelDRow}>
                                    <Text style={styles.panelDRowLabel}>Date of Birth</Text>
                                    <Text style={styles.panelDRowValue}>{utils.getAppCommonDateFormat(dob)}</Text>
                                </View>
                                <View style={styles.panelDRow}>
                                    <Text style={styles.panelDRowLabel}>Mobile Number</Text>
                                    <Text style={styles.panelDRowValue}>{mobileNumber}</Text>
                                </View>
                                <View style={styles.panelDRow}>
                                    <Text style={styles.panelDRowLabel}>Locality</Text>
                                    <Text style={styles.panelDRowValue}>{street}</Text>
                                </View>
                                <View style={styles.panelDRow}>
                                    <Text style={styles.panelDRowLabel}>City</Text>
                                    <Text style={styles.panelDRowValue}>{city}</Text>
                                </View>
                                <View style={styles.panelDRow}>
                                    <Text style={styles.panelDRowLabel}>Pin Code</Text>
                                    <Text style={styles.panelDRowValue}>{pincode}</Text>
                                </View>
                                <View style={styles.panelDRow}>
                                    <Text style={styles.panelDRowLabel}>State</Text>
                                    <Text style={styles.panelDRowValue}>{state}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </Container>
        )
    }
}


const styles = StyleSheet.create({
    pageContainer: {
        height: '100%',
        width: '100%',
        padding: THEME.LAYOUT_PADDING,
    },
    headSection: {
       ...utils.getBoxShadow(6, '#00000066'),
       backgroundColor: '#ffffff',
       paddingHorizontal: 11,
       paddingVertical: 15,
       flexDirection: 'row',
       alignItems: 'center',
       marginBottom: 9
    },
    headSectionAvtr: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
    },
    headSectionAvtrImage: {
        width: 52,
        height: 52,
    },
    headSectionDetails: {
        paddingLeft: 11,
        flexGrow: 1,
    },
    headSectionName: {
        color: THEME.PRIMARY,
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 1
    },
    headSectionSub: {
        marginTop: 1,
        color: '#777',
        fontSize: 12,
        fontWeight: '500'
    },
    panelSection: {
        marginVertical: 9
    },
    panelHeader: {
        backgroundColor: THEME.PRIMARY,
        padding: 11,
    },
    panelHeaderTitle: {
        color: THEME.PRIMARY_INVERT,
        fontSize: 14,
    },
    panelBody: {
        ...utils.getBoxShadow(5, '#00000077'),
        padding: 11 - 7,
        backgroundColor: "#ffffff",
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    panelDRow: {
        width: '50%',
        padding: 7,
    },
    panelDRowLabel: {
        color: THEME.PRIMARY,
        fontSize: 12,
    },
    panelDRowValue: {
        color: '#555',
        fontSize: 12,
        fontWeight: 'bold'
    }
})

const mapStateToProps = state => ({
    userDetails: state.commonReducer.userDetails,
})

export default connect(
    mapStateToProps,
    {fetchCustomerDetails},
)(Profile);
