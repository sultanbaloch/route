
function signup() {

    axios({
        method: 'post',
        url: 'http://localhost:5000/signup',
        data: {
            uname: document.getElementById("txt_name").value,
            email: document.getElementById("txt_email").value,
            password: document.getElementById("txt_password").value,
            phone: document.getElementById("txt_number").value,
            gender: document.getElementById("gender").value
        }, withCredentials: true
    }).then((response) => {
        if (response.data.status === 200) {
            alert(response.data.message)
            location.href = "./login.html"
        } else {
            alert(response.data.message);
        }
    }).catch((error) => {
        console.log(error);
    });

    return false;
}

function login() {
    axios({
        method: 'post',
        url: "http://localhost:5000/login",
        data: {
            email: document.getElementById("txt_email").value,
            password: document.getElementById("txt_password").value,
        },
        withCredentials: true
    }).then((response) => {
        if(response.data.status === 200){
            console.log(response.data.message);
            alert(response.data.message);
            window.location.href = "./profile.html"
            return
        }else{
            alert(response.data.message)
        }
    }, (error) => {
        console.log(error);
    });

    return false;
}

function profile() {
    axios.get('http://localhost:5000/profile').then(resp => {
        document.getElementById("dis_name").innerHTML = resp.data.profile.name;
        document.getElementById("dis_email").innerHTML = resp.data.profile.email;
        document.getElementById("dis_phone").innerHTML = resp.data.profile.phone;
        document.getElementById("dis_gender").innerHTML = resp.data.profile.gender;
    });
}