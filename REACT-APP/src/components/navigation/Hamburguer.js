import classes from './Hamburguer.module.css'

const Hamburguer = props => {

    return <div className={classes.hamburguerContainer} onClick={props.onClick}>
        {props.open && <div className={classes.stripes}>
            <div className={classes.stripe}></div>
            <div className={classes.stripe}></div>
            <div className={classes.stripe}></div>
        </div>}
        {!props.open && <div className={classes.close}>
            <div className={classes.closeRight}></div>
            <div className={classes.closeLeft}></div>
        </div>}
    </div>
}

export default Hamburguer