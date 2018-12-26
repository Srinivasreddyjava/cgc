var express=require('express');
var compression = require('compression');
path=require('path');
bodyParser=require('body-parser');
cors=require('cors');
app=express();
app.use(compression());
port=3200;
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));
app.listen(port,function(){console.log('Server logged on '+port);});
app.get('*',function(a,b){
  b.sendFile(path.join(__dirname + '/public/index.html'));
});