const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-heyru:Test123@cluster0.dqdps.mongodb.net/todolistDB");

const itemSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"   
});

const item2 = new Item({
    name: "Hit the + button to add a new item."   
});

const item3 = new Item({
    name: "Hit the checkbox to delete an item."   
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", (req, res) => {

    Item.find()
        .then(function (foundItems) {
            if (foundItems.length === 0) {
                Item.insertMany(defaultItems)
                    .then(function (foundItems) {
                        console.log("Successfully saved default items to DB");
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
                res.redirect("/");
            } else {
                res.render("list", { ListTitle: "Today" , NewListItems: foundItems });
            }
        })
        .catch(function (err) {
            console.log(err);
        });

   
    
});

app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName); 
  
  List.findOne({ name: customListName })
    .then(function (foundList) {
        if (!foundList) {
           // Create a new list
           const list = new List({
            name: customListName,
            items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
            
        } else {
            // Show an existing list
            res.render("list", { ListTitle: foundList.name, NewListItems: foundList.items });
           
        }
    })
    .catch(function (err) {
        console.log(err);
    });



});
   
app.post("/", (req, res) => {

    // console.log(req.body)

    const itemName = req.body.newitem;
    const listName = req.body.list;

    const newItem = new Item({
        name: itemName
    });

    if (listName === "Today") {
        newItem.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName })
            .then(function (foundList) {
                foundList.items.push(newItem);
                foundList.save();
                res.redirect("/" + listName);
            })
            .catch(function (err) {
                console.log(err);
            });
    }
      });

app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.deleteOne({ _id: checkedItemId })
            .then(function () {
                console.log("Successfully deleted item from DB");
            })
            .catch(function (err) {
                console.log(err);
            });
        res.redirect("/");
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } })
            .then(function () {
                res.redirect("/" + listName);
            })    
            .catch(function (err) {
                console.log(err);
            })
}

});
    

app.get("/work", (req, res) => {

    res.render("list", { ListTitle: "Work List", NewListItems: workItems });
    
});

app.get("/about", (req, res) => {
    res.render("about", { KindOfday: "Monday" });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

