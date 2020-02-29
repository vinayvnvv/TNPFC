import TYPES from "./types";


export default ({dispatch, getState}) => next => async action => {
  console.log('inside middle ware', action)
  const {auth} = getState();
  if(action === undefined) {
    console.log('inside middle ware undifned', action);
    return next(action);
  }
  if (action && action.type !== TYPES.COMMON.API_REQUEST) {
    console.log('inside middle ware go', action)
    return next(action);
  }
  const {
    method,
    headers,
    server,
    endpoint,
    onload,
    onsuccess,
    onerror,
    body,
  } = action.payload;
  try {
    dispatch(onload())
    const config = {
      method,
      headers,
    };
    if (!headers && server) {
      config.headers = Object.assign(
        {},
        AUTH_HEADER(auth[server]),
        JSON_HEADER
      );
    }
    if (method === 'POST' 
        || method === 'PATCH' 
        || method === 'DELETE' 
        || method === 'PUT') {
      config.body = body;
    }
    const response = await (await fetch(endpoint, config)).json();
    
    if (response.non_field_errors) {
      dispatch(onerror(response.non_field_errors[0]));
    } else if (response.detail) {
      dispatch(onerror(response.detail));
    } else {
      dispatch(onsuccess(response));
    }
  } catch ({message}) {
    dispatch(onerror(message));
  }
};