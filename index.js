var express = require('express')
var app = express()

var cors = require('cors')

const bodyParser = require('body-parser');
//app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(cors())


var currentDB = {}


function getDB(dbName, table)
{
	var Datastore = require('nedb')
	var slug = dbName+"_"+table
	if ( currentDB[slug] ) {
		return currentDB[slug]
	} else {
		currentDB[slug] = new Datastore({ filename: dbName +"/"+ table, autoload: true });
		return currentDB[slug]
	}

}


//получить список узлов
app.get('/:db/:entity', function (req, res) {
	//console.log(JSON.parse(req.query.body))

	let query = JSON.parse(req.query.body)

	getDB(req.params.db, req.params.entity).find(query, function (error, data) {
		res.send(data)
	})	
})

//получить узел по id
app.get('/:db/:entity/:id', function (req, res) {
	getDB(req.params.db, req.params.entity).find({"_id":req.params.id}, function (error, data) {
		res.send(data[0])
	})	
})

//создать узел
app.post('/:db/:entity', function (req, res) {

	// console.log(req.body)
	// res.send(req.body)

	getDB(req.params.db, req.params.entity).insert(req.body, function (err, newDoc) {  
		res.send(newDoc)
	});
	// getDB(req.params.db, req.params.entity).find({}, function (error, data) {
	// 	res.send(data)
	// })	
	
})

//изменить узел по id
app.put('/:db/:entity/:id', function (req, res) {

	getDB(req.params.db, req.params.entity).update({"_id":req.params.id}, { $set: req.body }, { multi: true }, function (err, numReplaced) {
	  res.send('success')
	});

})

//удалить узел по id
app.delete('/:db/:entity/:id', function (req, res) {
	getDB(req.params.db, req.params.entity).remove({"_id":req.params.id}, { multi: true }, function (err, numDeleted) {
	  res.send('success')
	});
})


app.listen(8077)