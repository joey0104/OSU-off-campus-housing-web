import styles from './Login.css'
import React, {useState} from 'react'
import { refreshToken, tokenExpired } from './refresh'

function Post(){
  //set up the useStates
  const [type, setType] = useState("Housing Post")
  const [address, setAddress] = useState("")
  const [lowerRent, setLowerRent] = useState("")
  const [upperRent, setUpperRent] = useState("")
  const [bedroom, setBedroom] = useState("")
  const [full_bath, setFull_bath] = useState("")
  const [half_bath, setHalf_bath] = useState("")
  const [amenities, setAmenities] = useState("")
  let url=""
  const [info, setInfo] = useState("")
   //wait until the request is sent to the server before redirect it to home
  const submit = async(event)=>{
    //prevent default html feature - page reload or navigation
    event.preventDefault();
    try{
      url=`http://localhost:3000/about?address=${address}`
      const token = localStorage.getItem('token')
      //promise fetch
      const res = await fetch('http://localhost:4000/post', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({address, lowerRent, upperRent, full_bath, half_bath, bedroom, amenities, url, info, type})
      });
      //check status if its 200, then redirect page to home
      if(res.ok){
        window.location.href='/post';
      }else{
        console.log('err')
      }
    }catch(error){
      tokenExpired(error, refreshToken, submit)
    }
  }
    return(
        <>
            <div className="header"></div>
            <div className="content1">
            <div className="logIn">
                <form onSubmit={submit}>
                    <h1>Create a housing post</h1>
                    <label>Type of post: </label>
                    <select id="post_type" name="post_type" onChange={(event)=>{setType(event.target.value)}}>
                        <option value="housing post">Housing Post</option>
                        <option value="sublease">Sublease</option>
                    </select>
                    <br></br>
                    <label> Address: </label>
                    <br></br>
                    <input type="text" name="address" placeholder="House Address" onChange={(event)=>{setAddress(event.target.value)}} required/>
                    <br></br>
                    <label> Payment of Rent: </label>
                    <br></br>
                    From  <input type="text" id="rent" name= "lower_rent" placeholder="Minimum" onChange={(event)=>{setLowerRent(event.target.value)}} required/>   to   <input type="text" id="rent" name="upper_rent" placeholder="Maximum" onChange={(event)=>{setUpperRent(event.target.value)}} required/>
                    <br></br>
                    <label>Number of Bedrooms: </label>
                    <br></br>
                    <input type="text" name= "bedrooms" placeholder="Number of Bedrooms" onChange={(event)=>{setBedroom(event.target.value)}} required/>
                    <br></br>
                    <label>Number of Bathrooms: </label>
                    <br></br>
                    <input type="text" name= "bathrooms" placeholder="Number of full baths" onChange={(event)=>{setFull_bath(event.target.value)}} required/>
                    <br></br>
                    <input type="text" name= "bathrooms" placeholder="Number of half baths" onChange={(event)=>{setHalf_bath(event.target.value)}} required/>
                    <br></br>
                    <label>General amenities: </label>
                    <br></br>
                    <input type="text" name= "amenities" placeholder="eg: AC/pet allowed" onChange={(event)=>{setAmenities(event.target.value)}} required/>
                    <br></br>
                    <label>Additional information: </label> 
                    <br></br>
                    <textarea name="bio" id="bio" placeholder="Please include amenities, parking availability, pet restrictions, utilities, and property details" onChange={(event)=>{setInfo(event.target.value)}} required></textarea>
                    <br></br>
                    <button type="submit" className="loginButton">SUBMIT</button>
                </form>
            </div>
            <div className="img"></div>
            </div>
        </>
    )
}
export default Post