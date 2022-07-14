import { useContext } from 'react'
import { AuthContext } from '../../shared/context/auth-context'
import classes from './Footer.module.css'
import { useTranslation } from 'react-i18next'
import ButtonRound from '../ui/ButtonRound'

const Footer = () => {
    const authCtx = useContext(AuthContext)
    const { t } = useTranslation()

    const changeLanguage = () => {
        if (authCtx.language !== 'en') {

            authCtx.changeLanguage('en')
        } else {

            authCtx.changeLanguage('pt')
        }
    }

    return <footer className={classes.footer}>
        <div className={classes.footerItems}>
            <div className={classes.language}>
                <p>{t('changeLanguage')}</p>
                <ButtonRound onClick={changeLanguage}>{t('lngOption')}</ButtonRound>
            </div>

        </div>

    </footer>

}
export default Footer
