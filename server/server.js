const mysql = require ("mysql2")
const express = require("express")
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require('jsonwebtoken')
require('dotenv').config()


const app = express()
app.use(bodyParser.json());

//connect back end and front end running on different port
app.use(cors());

//array storing refreshToken
let refreshTokenArray=[];

//assign refresh token duration 
let refreshTokenExpiry = '7d';

//store log in time to further delete the expired refresh token
let loginDate

//conect to database
const db_connection = mysql.createConnection({
    host:'localhost',
    user:'root',       
    password:'', //Replace it with your MYSQL password
    database:''  //Replace it with your MYSQL database
})

//middleware autheticate token
function tokenAuthentication(req, res, next){
    //get token from the header authorization formatted as 'Bearer {token}'
    const header = req.headers['authorization']
    const token = header && header.split(' ')[1]
    if(token == null){
         return res.sendStatus(403)
    }
    else{
        //verify token by decoding token to get the payload
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded)=>{
            if(err){res.sendStatus(401)}
            req.user = decoded.email
            next()
        })
    }
}

//sign up page
app.post('/signup', (req, res)=>{
    //insert new user to table accounts
    db_connection.query('Insert Into accounts SET ?', req.body, (err)=>{
        if(err){
            res.status(500).send('Server error inserting new user to table accounts')
        }
        else{
            res.sendStatus(200)
        } 
    })
})

//log in page
app.post('/login', (req, res)=>{
    // get email from he req body
    const user = req.body;
    //retrieve password of the user
    db_connection.query('Select password From accounts where email = ?', [user.email], (err, result)=>{
        if(err){
            return res.status(500).send("error logging in")
        }else{
            //verify password
            console.log(result)
            if(result[0].password===user.password){
                loginDate = Date.now()
                const accessToken = jwt.sign({email:user.email}, process.env.SECRET_KEY, {expiresIn: '1h'})
                const refreshToken = jwt.sign({email:user.email}, process.env.REFRESH_SECRET_KEY, {expiresIn : refreshTokenExpiry})
                res.json({accessToken: accessToken, refreshToken : refreshToken})
                refreshTokenArray.push(refreshToken)
                return;
            }
            else{
                res.status(401).send('password invalid')
            }
        }
    })
})

//forgot password page
app.post('/password', (req, res)=>{
    const user = req.body;
    //update user password
    const sql=` Update accounts Set password = '${user.password}' Where email='${user.email}'`
    db_connection.query(sql, (err, result, fields)=>{
        if(err){
            return res.status(500).send("Server error finding email")
        }
        res.sendStatus(200)
    })
})

//main page with tokenAuthetication middleware applied
app.get('/main', tokenAuthentication, (req, res)=>{
    //get filter data
    const {lowerRent, upperRent, bedroom, bathroom, pageNumber}=req.query //req.query
    //adding 1=1 just to have where statement
    let sql = 'Select * From houses Where 1=1'
    if (lowerRent!=='0'){
        sql+=` AND lowerRent >= '${lowerRent}'`
    }
    if (upperRent!=='0'){
        sql+=` AND upperRent <= '${upperRent}'`
    }
    if (bathroom!=='0'){
        sql+=` AND full_bath = '${bathroom}'`
    }
    if (bedroom!=='0'){
        sql+=` AND bedroom = '${bedroom}'`
    }
    
    //page management
    const start = (15*(pageNumber-1)).toString()
    sql+=` Limit 15 offset ${start}`

    //get houses
    db_connection.query(sql, (err, results)=>{
        if(err){
            res.status(500).send('Server error retrieving houses')
        }else{
            res.send(results)
        }
    })
})

//create a post page
app.post('/post', tokenAuthentication, (req, res)=>{
    const {url} = req.body
    //insert data to the table houses
    db_connection.query('Insert Into houses SET ?', req.body, (err)=>{
        if(err){
            return res.status(500).send('Server error adding house to houses')
        }
        //get the id of the inserted house
        db_connection.query('Select id from houses where address = ?', req.body.address, (err, result)=>{
            if(err){
                return res.status(500).send("Server error getting id from houses")
            }
            //updating house id to my post by concating with current value
            const sql=` Update accounts Set my_post = Concat(my_post, ' ${result[0].id}') Where email= ?`
            db_connection.query(sql,[req.user], (err)=>{
                if(err){
                    return res.status(500).send("Error updating my_post")
                }
                res.sendStatus(200)
            })
        })
    })
})

//profile page
app.get('/profile', tokenAuthentication, (req, res)=>{
    const email=req.user
    //get user info
    db_connection.query(`Select * from accounts where email ='${email}'`, (err, results)=>{
        if(err){
            return res.status(500).send("Server error fetching profile information")
        }else{
            //transform liked_hosues to sql where ... in format, (id, id, id)
            const liked = (results[0].liked_houses).split(' ')
            const inFormat = liked.map(()=>'?').join(',')
            //get house info of the ids
            db_connection.query(`Select * from houses where id IN (${inFormat})`, liked, (err, results2)=>{
                if (err){
                    return res.status(500).send("Server error fetching house information")
                }else{
                    //transform my_post to sql where ... in format, (id, id, id)
                    const post_ids = (results[0].my_post).split(' ')
                    const inFormat2 = post_ids.map(()=>'?').join(',')
                    //get house info of the ids
                    db_connection.query(`Select * from houses where id IN (${inFormat2})`, post_ids, (err, results3)=>{
                        if (err){
                            return res.status(500).send("Server error fetching house information")
                        }else{
                            //eleminate duplicates by transforming array to set then back to array
                            const uniqueResults2=[...new Set(results2)]
                            const uniqueResults3=[...new Set(results3)]
                            const result= results.concat([uniqueResults2], [uniqueResults3])
                            res.json(result)
                        }
                    
                    })
                }
            }) 
        }
    })
})

//change bio
app.post('/profile', tokenAuthentication, (req, res)=>{
    const {newBio}=req.body
    // update bio
    const sql=` Update accounts Set bio = ? Where email= ?`
    db_connection.query(sql,[newBio, req.user], (err)=>{
        if(err){
            return res.status(500).send("Error updating bio")
        }
        res.sendStatus(200)
    })
})

//update like
app.post('/like', tokenAuthentication, (req, res)=>{
    const {likedId} = req.body
    const email= req.user
    //update id to user's liked_houses in account table by concatinating with current value
    const sql=` Update accounts Set liked_houses = Concat(liked_houses, ' ${likedId}') Where email= ?`
    db_connection.query(sql,[email], (err)=>{
        if(err){
            return res.status(500).send("Server error updating table accounts")
        }
        //update email to houses's liked_users in houses table by concatinating with current value
        const sql2=` Update houses Set liked_users = Concat(liked_users, ' ${email}') Where id= ?`
        db_connection.query(sql2,[likedId], (err)=>{
            if(err){
                return res.status(500).send("Error updating houses table")
            }
        res.sendStatus(200)
        })
    })
    
})

//like list page
app.get('/like', tokenAuthentication, (req, res)=>{
    const {id} = req.query
    //retrieve like_users from houses
    const sql="Select liked_users From houses where id= ?"
    db_connection.query(sql, [id], (err, result)=>{
        if(err){
            return res.status(500).send("Error retrieving houses table")
        }else{
            //transform liked_users to sql where...in format (email, email, email) then eliminate duplicates
            const emails=result[0].liked_users.split(" ")
            const uniqueResult=[...new Set(emails)]
            const inFormat = uniqueResult.map(()=>'?').join(',')
            //get user info
            db_connection.query(`Select name, email from accounts where email IN (${inFormat})`, uniqueResult, (err, result2)=>{
                if(err){
                    return res.status(500).send("Error updating houses table")
                }else{
                    res.send(result2)
                }
            })
        }
    })
    
})

//about page 
app.get('/about', tokenAuthentication, (req, res)=>{
    const {address} = req.query
    //get house info from houses table
    db_connection.query('Select * from houses where address = ?', address, (err, result)=>{
        if(err){
            res.status(500).send("Server error retrieving table houses: ", err)
        }else{
            res.json(result)
        }
    })
})
app.post('/trash', tokenAuthentication, (req, res)=>{
    const {TrashedId} = req.body;
    const email= req.user
    //find my_post value of the user
    const sql=` Select my_post from Accounts Where email= ?`
    db_connection.query(sql,[email], (err, result)=>{
        if(err){
            return res.status(500).send("Error retrieving data froom accounts table: ", err)
        }else{
            //delete house id from the my_post value
            let liked_ids = result[0].my_post
            liked_ids=liked_ids.replace(TrashedId, "")
            //update my_post
            const sql2='Update accounts Set my_post = ? Where email= ?'
            db_connection.query(sql2,[liked_ids, email], (err)=>{
                if(err){
                    return res.status(500).send("Error updating accounts table: ", err)
                }else{
                    //delete house from houses table
                    const sql3=` Delete from houses where id= ?`
                    db_connection.query(sql3,[TrashedId], (err)=>{
                        if(err){
                            return res.status(500).send("Error deleting row: ", err)
                        }else{
                            res.sendStatus(200)
                        }
                    })
                }
            })
        }
    })
})

//dislike button
app.post('/dislike', tokenAuthentication, (req,res)=>{
    const {TrashedId} = req.body
    const email = req.user
    //get the post's liked_users value from table houses
    const sql=` Select liked_users from houses Where id= ?`
    db_connection.query(sql,[TrashedId], (err, result)=>{
        if(err){
            return res.status(500).send("Error retrieving data from table houses: ", err)
        }else{
            //delete the user's email from the liked_users string
            let usersStr=result[0].liked_users
            usersStr=usersStr.replace(email, "")

            //update the new string back to liked_users
            const sql2='Update houses Set liked_users = ? Where id= ?'
            db_connection.query(sql2,[usersStr, TrashedId], (err)=>{
                if(err){
                    return res.status(500).send("Server error updating houses table: ", err)
                }else{
                    // get the user's liked_houses value from accounts
                    const sql=` Select liked_houses from accounts Where email= ?`
                    db_connection.query(sql,[email], (err, result2)=>{
                        if(err){
                            return res.status(500).send("Error retrieving data from table accounts: ", err)
                        }else{    
                            //delete the house id from the liked_houses string
                            let housesStr = result2[0].liked_houses
                            housesStr = housesStr.replace(TrashedId, "")
                            
                            //update the liked_houses to the table accounts.
                            const sql2='Update accounts Set liked_houses = ? Where email= ?'
                            db_connection.query(sql2,[housesStr, email], (err)=>{
                                if(err){
                                    return res.status(500).send("Server error updating table accounts: ", err)
                                }else{
                                    res.send(200)
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

app.post('/token', (req, res)=>{
    const {token} = req.body;
    //delete the refreshToken from array if it is expired 
    if(loginDate + parseInt(refreshTokenExpiry)*86400000 < Date.now()){
        refreshTokenArray = refreshTokenArray.filter(element => element!==token)
    }
    //if expired
    if(!refreshTokenArray.includes(token)){
        return res.status(419).send('Refresh token expired')
    }
    //verify refrehToken
    jwt.verify(token, process.env.REFRESH_SECRET_KEY, (err, decoded)=>{
        if(err){
            return res.sendStatus(403)}
        req.user = decoded.email
        //get new accessToken
        const newAccessToken=jwt.sign({email : req.user}, process.env.SECRET_KEY, {expiresIn : '1h'})
        res.json({accessToken: newAccessToken})
    })
})

app.listen(4000)
