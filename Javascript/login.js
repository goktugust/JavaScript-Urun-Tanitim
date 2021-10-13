function utf8_to_b64( str ) {
    return window.btoa(unescape(encodeURIComponent( str )));
 }


function whereToGo() {
    const index = sessionStorage.getItem("index");
    if (index != null) {
        return index;
    }else {
        return "anasayfa.html"
    }
}

$(document).ready(function () {
  $("#loginForm").submit(function (e) {
    e.preventDefault();

    const email = $("#email").val();
    const password = $("#password").val();
    
    const pushObj = {
        ref: "806e6b62c34c9533484edb7c1b295a8c",
        userEmail: email,
        userPass: password,
        face: "no" 
    }

    const url = "https://www.jsonbulut.com/json/userLogin.php";

    $.ajax({
        type: "get",
        url: url,
        data: pushObj,
        dataType: "json",
        success: function ( res ) {

            const status = res.user[0].durum;
            const message = res.user[0].mesaj;

            if (status == true) {


                const item = res.user[0];
                if ($("#remember").is(":checked")) {
                    localStorage.setItem("userId", utf8_to_b64(JSON.stringify(item.bilgiler)))
                }

                sessionStorage.setItem("userId", utf8_to_b64(JSON.stringify(item.bilgiler)))


                alert(message)
                window.location.href = whereToGo()
            }else {
                alert(message)
            }

            
        }
    });

  });
});
