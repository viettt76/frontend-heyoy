import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import userReducer from './features/users/userSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            user: userReducer,
            auth: authReducer,
        },
    });
};

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
