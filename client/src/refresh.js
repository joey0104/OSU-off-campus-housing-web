import axios from 'axios'
export const refreshToken = async ()=>{
    try{
        //get refreshToken
        const refreshToken = localStorage.getItem('refreshToken')
        //token server for new token
        const res = await axios.post('http://localhost:4000/token', {token: refreshToken})
        //set new token to local storage
        localStorage.setItem('token', res.data.accessToken)
        
    }catch(error){
        console.error("Error refreshing token: " , error)
        //if refresh token expires
        if(error.response.status===419){
            console.error("refresh token expired")
            //redirect to login 
            window.location.href='/login'
        }
    }
    
}

export const tokenExpired = async(error, refreshToken, fetch)=>{
    //token expired
    if(error.response.status===401){
        try{
            //refresh token
            await refreshToken()
            //reload
            fetch()
        }catch(refreshError){
            console.error(refreshError)
        }
    }else{
        console.error("Error fetching data from server", error)
    }
}