//connect to server through local ip address
document.getElementById("connect").onclick = function(){
    window.localStorage.setItem("ip", document.getElementById('connectServer').value);
    window.location.href="test.html";
}; 