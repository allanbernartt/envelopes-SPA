import classes from './ErrorCard.module.css'

const ErrorCard = props => {
    return <div className={classes.errorCard}>
        {props.children}
    </div>
}

export default ErrorCard