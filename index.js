const express = require('express')
const app = express()
const port = 3000
const path = require('path');
var bodyParser = require('body-parser');
const youtubedl = require('youtube-dl-exec');
const querystring = require('node:querystring')

// Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'homepage.html'));
})


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/node_modules/jquery/dist/')));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Post handler to download video
app.post('/download', function(req,res){
	let url = req.body.url;
	let dlPlaylist = req.body.dlPlaylist;
	let audioOnly = req.body.audioOnly;
	ydl(res, url);
})

app.get('/download', function(req,res){
	let params = querystring.parse(req.url.split('?').pop());
	let id = params.id;
	let fileTitle = params.filename;
	let fileExt = params.extension;
	res.download(path.join(__dirname, `/videos/${id}.${fileExt}`), `${fileTitle}.${fileExt}`);
})


function ydl(res, url){
	youtubedl.exec(url, {
	output: `${path.join(__dirname,"/videos/")}%(id)s`,
	noPlaylist: true
	}).then(() => {
		youtubedl.exec(url,{
		getTitle: true,
		getId: true,
		getFilename: true,
		noPlaylist: true
		}).then((output)=>{
			res.send(output.stdout.split('\n'));
		}).catch((error)=>{
			console.log(error);
			res.status(500).send();
		})
	}).catch((error)=>{
		console.log(error)
		res.status(500).send();
	})

	
}