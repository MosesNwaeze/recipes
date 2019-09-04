const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('./models/recipe');
const bodyParser = require('body-parser');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


const app = express();
app.use(bodyParser.json());
const password = 'U3S9hCOUdd1oKQ4t';
const connectionUrl = `mongodb+srv://moses:${password}@cluster0-eyfw9.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(connectionUrl).
    then(() => console.log('Connection successful!')).
    catch((error) => {
    	console.log('Unable to connect to MongoDB Atlas!');
    	console.error(error);
    });

app.get('/api/recipes/:id', (req, res, next) =>{
	Recipe.findOne({_id : req.params.id}).
	    then((recipe) => res.status(200).json(recipe) ).
	    catch((error) => res.status(404).json({error : error}));

});

app.delete('/api/recipes/:id', (req, res, next) =>{
	Recipe.deleteOne({_id : req.params.id}).
	   then(() => res.status(200).json({message : 'Recipe deleted successfully!'})).
	   catch((error) => {
	   		res.status(400).json({error : error});
	   });
});

// work on it for proper field
app.put('/api/recipes/:id', (req, res, next) =>{
	const recipe = new Recipe({
		_id : req.params.id,
		title : req.body.title,
		ingredients : req.body.ingredients,
		instructions : req.body.instructions,
		time : req.body.time, 
		difficulty : req.body.difficulty
	});
	Recipe.updateOne({_id : req.params.id}, recipe).
	    then(() => res.status(201).json({message : 'Recipe undated successfully!'})).
	    catch((error) => res.status(304).json({error : error}));
});

// check out it fields
app.post('/api/recipes', (req, res, next) =>{
	new Recipe({
		title : req.body.title,
		ingredients : req.body.ingredients,
		instructions : req.body.instructions,
		time : req.body.time,
		difficulty : req.body.difficulty
	}).save().
	    then(() => res.status(201).json({message : 'Recipe successfully saved'})).
	    catch((error) => {
	    	res.status(304).json({error : error});
	    });
});

app.use('/api/recipes', (req, res, next) =>{
	Recipe.find().
	  then((recipes) => res.status(200).json(recipes)).
	  catch((error) => {
	  		res.status(404).json({error : error});
	  });
});

module.exports = app;