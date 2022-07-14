import { useState, useEffect, useContext } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useHttpClient } from '../../../shared/hooks/http-hook'
import { url } from '../../../utils/urls/urls'
import { useForm } from 'react-hook-form'
import classes from './PasswordReset.module.css'
import LoaderSpinner from '../../../components/ui/LoaderSpinner'
import ButtonRound from '../../../components/ui/ButtonRound'
import { AuthContext } from '../../../shared/context/auth-context'
import { authHeaders } from '../../../utils/headers/authHeader'

const PasswordReset = () => {

    const authCtx = useContext(AuthContext)

    const { t } = useTranslation()
    const { isLoading, error, sendRequest, clearError } = useHttpClient()
    const [isResponseOk, setIsResponseOk] = useState(false)
    const [isPassReset, setIsPassReset] = useState(false)
    const activationToken = useParams().token
    const {
        register,
        formState: { errors },
        getValues,
        handleSubmit
    } = useForm({
        mode: "onChange"
    });

    useEffect(() => {

        const httpAbortCtrl = new AbortController()
        const fetchUsers = async () => {

            try {
                await sendRequest(process.env.REACT_APP_BACKEND_URL + `/users/user-password-reset/${activationToken}`, httpAbortCtrl);

                setIsResponseOk(true)

            } catch (err) { }
        }
        fetchUsers()

    }, [sendRequest, activationToken])

    const onSubmit = async (data) => {
        const headers = authHeaders(null, authCtx.csurfTk)
        clearError()
        const httpAbortCtrl = new AbortController()
        try {
            const userData = {
                new_password: data.new_password,
                newPassConfirmation: data.newPassConfirmation
            }

            await sendRequest(process.env.REACT_APP_BACKEND_URL + `/users/user-password-reset/${activationToken}`,
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
            setIsPassReset(true)

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

    if (err && err.serverMessage) {
        return <div className={classes.invalidContainer}>
            <p>{err.serverMessage}</p>
            <NavLink to={`/${url.users}/${url.account}/${url.sendEmail}?requestType=password`}>Try again?</NavLink>

        </div>
    }


    if (isPassReset) {
        return <div className={classes.successMessage}>
            <h1>{t('passResetSuccess')}</h1>
            <h2>{t('loginWithNewPass')}</h2>
            <NavLink to={`/${url.users}/${url.auth}`}>Login</NavLink>
        </div>
    }


    if (!isLoading && isResponseOk) {
        return <div className={classes.generalFormContainer}>
            <form className={classes.generalForm} onSubmit={handleSubmit(onSubmit)}>

                <label>Password: </label>
                <input
                    {...register("new_password", {
                        required: t('fieldNotEmpty'),
                        minLength: {
                            value: 8,
                            message: t('passFieldMaxMin')
                        },
                        maxLength: {
                            value: 25,
                            message: t('passFieldMaxMin')
                        },
                    })}
                />
                {errors.new_password && (
                    <p className={classes.errorMessage}>{errors.new_password.message}</p>
                )}
                {err && err.new_password && <p className={classes.errorMessage}>{err.new_password}</p>}

                <label>Confirm Password: </label>
                <input
                    {...register("newPassConfirmation", {
                        required: t('fieldNotEmpty'),
                        validate: {
                            matchesPreviousPassword: (value) => {
                                const { new_password } = getValues();
                                return new_password === value || t('passMatchField');
                            }
                        }
                    })}
                />
                {errors.newPassConfirmation && (
                    <p className={classes.errorMessage}>
                        {errors.newPassConfirmation.message}
                    </p>
                )}
                {err && err.newPassConfirmation && <p>{err.newPassConfirmation}</p>}

                <div className={classes.formAction}>
                    <ButtonRound className={classes.formActionBtn} type="submit">{t('send')}</ButtonRound>
                </div>

            </form>
            {err && err.serverMessage && <p className={classes.errorMessage}>{err.serverMessage}</p>}

        </div>
    }

}

export default PasswordReset

