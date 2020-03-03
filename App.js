import React from 'react';
import 'react-native-gesture-handler';
import Index from './src';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { Container, View, Text, StyleProvider, Root} from 'native-base';
import getTheme from './native-base-theme/components';
import vars from './native-base-theme/variables/commonColor';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { store, persistor } from './src/store';
import { MenuProvider } from 'react-native-popup-menu';

const Loading = () => (
  <View>
    <Text>Loading</Text>
  </View>
)


class App extends React.Component {
  state = {
    isReady: false,
  }
  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    this.setState({
      isReady: true,
    })
  }
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {this.state.isReady ? (
              <MenuProvider>
                  <StyleProvider style={getTheme(vars)}>
                    <Root>
                        <Index />
                    </Root>
                </StyleProvider>
              </MenuProvider>
          ) : (
            <Loading />
          )}
          
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
