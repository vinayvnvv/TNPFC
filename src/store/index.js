// import AsyncStorage from '@react-native-community/async-storage';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import thunk from 'redux-thunk';
import api from './middleware';
// import storage from 'redux-persist/es/storage';

// Imports: Redux
import rootReducer from './reducers';



// Middleware: Redux Persist Config
const persistConfig = {
    // Root
    key: 'root',
    // Storage Method (React Native)
    storage: AsyncStorage,
    // storage,
    // Whitelist (Save Specific Reducers)
    whitelist: ['testReducer'],
    // Blacklist (Don't Save Specific Reducers)
    // blacklist: [],
};

  // Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);


// Redux: Store
const store = createStore(
    persistedReducer,
    applyMiddleware(
        thunk, createLogger()
    ),
);


// Middleware: Redux Persist Persister
let persistor = persistStore(store);
// Exports
export {
  store,
  persistor,
};