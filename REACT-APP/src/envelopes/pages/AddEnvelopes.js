import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { AuthContext } from '../../shared/context/auth-context'
import classes from './AddEnvelope.module.css'
import { url } from '../../utils/urls/urls'
import LoaderSpinner from '../../components/ui/LoaderSpinner'
import ButtonRound from '../../components/ui/ButtonRound'
import { useTranslation } from 'react-i18next'
import GenericError from '../../components/ui/GenericError'
import { authHeaders } from '../../utils/headers/authHeader'

const AddEnvelopes = () => {

    const { t } = useTranslation()
    const authCtx = useContext(AuthContext)
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
        clearError()
        const headers = authHeaders(authCtx.token, authCtx.csurfTk)
        const httpAbortCtrl = new AbortController()
        try {
            const userData = {
                title: data.title,
            }

            await sendRequest(process.env.REACT_APP_BACKEND_URL + '/envelopes',
                httpAbortCtrl,
                'POST',
                JSON.stringify(userData),
                headers
                /* {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + authCtx.token,
                    'X-CSRF-TOKEN': authCtx.csurfTk,
                    credentials: 'include'
                } */
            )

            navigate(`/${url.envelopes}/${url.userEnvelopes}`)

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

    const clearErrorHandler = () => {
        clearError()
    }

    if (err && err.serverMessage) {
        return <GenericError onClearError={clearErrorHandler} />
    }

    const onCancelSubmission = event => {
        event.preventDefault()
        navigate(`/${url.envelopes}/${url.userEnvelopes}`)
    }

    return <div className={classes.addEnvelopeContainer}>

        <form className={classes.addFormContainer} onSubmit={handleSubmit(onSubmit)}>

            <div className={classes.addFormTag}>
                <h1>{t('createEnvelope')}</h1>
            </div>
            <div className={classes.addFormInputs}>
                <label>{t('title')}</label>
                <input
                    {...register("title", {
                        required: t('fieldNotEmpty'),
                        minLength: {
                            value: 2,
                            message: t('titleFieldMaxMin')
                        },
                        maxLength: {
                            value: 14,
                            message: t('titleFieldMaxMin')
                        },
                    })}
                />
                {errors.title && (
                    <p className={classes.errorMessage}>{errors.title.message}</p>
                )}
                {err && err.title && <p>{err.title}</p>}
            </div>

            <div className={classes.addFormAction}>
                <ButtonRound className={classes.addFormBtnOk} type="submit">{t('send')}</ButtonRound>
                <ButtonRound className={classes.addFormBtnCancel} onClick={onCancelSubmission}>{t('cancel')}</ButtonRound>
            </div>

        </form>
    </div>

}

export default AddEnvelopes