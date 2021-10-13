// decode encoded data
function b64_to_utf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}
// encode data
function utf8_to_b64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

// local storage control
const local = localStorage.getItem("userId");
let adetHtml = ``;
if (local != null) {
  sessionStorage.setItem("userId", local);
}
// session control
const user = sessionStorage.getItem("userId");

if (user == null) {
  sessionStorage.setItem("index", "personal.html");
  window.location.href = "login.html";
} else {
  // session true(birisi oturum açmış)
  const encodedUserData = b64_to_utf8(user);
  console.log("encodedUserData :>> ", encodedUserData);
  const parsedJson = JSON.parse(encodedUserData);
}

function fncLogOut() {
  // confirm answer
  const answer = confirm("Are you sure!");
  if (answer == true) {
    // local storage remove
    localStorage.clear();

    //single item remove
    sessionStorage.removeItem("userId");

    // redirect to login
    window.location.href = "index.html";
  }
  return false;
}

$(document).ready(function () {
  getUserInfo(JSON.parse(b64_to_utf8(user)));
  function getUserInfo(obj) {
    let html = `
    <div class="row">
    <div class="col-sm-4"></div>
    <div class="col-sm-4">
    <div id="formInsideDiv">
      <div class="form-control" style="display:flex;flex-direction:row;justify-content:space-between;border:none">
      <h2>Merhaba ${obj.userName}</h2>
      <button id="editBtn" style="border:none;background-color:white;"><i class="fas fa-user-edit icons"></i></button>
      </div>
      
      <form id="userInfoUpdateForm" method="post">
        <div class="mb-3">
          <label for="userName" class="form-label">User Name</label>
          <input
            type="text"
            class="form-control pInfo"
            aria-describedby="userName"
            id="userName"
            disabled
            required
            value="${obj.userName}"
          />
        </div>
        <div class="mb-3">
          <label for="userSurname" class="form-label">User Surname</label>
          <input
            type="text"
            class="form-control pInfo"
            aria-describedby="userSurname"
            id="userSurname"
            value="${obj.userSurname}"
            disabled
            required
          />
        </div>
        <div class="mb-3">
          <label for="userPhone" class="form-label">Phone Number</label>
          <input
            type="text"
            class="form-control pInfo"
            aria-describedby="userPhone"
            id="userPhone"
            value="${obj.userPhone}"
            disabled
            required
          />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            class="form-control pInfo"
            aria-describedby="email"
            id="email"
            value="${obj.userEmail}"
            disabled
            required
          />
        </div>
        <div class="mb-3" id="passDiv" hidden = "true">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            required
          />
        </div>
        </div>
        <div class="formButtons" hidden="true">
          <button id="saveBtn" class="btn btn-warning">Güncelle</button>
        </div>
      </form>
    </div>

    <div class="col-sm-4"></div>
  </div>`;

    $("#info").append(html);
  }

  $("#editBtn").click(function (e) {
    e.preventDefault();
    if ($(".pInfo").attr("disabled") == "disabled") {
      //$(".pInfo").setAttr("disabled","enabled");
      $(".pInfo").removeAttr("disabled");
      $(".formButtons").attr("hidden", false);
      $("#passDiv").attr("hidden", false);

      console.log("true ");
    } else {
      console.log("false");
      $(".pInfo").attr("disabled", "disabled");
      $(".formButtons").attr("hidden", true);
      $("#passDiv").attr("hidden", true);
    }
  });

  function getUserId(obj) {
    return obj.userId;
  }

  $("#saveBtn").click(function (e) {
    e.preventDefault();
    const name = $("#userName").val();
    const surname = $("#userSurname").val();
    const mail = $("#email").val();
    const phone = $("#userPhone").val();
    const pass = $("#password").val();
    const id = getUserId(JSON.parse(b64_to_utf8(user)));
    console.log("id :>> ", id);

    const updateUrl = "https://www.jsonbulut.com/json/userSettings.php";

    const updateData = {
      ref: "806e6b62c34c9533484edb7c1b295a8c",
      userName: name,
      userSurname: surname,
      userMail: mail,
      userPhone: phone,
      userPass: pass,
      userId: id,
    };

    $.ajax({
      type: "get",
      url: updateUrl,
      data: updateData,
      dataType: "json",
      success: function (res) {
        console.log("response :>> ", res);

        const status = res.user[0].durum;
        const message = res.user[0].mesaj;

        if (status == true) {
          sessionStorage.removeItem("userId");
          localStorage.removeItem("userId");
          alert(message);
          window.location.href = "login.html";
        } else {
          alert(message);
        }
      },
    });
  });



  // önceki start

  $("#siparislerBtn").click(function (e) { 
    e.preventDefault();
    if ($("#siparisCardsFromJs").attr('hidden') == 'hidden') {
      $("#siparisCardsFromJs").removeAttr('hidden');
      $("#siparislerBtn").text("Siparişleri Kapat");
    }else {
      $("#siparislerBtn").text("Siparişleri Gör")
      $("#siparisCardsFromJs").attr('hidden',true);
    }
  });

  const parsedUser = JSON.parse(b64_to_utf8(user));
  const userIdForAjax = parsedUser.userId;

  const siparislerUrl = "https://www.jsonbulut.com/json/orderList.php";

  const siparislerData = {
    ref: "806e6b62c34c9533484edb7c1b295a8c",
    musterilerID: userIdForAjax,
  };

  $.ajax({
    type: "get",
    cache:false,
    url: siparislerUrl,
    data: siparislerData,
    dataType: "json",
    success: function (res) {
      console.log("response :>> ", res.orderList[0]);

      if (res.orderList[0] == false) {
        const sepetNull = `<h2 class="mt-5">Daha Önce Verdiğiniz Bir Sipariş Bulunmuyor.</h2>`;
        $("#siparisCardsFromJs").html(sepetNull);
      } else {
        addListItem(res.orderList);
      }

    },
    error: function (error) {
      console.log('error :>> ', error);
    }
  });

  function addListItem(arr) {
    let html = ``;
    let newHtml = ``;
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        const img = arr[i][j].normal;
        console.log("img :>> ", img);
        const name = arr[i][j].urun_adi;
        const price = arr[i][j].fiyat;


        newHtml += `<div class="col-5 col-sm-4 col-md-2">
        <div class="card cardForProducts mb-3">
            <div class="divImg"><img style="width:200px" src="` +
            img +
            `" class="img-fluid rounded-start" /></div>
            <div class="card-body">
                <h5 class="card-title">`+name+`</h5>
                
                <p class="card-text">`+price+`₺</p>
            </div>
        </div>
    </div>`;

        html +=
          `<div class="card mt-5 mb-3 bucketPr" >
    <div class=" g-0">
      
        <img style="width:200px" src="` +
          img +
          `" class="img-fluid rounded-start" />
      
      
        <div class="card-body">
          <h5 class="card-title">` +
          name +
          `</h5>
          <p class="card-text">` +
          price +
          `₺</p>
        </div>
      
    </div>
  </div>
  `;
      }
    }
    $("#siparisCardsFromJs").html(newHtml);
    adetHtml = `<h4 class="mt-4"><i>Şimdiye Kadar ${arr[0].length} adet sipariş verdiniz.</i></h4>`;
    $("#adet").append(adetHtml);
    
  }

  //önceki finish

  // categori ajax start

  const kategoriUrl = "https://www.jsonbulut.com/json/companyCategory.php";

  const kategoriData = {
    ref: "806e6b62c34c9533484edb7c1b295a8c",
  };

  $.ajax({
    type: "get",
    url: kategoriUrl,
    data: kategoriData,
    dataType: "json",
    success: function (res) {
      const categories = res.Kategoriler[0].Categories;
      addNavMenu(categories);
    },
  });

  function addNavMenu(obj) {
    for (let i = 0; i < obj.length; i++) {
      let html = `<li class="mb-2">`;
      if (obj[i].TopCatogryId == "0" && obj[i].CatogryName != 'Deneme') {
        html += `<form class="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#${obj[i].CatogryName}-collapse" aria-expanded="false">
                     ${obj[i].CatogryName}
                     </form>
                     <div class="collapse" id="${obj[i].CatogryName}-collapse">
                         <ul id="${obj[i].CatogryName}" class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                     `;
        for (let j = 0; j < obj.length; j++) {
          if (obj[i].CatogryId == obj[j].TopCatogryId) {
            html += `<li><a id="${obj[j].CatogryId}" onclick="getProductsForId(this.id)" href="products.html" class="link-dark rounded">${obj[j].CatogryName}</a></li>`;
          }
        }
        html += `</ul></div></li>`;
        console.log("html :>> ", html);
        $("#dropdownNavMenuFromJs").append(html);
      }
    }
  }

  // categori ajax finish

  $("#logOut").click(function () {
    const answer = confirm("Are you sure!");
    if (answer == true) {
      sessionStorage.removeItem("userId");
      localStorage.removeItem("userId");
      window.location.href = "anasayfa.html";
    }
    return false;
  });
});


