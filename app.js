const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const port = 3000;
let items = ["Buy food", "Cook food", "Eat food"];
let workItems = [];



const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {

    const day = date.gateDate();

    res.render("list", { ListTitle: day , NewListItems: items });
    
});

app.post("/", (req, res) => {

    console.log(req.body)

    let item = req.body.newitem;

    if (req.body.list == "Work") {
        workItems.push(item);
        res.redirect("/work");
    }else{
        items.push(item);
        res.redirect("/");
    }
       
    });

app.get("/work", (req, res) => {

    res.render("list", { ListTitle: "Work List", NewListItems: workItems });
    
});

app.get("/about", (req, res) => {
    res.render("about", { KindOfday: "Monday" });
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

