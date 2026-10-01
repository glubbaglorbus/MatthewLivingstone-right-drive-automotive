const express = require('express');
const exphbs = require('express-handlebars');
const {body, validationResult} = require ('express-validator');
const helmet = require('helmet');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

//helmet!
app.use(helmet());

//static file(S)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

//body parser
app.use(express.urlencoded({ extended: true }));

//multer
const upload = multer({dest: 'uploads/'});

//handlebars setup and helper
app.engine('hbs', exphbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    helpers: {
    reviewDate: () => {
            const date = new Date();
            date.setDate(date.getDate()+3);
            return date.toDateString();
        }
    }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

//routes
app.get('/', (req, res)=>{
    res.render('complaint-form');
});

app.post('/submit',
    upload.single('image'),
    [
        body('fullName').notEmpty(),
    body('email').isEmail(),
    body('phone').notEmpty(),
    body('vehicleMake').notEmpty(),
    body('vehicleModel').notEmpty(),
    body('vin').isLength({ min: 5 }),
    body('subject').notEmpty(),
    body('description').isLength({ min: 10 })
    ],
    (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.render('complaint-form', {errors: errors.array(), old: req.body});
        }

        const data = {
            ...req.body,
            imagePath: req.file ? `/uploads/${req.file.filename}` : null
        };

        res.render('complaint-display', {complaint: data});    
    }
);

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));