import * as ACTIONS from './actionTypeStrings'

const initState = {
    toDoList: [],
    toDoInput:{},
    tableConfig: {
        limit:15,
        offset:0
    }
}

const reducer = (state = initState, action) => {

    switch(action.type) {

        // ToDoListe aus der DB laden
        case ACTIONS.LOAD:
            return{
                ...state,
                toDoList: action.payload
            }   
        case ACTIONS.SETCONFIG:
            // console.log("ACTIONS.SETCONFIG",action.payload);
            const key = Object.keys(action.payload)[0]
            const value = action.payload[key];
            // console.log("ACTIONS.SETCONFIG-key",key);
            if(key === "limit"){
                return {
                    ...state,
                    tableConfig:{
                        ...state.tableConfig,
                        limit: value
                    }
                }
            }
            if(key === "offset"){
                return {
                    ...state,
                    tableConfig:{
                        ...state.tableConfig,
                        offset: value
                    }
                }
            }

        default:
            return state  

    }
    
}

export default reducer