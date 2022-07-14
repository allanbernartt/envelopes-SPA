import { useState, useEffect } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LoaderSpinner from '../../../components/ui/LoaderSpinner'
import { useHttpClient } from '../../../shared/hooks/http-hook'
import { url } from '../../../utils/urls/urls'
import classes from './PasswordReset.module.css'

const AccountActivation = () => {

    const { t } = useTranslation()
    const { isLoading, error, sendRequest } = useHttpClient()
    const [isActivated, setIsActivated] = useState(true)
    const activationToken = useParams().token

    useEffect(() => {

        const httpAbortCtrl = new AbortController()
        const fetchUsers = async () => {

            try {
                await sendRequest(process.env.REACT_APP_BACKEND_URL + `/users/account-activation/${activationToken}`, httpAbortCtrl);
                setIsActivated(true)

            } catch (err) { }
        }
        fetchUsers()

    }, [sendRequest, activationToken])

    if (isLoading) {
        return <LoaderSpinner />
    }

    let err;
    if (error) {

        err = JSON.parse(error)
        return <div className={classes.invalidContainer}>
            <p>{err.serverMessage}</p>
            <NavLink to={`/${url.users}/${url.account}/${url.sendEmail}?requestType=activation`}>{t('resendActivationEmail')}</NavLink>

        </div>
    }

    if (!isLoading && isActivated) {
        return (
            <div className={classes.successMessage}>
                <h1>{t('activatedAccount')}</h1>

            </div>
        )
    }

}

export default AccountActivation