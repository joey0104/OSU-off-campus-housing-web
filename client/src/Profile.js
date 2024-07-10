import React, {useState, useEffect, useRef} from 'react'
import styles from './Profile.css'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrash, faHeartCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { refreshToken, tokenExpired } from './refresh'

function Profile(){
    //useState
    const [profile, setProfile] = useState({})
    const [houses, setHouses] = useState([])
    const [myPost, setMyPost] = useState([])
    const [bio, setBio] = useState("")

    const fetchProfile = async()=>{
        try{
            const token = localStorage.getItem('token')
            const res = await axios.get('http://localhost:4000/profile', {
                headers:{
                 'Authorization': `Bearer ${token}`
                },
            })
            setProfile(res.data[0])
            setHouses(res.data[1])
            setMyPost(res.data[2])
        }catch(error){
            tokenExpired(error, refreshToken, fetchProfile)
       }
    }
    useEffect(() => {
        fetchProfile()
    },[])
    //delete the created post
    const handleTrash = async(id)=>{
        try{
            const token = localStorage.getItem('token')
            const res = await axios.post("http://localhost:4000/trash", { TrashedId: id },{
                headers:{
                'Authorization': `Bearer ${token}`
                }
            })
            window.location.href=`/profile`;
           }catch(error){
            tokenExpired(error, refreshToken, fetchProfile)
       }
    }
    //dislike post
    const handleDislike = async(id)=>{
        try{
            const token = localStorage.getItem('token')
            const res = await axios.post("http://localhost:4000/dislike", { TrashedId: id },{
                headers:{
                'Authorization': `Bearer ${token}`
                }
            })
            window.location.href=`/profile`;
           }catch(error){
            tokenExpired(error, refreshToken, fetchProfile)
       }
    }

    const changeBio = async()=>{
        try{
            const token = localStorage.getItem('token')
            const response = await axios.post('http://localhost:4000/profile', {newBio: bio}, {
                headers:{
                 'Authorization': `Bearer ${token}`
                },
            })
            if(response.ok){
                window.location.href='/profile';
            }
        }catch(error){
            tokenExpired(error, refreshToken, fetchProfile)
       }
    }
    return(
        <>
            <div className="header"></div>
            <div className="content">
                <div className="first_page">
                    <div className="profile">
                        <h1>Your Profile: </h1>
                        <div className="profileContent">
                            <label>Name: </label><br/>
                            <h3>  {profile.name}</h3>
                            <label>Email Address: </label><br/>
                            <h3>  {profile.email}</h3>
                            <label>Bio: </label><br/>
                                <textarea name="bio" id="bio" placeholder={profile.bio}
                                onChange={(event)=>setBio(event.target.value)}
                                required> </textarea>
                            <br></br>
                            <button type="button" className="loginButton" onClick={changeBio}>Change BIO</button>
                            </div>
                    </div>
                 <h1>Your liked posts: </h1>
                 <div className="liked">
                    {houses.map((house, index)=>(
                    <div className="liked_house" key={index}>
                        <button type="button" className="heart" name="like" onClick={()=>handleDislike(house.id)}>
                        <FontAwesomeIcon icon={faHeartCircleXmark} />
                        </button>
                       <div className="address">
                           <h2>{house.address}</h2>
                       </div>
                       <div className="content3">
                           <h3>Total Monthly Rent: <br></br>{house.rent}</h3>
                           <h3>Bedrooms: {house.bedroom}</h3>
                           <h3>Bathrooms: {house.bathroom}</h3>
                           <h3>Amenities: {house.amenities}</h3>
                           <a href={house.url}>
                               <button type="button" className="button1"> More details </button>
                           </a>
                       </div>
                   </div>
                    ))}
                </div>
                <h1>Your posts: </h1>
                 <div className="MyPosts">
                    {myPost.map((house, index)=>(
                    <div className="MyPost" key={index}>
                        <button type="button" className="heart" name="like" onClick={()=>handleTrash(house.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                        </button>
                       <div className="address">
                           <h2>{house.address}</h2>
                       </div>
                       <div className="content3">
                            <h3>Total Monthly Rent: <br></br>${house.lowerRent} - ${house.upperRent}</h3>
                           <h3>Bedrooms: {house.bedroom} beds</h3>
                           <h3>Bathrooms: {house.full_bath} full baths {house.half_bath} half baths</h3>
                           <h3>Amenities: {house.amenities}</h3>
                           <a href={house.url}>
                               <button type="button" className="button1"> More details </button>
                           </a>
                       </div>
                   </div>
                    ))}
                </div>
                </div>
                <div className="img"></div>
            </div>
        </>
        
    )
}
 export default Profile