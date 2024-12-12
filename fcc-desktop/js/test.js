$(document).ready(function () {
    axios.get('http://10.176.17.18:8080/fcc-monitor/thread.html?id=999&name=Test%20agent&state=0')
        .then(function (response) {
            //document.getElementById('useravatar').src = user.data.avatar_url;
            $('#test_box').html(response.data);

            alert("OK");
        })
        .catch(function (err) {
            alert(err.message);
        });
});