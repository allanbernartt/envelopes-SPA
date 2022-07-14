import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from 'react-hook-form'
import { AuthContext } from "../../shared/context/auth-context"
import { useHttpClient } from "../../shared/hooks/http-hook"
import { url } from '../../utils/urls/urls'
import LoaderSpinner from "../../components/ui/LoaderSpinner"
import classes from './EnvelopeTransfer.module.css'
import ButtonRound from '../../components/ui/ButtonRound'
import ErrorCard from "../../components/ui/ErrorCard"
import { useTranslation } from 'react-i18next'
import {currencyMask} from '../../utils/i18n/currencyMask'


const EnvelopeTransfer = () => {

    const { t, i18n } = useTranslation()
    const authCtx = useContext(AuthContext)

    const { isLoading, error, sendRequest } = useHttpClient()
    const [sourceEnvelope, setSourceEnvelope] = useState()
    const [destinationArray, setDestinationArray] = useState()
    const [insufficientFunds, setInsufficientFunds] = useState(false)

    const envelopeId = useParams().envelopeId

    const navigate = useNavigate()

    const {
        register,
        handleSubmit
    } = useForm({
        mode: "onChange"
    });

    useEffect(() => {
        const httpAbortCtrl = new AbortController()
        try {
            const fetchEnvelopeById = async () => {

                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + `/transactions/${envelopeId}/transfer`, httpAbortCtrl, 'GET', null, {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + authCtx.token
                })

                setSourceEnvelope(responseData.sourceEnvelope)
                setDestinationArray(responseData.destinationEnvelopesArray)
            }

            fetchEnvelopeById()
        } catch (error) {

        }


    }, [sendRequest, authCtx.token, envelopeId])

    const goBack = (event) => {
        event.preventDefault()
        navigate(-1)
    }

    let err;

    if (error) {
        
        err = JSON.parse(error)

        return <div className={classes.errorWrapper}>
            <ErrorCard>
                <h2>{err.serverMessage || err.budget || err.insufficientFunds || t('genericError')}</h2>
                <ButtonRound onClick={goBack}>{t('goBack')}</ButtonRound>
            </ErrorCard>
        </div>
    }

    if (isLoading) {
        return <LoaderSpinner />
    }

    const onSubmit = async (data) => {

        const valueFloat = parseFloat(data.budget)
        const maxAllowed = parseFloat(sourceEnvelope.budget)

        if (valueFloat >= maxAllowed) {
            setInsufficientFunds(true)
            return
        }

        const normalized = i18n.language === 'pt' ? data.budget.replaceAll('.', '') : data.budget.replaceAll(',', '');
            const budget = i18n.language === 'pt' ? normalized.replace(',', '.') : parseFloat(normalized)
        const sendData = {
            destinationId: data.destinationId,
            budget: budget
        }

        try {
            const httpAbortCtrl = new AbortController()
            await sendRequest(process.env.REACT_APP_BACKEND_URL + `/transactions/${sourceEnvelope.env_id}/transfer`,
                httpAbortCtrl,
                'POST',
                JSON.stringify(sendData),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + authCtx.token,
                    'X-CSRF-TOKEN': authCtx.csurfTk,
                    credentials: 'include'
                }
            )

            navigate(`/${url.envelopes}/${url.userEnvelopes}`)

        } catch (error) {

        }
    }


    const inputMask = () => {

        let element = document.getElementById('valor')

        let valor = element.value.replace(/[^\d]+/gi, '');
        let reversedValue = valor.split('').reverse().join('')
        let resultado = "";
        let mascara = i18n.language === 'pt' ? "##.###.###,##".split('').reverse().join('') : "##,###,###.##".split('').reverse().join('');
        for (let x = 0, y = 0; x < mascara.length && y < reversedValue.length;) {
            if (mascara.charAt(x) !== '#') {
                resultado += mascara.charAt(x);
                x++;
            } else {
                resultado += reversedValue.charAt(y);
                y++;
                x++;
            }
        }
        element.value = resultado.split('').reverse().join('');
    }

    const clearInsufficientFundsError = (event) => {
        event.preventDefault()
        setInsufficientFunds(false)
    }

    if (sourceEnvelope && destinationArray) {
        const sourceBudget = currencyMask(sourceEnvelope.budget, i18n.language)

        const destination = destinationArray.map(dest => {
            const destinationBudget = currencyMask(dest.budget, i18n.language)

            return <option key={dest.env_id} value={dest.env_id}>{`${dest.title}: ${destinationBudget}`}</option>
        })

        return <div className={classes.transferContainer}>

            <div className={classes.transferTitle}>
                <h1>{t('transfer')}</h1>
            </div>

            <div className={classes.transferSourceContainer}>

                <div>
                    <h2>{t('source')}</h2>
                    <h3>{sourceEnvelope.title}</h3>
                </div>

                <div>
                    <h2>{t('availableFunds')}</h2>
                    <h3>{sourceBudget}</h3>
                </div>
            </div>

            <div className={classes.destinationContainer}>
                <h2>{t('envelopeDestination')}</h2>
                <form onSubmit={handleSubmit(onSubmit)} className={classes.formTransfer}>
                    <label>{t('chooseDestination')}</label>
                    <select name="Envelope Destination" {...register("destinationId", { required: true })}>
                        {destination}
                    </select>

                    <div className={classes.inputSection}>
                        <p>{t('currency')}</p>
                        <input
                            id="valor" onKeyUp={inputMask}
                            placeholder={t('amountToTransfer')}
                            {...register("budget", {
                                required: t('fieldNotEmpty')
                            })}
                        />
                    </div>



                    <div className={classes.transferContainerAction}>
                        <ButtonRound className={classes.btnOk}>{t('send')}</ButtonRound>
                        <ButtonRound className={classes.btnCancel} onClick={goBack}>{t('cancel')}</ButtonRound>
                    </div>

                </form>
                {insufficientFunds && <>
                    <p className={classes.errorMessage}>{t('sourceInsufficientFunds')}</p>
                    <ButtonRound className={classes.errorMessageBtn} onClick={clearInsufficientFundsError}>Ok</ButtonRound>
                </>}
            </div>
        </div>
    }

}

export default EnvelopeTransfer