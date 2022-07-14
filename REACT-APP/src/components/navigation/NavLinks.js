import { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import classes from './NavLinks.module.css'
import { AuthContext } from '../../shared/context/auth-context'
import { url } from '../../utils/urls/urls'
import { useTranslation } from 'react-i18next'

const NavLinks = props => {
    const { t } = useTranslation()
    const authCtx = useContext(AuthContext)

    const [expandLogoutMobile, setExpandLogoutMobile] = useState(false)

    const onExpandHandler = () => {
        setExpandLogoutMobile(prev => !prev)
    }

    const logout = () => {
        
        authCtx.logout()
        if(props.mobile){
            props.closeMenu()
        }
    }

    const logoutFromAllDevices = () => {
       
        authCtx.logout()
        if(props.mobile){
            props.closeMenu()
        }
    }

    const changeLanguage = () => {
        if (authCtx.language !== 'en') {

            authCtx.changeLanguage('en')            

        } else {

            authCtx.changeLanguage('pt')
           
        }

        if(props.mobile){
            props.closeMenu()
        }
        
    }

   


    const mobileLogoutClass = expandLogoutMobile ? classes.showMobileLogout : classes.hideMobileLogoutContainer

    return <ul className={props.className}>

        <li onClick={props.onClick}>
            <NavLink to='/'>Home</NavLink>
        </li>

        {authCtx.token && <li onClick={props.onClick}>
            <NavLink to={`/${url.envelopes}/${url.userEnvelopes}`} style={({ isActive }) => isActive ? { color: '#e34f71' } : {}}>Envelopes</NavLink>
        </li>}

        {authCtx.token && <li onClick={props.onClick}>
            <NavLink to={`/${url.envelopes}/${url.addEnvelope}`} style={({ isActive }) => isActive ? { color: '#e34f71' } : {}}>{t('createEnvelope')}</NavLink>
        </li>}

        {authCtx.token && <li onClick={props.onClick}>
            <NavLink to={`/${url.transactions}`} style={({ isActive }) => isActive ? { color: '#e34f71' } : {}}>{t('transactions')}</NavLink>
        </li>}

        {!props.mobile && authCtx.token && <li>
            <div className={classes.dropdown}>
                <button className={classes.dropbtn}>Logout</button>
                <div className={classes.dropdownContent}>
                    <button className={classes.logoutBtns} onClick={logout}>Logout</button>
                    <button className={classes.logoutBtns} onClick={logoutFromAllDevices}>{t('logoutFromAllDevices')}</button>
                </div>
            </div>
        </li>}

        {props.mobile && authCtx.token && <li>
            <p onClick={onExpandHandler}>Logout</p>
            <div className={mobileLogoutClass}>
                <button className={classes.logoutBtnsMobile} onClick={logout}>Logout</button>
                <button className={classes.logoutBtnsMobile} onClick={logoutFromAllDevices}>{t('logoutFromAllDevices')}</button>
            </div>
        </li>}

        {!authCtx.token && <li onClick={props.onClick}>
            <NavLink to={`/${url.users}/${url.auth}`} style={({ isActive }) => isActive ? { color: '#e34f71' } : {}}>{t('registerLogin')}</NavLink>
        </li>}

        {!authCtx.token && <li><button className={classes.lngBtn} onClick={changeLanguage}>{t('lngOption')}</button></li>}

    </ul>
}

export default NavLinks