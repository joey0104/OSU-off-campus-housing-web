import React from 'react'
import Login from './Login'
import Main from './Main'
import Signup from './Signup'
import Profile from './Profile'
import Post from './Post'
import Password from './Password'
import Like from './like'
import About from './about'
import { BrowserRouter, Routes, Route} from 'react-router-dom';

function App(){
    return(
        <div>
            <BrowserRouter>
                <Routes>
                    <Route index element={<Signup/>}></Route>
                    <Route path='/signup' element={<Signup/>}></Route>
                    <Route path='/login' element={<Login/>}></Route>
                    <Route path='/Main' element={<Main/>}></Route>
                    <Route path='/profile' element={<Profile/>}></Route>
                    <Route path='/post' element={<Post/>}></Route>
                    <Route path='/password' element={<Password/>}></Route>
                    <Route path='/like' element={<Like/>}></Route>
                    <Route path='/about' element={<About/>}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;