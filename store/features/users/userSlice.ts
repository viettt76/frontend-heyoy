import { RootState } from '@/store';
import { UserGender, UserRole } from '@/types/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
    id: string;
    firstName: string;
    lastName: string;
    birthday: Date | string | null;
    gender: UserGender | null;
    hometown: string;
    school: string;
    workplace: string;
    avatar: string | null;
    role: UserRole | null;
    isPrivate: boolean | null;
}

const initialState: UserState = {
    id: '',
    firstName: '',
    lastName: '',
    birthday: null,
    gender: null,
    hometown: '',
    school: '',
    workplace: '',
    avatar: '',
    isPrivate: null,
    role: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addInfo(state, action: PayloadAction<Partial<UserState>>) {
            Object.assign(state, action.payload);
        },
    },
});

export const { addInfo } = userSlice.actions;

export const getUserInfo = (state: RootState) => state.user;

export default userSlice.reducer;
