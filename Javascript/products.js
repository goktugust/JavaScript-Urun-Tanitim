
function getProductsForId(clicked_id) {
    console.log('clicked_id :>> ', clicked_id);
    sessionStorage.setItem("categoriId",clicked_id)
    return clicked_id;
}
const itemsInBucString = localStorage.getItem('bucketProducts');
    function handle( str ) {
        
        if (str != null) {
            const parsedBucketItems = JSON.parse(str);
            $("#productCount").text(parsedBucketItems.length);
        }else {
            $("#productCount").text("");
        }
    }

const session = sessionStorage.getItem("categoriId");
$(document).ready(function () {
    handle(itemsInBucString)


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

    
    
  
  $(session).css("backgroundColor", "red");

  const pushObj = {
      ref: "806e6b62c34c9533484edb7c1b295a8c",
      start: 0,
      categoryId: session
  }
  
  const url = "https://www.jsonbulut.com/json/product.php";
  $.ajax({
      type: "get",
      url: url,
      data: pushObj,
      dataType: "json",
      success: function (response) {
          const arr = response.Products[0].bilgiler
          console.log('response :>> ', arr);
          cardBuild(arr)
      }
  });


  function cardBuild( obj ) {
    let card = ``;
    let i = 0
    for (const index in obj) {
        sessionStorage.setItem("productsInHTML",JSON.stringify(obj))
        const productName = obj[index].productName;
        const price = obj[index].price;
        const brief = obj[index].brief;
        const productId = obj[index].productId;
        const description = obj[index].description;
        const normal = obj[index].images[0].normal;

        
        
        
        card += `<div class="col-sm-2">
        <div class="card cardForProducts">
            <div class="divImg"><button id="${i}" onclick="getDetail(this.id)" class="cardImgBtn"><img src="`+normal+`" class="card-img-top" /></button></div>
            <div class="card-body">
                <h5 class="card-title">`+productName+`</h5>
                
                <p class="card-text">`+price+`₺</p>
                <button id="${i}" onclick="addBucket(this.id)" class="btn myButton">Sepete Ekle</button>
            </div>
        </div>
    </div>`;
    i++;
    }
    $("#productDiv").append(card);
}



});

function getDetail(clicked_product_id) {
    const session = sessionStorage.getItem("productsInHTML");
    if (session != null) {
        const parsedJson = JSON.parse(session);
        const product = parsedJson[clicked_product_id]
        console.log('product :>> ', product);
        sessionStorage.setItem("clickedProductDetail",JSON.stringify(product));
        window.location.href = "detay.html"
    }
}

function storageControl() {
    const local = localStorage.getItem("bucketProducts");

    if (local != null) {
        return JSON.parse(local)
    }else{
        return []
    } 
}

function addBucket(clicked_id) {
    
    const session = sessionStorage.getItem("productsInHTML")
    if (session != null) {
        const parsedJson = JSON.parse(session);
        const product = parsedJson[clicked_id]
        const bucket = storageControl()
        bucket.unshift(product)
        localStorage.setItem("bucketProducts",JSON.stringify(bucket))
    } else {
        alert("session storage boş")
    }
    
    
    return clicked_id
}
