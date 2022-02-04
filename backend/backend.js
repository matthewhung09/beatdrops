const express = require('express');
const cors = require('cors');

const postServices = require('./models/post-services');

const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  
app.get('/posts', async (req, res) => {
    const title = req.query['title'];
    const artist = req.query['artist'];
    try {
        const result = await postServices.getPosts(title, artist);
        res.send({post_list: result});         
    } catch (error) {
        console.log(error);
        res.status(500).send('An error ocurred in the server.');
    }
});

app.post('/posts', async (req, res) => {
    const new_Post = req.body;
    const savedPost = await postServices.addPost(new_Post);
    if (savedPost)
        res.status(201).send(savedPost);
    else
        res.status(500).end();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});