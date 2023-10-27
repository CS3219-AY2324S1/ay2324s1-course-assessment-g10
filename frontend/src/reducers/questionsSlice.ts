import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';
import { QnFilter, Question } from '../models/Question.model';

const questionsSlice = createSlice({
    name: 'questions',
    initialState: {
        originalQuestions: [] as Question[]
    },
    reducers: {
        setQuestions: (state, action) => {
            state.originalQuestions = action.payload;
        },
        addQuestions: (state, action) => {
            state.originalQuestions = [...state.originalQuestions, ...action.payload];
        },
        modifyQuestion: (state, action) => {
            state.originalQuestions = state.originalQuestions.map((qn) => {
              if (qn._id === action.payload._id) {
                return action.payload;
              }
              return qn;
            });
        },
        deleteQuestion: (state, action) => {
          state.originalQuestions = state.originalQuestions.filter((qn) => qn._id !== action.payload);
        }
    },
});

export const selectFilteredQuestions = (state: RootState, filter: QnFilter) => {
    return state.questions.originalQuestions.filter((qn) => {
        if (filter.difficultyFilter) {
          if (
            qn.difficulty > filter.difficultyFilter[1] ||
            qn.difficulty < filter.difficultyFilter[0]
          )
            return false;
        }
    
        if (filter.tagFilter && filter.tagFilter.size) {
          if (qn.topics.every((tag) => !filter.tagFilter?.has(tag))) {
            return false;
          }
        }
    
        if (filter.qnFilter) {
          if (qn.displayedQuestion.toLowerCase().indexOf(filter.qnFilter) === -1) {
            return false;
          }
        }
    
        return true;
      });
}

export const { setQuestions, addQuestions, modifyQuestion, deleteQuestion } = questionsSlice.actions;
export default questionsSlice.reducer;