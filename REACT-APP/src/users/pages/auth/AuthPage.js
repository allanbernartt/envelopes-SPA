import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form'
import { NavLink, useNavigate } from 'react-router-dom';
import classes from './AuthPage.module.css'
import { useHttpClient } from '../../../shared/hooks/http-hook'
import ButtonRound from '../../../components/ui/ButtonRound';
import { AuthContext } from '../../../shared/context/auth-context';
import { url } from '../../../utils/urls/urls'
import LoaderSpinner from '../../../components/ui/LoaderSpinner';
import { useTranslation } from 'react-i18next'
import { authHeaders } from '../../../utils/headers/authHeader';

const AuthPage = () => {

    const { t } = useTranslation()
    const authCtx = useContext(AuthContext)

    const [isLoginMode, setIsLoginMode] = useState(true)
    const { isLoading, error, sendRequest, clearError } = useHttpClient()
    const {
        register,
        formState: { errors },
        getValues,
        handleSubmit
    } = useForm({
        mode: "onChange"
    });

    const navigate = useNavigate()

    const onSubmit = async (data) => {

        const headers = authHeaders(null, authCtx.csurfTk)
        const httpAbortCtrl = new AbortController()
        if (isLoginMode) {

            try {
                const userData = {
                    user_email: data.user_email,
                    password: data.password
                }

                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/users/login',
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

                authCtx.login(responseData.userId, responseData.token)

            } catch (error) {

            }

        } else {
            try {
                const userData = {
                    user_name: data.user_name,
                    user_email: data.user_email,
                    password: data.password,
                    passConfirmation: data.passConfirmation
                }
                await sendRequest(process.env.REACT_APP_BACKEND_URL + '/users/register',
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

                navigate(`/${url.users}/${url.emailSent}?requestType=activation`)

            } catch (err) { }

        }
    };

    const switchAuthModeHandler = (event) => {
        event.preventDefault()
        setIsLoginMode(prev => !prev)
        clearError()
    }

    if (isLoading) {
        return <LoaderSpinner />
    }

    let err;
    if (error) {
        err = JSON.parse(error)


    }
    return <div className={classes.authContainer}>
        {authCtx.sessionExpiration && <div className={classes.sessionExpiration}><p>{t('sessionExpiration')}</p></div>}
        <div className={classes.loginFormContainer}>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className={classes.loginFormTitle}>
                    <h1>{isLoginMode ? t('loginTag') : t('createAccount')}</h1>
                </div>
                <div className={classes.loginFormInputs}>

                    {!isLoginMode && <>
                        <input
                            placeholder={t('name')}
                            {...register("user_name", {
                                required: t('fieldNotEmpty'),
                                minLength: {
                                    value: 3,
                                    message: t('nameFieldMaxMin')
                                },
                                maxLength: {
                                    value: 25,
                                    message: t('nameFieldMaxMin')
                                }
                            })}
                        />
                        {errors.user_name && <p className={classes.errorMessage}>{errors.user_name.message}</p>}
                        {err && err.user_name && <p className={classes.errorMessage}>{err.user_name}</p>}
                    </>}

                    <input
                        placeholder="Email"
                        type="text"
                        {...register("user_email", {
                            required: t('fieldNotEmpty'),
                            pattern: {
                                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                message: t('validEmailField')
                            }
                        })}
                    />
                    {errors.user_email && <p className={classes.errorMessage}>{errors.user_email.message}</p>}
                    {err && err.user_email && <p className={classes.errorMessage}>{err.user_email}</p>}
                    <input
                        placeholder={t('password')}
                        type="password"
                        {...register("password", {
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
                    {errors.password && (
                        <p className={classes.errorMessage}>{errors.password.message}</p>
                    )}
                    {err && err.password && <p className={classes.errorMessage}>{err.password}</p>}

                    {!isLoginMode && <>
                        <input
                            placeholder={t('confirmPass')}
                            type="password"
                            {...register("passConfirmation", {
                                required: t('fieldNotEmpty'),
                                validate: {
                                    matchesPreviousPassword: (value) => {
                                        const { password } = getValues();
                                        return password === value || t('passMatchField');
                                    }
                                }
                            })}
                        />
                        {errors.passConfirmation && (
                            <p className={classes.errorMessage}>
                                {errors.passConfirmation.message}
                            </p>
                        )}
                        {err && err.passConfirmation && <p className={classes.errorMessage}>{err.passConfirmation}</p>}
                    </>
                    }
                </div>
                {err && err.serverMessage && <div className={classes.serverError}>
                    <p>{err.serverMessage}</p>
                </div>}
                {err && err.emailErrorMessage && <div className={classes.serverError}>
                    (
                    <>
                        <p>{err.emailErrorMessage}</p>

                        <NavLink to={`/${url.users}/${url.account}/${url.sendEmail}?requestType=activation`}>{t('resendActivationEmail')}</NavLink>

                    </>
                    )
                </div>}

                <div className={classes.forgotPassword}>
                    {isLoginMode && <NavLink to={`/${url.users}/${url.account}/${url.sendEmail}?requestType=password`}>{t('forgotPass')}</NavLink>}
                </div>

                <div className={classes.loginFormAction}>
                    <ButtonRound className={classes.btnSubmit}>{isLoginMode ? 'LOGIN' : t('btnRegister')}</ButtonRound>
                    <ButtonRound className={classes.btnSwitch} onClick={switchAuthModeHandler}>{t('switchTo')} {isLoginMode ? t('createAccount') : 'Login'}</ButtonRound>
                </div>

            </form>

        </div>
    </div>
}

export default AuthPage