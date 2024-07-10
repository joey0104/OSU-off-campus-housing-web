import './like.css'
import {useLocation} from 'react-router-dom';
import axios from 'axios';
import React, {useEffect, useState} from 'react'
import {refreshToken, tokenExpired} from './refresh'
function Like(){
    //get info from link
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const id = params.get('id');

    const [people, setPeople] = useState([])
    const fetch = async()=>{
        try{
            //have the token as headers, id as params to to the server
            const token = localStorage.getItem('token')
            const res = await axios.get('http://localhost:4000/like', {
                headers:{
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    id: id,
                },
            })
            setPeople(res.data)
        }catch(error){
            tokenExpired(error, refreshToken, fetch)
       }
    }
    useEffect(() => {
        fetch(); // Initial fetch when component mounts
    }, []);
     
    return(
        <>
            <div className="header"></div>
            <div className="content4">
                <div className="liked_list">
                    <h1>Users who liked the post: </h1>
                    <p>contact them for potential roommate match!</p>
                    <div className="nameCards">
                        {people.map(person=>(
                            <div>
                            Name: <h3>{person.name}</h3>
                            Email Address: <h3>{person.email}</h3>
                            </div>
                        ))}
                    </div>
                   
                </div>
                <div className="img"></div>
            </div>
        </>
        
    )
}
export default Like