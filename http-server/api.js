
import { createServer } from 'http';

var server = createServer(function(req, res) {
  res.writeHead(200);
  res.end('hey');
}).listen(process.env.PORT || 8000, function() {
  console.log('App listening on port %d', server.address().port);
});
