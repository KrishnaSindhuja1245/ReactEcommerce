import handleCart from './handleCart'
import authSlice from './authSlice';
import { combineReducers } from "redux";
const rootReducers = combineReducers({
    handleCart,
    authSlice,
})
export default rootReducers