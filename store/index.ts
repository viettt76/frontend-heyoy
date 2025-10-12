import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/users/userSlice';
import authReducer from './features/auth/authSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            user: userReducer,
            auth: authReducer,
        },
    });
};

const store = makeStore();

// export const store = configureStore({
//     reducer: {
//         user: userReducer,
//         auth: authReducer,
//     },
// });

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
