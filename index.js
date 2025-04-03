import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = 3000;
const app = express();
var posts = [];
var id = -1;

function findPost(id){
    const idEdit = parseInt(id);
    const post = posts.find((p) => p.postId === idEdit);
    return post;
}

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs", {
        userPosts: posts,
        hasPosts: posts.length > 0
    });
});

app.get("/write", (req, res) => {
    res.render("write.ejs");
});

// req.params.id will return whatever the id was in the action
app.get("/edit/:id", (req, res) => {
    const post = findPost(req.params["id"]);
    if(post) {
        res.render("write.ejs", { postEdit: post});
    } else {
        res.send(`<h1>Cannot find the post with the id ${req.params["id"]}</h1>`);
    }
});

app.post("/:id", (req, res) => {
    const post = findPost(req.params["id"]);
    post["text"] = req.body["post"];

    res.render("index.ejs", {
        userPosts: posts,
    });
});

app.post("/delete/:id", (req, res) => {
    const post = findPost(req.params["id"]);
    const index = posts.indexOf(post);
    if(index > -1) {
        posts.splice(index, 1);
        id = -1;
        posts.forEach((post) => {
            post["postId"] = ++id;
        });
    }

    res.render("index.ejs", {
        userPosts: posts,
    });
})

app.post("/", (req, res) => {
    const userPost = {
        postId: ++id,
        firstName: req.body["fName"],
        lastName: req.body["lName"],
        text: req.body["post"],
        };

        posts.push(userPost);

        res.render("index.ejs", {
        userPosts: posts,
        });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
