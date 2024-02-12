import React from 'react'
import logo from "../images/logo.png"
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppProvider'
import banner from "../images/press-zero-banner-01.png"


function LoginView() {
    const {handleUserSignIn} = React.useContext(AppContext)
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")

    const [errorMessage, setErrorMessage] = React.useState("")

    const navigate = useNavigate();

    const handleSignin = async () => {
        const isAuthorized = await handleUserSignIn({username:username,password:password})
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

                        <div className='form-control'>
                            <div className='wrap'>
                                <input type='checkbox' placeholder='Remember Me?' />
                                <label>Remember me?</label>
                            </div>
                        </div>

                        <div className='form-control'>
                            <input className='enabled' onClick={handleSignin} type='button' value='Sign in' />
                        </div>

                        <div className='form-control'>
                            <input className='disabled' type='button' value='Forgot Password?' />
                        </div>

                        <div className='form-control'>
                            <center>
                                <p>Don’t have an account? <Link to={"/register"}>SIGN UP</Link></p>
                            </center>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default LoginView
