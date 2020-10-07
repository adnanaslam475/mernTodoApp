const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    todo_description: {
        type: String,
        required: true
    },
    todo_responsible: {
        type: String,
        required: true
    },
    todo_priority: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},
    {
        timestamps: true
    })

module.exports = Todo = mongoose.model('Todo', todoSchema)