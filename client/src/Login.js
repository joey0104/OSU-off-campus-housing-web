import styles from './Login.css'
import React, {useState} from 'react'
function Login(){
  //set up the useStates
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  //wait until the request is sent to the server before redirect it to home
  const submit = async(event)=>{
    //prevent default html feature - page reload or navigation
    event.preventDefault();
    try{
      //promise fetch
      const res = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        //conver to json string
        body: JSON.stringify({email, password})
      });
      //check status if its 200, then redirect page to home
      if(res.ok){
        const data = await res.json()
        //set token and refreshToken to local storage
        localStorage.setItem('token', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        window.location.href='/main';
      }else{
        console.error("Invalid password")
        window.location.href='/login';
      }
    }catch(error){
      console.error(error)
      window.location.href='/login';
    }
  }
  return(
    <>
    <div className="header"></div>
    <div className="content1">
      <div className="logIn">
      <form onSubmit={submit}>
        <h1>Log in</h1>
        <label>Email Address: </label>
        <br></br>
        <input type="email" name="email address" placeholder="Email Address"
               onChange={(event)=>{setEmail(event.target.value)}} 
               required></input>
        <br></br>
        <label>Password: </label>
        <br></br>
        <input type="password" name="password" placeholder="Password" 
              onChange={(event)=>{setPassword(event.target.value)}}
              required></input>
        <br></br>
        <a href="./password">Forgot your password?</a>
        <br></br>
        <button type="submit" className="loginButton">LOG IN</button>
        <div className="noAccount">
          <label className="account">Don't have an account ?  </label>
          <a href="/signup">Sign up</a>
        </div>
        
      </form>
    </div>
    <div className="img"></div>
    </div>
     
  </>
  )
}
export default Login