// third-party
import {
	Middleware,
	MiddlewareAPI,
	configureStore,
	isRejectedWithValue,
} from '@reduxjs/toolkit';
import {
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from 'redux-persist';
import Swal from 'sweetalert2';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';


export const rtkQueryErrorLogger: Middleware =
	(api: MiddlewareAPI) => (next) => (action: any) => {
		if (isRejectedWithValue(action)) {
			console.error(action.payload);
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: action.payload.data?.msg || action.payload.data?.message,
			});
			if (action.payload?.status === 401) {
				// store.dispatch(logoutApp());
			}
		}
		return next(action);
	};


	
export const store = configureStore({
	reducer: appReducer,
	devTools: process.env.NODE_ENV !== 'production',
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [
					FLUSH,
					REHYDRATE,
					PAUSE,
					PERSIST,
					PURGE,
					REGISTER,
				],
			},
		}).concat([
			rtkQueryErrorLogger,
		]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
