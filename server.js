const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())
app.use(express.urlencoded({ extended:true }))

const Books = [
    {
        id: 1,
        BookName: "PHP 8",
        YearPublished: "2023",
        Author: "VicS",
        Category: "Web",
        status: 1,
    },
    {
        id: 2,
        BookName: "React.js",
        YearPublished: "2000",
        Author: "Peter SMith",
        Category: "Web",
        status: 1,
    },
    {
        id: 3,
        BookName: "CSS framework",
        YearPublished: "2005",
        Author: "Jaguar",
        Category: "Web",
        status: 1,
    },
    {
        id: 4,
        BookName: "Data Science",
        YearPublished: "2023",
        Author: "Vic S",
        Category: "Data",
        status: 1,
    },
]

const LoginProfiles = [

    {
        id: 1,
        username: "admin",
        password: "passwd123",
        isAdmin: true,
    },
    {
        id: 2,
        username: "staff",
        password: "123456",
        isAdmin: false,
    },
    {
        id: 3,
        username: "vice",
        password: "abrakadabra",
        isAdmin: false,
    },
{
        id: 4,
        username: "super",
        password: "69843",
        isAdmin: true,
    },
{
        id: 5,
        username: "user",
        password: "123",
        isAdmin: false,
    }
]

app.get('/books', (req, res) => {
    res.json(Books)
})

app.get('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
  
    const book = Books.find((book) => book.id === bookId);
  
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  });

const generateAccessToken = (user) => {
    return jwt.sign( { id: user.id, isAdmin: user.isAdmin }, "SecretKey", {expiresIn : '1000s'})
}

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = LoginProfiles.find((user) => user.username === username && user.password === password)

    if(user){
        const accessToken = generateAccessToken(user);

        res.json({
            username: user.username,
            isAdmin: user.isAdmin,
            accessToken: accessToken,
        }); 
    } else {
        res.status(400).json("Username or Password Incorrect"); 
        }
    })

    const verify = (req, res, next)=>{

        const autHeader = req.headers.authorization;  
      
          if(autHeader){
              const token = autHeader.split(" ")[1];
      
              jwt.verify(token, "SecretKey", (err, user) => {
                  if(err){
                       return res.status(403).json("Token is not valid!")   
                  }
                  req.user = user;
                  next();
              })
      
          } else {
              return res.status(403).json("You are not authenticated!")   
          }   
      }
      
app.listen(9001)