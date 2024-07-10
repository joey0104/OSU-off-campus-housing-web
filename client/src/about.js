import {useLocation} from 'react-router-dom';
import axios from 'axios';
import React, {useEffect, useState} from 'react'
import "./about.css"
import {refreshToken, tokenExpired} from './refresh'

function About(){
    //get info from url
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const address = params.get('address');

    const [post, setPost] = useState([])

    const fetch = async()=>{
        try{
            //have token as headers and address as params to the server
            const token = localStorage.getItem('token')
            const res = await axios.get('http://localhost:4000/about', {
                headers:{
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    address: address,
                },
            })
            //set post object with res.data
            setPost(res.data[0])
        }catch(error){
            tokenExpired(error, refreshToken, fetch)
       }
    }
    //fetch when the component mounts
    useEffect(() => {
        fetch();
    }, []);
    return(
        <>
            <div className="header"></div>
            <div className="content4">
                <div className="post">
                    <div className="postCard">
                            <h1>Address: {post.address}</h1>
                            Housing type: <h3>{post.type}</h3>
                            Total Monthly Rent: <h3>${post.lowerRent} - ${post.upperRent}</h3>
                            Bedrooms: <h3>{post.bedroom} beds</h3>
                            Bathrooms: <h3>{post.full_bath} full baths {post.half_bath} half baths</h3>
                            Amenities: <h3>{post.amenities}</h3>
                            Additional information: <h3 id="info">{post.info}</h3>
                    </div>
                   
                </div>
                <div className="img"></div>
            </div>
        </>
        
    )
}
export default About