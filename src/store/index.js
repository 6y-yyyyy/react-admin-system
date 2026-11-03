import { configureStore } from "@reduxjs/toolkit";
import TabReducer from './reducer/tab'

export default configureStore({
    reducer:{
        tab:TabReducer //TabReducer来自/store/tab.js的:export default tabSlice.reducer,是函数
    }
})