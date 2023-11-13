import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store';

interface User {
    id: string;
    username: string;
    role: 'ADMIN' | 'USER';
    bio: string | null;
    profilePic: string | null;
};

interface AuthState {
    user: User | null;
};

const dummyUser: User = {
    id: '1',
    username: 'Harro_world',
    role: 'USER',
    bio: null,
    profilePic: null,
}

const dummyAdmin: User = {
    id: '21',
    username: 'admin',
    role: 'ADMIN',
    bio: null,
    profilePic: null,
}

const initialState: AuthState = {
    user: dummyUser // null
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
export const selectIsAdmin = (state: RootState) => state.user.user?.role === 'ADMIN';
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
export type { User };