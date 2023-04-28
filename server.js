const express = require('express');
const fs = require('fs');
const path = require('path');
// const { clog } = require('./middleware/clog');
// const api = require('./routes/apiroutes')
const app = express();
// Import custom middleware, "cLog"
// app.use(clog);

const PORT = process.env.PORT || 8080 ;
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));



// app.use('/api', api)

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        var notes = JSON.parse(data);
        console.log(notes)
        res.json(notes);
    });
});
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/notes.html'))
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        var notes = JSON.parse(data);
        let userNote = req.body;
        userNote.id = Math.floor(Math.random() * 5000);
        notes.push(userNote);
        fs.writeFile('./db/db.json', JSON.stringify(notes), (err, data) => {
            res.json(userNote);
        });
    });
});


app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        const newNotes = notes.filter(note => note.id !== parseInt(req.params.id));

        fs.writeFile('./db/db.json', JSON.stringify(newNotes), (err, data) => {
            res.json({msg: 'successfully'});
        });
    });
});



app.listen(PORT, () => {
    console.log(`App listening on PORT: ${PORT}`);
});