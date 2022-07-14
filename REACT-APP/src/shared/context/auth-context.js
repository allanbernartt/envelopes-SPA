import {createContext} from 'react'

export const AuthContext = createContext({
    isLoggedIn: false, 
    userId: null,
    token: null,   
    login: () => {}, 
    logout:() => {},
    logoutFromAllDevices:() =>{},
    language:'en',
    changeLanguage: ()=>{},
    csurfTk: null,
    sessionExpiration: false
})