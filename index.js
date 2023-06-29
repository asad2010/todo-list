// require
const express = require('express')
const app = express()
const mongoose = require('mongoose')
// connecting to db
const db_url = "mongodb://localhost:27017/to_do_list"
async function db_conn(){
    try {
        await mongoose.connect(db_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family: 4
        })
        console.log('db runned')
    } catch(error){
        console.log(error.message)
    }
}
const todoSchema = new mongoose.Schema({
    text: String
})
const Todo = mongoose.model('todo', todoSchema)
db_conn()
// setting and using to app
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: true}))
// app (express)
app.get('/', async (req,res)=>{
    try {
        const data = await Todo.find()
        res.render('index', {data})
    } catch (error) {
        res.status(500).send(`Not found`)
        console.log(error.message)
    }
})

// app.get('/:id', async(req,res)=>{
//     try {
//         const {id} = req.params;
//         const data = await Todo.findById(id)
//         if(!data) return res.status(500).send('Not found')
//         res.send(data)
//     } catch (error) {
//         res.status(500).send(`Not found`)
//         console.log(error.message)
//     }
// })
app.post('/add', async(req,res)=>{
    try {
        const text = req.body.text;
        if(text !== "") {
            await Todo.create({
                text: text
            })
            res.redirect('/')
        } else {
            res.render('empty')
        }
    } catch (error) {
        res.status(500).send(`Fatal error`)
        console.log(error.message)
    }
})
app.get('/edit/:id', async (req,res)=>{
    const {id} = req.params;
    const data = await Todo.findById(id)
    res.render('edit', {data})
})
app.post('/edit/:id', async (req,res)=>{
    const text = req.body.text;
    const data = await Todo.findByIdAndUpdate(req.params.id, {text})
    res.redirect('/')
})
app.get('/delete/:id', async(req,res)=>{
    const {id} = req.params;
    await Todo.findByIdAndDelete(id)
    res.redirect('/')
})
app.listen(3000, ()=>{
    console.log(`server run on port ${3000}`);
})

