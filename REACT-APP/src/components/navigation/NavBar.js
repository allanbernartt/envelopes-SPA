import { useState } from 'react'
import classes from './NavBar.module.css'
import Hamburguer from './Hamburguer'
import { CSSTransition } from 'react-transition-group'
import NavLinks from './NavLinks'
import brandImg from '../../components/ui/img/brand.png'
import brandMobileImg from '../../components/ui/img/brandMobile.png'
const NavBar = () => {

    const [showHamburguer, setShowHamburguer] = useState(true)

    const showClosehamburguerHandler = () => {
        setShowHamburguer(prev => !prev)
    }

    const classAnimIn = !showHamburguer ? classes.animIn : classes.animOut

    return <nav className={classes.nav}>
        <div className={classes.navContainer}>

            <div className={classes.brand}>
                <img src={brandImg} alt="brand" />
                <label className={classes.logo}>Envelopes</label>
            </div>

            <div className={classes.logoMobile}>
                <label className={classes.logo}>Envelopes</label>
            </div>

            <div className={classes.brandMobile}>
                <img src={brandMobileImg} alt="brand" />
            </div>

            <NavLinks className={classes.navList} mobile={false} />

            <div className={classes.hamburger}>
                <Hamburguer
                    open={showHamburguer}
                    onClick={showClosehamburguerHandler}
                />
            </div>

        </div>

        <CSSTransition in={!showHamburguer} timeout={300} mountOnEnter unmountOnExit>
            <>
                <div className={classes.backDrop} onClick={showClosehamburguerHandler}></div>
                <NavLinks className={`${classes.navList2} ${classAnimIn}`} onClick={showClosehamburguerHandler} mobile={true} closeMenu={showClosehamburguerHandler} />

            </>
        </CSSTransition>

    </nav>
}

export default NavBar