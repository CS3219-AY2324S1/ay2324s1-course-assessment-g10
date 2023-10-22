import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';
import { QnFilter, Question } from '../models/Quesiton.model';


const questionsSlice = createSlice({
    name: 'questions',
    initialState: {
        originalQuestions: [] as Question[]
    },
    reducers: {
        setQuestions: (state, action) => {
            state.originalQuestions = action.payload;
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
          if (qn.categories.every((tag) => !filter.tagFilter?.has(tag))) {
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

export const { setQuestions } = questionsSlice.actions;
export default questionsSlice.reducer;