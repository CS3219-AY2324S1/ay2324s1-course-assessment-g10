import { configureStore } from '@reduxjs/toolkit';
import questionReducer from './questionsSlice'
import userReducer from './authSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    questions: questionReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export default store;