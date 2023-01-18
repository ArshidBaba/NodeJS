const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    { id: 1, name: 'course1'},
    { id: 2, name: 'course2'},
    { id: 3, name: 'course3'},
];

app.get('/', (req, res) => {
    res.send('Hello World!!!');
})

app.get('/api/courses/', (req, res) => {
    res.send(courses);
})

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('The course with the given Id does not exist');
    res.send(course);
});

app.post('/api/courses/', (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    
    const result = schema.validate({ name: req.body.name });
    // const result = Joi.va
    console.log(result);
    
    if (result.error) {
        res.status(400).send(result.error.message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    console.log(courses);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('The course with the given Id does not exist');

    const { error } = validateCourse(req.body);

     
    if (error) {
        res.status(400).send(error.message);
        return;
    }

    course.name = req.body.name;
    console.log(courses);
    res.send(course);
});

app.delete('/api/courses/:id/', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('The course with the given Id does not exist');

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate({ name: course.name });
}
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

