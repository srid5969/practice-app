import { combineReducers, AnyAction } from 'redux';



const rootReducer = combineReducers({
	
});

// Handle the LOGOUT action
const appReducer = (
	state: ReturnType<typeof rootReducer> | undefined,
	action: AnyAction,
) => {
	// if (action.type === LOGOUT) {
	// 	Cookie.delete('token');
	// 	Cookie.removeToken();
	// 	state = undefined;
	// }
	return rootReducer(state, action as never);
};

export default appReducer;
