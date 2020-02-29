import TYPES from './../types';
export const save = val => ({
    type: TYPES.TEST.SAVE,
    payload: val,
});