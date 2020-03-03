import { combineReducers } from 'redux';

import testReducer from './test-reducer';
import authReducer from './auth-reducer';
import depositeReducer from './deposite-reducer';
import commonReducer from './common-reducer';


// Redux: Root Reducer
const rootReducer = combineReducers({
    testReducer,
    authReducer,
    depositeReducer,
    commonReducer,
  });
  // Exports
  export default rootReducer;