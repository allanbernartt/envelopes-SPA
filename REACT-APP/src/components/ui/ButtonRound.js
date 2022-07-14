import classes from './ButtonRound.module.css'

const ButtonRound = props => {
    return <button
        className={`${classes.buttonRound} ${props.className}`}
        onClick={props.onClick}
        type={props.type}
    >{props.children}</button>
}

export default ButtonRound