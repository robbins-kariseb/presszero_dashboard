import React from 'react'
import logo from "../images/logo.png"
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppProvider'
import banner from "../images/press-zero-banner-01.png"
import Integrations from '../controllers/integration.controller'


function LoginView() {
    const {handleUserSignIn} = React.useContext(AppContext)
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [accessKey, setAccessKey] = React.useState("")

    const [errorMessage, setErrorMessage] = React.useState("")

    const navigate = useNavigate();

    const handleSignin = async () => {
        const isAuthorized = await handleUserSignIn({username:username,password:password, accessKey: accessKey})
        console.log(isAuthorized)
        if (isAuthorized) {
            if (!window.location.href.includes("/dashboard")) window.location.href = "/dashboard";
        } else {
            setErrorMessage("You are not authorized to access this application!")
            const interval = setTimeout(() => {
                setErrorMessage("")
                return ()=>clearTimeout(interval)
            }, 5000);
        }
    }

    const handleMagicSignIn = async (username, accessKey) => {
        const isAuthorized = await handleUserSignIn({username:username, accessKey: accessKey})
        console.log(isAuthorized)
        if (isAuthorized) {
            if (!window.location.href.includes("/dashboard")) window.location.href = "/dashboard";
        } else {
            setErrorMessage("Invalid username or password!")
            const interval = setTimeout(() => {
                setErrorMessage("")
                return ()=>clearTimeout(interval)
            }, 5000);
        }
    }
    
    React.useEffect(()=>{
        const controller = new Integrations()

        const magic_link = controller.extractMagicLink()
        console.log("magic_link", magic_link)

        if (magic_link && magic_link.email !== null && magic_link.password !== null) {
            setUsername(magic_link.email)
            setAccessKey(magic_link.password)

            setTimeout(() => {
                handleMagicSignIn(magic_link.email, magic_link.password)
            }, 1000);
        }
    }, [])

    return (
        <React.Fragment>
            <div className='container flex'>
                <div className='main-2x3'>
                    <center>
                        <div style={{color:"#c7c7c7"}} className='info-banner'>
                            <h3><span style={{color:"#ffffff"}}>WELCOME TO</span> <br/> PRESS ZERO</h3>
                        </div>
                    </center>
                    <div className='banner'>
                        <img src={banner} alt="PressZero" />
                    </div>
                </div>
                <div className='main-1x3'>
                    <div className='branding'>
                        <center>
                            <img src={logo} alt="PressZero" />
                            <h4>PRESS ZERO BUSSINESS</h4>
                        </center>
                    </div>
                    <div className='login-form'>
                        <div className='heading form-control'>
                            <h4>Sign in</h4>
                            
                            {errorMessage.length > 0 && <p className={`form-error ${errorMessage.length > 0 ? 'shake' : ''}`}>{errorMessage}</p>}
                        </div>

                        <div className='form-control'>
                            <input type='email' value={username} onChange={(e)=>setUsername(e.target.value)} placeholder='Company Email Address' />
                        </div>

                        <div className='form-control'>
                            <input type='password' value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Password' />
                        </div>

                        {/* <div className='form-control'>
                            <div className='wrap'>
                                <input type='checkbox' placeholder='Remember Me?' />
                                <label style={{display: "grid"}}>Remember me?</label>
                            </div>
                        </div> */}

                        <div className='form-control'>
                            <input className='enabled' onClick={handleSignin} type='button' value='Sign in' />
                        </div>

                        {/* <div className='form-control'>
                            <input className='disabled' type='button' value='Forgot Password?' />
                        </div>

                        <div className='form-control'>
                            <center>
                                <p>Don’t have an account? <Link to={"/register"}>SIGN UP</Link></p>
                            </center>
                        </div> */}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default LoginView
