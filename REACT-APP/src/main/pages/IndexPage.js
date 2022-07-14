import classes from './IndexPage.module.css'
import bigEnvelope from '../../components/ui/img/bigenvelope.png'
import { useTranslation } from 'react-i18next'

const IndexPage = () => {

    const { t } = useTranslation()

    return <div >

        <div className={classes.imageContainer}>
            <img className={classes.image} src={bigEnvelope} alt='envelope' />
        </div>

        <div className={classes.platform}>
            <h1>{t('platform')}</h1>
        </div>
        <div className={classes.info}>
            <h1>{t('whatIs')}</h1>
            <p>{t('whatIsInfo')}</p>
        </div>
        <div className={classes.instructionsContainer}>

            <div className={classes.howWorks}>
                <div className={classes.howWorksTitle}>
                    <h2>{t('howWorks')}</h2>
                </div>
                
                <div className={classes.howWorksList}>
                    <ul>
                        <li>
                            <span className={classes.checkmark}>
                                <div className={classes.checkmarkStem}></div>
                                <div className={classes.checkmarkKick}></div>
                            </span>
                            <p>{t('stepOne')}</p>
                        </li>
                        <li>
                            <span className={classes.checkmark}>
                                <div className={classes.checkmarkStem}></div>
                                <div className={classes.checkmarkKick}></div>
                            </span>
                            <p>{t('stepTwo')}</p>
                        </li>
                        <li>
                            <span className={classes.checkmark}>
                                <div className={classes.checkmarkStem}></div>
                                <div className={classes.checkmarkKick}></div>
                            </span>
                            <p>{t('stepThree')}</p>
                        </li>
                        <li>
                            <span className={classes.checkmark}>
                                <div className={classes.checkmarkStem}></div>
                                <div className={classes.checkmarkKick}></div>
                            </span>
                            <p>{t('stepFour')}</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    </div>
}

export default IndexPage