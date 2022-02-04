const express = require('express');
const cors = require('cors');

const postServices = require('./models/post-services');

const app = express();
const port = 5000;

app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  
app.get('/posts', async (req, res) => {
    try {
        const result = await postServices.getPosts();
        res.send({post_list: result});         
    } catch (error) {
        console.log(error);
        res.status(500).send('An error ocurred in the server.');
    }
});

app.post('/posts', async (req, res) => {
const p = req.body;
const savedPost = await postServices.addPost(p);
if (savedPost)
    res.status(201).send(savedPost);
else
    res.status(500).end();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});