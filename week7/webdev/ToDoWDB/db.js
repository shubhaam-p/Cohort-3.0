const { default: mongoose} = require("mongoose")
const Schema = mongoose.Schema
const ObjectId = mongoose.ObjectId;

users = new Schema({
    name:String,
    email:String,
    password:String
})

todo = new Schema({
    userId: ObjectId,
    title: String,
    done:Boolean
})

const UserModel = mongoose.model('users', users);
const TodoModel = mongoose.model('todo', todo);

module.exports = {
    UserModel,
    TodoModel
}