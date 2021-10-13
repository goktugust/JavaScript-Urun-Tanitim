const itemsInBucString = localStorage.getItem('bucketProducts');
    function handle( str ) {
        
        if (str != null) {
            const parsedBucketItems = JSON.parse(str);
            $("#productCount").text(parsedBucketItems.length);
        }else {
            $("#productCount").text("");
        }
    }
$(document).ready(function () {

    

    handle(itemsInBucString)



    const pushObj = {
        ref: "806e6b62c34c9533484edb7c1b295a8c",
        start: 0,
        count: 6,
        order:"desc"
    }

    const url = "https://www.jsonbulut.com/json/product.php";

    $.ajax({
        type: "get",
        url: url,
        data: pushObj,
        dataType: "json",
        success: function ( res ) {
            const lastAddedProducts = res.Products[0].bilgiler;

            
            cardBuild(lastAddedProducts)
            
        }
    });

    function cardBuild( obj ) {
        let card = ``;
        let i = 0
        for (const index in obj) {
            localStorage.setItem("products",JSON.stringify(obj))
            const productName = obj[index].productName;
            const price = obj[index].price;
            const brief = obj[index].brief;
            const productId = obj[index].productId;
            const description = obj[index].description;
            const normal = obj[index].images[0].normal;

            
            
            
            card += `<div class="col-5 col-sm-4 col-md-2">
            <div class="card cardForProducts mb-3">
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
            addLeftMenu(categories)
        }
    });

    function addLeftMenu(obj) {
        
        for (let i = 0; i < obj.length; i++) {
            let html = `<li class="mb-2">`;
            if (obj[i].TopCatogryId == "0" && obj[i].CatogryName != "Deneme") {
                html += `<button class="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#${obj[i].CatogryName}-collapse" aria-expanded="true">
                ${obj[i].CatogryName}
                </Button>
                <div class="collapse show" id="${obj[i].CatogryName}-collapse">
                    <ul id="${obj[i].CatogryName}" class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                `
                for (let j = 0; j < obj.length; j++) {
                    
                    if (obj[i].CatogryId == obj[j].TopCatogryId) {
                        
                        html += `<li><a id="${obj[j].CatogryId}" onclick="getProductsForId(this.id)" href="products.html" class="link-dark rounded">${obj[j].CatogryName}</a></li>`;
                    }
                    
                }
                html += `</ul></div></li><li class="border-bottom my-3"></li>`;
                console.log('html :>> ', html);
                $("#leftMenuFromJs").append(html);
            }
            
            
        }
    }


    // categori ajax finish


    // reklam ajax


    const reklamData = {
        ref: "806e6b62c34c9533484edb7c1b295a8c",
        advertisementId: 36
    }

    const reklamUrl = "https://www.jsonbulut.com/json/advertisement.php?ref=&"

    
   $.ajax({
       type: "get",
       url: reklamUrl,
       data: reklamData,
       dataType: "json",
       success: function (response) {
           const advertisement = response.reklam[0].reklam;

           sessionStorage.setItem("reklam",JSON.stringify(advertisement));
           addReklamDiv( advertisement );
           // console.log( advertisement.adi, advertisement.dosya, advertisement.href);
       }
   });

   function addReklamDiv( obj ) {
       let html = `<a target="blank" href="${obj.href}"><img id="reklamImg" src="${obj.dosya}"/></a>`;
       $("#reklam").append(html);
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
    
    const local = localStorage.getItem("products")
    if (local != null) {
        const parsedJson = JSON.parse(local);
        const product = parsedJson[clicked_id]
        const bucket = storageControl()
        bucket.unshift(product)
        localStorage.setItem("bucketProducts",JSON.stringify(bucket))
        const itemsInBucString = localStorage.getItem('bucketProducts');
        handle(itemsInBucString)
    } else {
        
    }
    
    
    return clicked_id
}

function getProductsForId(clicked_id) {
    console.log('clicked_id :>> ', clicked_id);
    sessionStorage.setItem("categoriId",clicked_id)
    return clicked_id;
}

function getDetail(clicked_product_id){
    const session = localStorage.getItem("products");
    if (session != null) {
        const parsedJson = JSON.parse(session);
        const product = parsedJson[clicked_product_id]
        
        // sessionStorage.setItem("productsInHTML",[JSON.stringify(product)])
        
        console.log('product :>> ', product);
        sessionStorage.setItem("clickedProductDetail",JSON.stringify(product));
        window.location.href = "detay.html"
    }

}






