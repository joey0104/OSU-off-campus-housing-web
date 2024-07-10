import styles from './Login.css'
import React, {useState} from 'react'
function Password(){
  //set up the useStates
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
   //wait until the request is sent to the server before redirect it to home
  const submit = async(event)=>{
    //prevent default html feature - page reload or navigation
    event.preventDefault();
    try{
      //promise fetch
      const res = await fetch('http://localhost:4000/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
      });
      //check status if its 200, then redirect page to home
      if(res.ok){
        window.location.href='/main';
      }else{
        console.log('Server error')
      }
    }catch(error){
      console.log('Set password err')
    }
  }
  return(
    <>
    <div className="header"></div>
    <div className="content1">
      <div className="logIn">
      <form onSubmit={submit}>
        <h1>Change Password</h1>
        <label>Email Address: </label>
        <br></br>
        <input type="email" name="email address" placeholder="Email Address"
               onChange={(event)=>{setEmail(event.target.value)}} 
               required></input>
        <br></br>
        <label>New Password: </label>
        <br></br>
        <input type="password" name="password" placeholder="New Password" 
              onChange={(event)=>{setPassword(event.target.value)}}
              required></input>
        <br></br>
        <button type="submit" className="loginButton">LOG IN</button>
        <div className="noAccount">
          <label className="account">Remember your password ?  </label>
          <a href="./login">Log In</a>
        </div>
        
      </form>
    </div>
    <div className="img"></div>
    </div>
     
  </>
  )
}
export default Password