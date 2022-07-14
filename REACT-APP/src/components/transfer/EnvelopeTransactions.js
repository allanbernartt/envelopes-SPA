import { useHttpClient } from "../../shared/hooks/http-hook"
import { useForm } from 'react-hook-form'
import { useContext, useState } from "react"
import LoaderSpinner from "../ui/LoaderSpinner"
import classes from './EnvelopeTransactions.module.css'
import ButtonRound from "../ui/ButtonRound"
import { useTranslation } from 'react-i18next'
import { AuthContext } from "../../shared/context/auth-context"
import {authHeaders} from '../../utils/headers/authHeader'

const EnvelopeTransactions = (props) => {
    const authCtx = useContext(AuthContext)
    const { t, i18n } = useTranslation()
    const { isLoading, error, sendRequest } = useHttpClient()
    const [insufficientFunds, setInsufficientFunds] = useState(false)
    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm({
        mode: "onChange"
    });

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

    let err;
    if (error) {
        err = JSON.parse(error)
    }

    const inputElements = props.inputs && props.inputs.map(inpt => {

        return <div key={inpt.name} className={classes.formInputs}>
            <label>{inpt.label}</label>
            <div className={classes.inputContainer}>
                {props.currency ? <p className={classes.inputCurrency}>{t('currency')}</p> : null}
                <input
                    onKeyUp={inpt.keyUp ? inputMask : null}
                    id={inpt.id ? inpt.id : null}
                    type={inpt.type}
                    step={inpt.step ? inpt.step : null}
                    min={inpt.min ? inpt.min : null}
                    max={inpt.max ? inpt.max : null}
                    placeholder={inpt.placeholder ? inpt.placeholder : null}
                    {...register(inpt.name, {
                        required: inpt.requiredMessage || null,
                        minLength: inpt.minLength ? {
                            ...inpt.minLength
                        } : null,
                        maxLength: inpt.maxLength ? {
                            ...inpt.maxLength
                        } : null
                    })}
                />
            </div>

            {errors[inpt.name] && (
                <p className={classes.errorMessage}>{errors[inpt.name].message}</p>
            )}

            {err && err.title && <p className={classes.errorMessage}>{err.title}</p>}
            {err && err.insufficientFunds && <p className={classes.errorMessage}>{err.insufficientFunds}</p>}

        </div>

    })

    const onSubmit = async (data) => {
        const headers = authHeaders(props.token, authCtx.csurfTk)
        if (props.withdrawBudget) {

            const valueFloat = parseFloat(data.budget)
            const maxAllowed = parseFloat(props.withdrawBudget)

            if (valueFloat >= maxAllowed) {
                setInsufficientFunds(true)
                return
            }


        }

        let sendData;
        if (data.budget) {

            const normalized = i18n.language === 'pt' ? data.budget.replaceAll('.', '') : data.budget.replaceAll(',', '');
            const budget = i18n.language === 'pt' ? normalized.replace(',', '.') : parseFloat(normalized)
            sendData = {
                budget
            }
        } else {
            sendData = {
                ...data,
            }
        }

        try {
            const httpAbortCtrl = new AbortController()
            await sendRequest(props.url,
                httpAbortCtrl,
                props.method,
                JSON.stringify(sendData),
                headers
                /* {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'X-CSRF-TOKEN': authCtx.csurfTk,
                    credentials: 'include'
                } */
            )

            props.afterSubmitHandler()
           
        } catch (error) {

        }
    }

    const cancel = (event) => {
        event.preventDefault()
        props.cancel()
    }

    if (isLoading) {
        return <LoaderSpinner />
    }

    const clearInsufficientFundsError = () => {
        setInsufficientFunds(false)
    }

    return <>
        <div className={classes.backDrop} onClick={cancel}></div>
        <div className={classes.formContainer}>
            <div className={classes.formTag}>
                <p>{props.transactionType}</p>
            </div>
            {props.delete && <h3>{t('deleteEnvelope')}</h3>}

            <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                <div>
                    {inputElements}
                </div>
                <div className={classes.formAction}>
                    <ButtonRound type="submit" className={classes.buttonOK}>{t('send')}</ButtonRound>
                    <ButtonRound onClick={cancel} className={classes.buttonCancel}>{t('cancel')}</ButtonRound>
                </div>
            </form>

            {err && err.message && <p>{err.message}</p>}
            {insufficientFunds && <>
                <p>{t('sourceInsufficientFunds')}</p>
                <ButtonRound className={classes.buttonError} onClick={clearInsufficientFundsError}>Ok</ButtonRound>
            </>}

        </div>

    </>

}

export default EnvelopeTransactions