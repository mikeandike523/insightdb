import {useState, useEffect, createContext, useContext, Dispatch, SetStateAction, ReactNode} from 'react'

import deepMerge from '@/utils/deepMerge'
import { SerializableObject } from '@/types/SerializableObject';

type ContextType = [
    string, // Global state is stored in stringified form just to make sure
            // React will always re-render on state change
    Dispatch<SetStateAction<string>>
];

function emptyContextType(): ContextType {
    return ["{}", (action: SetStateAction<string>)=>{}]
}

class StateManager {
    state: SerializableObject;
    setStateAsString: Dispatch<SetStateAction<string>>;

    constructor(initialStateAsString: string, setStateAsString: Dispatch<SetStateAction<string>>) {
        this.state = JSON.parse(initialStateAsString)
        this.setStateAsString = setStateAsString
    }

    get() {
        return this.state
    }

    update(updates: SerializableObject) {

        this.state = deepMerge(this.state, updates)

        if(typeof window !== "undefined") {
            window.localStorage.setItem("globalStateAsString", JSON.stringify(this.state))
        }

        this.setStateAsString(JSON.stringify(this.state))

        return this

    }

}

const GlobalContext = createContext<ContextType>(emptyContextType())

export function GlobalStateProvider({
    children,
    defaultComponent=<></>
}:{
    children?: ReactNode | ReactNode[],
    defaultComponent?: ReactNode | ReactNode[]
}){

    let [stateAsString, setStateAsString] = useState("{}")

    let [hydrated, setHydrated] = useState(false)

    // useEffect(()=>{
    //     if(typeof window !== "undefined"){
    //         if(window.sessionStorage.getItem("globalStateAsString")){
    //             setStateAsString(window.sessionStorage.getItem("globalStateAsString")??"{}")
    //         }
    //         setHydrated(true)
    //     }
    // },[typeof window !== "undefined"])

    // return hydrated?<GlobalContext.Provider value={[stateAsString, setStateAsString]}>
    //     <>
    //         {children}
    //     </>
    // </GlobalContext.Provider>:<>{defaultComponent}</>

    return <GlobalContext.Provider value={[stateAsString, setStateAsString]}>
        <>
            {children}
        </>
    </GlobalContext.Provider>

}

export function useGlobalState() : StateManager {
    let [stateAsString, setStateAsString] = useContext(GlobalContext)
    return new StateManager(stateAsString, setStateAsString)
}