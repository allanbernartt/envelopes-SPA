import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import classes from './SingleEnvelope.module.css'
import { url } from '../../utils/urls/urls'
import EnvelopeTransactions from '../../components/transfer/EnvelopeTransactions'
import LoaderSpinner from '../../components/ui/LoaderSpinner'
import ButtonRound from '../../components/ui/ButtonRound'
import ErrorCard from '../../components/ui/ErrorCard'
import GenericError from '../../components/ui/GenericError'
import { useTranslation } from 'react-i18next'
import { currencyMask } from '../../utils/i18n/currencyMask'

const UpdateEnvelope = (props) => {

    const { t, i18n } = useTranslation()

    const authCtx = useContext(AuthContext)
    const envelopeId = useParams().envelopeId
    const [envelope, setEnvelope] = useState()
    const [totalBudget, setTotalBudget] = useState(0.00)
    const [budgetPercentage, setBudgetPercentage] = useState(0.00)
    const [updateTitle, setUpdateTitle] = useState()
    const [deposit, setDeposit] = useState()
    const [withdraw, setWithdraw] = useState()

    const navigate = useNavigate()
    const { isLoading, error, sendRequest, clearError } = useHttpClient()

    useEffect(() => {
        const httpAbortCtrl = new AbortController()
        try {
            const fetchEnvelopeById = async () => {

                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + `/envelopes/${envelopeId}`, httpAbortCtrl, 'GET', null, {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + authCtx.token
                })

                const checkTotalBudget = responseData.totalBudget.total_budget ? responseData.totalBudget.total_budget: 0.00
                const totalBudgetFloat = parseFloat(checkTotalBudget)

                const envelopeBudget = parseFloat(responseData.envelopes.budget)

                if (totalBudgetFloat > 0) {
                    const percentage = (envelopeBudget / totalBudgetFloat) * 100
                    const round = +(percentage).toPrecision(2)
                    setBudgetPercentage(round)

                }

                setEnvelope(responseData.envelopes)
                setTotalBudget(totalBudgetFloat)
            }

            fetchEnvelopeById()
        } catch (error) {

        }

    }, [sendRequest, authCtx.token, envelopeId])

    if (isLoading) {
        return <LoaderSpinner />
    }

    const onClearErrorHandler = () => {
        clearError()
        navigate(`/${url.envelopes}/${url.userEnvelopes}`)
    }

    let err;

    if (error) {

        err = JSON.parse(error)

        if (err.invalidId) {
            return <>
                <ErrorCard>
                    <h1>{err.invalidId}</h1>
                    <ButtonRound onClick={onClearErrorHandler}>OK</ButtonRound>
                </ErrorCard>
            </>
        }

        if (err.serverMessage) {
            return <GenericError errMsg={err.serverMessage} onClearError={clearError} />
        }
    }

    const openDeposit = () => {
        setUpdateTitle(false)
        setWithdraw(false)
        setDeposit(true)
    }

    const cancelDeposit = () => {
        setDeposit(false)
    }

    const openUpdateTitle = () => {
        setDeposit(false)
        setWithdraw(false)
        setUpdateTitle(true)
    }

    const cancelUpdateTitle = () => {
        setUpdateTitle(false)

    }

    const onUpdateEnvelope = () => {
        navigate(`/${url.envelopes}/${url.userEnvelopes}`)
    }

    const backToAllEnvelopes = () => {
        navigate(`/${url.envelopes}/${url.userEnvelopes}`)
    }

    const openWithdraw = () => {
        setUpdateTitle(false)
        setDeposit(false)
        setWithdraw(true)
    }

    const cancelWithdraw = () => {
        setWithdraw(false)
    }

    const updateTitleInputs = [
        {
            label: t('title'),
            type: 'text',
            placeholder: t('title'),
            name: 'title',
            requiredMessage: t('fieldNotEmpty'),
            minLength: {
                value: 2,
                message: t('titleFieldMaxMin')
            },
            maxLength: {
                value: 25,
                message: t('titleFieldMaxMin')
            },
        },

    ]

    const DepositInputs = [
        {
            label: t('amount'),
            type: 'text',
            step: 0.01,
            placeholder: t('howMuch'),
            name: 'budget',
            requiredMessage: t('fieldNotEmpty'),
            min: 0.01,
            keyUp: true,
            id: 'valor'
        },

    ]

    if (!isLoading && envelope) {
        const WithdrawInputs = [
            {
                label: t('amount'),
                type: 'text',
                placeholder: t('howMuch'),
                name: 'budget',
                requiredMessage: t('fieldNotEmpty'),
                max: envelope.budget,
                id: 'valor',
                keyUp: true,

            },
        ]

        let envelopeBudgetCurrency = currencyMask(envelope.budget, i18n.language)
        let totalBudgetCurrency = currencyMask(totalBudget, i18n.language)

        return <>
            <div className={classes.singleEnvelopeContainer}>

                {deposit && <EnvelopeTransactions
                    transactionType={t('deposit')}
                    method={'POST'}
                    currency={true}
                    inputs={DepositInputs}
                    token={authCtx.token}
                    url={process.env.REACT_APP_BACKEND_URL + `/transactions/${envelope.env_id}/deposit`}
                    cancel={cancelDeposit}
                    afterSubmitHandler={onUpdateEnvelope}

                />}
                {withdraw && <EnvelopeTransactions
                    transactionType={t('withdraw')}
                    method={'POST'}
                    currency={true}
                    inputs={WithdrawInputs}
                    token={authCtx.token}
                    url={process.env.REACT_APP_BACKEND_URL + `/transactions/${envelope.env_id}/withdraw`}
                    cancel={cancelWithdraw}
                    afterSubmitHandler={onUpdateEnvelope}
                    withdrawBudget={envelope.budget}
                />}
                {updateTitle && <EnvelopeTransactions
                    transactionType={t('update')}
                    method={'PUT'}
                    inputs={updateTitleInputs}
                    token={authCtx.token}
                    url={process.env.REACT_APP_BACKEND_URL + `/envelopes/${envelope.env_id}`}
                    cancel={cancelUpdateTitle}
                    afterSubmitHandler={onUpdateEnvelope}

                />}
                <div className={classes.singleEnvelopeInfo}>
                    <div>
                        <h1>{envelope.title}</h1>
                    </div>
                    <div className={classes.singleEnvelopeStats}>
                        <div className={classes.circleContainer}>

                            <div className={`${classes.circle}`} style={{ backgroundImage: `conic-gradient(#302d2e ${budgetPercentage}%, #cbc3bf 0)` }}>
                                <div className={classes.inner}>{budgetPercentage}%</div>
                            </div>
                        </div>
                        <div>
                            <div>
                                <h2>{envelopeBudgetCurrency}</h2>
                                <p>{t('budget')}</p>
                            </div>
                            <div>
                                <h2>{totalBudgetCurrency}</h2>
                                <p>{t('totalBudget')}</p>
                            </div>
                        </div>

                    </div>

                </div>

                <div className={classes.singleEnvelopeActions}>
                    <ButtonRound className={classes.singleEnvelopeActionBtn} onClick={openDeposit}>{t('deposit')}</ButtonRound>
                    <ButtonRound className={classes.singleEnvelopeActionBtn} onClick={openWithdraw}>{t('withdraw')}</ButtonRound>
                    <ButtonRound className={classes.singleEnvelopeActionBtn} onClick={openUpdateTitle}>{`${t('update')} ${t('title')}`}</ButtonRound>

                    <ButtonRound className={classes.singleEnvelopeActionBtn} onClick={backToAllEnvelopes}>{t('myEnvelopes')}</ButtonRound>

                </div>

                <div className={classes.envelope}>
                    <NavLink as={NavLink} to={`/${url.envelopes}/${url.transfer}/${envelope.env_id}`}>{t('transferToAnother')}</NavLink>
                </div>

            </div>
        </>
    }

}

export default UpdateEnvelope