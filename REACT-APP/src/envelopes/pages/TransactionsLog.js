import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoaderSpinner from '../../components/ui/LoaderSpinner'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import classes from './TransactionsLog.module.css'
import { useTranslation } from 'react-i18next'
import ErrorCard from '../../components/ui/ErrorCard'
import ButtonRound from '../../components/ui/ButtonRound'
import { url } from '../../utils/urls/urls'

const TransactionsLog = () => {

    const { t } = useTranslation()
    const authCtx = useContext(AuthContext)
    const { isLoading, error, sendRequest, clearError } = useHttpClient()
    const [transactions, setTransactions] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        try {
            const fetchTransactions = async () => {
                const httpAbortCtrl = new AbortController()
                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + "/transactions-log",
                    httpAbortCtrl,
                    'GET',
                    null,
                    {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + authCtx.token
                    })

                setTransactions(responseData.data)
            }

            fetchTransactions()
        } catch (error) {

        }

    }, [sendRequest, authCtx.token])

    const goBack = () => {
        navigate(`/${url.envelopes}/${url.userEnvelopes}`)
    }

    if (isLoading) {
        return <LoaderSpinner />
    }

    if (error) {
        return <ErrorCard>
            <h2>{t('genericError')}</h2>
            <ButtonRound onClick={clearError}>Ok</ButtonRound>
        </ErrorCard>
    }

    const transactionsArray = transactions.length > 0 ? transactions.map(trans => {

        return <li className={classes.logListItem} key={trans.date}>
            <h2>{trans.date}</h2>
            <hr></hr>
            {trans.info.map(i => {
                const amount = parseFloat(i.amount)
                return <div key={i.transaction_id}>
                    <p><span className={classes.listTitle}>{t('transactionType')}:</span> {t(i.transaction_type)}</p>
                    {i['ENVELOPE SOURCE'] ? <p><span className={classes.listTitle}>{t('from')}:</span> {i['ENVELOPE SOURCE']}</p> : null}
                    {i.transaction_type === 'withdraw' ? <p><span className={classes.listTitle}>{t('from')}:</span> {i['ENVELOPE DESTINATION']}</p> : <p><span className={classes.listTitle}>{t('to')}:</span> {i['ENVELOPE DESTINATION']}</p>}
                    <p><span className={classes.listTitle}>{t('amount')}:</span> {i.transaction_type === 'withdraw' ? `-${t('currency')} ${amount.toFixed(2)}` : `${t('currency')} ${amount.toFixed(2)}`} </p>

                    <hr></hr>
                </div>
            })}

        </li>
    }) : []

    if (!isLoading && transactions.length > 0) {

        return (<div className={classes.logContainer}>
            <h1>{t('transactions')}</h1>
            <div className={classes.logListContainer}>
                <ul>
                    {transactionsArray}
                </ul>
            </div>
        </div>)

    } else {
        return <div className={classes.emptyLogContainer}>
            <h1>{t('noTransactions')}</h1>
            <ButtonRound className={classes.backButton} onClick={goBack}>{t('backToEnvelopes')}</ButtonRound>

        </div>
    }

}

export default TransactionsLog