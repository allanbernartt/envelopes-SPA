import ReactDOM from 'react-dom'
import classes from './LoaderSpinner.module.css'

const LoaderSpinner = () => {
    return ReactDOM.createPortal(
        <div className={`${classes.loaderContainer}`}>
            <div className={`${classes.loader} ${classes.hourGlass}`}></div>
        </div>,
        document.getElementById('spinner')
    )
}

export default LoaderSpinner