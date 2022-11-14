const express = require('express')
const app = express()
const port = 3000
const path = require('path');
var bodyParser = require('body-parser');
const youtubedl = require('youtube-dl-exec');
const querystring = require('node:querystring');
const fs = require('fs');

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
	let options = {
		extractAudio: req.body.audioOnly ==='true'
	}
	let downloadPromise = ydl(res, url, options);
	downloadPromise.then((result)=>{
		res.send(result);
	}).catch((err)=>{
		res.status(400).send();
	})
})

app.get('/download', function(req,res){
	let params = querystring.parse(req.url.substring(req.url.indexOf('?')+1));
	let id = params.id;
	let fileTitle = params.filename;
	let fileExt = params.extension;
	res.download(path.join(__dirname, `/videos/${id}.${fileExt}`), `${fileTitle}.${fileExt}`,function(err){
		const directory = "videos";
		console.log('delete')
		fs.readdir(directory, (err, files)=>{
			for (const file of files){
				console.log(file)
				fs.unlink(path.join(directory, file), (err)=>{
					if (err) throw err;
				})
			}
		})
	});

})


function ydl(res, url, options){
	const downloadOptions = {
		output: `${path.join(__dirname,"/videos/")}%(id)s.%(ext)s`,
		noPlaylist: true,
	}

	if (options.extractAudio){
		downloadOptions['extractAudio'] = true;
		downloadOptions['audioFormat'] = "mp3";
	} 

	return new Promise((resolve,reject)=>{
		youtubedl.exec(url, downloadOptions).then(() => {
			youtubedl.exec(url,{
					getTitle: true,
					getId: true,
					getFilename: true,
					noPlaylist: true, 
					skipDownload: true,
				}).then((output)=>{
					resolve(output.stdout.split('\n'));
				}).catch((error)=>{
					console.log(error);
					reject(error);
				})
		}).catch((error)=>{
			console.log(error);
			reject(error);
		})
	})
}

