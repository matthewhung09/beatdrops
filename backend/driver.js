const postServices = require('./models/post_functions');

async function main(){
    result = postServices.getPosts({title: "Sunglasses", artist: "Black Country New Road", likes: 0});
    console.log(result);
}