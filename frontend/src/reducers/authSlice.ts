import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store';

interface User {
    id: String;
    username: String;
    role: String;
};

interface AuthState {
    user: User | null;
};


const initialState: AuthState = {
    user: null
}

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        clearUser: (state) => { state.user = null }
    }

})

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.user)`
export const selectUser = (state: RootState) => state.user.user
export const selectIsAuthenticated = (state: RootState) => state.user.user !== null;
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
export type { User };