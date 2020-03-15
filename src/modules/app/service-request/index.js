import React from 'react';
import {connect} from 'react-redux';
import { Container, Button, Icon, Left, Right, Header, Body, Title, Text, Spinner, View } from "native-base";
import {StyleSheet, SafeAreaView, FlatList} from 'react-native';
import { fetchRequestStatus } from '../../../store/actions/common-actions';
import ListItemPanel from '../../common/components/list-item-panel';
import utils from '../../../services/utils';
import { THEME } from '../../../../config';
import { COMMON_STYLES } from '../../common/styles';


const Item = ({
    data: {
        acknowledgementId,
        purpose,
        depositNumber
    } = {},
}) => (
    <ListItemPanel 
        panelTitleValue={acknowledgementId}
        itemWidth={'50%'}
        style={styles.itemStyle}
        noHoverEffect
        lists={[
            ['Purpose', purpose],
            ['Deposite No.', depositNumber],
        ]}
        panelTitleLabel={'Ticket ID'} />
);

class ServiceRequest extends React.Component {
    state = {
        pageInit: false,
    }
    componentDidMount() {
        this.initPage();
    }
    initPage = async () => {
        const {requestStatus, fetchRequestStatus} = this.props;
        if(!requestStatus) await fetchRequestStatus();
        this.setState({pageInit: true});
    }
    goBack = () => {
        const {navigation} = this.props;
        navigation.goBack();
    }
    render() {
        const {requestStatus} = this.props;
        const {pageInit} = this.state;
        return (
            pageInit ? (
                <Container>
                    <Header>
                        <Left>
                            <Button transparent onPress={this.goBack}>
                                <Icon name='arrow-back' />
                            </Button>
                        </Left>
                        <Body>
                            <Title>Service Request</Title>
                        </Body>
                        <Right />
                    </Header>
                    <Container style={styles.container}>
                        {requestStatus && requestStatus.length !== undefined  && requestStatus.length > 0 && (
                            <FlatList
                                data={requestStatus}
                                // ListHeaderComponent={<ListHeader headerList={headerList}/>}
                                renderItem={({ item }) => (
                                <Item
                                    data={item}
                                />
                                )}
                                keyExtractor={item => item.acknowledgementId}
                            />
                        )} 
                    </Container>
                </Container>
                ) : (
                    <Container>
                        <View style={COMMON_STYLES.spinnerContainerFullScreen}>
                            <Spinner />
                            <Text style={COMMON_STYLES.spinnerContainerFullScreenText}>Loading Data...</Text>
                        </View>
                    </Container>
                )
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: THEME.LAYOUT_PADDING,
    },
    itemStyle: {
        borderStyle: 'solid',
        borderColor: '#f0f0f0',
        borderWidth: 1,
    }
})

const mapStateToProps = state => ({
    requestStatus: state.commonReducer.requestStatus,
})

export default connect(
    mapStateToProps,
    {fetchRequestStatus}
)(ServiceRequest);