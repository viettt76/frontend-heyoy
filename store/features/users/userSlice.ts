import { UserGender, UserRole } from '@/lib/enums';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getMyInfo } from '@/lib/api/user.service';

interface User {
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

export interface UserState {
    currentUser: User | null;
    loading: boolean;
}

const initialState: UserState = {
    currentUser: null,
    loading: false,
};

export const fetchCurrentUser = createAsyncThunk('user/fetchCurrent', async () => {
    const res = await getMyInfo();
    return res.data;
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<Partial<User>>) => {
            if (state.currentUser) {
                state.currentUser = {
                    ...state.currentUser,
                    ...action.payload,
                };
            } else {
                state.currentUser = action.payload as User;
            }
        },
        clearUser: (state) => {
            state.currentUser = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.currentUser = action.payload;
                state.loading = false;
            })
            .addCase(fetchCurrentUser.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const { clearUser, setUserInfo } = userSlice.actions;

export const userInfoSelector = (state: { user: UserState }) => state.user.currentUser;

export default userSlice.reducer;
