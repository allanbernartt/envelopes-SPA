import { useSearchParams } from "react-router-dom"
import { useTranslation } from 'react-i18next'
import classes from './PasswordReset.module.css'

const EmailSent = () => {
    const { t } = useTranslation()
    const [searchParams] = useSearchParams()
    const requestType = searchParams.get('requestType');

    return (
        <div className={classes.successMessage}>
            {requestType === 'activation' && <h1>{t('anEmailWith')} {t('accountActivation')} {t('wasSentToYou')}</h1>}
            {requestType === 'password' && <h1>{t('anEmailWith')} {t('passwordReset')} {t('wasSentToYou')}</h1>}
            <p>{t('linkExpiration')}</p>
        </div>
    )
}

export default EmailSent