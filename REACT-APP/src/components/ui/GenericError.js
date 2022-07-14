import classes from './GenericError.module.css';
import {useNavigate} from 'react-router-dom'
import ButtonRound from './ButtonRound';
import { useTranslation } from 'react-i18next'


const GenericError = props => {

    const { t } = useTranslation()
    const navigate = useNavigate()
    const clearError = () => {
        props.onClearError()
    }
    const backHome =() => {
        navigate('/')
    }

    const errMsg = props.errMsg || t('genericError')

    return <div className={classes.genericErrorContainer}>
        <h1>OOPS!</h1>
        <h2>{errMsg}</h2>
        <div className={classes.genericErrorAction}>
            <ButtonRound className={classes.backBtn} onClick={clearError}>{t('goBack')}</ButtonRound>
            <ButtonRound className={classes.homeButton} onClick={backHome}>Home</ButtonRound>
        </div>

    </div>
}

export default GenericError