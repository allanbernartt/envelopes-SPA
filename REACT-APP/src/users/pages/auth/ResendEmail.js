import { useForm } from 'react-hook-form'
import classes from './ResetAndResendEmail.module.css'
import { useHttpClient } from '../../../shared/hooks/http-hook'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { url } from '../../../utils/urls/urls'
import LoaderSpinner from '../../../components/ui/LoaderSpinner'
import ButtonRound from '../../../components/ui/ButtonRound'
import { useContext } from 'react'
import { AuthContext } from '../../../shared/context/auth-context'
import { authHeaders } from '../../../utils/headers/authHeader'

const ResendEmail = () => {
    const authCtx = useContext(AuthContext)
    const { t } = useTranslation()
    const [searchParams] = useSearchParams()
    const requestType = searchParams.get('requestType');
    const { isLoading, error, sendRequest, clearError } = useHttpClient()
    const {
        register,
        formState: { errors },        
        handleSubmit
    } = useForm({
        mode: "onChange"
    });

    const navigate = useNavigate()

    const onSubmit = async (data) => {
        const headers = authHeaders(null, authCtx.csurfTk)
        clearError()
        const httpAbortCtrl = new AbortController()
        try {
            const userData = {
                user_email: data.user_email
            }
            const requesturl = requestType === 'activation' ? process.env.REACT_APP_BACKEND_URL + '/users/resend-activation-email' : process.env.REACT_APP_BACKEND_URL + '/users/password-reset'
            await sendRequest(requesturl,
                httpAbortCtrl,
                'POST',
                JSON.stringify(userData),
                headers
                /* {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': authCtx.csurfTk,
                    credentials: 'include'
                } */
            )

            const redirectUrl = requestType === 'activation' ? `/${url.users}/${url.emailSent}/?requestType=activation` : `/${url.users}/${url.emailSent}/?requestType=password`
            navigate(redirectUrl)            
        } catch (error) {

        }
    };

    if (isLoading) {
        return <LoaderSpinner />
    }

    let err;
    if (error) {
        err = JSON.parse(error)
    }

    return <div className={classes.sendEmailContainer}>
        {requestType === 'activation' && <h1>{t('resendActivationEmail')}</h1>}
        {requestType === 'password' && <h1>{t('recoverPass')}</h1>}
        <form className={classes.sendEmailForm} onSubmit={handleSubmit(onSubmit)}>

            <label htmlFor="user_email">Email</label>
            <input
                placeholder="Email"
                type="text"
                {...register("user_email", {
                    required:t('fieldNotEmpty'),
                    pattern: {
                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                        message: t('validEmailField')
                    }
                })}
            />
            {errors.user_email && <p className={classes.errorMessage}>{errors.user_email.message}</p>}
            {err && err.user_email && <p className={classes.errorMessage}>{err.user_email}</p>}
            {err && err.invalidEmail && <p className={classes.errorMessage}>{err.invalidEmail}</p>}

            <div className={classes.formAction}>
            <ButtonRound className={classes.formActionBtn} type="submit">{t('send')}</ButtonRound>
            </div>           

        </form>
        {err && err.serverMessage && <p className={classes.errorMessage}>{err.serverMessage}</p>}

    </div>
}

export default ResendEmail