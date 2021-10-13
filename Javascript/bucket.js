function getProductsForId(clicked_id) {
    
    sessionStorage.setItem("categoriId",clicked_id)
    
}

function b64_to_utf8( str ) {
    return decodeURIComponent(escape(window.atob( str )));
  }
  
const bucket = localStorage.getItem("bucketProducts");
const productCount = document.getElementById('productCount');

function storageHandle( str ) {
    
    if (str != null) {
        document.getElementById('delAllBucket').disabled = false;
        document.getElementById('giveOrder').disabled = false;
        const parsedBucketData = JSON.parse(str);
        productCount.innerHTML = parsedBucketData.length;
        return parsedBucketData;
    }else {
        document.getElementById('delAllBucket').disabled = true;
        document.getElementById('giveOrder').disabled = true;
        var ok = confirm("Sepetiniz Boş");
        if (ok == true) {
            window.location.href = "anasayfa.html"
        }
    }
}


$(document).ready(function () {

     // categori ajax start

     const kategoriUrl = "https://www.jsonbulut.com/json/companyCategory.php";

     const kategoriData = {
         ref:"806e6b62c34c9533484edb7c1b295a8c"
     }
 
     $.ajax({
         type: "get",
         url: kategoriUrl,
         data: kategoriData,
         dataType: "json",
         success: function (res) {
             const categories = res.Kategoriler[0].Categories;
             addNavMenu(categories)
         }
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
                 `
                 for (let j = 0; j < obj.length; j++) {
                     
                     if (obj[i].CatogryId == obj[j].TopCatogryId) {
                         
                         html += `<li><a id="${obj[j].CatogryId}" onclick="getProductsForId(this.id)" href="products.html" class="link-dark rounded">${obj[j].CatogryName}</a></li>`;
                     }
                     
                 }
                 html += `</ul></div></li>`;
                 console.log('html :>> ', html);
                 $("#dropdownNavMenuFromJs").append(html);
             }
             
             
         }
     }
 
 
     // categori ajax finish


    
    const parsedBucketData = storageHandle(bucket);

    console.log('parsedBucketData :>> ', parsedBucketData);
    cardBuild(parsedBucketData)


    function cardBuild( obj ) {
        
        let card = ``;
        let i = 0
        for (const index in obj) {
            
            const productName = obj[index].productName;
            const price = obj[index].price;
            const brief = obj[index].brief;
            const productId = obj[index].productId;
            const description = obj[index].description;
            const normal = obj[index].images[0].normal;


        card += `<div class="card mb-3 bucketPr" >
        <div class="row g-0">
          <div class="col-md-2">
            <img src="`+normal+`" class="img-fluid rounded-start" >
          </div>
          <div class="col-md-10">
            <div class="card-body">
              <h5 class="card-title">`+productName+`</h5>
              
              <p class="card-text">`+price+`₺</p>
              <p class="card-text">`+description+`</p>
              <button id="${i}" onclick="delBucket(this.id)" class="btn btn-danger delBtn">Sil</button>
              
            </div>
          </div>
        </div>
      </div>
      <hr class="mrgnHr" />`;
        i++;
        }
        $("#fullBucketDiv").append(card);
    }


    $("#delAllBucket").click(function (  ) { 
        
        localStorage.removeItem("bucketProducts")
        window.location.href = "bucket.html"
        
    });


    $("#giveOrder").click(function () { 
        const userSession = sessionStorage.getItem("userId");

        if (userSession != null) {
            const user = b64_to_utf8(userSession);
            const parsedUser = JSON.parse(user);

            const customerIdForAjax = parsedUser.userId;

            const sepet = localStorage.getItem('bucketProducts');
            const parsedSepet = JSON.parse(sepet);
            let messageForUser = "";
            for (let i = 0; i < parsedSepet.length; i++) {
                const productIdForAjax = parsedSepet[i].productId;
                console.log('productId :>> ',customerIdForAjax, productIdForAjax);

                const siparisUrl = "https://www.jsonbulut.com/json/orderForm.php";

                const siparisData = {
                    ref:"806e6b62c34c9533484edb7c1b295a8c",
                    customerId: customerIdForAjax,
                    productId: productIdForAjax,
                    html: productIdForAjax
                }
                $.ajax({
                    type: "get",
                    url: siparisUrl,
                    data: siparisData,
                    dataType: "json",
                    success: function ( res ) {
                        console.log('res :>> ', res.order[0].mesaj);
                    }
                });
                
            }
            localStorage.removeItem('bucketProducts')
            window.location.href = "anasayfa.html"
        }else {
            sessionStorage.setItem('index','bucket.html')
            alert("Giriş yapılması gerekiyor")
            window.location.href = "login.html"
        }
        
    });


});

function delBucket(clicked_id) {
    const parsedBucketData = JSON.parse(bucket);
    const deletedBucketProduct = parsedBucketData.splice(clicked_id,1);
    const newBucketAfterDelete = parsedBucketData;
    if (newBucketAfterDelete.length == 0) {
        localStorage.removeItem("bucketProducts")
    }else {
        const updateLocal = localStorage.setItem("bucketProducts",JSON.stringify(parsedBucketData));
        console.log('updateLocal :>> ', parsedBucketData);
    }
    window.location.href = "bucket.html"
}


