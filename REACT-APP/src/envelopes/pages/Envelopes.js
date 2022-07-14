import { useContext, useEffect, useState } from "react"
import { NavLink } from 'react-router-dom'
import LoaderSpinner from "../../components/ui/LoaderSpinner"
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from "../../shared/hooks/http-hook"
import { url } from '../../utils/urls/urls'
import EnvelopeItem from "./EnvelopeItem"
import classes from './Envelopes.module.css'
import ErrorCard from "../../components/ui/ErrorCard"
import { useTranslation } from 'react-i18next'
import { currencyMask } from '../../utils/i18n/currencyMask'

const Envelopes = () => {

    const { t, i18n } = useTranslation()
    const authCtx = useContext(AuthContext)
    const { isLoading, error, sendRequest } = useHttpClient()
    const [envelopes, setEnvelopes] = useState([])
    const [totalBudget, setTotalBudget] = useState()

    

    useEffect(() => {
        const httpAbortCtrl = new AbortController()
        try {
            const fetchEnvelopes = async () => {

                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/envelopes', httpAbortCtrl, 'GET', null, {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + authCtx.token                    
                })

                setEnvelopes(responseData.envelopes)

                if (responseData.total_budget) {

                    const totalBudgetFloat = parseFloat(responseData.total_budget.total_budget)
                    setTotalBudget(totalBudgetFloat.toFixed(2))
                } else {
                    setTotalBudget('0.00')
                }
            }

            fetchEnvelopes()
        } catch (error) {

        }

    }, [sendRequest, authCtx.token, authCtx.csurfTk])

    if (isLoading) {
        return <LoaderSpinner />
    }

    let err;
    if (error) {
        err = JSON.parse(error)
    }

    let fetchedTotalBudget;

    if (totalBudget) {
        let totalCurrency = currencyMask(totalBudget, i18n.language)
        fetchedTotalBudget = <h2>{t('totalBudget')} {!totalBudget ? `${t('currency')} 0.00 ` : totalCurrency}</h2>
    }

    if (envelopes.length === 0) {

        return <div className={classes.errorContainer}>
            <div className={classes.envelopeTop}>
                <h1>Envelopes</h1>
                <div>
                    {fetchedTotalBudget}
                </div>
            </div>
            <ErrorCard>
                <h1>{t('emptyEnvelopes')}</h1>
                <NavLink as={NavLink} to={`/${url.envelopes}/${url.addEnvelope}`}>{t('createEnvelope')}</NavLink>

            </ErrorCard>
        </div>




    }

    if (err && err.serverMessage) {
        return <p>{err.serverMessage}</p>
    }

    const onDeleteHandler = (deletedId) => {

        const httpAbortCtrl = new AbortController()

        try {
            const fetchEnvelopes = async () => {

                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + `/envelopes/`, httpAbortCtrl, 'GET', null, {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + authCtx.token
                })

                setEnvelopes(responseData.envelopes)
                if (responseData.total_budget) {

                    const totalBudgetFloat = parseFloat(responseData.total_budget.total_budget)
                    setTotalBudget(totalBudgetFloat.toFixed(2))
                } else {
                    setTotalBudget('0.00')
                }
            }

            fetchEnvelopes()
        } catch (error) {

        }
    }

    let envelopeArray;

    if (!err && !isLoading && envelopes.length > 0) {

        envelopeArray = envelopes.map(env => {
            return <EnvelopeItem
                key={env.env_id}
                id={env.env_id}
                title={env.title}
                budget={env.budget}
                onDeleteHandler={onDeleteHandler}
                totalBudget={totalBudget}
            />
        })
    }

    return (
        <div className={classes.envelopes}>

            <div className={classes.envelopeTop}>
                <h1>Envelopes</h1>
                <div>
                    {fetchedTotalBudget}
                </div>
            </div>


            <div className={classes.gridContainer}>
                {envelopeArray}
            </div>

        </div>
    )
}

export default Envelopes