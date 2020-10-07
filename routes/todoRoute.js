const express = require('express')
const router = express.Router()
const Todo = require('../models/todoModel')
const auth = require('../middleware/auth')

router.post('/add', auth, async (req, res) => {
    const todo = new Todo({
        ...req.body,
        owner: req.user._id
    })
    try {
        await todo.save()
        res.status(201).json(todo)
    } catch (e) {
        res.status(400).send({ msg: 'failed to fetch todos' })
    }
})

router.get('/tasks', auth, async (req, res) => {
    const match = {}
    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: '-createdAt'
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }
    catch (e) {
        res.status(500).send('error')
    }
})
// for social auth user
// router.post('/add', async (req, res) => {
//     const todo = new Todo({
//         ...req.body
//     })
//     try {
//         await todo.save()
//         res.status(201).json(todo)
//     } catch (e) {
//         res.status(400).send({ msg: 'failed to fetch todos' })
//     }
// })


router.get('/', async (req, res) => {
    await Todo.find()
        .sort({ date: -1 })
        .then(todos => res.json(todos))
        .catch(err => {
            res.status(400).send({ msg: 'failed to fetch todos' })
        })
});

router.post('/update/:id', (req, res) => {
    Todo.findById(req.params.id, (err, todo) => {
        if (!todo) {
            res.status(404).send({ msg: "data is not found" });
        }
        else {
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.save().then(todo => {
                res.json(todo);
            })
                .catch(err => {
                    res.status(400).send({ msg: "Update not successful" })
            })
        }
    });
})


router.get('/:id', async (req, res) => {
    let id = req.params.id;
    await Todo.findById(id, (err, todo) => {
        res.json(todo);
    });
});

router.delete('/:id', auth, (req, res) => {
    Todo.findById(req.params.id)
        .then(todo => todo.remove().then(() => res.json('deleted succesfully')))
        .catch(err => res.status(404).json({ msg: 'cannot find todo' }))
});

module.exports = router