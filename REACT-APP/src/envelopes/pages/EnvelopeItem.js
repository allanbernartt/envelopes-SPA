import classes from './EnvelopeItem.module.css'
import { NavLink } from 'react-router-dom'
import { url } from '../../utils/urls/urls'
import { useContext, useState } from 'react'
import { AuthContext } from '../../shared/context/auth-context'
import envelopeIcon from '../../components/ui/img/envelope.png'
import EnvelopeTransactions from '../../components/transfer/EnvelopeTransactions'
import { useTranslation } from 'react-i18next'
import { currencyMask } from '../../utils/i18n/currencyMask'

const EnvelopeItem = (props) => {

    const { t, i18n } = useTranslation()

    const authCtx = useContext(AuthContext)
    const [isDelete, setIsDelete] = useState(false)

    const onDeleteHandler = () => {
        props.onDeleteHandler(props.id)
    }

    const openDeleteModal = () => {
        setIsDelete(true)
    }

    const cancelDeleteModal = () => {
        setIsDelete(false)
    }

    let envelopeBudget = currencyMask(props.budget, i18n.language)
    return <>

        {isDelete && <EnvelopeTransactions
            transactionType={t('delete')}
            method={'DELETE'}
            inputs={null}
            token={authCtx.token}
            url={process.env.REACT_APP_BACKEND_URL + `/envelopes/${props.id}`}
            cancel={cancelDeleteModal}
            afterSubmitHandler={onDeleteHandler}
            delete={true}

        />}
        
        <div key={props.id} className={classes.envelopeItem}>

            <div className={classes.envelopeTag}>
                <img src={envelopeIcon} alt="envelope" />
                <h2>{props.title}</h2>
            </div>

            <div className={classes.envelopeInfo}>

                <div>
                    <h2>{t('availableBudget')}</h2>
                    <p>{envelopeBudget}</p>
                </div>

                <div className={classes.envelopeAction}>
                    <NavLink to={`/${url.envelopes}/${url.singleEnvelope}/${props.id}`}>{t('seeEnvelope')}</NavLink>
                    <button onClick={openDeleteModal}>{t('delete')}</button>
                </div>


            </div>

        </div>
    </>
}

export default EnvelopeItem