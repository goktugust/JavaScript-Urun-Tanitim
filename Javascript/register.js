$(document).ready(function () {
    // Register Form Submit
    $("#registerForm").submit(function (e) {
      e.preventDefault(); // sayfanın yenilenmesini engeller.
  
      const name = $("#userName").val();
      const surname = $("#userSurname").val();
      const phone = $("#userPhone").val();
      const email = $("#email").val();
      const password = $("#password").val();
  
      const pushObj = {
        ref: "806e6b62c34c9533484edb7c1b295a8c",
        userName: name,
        userSurname: surname,
        userPhone: phone,
        userMail: email,
        userPass: password
      };
  
      const url = "https://www.jsonbulut.com/json/userRegister.php";
  
      $.ajax({
        type: "get",
        url: url,
        data: pushObj,
        dataType: "json",
        success: function (res) {
          console.log("res :>> ", res);
          const status = res.user[0].durum;
          const message = res.user[0].mesaj;
          
          if (status == true) {
              // redirect
              alert("Giriş Başarılı")
              window.location.href = "login.html";
          }else {
              alert(message)
          }
        },
      });
    });
  });
  