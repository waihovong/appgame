var server = document.getElementById("connectServer");
console.log(server);

cordova.plugin.http.get('http://10.0.0.53:3000/game', {
  id: '12',
  message: 'test'
}, { Authorization: 'OAuth2: token' }, function(response) {
  console.log(response.status);
}, function(response) {
  console.error(response.error);
});