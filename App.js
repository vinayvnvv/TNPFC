import React from 'react';
import 'react-native-gesture-handler';
import Index from './src';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { Text, StyleProvider, Root} from 'native-base';
import getTheme from './native-base-theme/components';
import vars from './native-base-theme/variables/commonColor';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { store, persistor } from './src/store';
import { MenuProvider } from 'react-native-popup-menu';
import LoadingApp from './src/modules/common/components/loading-app';

class App extends React.Component {
  state = {
    isReady: false,
  }
  async componentDidMount() {
    console.disableYellowBox = true;
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    this.setState({
      isReady: true,
    });
  }
  render() {
    return (
        <ErrorBoundary>
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
              <LoadingApp />
            )}
            
          </PersistGate>
        </Provider>
      </ErrorBoundary>
    );
  }
}


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    console.log(error);
    // return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
    this.setState({hasError: true, error: error});
  }

  render() {
    console.log(this.state)
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <Text>Something went wrong.</Text>;
    }

    return this.props.children; 
  }
}

export default App;
