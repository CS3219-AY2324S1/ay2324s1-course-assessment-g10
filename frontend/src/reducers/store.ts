import { configureStore } from '@reduxjs/toolkit';
import questionReducer from './questionsSlice'

const store = configureStore({
  reducer: {
    questions: questionReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export default store;