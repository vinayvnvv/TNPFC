import React from 'react';
import {connect} from 'react-redux';
import { Container, Button, Icon, Left, Right, Header, Body, Title, Text, Spinner, View } from "native-base";
import {StyleSheet, SafeAreaView, FlatList} from 'react-native';
import { fetchFdLoans } from '../../../store/actions/deposite-actions';
import ListItemPanel from '../../common/components/list-item-panel';
import utils from '../../../services/utils';
import { THEME } from '../../../../config';
import { COMMON_STYLES } from '../../common/styles';


const Item = ({
    data: {
        loanAccountNumber,
        depositAccountNumber,
        loanAvialedAmount,
        loanOpenDate,
        loanClosureDueDate,
    } = {},
}) => (
    <ListItemPanel 
        panelTitleValue={'---'}
        style={styles.itemStyle}
        noHoverEffect
        lists={[
            ['Loan No.', loanAccountNumber],
            ['FD No.', depositAccountNumber],
            ['Loan Amount', loanAvialedAmount],
            ['EMI', '---'],
            ['Start Date', utils.getAppCommonDateFormat(loanOpenDate)],
            ['End Date', utils.getAppCommonDateFormat(loanClosureDueDate)],
        ]}
        panelTitleLabel={'Loan Name'} />
);

class MyLoans extends React.Component {
    state = {
        pageInit: false,
    }
    componentDidMount() {
        this.initPage();
    }
    initPage = async () => {
        const {fdLoans, fetchFdLoans} = this.props;
        if(!fdLoans) await fetchFdLoans();
        this.setState({pageInit: true});
    }
    goBack = () => {
        const {navigation} = this.props;
        navigation.goBack();
    }
    render() {
        const {fdLoans} = this.props;
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
                            <Title>My Loans</Title>
                        </Body>
                        <Right />
                    </Header>
                    <Container style={styles.container}>
                        {fdLoans && fdLoans.length !== undefined  && fdLoans.length > 0 && (
                            <FlatList
                                data={fdLoans}
                                // ListHeaderComponent={<ListHeader headerList={headerList}/>}
                                renderItem={({ item }) => (
                                <Item
                                    data={item}
                                />
                                )}
                                keyExtractor={item => item.loanAccountNumber}
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
    fdLoans: state.depositeReducer.fdLoans,
})

export default connect(
    mapStateToProps,
    {fetchFdLoans}
)(MyLoans);