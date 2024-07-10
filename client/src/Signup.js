import styles from './Login.css'
import React, {useState} from 'react'
function Signup(){
  //set up the useStates
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio]= useState("")
   //wait until the request is sent to the server before redirect it to home
  const submit = async(event)=>{
    //prevent default html feature - page reload or navigation
    event.preventDefault();
    try{
      //promise fetch
      const res = await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({name, email, password, bio })
      });
      //check status if its 200, then redirect page to home
      if(res.ok){
        window.location.href='/main';
      }else{
        console.error('Error from server')
      }
    }catch(error){
      console.error(error)
    }
  }
  return(
    <>
    <div className="header"></div>
    <div className="content1">
      <div className="logIn">
        <form onSubmit={submit}>
          <h1>Sign Up</h1>
          <label>Full name</label>
          <input type="text" name="full name" placeholder="Full Name"
                    onChange={(event)=>{setName(event.target.value)}}
                    required></input>
          <br></br>
          <label>Email Address: </label>
          <input type="email" name="email address" placeholder="Email Address"
                        onChange={(event)=>{setEmail(event.target.value)}} 
                        required></input>
          <br></br>
          <label>Passowrd: </label>
          <input type="password" name="password" placeholder="Password"
                    onChange={(event)=>{setPassword(event.target.value)}}
                    required></input>
          <br></br>
          <label>Bio: </label>
          <br></br>
          <textarea name="bio" id="bio" placeholder="Please type a short bio for roommate matching."
          onChange={(event)=>{setBio(event.target.value)}}
          required> </textarea>
          <br></br>
          <button type="submit" className="loginButton">SIGN UP</button>
          <div className="noAccount">
              Already have an account ?   <a href="./login">Log in</a>
          </div>
        </form>
      </div> 
      <div className="img">
      </div>
    </div>
     
  </>
  )
}
export default Signup
