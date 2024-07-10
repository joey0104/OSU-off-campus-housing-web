import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './Main.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faUser, faPlus, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { refreshToken, tokenExpired } from './refresh'

function Main(){
    //useState setup
    const [houses, setHouses]=useState([])
    const [lowerRent, setLowerRent] = useState('0');
    const [upperRent, setUpperRent] = useState('0');
    const [bedroom, setBedroom] = useState('0');
    const [bathroom, setBathroom] = useState('0');
    const [pageNumber, setPageNumber] = useState(1);

    const fetch = async()=>{
        try{
            const token = localStorage.getItem('token')
            const res = await axios.get('http://localhost:4000/main', {
               headers:{
                'Authorization': `Bearer ${token}`
               },
               params: {
                   lowerRent,
                   upperRent,
                   bedroom,
                   bathroom,
                   pageNumber
               }
           })
           setHouses(res.data)
       }catch(error){
            tokenExpired(error, refreshToken, fetch)
       }
   }
   useEffect(() => {
       fetch();
   }, [lowerRent, upperRent, bedroom, bathroom, pageNumber]);

   //like button
   const handleLike = async(id)=>{
    try{
        const token = localStorage.getItem('token')
        const res = await axios.post("http://localhost:4000/like", { likedId: id },{
            headers:{
            'Authorization': `Bearer ${token}`
            }
        })
        //redirect to like page
        window.location.href=`/like?id=${id}`;
       }catch(error){
        tokenExpired(error, refreshToken, fetch)
    }
   }

   return(
       <>
       <div className="header">
        <a href="./profile">
            <button type="submit" className="userButton">
                <FontAwesomeIcon icon={faUser} />
            </button>
        </a>  
        <a href='./post'>
            <button type="submit" className="addPost">
                <FontAwesomeIcon icon={faPlus} />
            </button>
        </a> 
        <a href='./login' onClick={()=>localStorage.removeItem('token')}>
            <button type="submit" className="logoutButton">
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
            </button>
        </a>    
       </div>
        <div className="houses">
           <div className="filter">
                <label>Page: </label>
                   <input type="number" name="page" value={pageNumber} onChange={(event) => {setPageNumber(event.target.value); fetch();}}/>
                   <br></br>
               <label>Post type: </label>
                   <select id="type" name="type">
                       <option value="housing post">housing post</option>
                       <option value="sublease">sublease</option>
                   </select>
                   <br></br>
                   <label>Total Monthly Rent From: </label>
                   <input type="number" name="lower_rent" value={lowerRent} onChange={(event) => {setLowerRent(event.target.value.toString()); fetch();}}/>
                   <br></br>
                   <label>Total Monthly Rent To: </label>
                   <input type="number" name="upper_rent" value={upperRent} onChange={(event) => {setUpperRent(event.target.value.toString()); fetch(); }}/>
                   <br></br>
                   <label>Number of Bedrooms: </label>
                   <input type="number" name="bedrooms" value={bedroom} onChange={(event) => {setBedroom(event.target.value.toString()); fetch();}}/>
                   <br></br>
                   <label>Number of Bathrooms: </label>
                   <input type="number" name="bathrooms" value={bathroom} onChange={(event) => {setBathroom(event.target.value.toString()); fetch();}}/>
           </div>
           <div className="cards">
               {houses.map((house, index)=>(
                   <div className="card" key={index}>
                        <button type="button" className="heart" name="like" onClick={()=>handleLike(house.id)}>
                        <FontAwesomeIcon icon={faHeart} />
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
       </>
   )
}
export default Main
