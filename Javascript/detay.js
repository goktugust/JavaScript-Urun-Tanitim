function getProductsForId(clicked_id) {
    
    sessionStorage.setItem("categoriId",clicked_id)
    
}
const productString = sessionStorage.getItem("clickedProductDetail")
let statusForParse = true;
if (productString == null) {
    statusForParse = false;
    window.location.href = "anasayfa.html";
}

$(document).ready(function () {



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



    let html = ``;

    cardBuild(productString)

    function cardBuild(obj){
        if (statusForParse) {
            const product = JSON.parse(obj);
            const productName = product.productName;
            const normal = product.images[0].normal;
            const price = product.price;
            const description = product.description;
            const topCategory = product.categories[0].categoryName;
            const childCategory = product.categories[1].categoryName;
            const i = 0;
            html += ` <p class="mt-5 ">`+topCategory+ " > " +childCategory+ " > " +productName+`</p>
            <hr  />
            <div class="card bucketPr" >
            <div class="row g-0">
              <div class="col-md-2">
                <img src="`+normal+`" class="img-fluid rounded-start" >
              </div>
              <div class="col-md-10">
                <div class="card-body">
                  <h5 class="card-title">`+productName+`</h5>
                  
                  <p class="card-text">`+price+`₺</p>
                  <p class="card-text">`+description+`</p>
                  <button id="${i}" onclick="addBucket(this.id)" class="btn myButton">Sepete Ekle</button>
                  
                </div>
              </div>
            </div>
          </div>
          <hr class="mrgnHr" />`;
          console.log('html :>> ', html);
          
          
        }else {
            console.log('statusForParse :>> ', statusForParse);
        }
        $("#containerDetay").append(html);
    }
    
});

function storageControl() {
    const local = localStorage.getItem("bucketProducts");

    if (local != null) {
        return JSON.parse(local)
    }else{
        return []
    } 
}

function addBucket(clicked_id) {
    
     
    const session = sessionStorage.getItem('clickedProductDetail');
    
    if (session != null) {
        const parsedJson = JSON.parse(session);
        
        
        const product = parsedJson
        const bucket = storageControl()
        bucket.unshift(product)
        localStorage.setItem("bucketProducts",JSON.stringify(bucket))
    } else {
        alert("session storage boş")
    }
    
    
    return clicked_id
}
