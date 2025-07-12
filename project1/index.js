const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


const fs = require('fs');

// Helper to get all tasks from files folder
function getTasks() {
    const dir = path.join(__dirname, 'files');
    // console.log("Directory:", dir);
    if (!fs.existsSync(dir)) return [];
    const files = fs.readdirSync(dir);
    return files.map(filename => {
        const title = filename.replace(/\.txt$/, '');
        const description = fs.readFileSync(path.join(dir, filename), 'utf-8');
        return { title, description };
    });
}

app.get('/', function(req, res) {
    const tasks = getTasks();
    res.render("index", { tasks });
});

app.get('/files/:filename', (req, res) => {
    fs.readFile(path.join(__dirname, 'files', req.params.filename), 'utf-8', (err, data) => {
        res.render("show", { title: req.params.filename.replace(/\.txt$/, ''), description: data });
    });
});

app.get('/edit/:filename', (req, res) => {
    res.render("edit", { title: req.params.filename });
});

// Add task route
app.post('/add', (req, res) => {
    let { title, description } = req.body;
    console.log(req.body);
    if (!title || !description) return res.redirect('/');
    // Remove spaces and special chars for filename
    const safeTitle = title.replace(/[^a-zA-Z0-9]/g, '');
    const filePath = path.join(__dirname, 'files', safeTitle + '.txt');
    fs.writeFileSync(filePath, description);
    res.redirect('/');
});

//edit file name
app.post('/edit', (req, res) => {
    const oldFileName = req.body.previousfilename, newFileName = req.body.newfilename;
    if (!oldFileName || !newFileName) return res.redirect('/');
    fs.rename(
        path.join(__dirname, 'files', oldFileName + '.txt'),
        path.join(__dirname, 'files', newFileName + '.txt'),
        (err) => {
            if (err) {
                console.error("Error renaming file:", err);
                return res.redirect('/');
            }
            res.redirect('/');
        }
    );
});

app.listen(3000);