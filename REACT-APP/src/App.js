import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './shared/context/auth-context'
import { useCallback, useEffect, useState } from 'react';
import { useHttpClient } from './shared/hooks/http-hook';
import { url } from './utils/urls/urls'
import LoaderSpinner from './components/ui/LoaderSpinner';
import NavBar from './components/navigation/NavBar';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next'
import { translationsEnglish, translationsPortuguese } from './utils/i18n/languages'
import Footer from './components/navigation/Footer';
import { authHeaders } from './utils/headers/authHeader'
import Cookies from 'js-cookie';


const IndexPage = React.lazy(() => import('./main/pages/IndexPage'))
const EmailSent = React.lazy(() => import('./users/pages/auth/EmailSent'))
const AccountActivation = React.lazy(() => import('./users/pages/auth/AccountActivation'))
const ResendEmail = React.lazy(() => import('./users/pages/auth/ResendEmail'))
const PasswordReset = React.lazy(() => import('./users/pages/auth/PasswordReset'))
const Envelopes = React.lazy(() => import('./envelopes/pages/Envelopes'))
const GenericError = React.lazy(() => import('./components/ui/GenericError'))
const AddEnvelopes = React.lazy(() => import('./envelopes/pages/AddEnvelopes'))
const SingleEnvelope = React.lazy(() => import('./envelopes/pages/SingleEnvelope'))
const EnvelopeTransfer = React.lazy(() => import('./envelopes/pages/EnvelopeTransfer'))
const TransactionsLog = React.lazy(() => import('./envelopes/pages/TransactionsLog'))
const AuthPage = React.lazy(() => import('./users/pages/auth/AuthPage'))

i18n.use(initReactI18next)
    .init({
        resources: {
            en: { translation: translationsEnglish },
            pt: { translation: translationsPortuguese }
        },
        lng: 'pt',
        fallbackLng: 'pt',
        interpolation: { escapeValue: false }
    })

let logoutTimer;

function App() {

    const { isLoading, error, sendRequest, clearError } = useHttpClient()
    const [sessionExpires, setSessionExpires] = useState()

    const initializeState = () => {
        const cid = Cookies.get('c.id')

        let cidToken;
        if (cid) {
            cidToken = JSON.parse(cid)
        }

        if (cid && cidToken) {
            if (new Date(cidToken.expiration) < new Date()) {
                setSessionExpires(true)
            }

            return cidToken

        } else {
            return false
        }
    }

    const initializeLanguage = () => {
        const storedData = JSON.parse(localStorage.getItem('options'))
        if (storedData && storedData.lng) {

            return storedData.lng

        } else {
            return 'pt'
        }
    }

    const [token, setToken] = useState(initializeState)
    const [userId, setUserId] = useState(null);
    const [tokenExpirationDate, setTokenExpirationDate] = useState()
    const [language, setLanguage] = useState(initializeLanguage)

    const [csurf, setCsurf] = useState(null)

    useEffect(() => {
        const token = Cookies.get('XSRF-TOKEN')
        setCsurf(token)
    }, [])

    const onChangeLanguageHandler = (language) => {
        i18n.changeLanguage(language)
        localStorage.setItem('options', JSON.stringify({ lng: language }));
        setLanguage(language)
    }

    const login = useCallback((uid, token, expirationDate) => {
        setToken(token)
        setUserId(uid)

        const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 24)
        setTokenExpirationDate(tokenExpirationDate)

        Cookies.set('c.id', JSON.stringify({ userId: uid, token: token, expiration: tokenExpirationDate.toISOString() }), { secure: true, expires: 7 })
    }, [])

    const logout = useCallback(async (expireTime) => {
        const headers = authHeaders(token, csurf)
        try {
            const httpAbortCtrl = new AbortController()
            await sendRequest(process.env.REACT_APP_BACKEND_URL + '/users/logout',
                httpAbortCtrl,
                'POST',
                null,
                headers
            )

            setToken(null)
            setUserId(null)
            if (expireTime) {
                setSessionExpires(true)

            } else {
                setSessionExpires(false)

                Cookies.remove('c.id')
            }

        } catch (error) {

            const err = JSON.parse(error.message)
            if (err.serverMessage === "Please authenticate" || err.serverMessage === 'Favor entrar na sua conta') {

                setToken(null)
                setUserId(null)

                Cookies.remove('c.id')
            }
        }

    }, [sendRequest, token, csurf])

    const logoutFromAllDevices = useCallback(async () => {
        const headers = authHeaders(token, csurf)
        const httpAbortCtrl = new AbortController()
        try {
            await sendRequest(process.env.REACT_APP_BACKEND_URL + '/users/logout-all',
                httpAbortCtrl,
                'POST',
                null,
                headers
            )

            setToken(null)
            setUserId(null)

            Cookies.remove('c.id')
        } catch (error) {
            const err = JSON.parse(error.message)

            if (err.serverMessage === "Please authenticate" || err.serverMessage === 'Favor entrar na sua conta') {

                setToken(null)
                setUserId(null)

                Cookies.remove('c.id')
            }
        }

    }, [sendRequest, token, csurf])

    useEffect(() => {

        if (token && tokenExpirationDate) {

            const remainingTime = tokenExpirationDate.getTime() - new Date().getTime()
            logoutTimer = setTimeout(logout, remainingTime, true)

        } else {
            clearTimeout(logoutTimer)
        }
    }, [token, logout, tokenExpirationDate])

    useEffect(() => {

        const storedCookie = Cookies.get('c.id')

        const storedOptions = JSON.parse(localStorage.getItem('options'))
        let lng = 'en'
        if (storedOptions && storedOptions.lng) {
            lng = storedOptions.lng || 'en'
        }

        i18n.changeLanguage(lng)

        let storedData;
        if (storedCookie) {
            storedData = JSON.parse(storedCookie)
        }

        if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {

            login(storedData.userId, storedData.token, new Date(storedData.expiration))

        } else {
            setToken(null)
            setUserId(null)
        }
    }, [login])

    const clearErrorHandler = () => {
        clearError()
    }

    if (error) {
        return <GenericError onClearError={clearErrorHandler} />
    }

    let routes;

    if (token) {

        routes = (
            <>
                <Route path="/" element={<IndexPage />} />
                <Route path={`/${url.transactions}`} element={<TransactionsLog />} />
                <Route path={`/${url.envelopes}/${url.userEnvelopes}`} element={<Envelopes />} />
                <Route path={`/${url.envelopes}/${url.addEnvelope}`} element={<AddEnvelopes />} />
                <Route path={`/${url.envelopes}/${url.transfer}/:envelopeId`} element={<EnvelopeTransfer />} />
                <Route path={`/${url.envelopes}/${url.singleEnvelope}/:envelopeId`} element={<SingleEnvelope />} />
                <Route path={`/${url.users}/${url.emailSent}`} element={<EmailSent />} />
                <Route path={`/${url.users}/${url.account}/:token`} element={<AccountActivation />} />
                <Route path={`/${url.users}/${url.account}/${url.sendEmail}`} element={<ResendEmail />} />
                <Route path="*" element={<Navigate to="/" />} />
            </>
        );
    } else {

        routes = (
            <>
                <Route path="/" element={<IndexPage />} />
                <Route path={`/${url.users}/${url.auth}`} element={<AuthPage />} />
                <Route path={`/${url.users}/${url.emailSent}`} element={<EmailSent />} />
                <Route path={`/${url.users}/${url.account}/${url.passwordReset}/:token`} element={<PasswordReset />} />
                <Route path={`/${url.users}/${url.account}/:token`} element={<AccountActivation />} />
                <Route path={`/${url.users}/${url.account}/${url.sendEmail}`} element={<ResendEmail />} />
                <Route path="*" element={<Navigate to={`/${url.users}/${url.auth}`} />} />
            </>
        )
    }

    return (
        <AuthContext.Provider value={{
            isLoggedIn: !!token,
            userId: userId,
            token: token,
            login: login,
            logout: logout,
            logoutFromAllDevices: logoutFromAllDevices,
            language: language,
            changeLanguage: onChangeLanguageHandler,
            csurfTk: csurf,
            sessionExpiration: sessionExpires

        }}>
            <BrowserRouter>
                <NavBar />
                {isLoading && <LoaderSpinner />}
                <Suspense fallback={<LoaderSpinner />}>
                    <Routes>
                        {routes}
                    </Routes>
                </Suspense>
                <Footer />
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;
