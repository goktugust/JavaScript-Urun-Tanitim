const haberId = sessionStorage.getItem("haberId");

if (haberId == null ) {
    window.location.href = "haberler.html"
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



    
    const url = "https://www.jsonbulut.com/json/news.php?ref=";

    const data = {
        ref: "806e6b62c34c9533484edb7c1b295a8c",
        id: haberId

    }

    $.ajax({
        type: "get",
        url: url,
        data: data,
        dataType: "json",
        success: function (response) {
            console.log('response :>> ', response);
            const haber = response.News[0].Haber_Bilgileri;

            const html = `<div class="card" col-12>
            <img id="haberId" src="https://www.jsonbulut.com/admin/static/haber_resimleri/${haber.picture}" class="card-img-top" alt="haber_detay_img">
            <div class="card-body">
              <p class="card-text"><b>${haber.title}</b></p>
              <p class="card-text">${haber.l_description}</p>
            </div>
          </div>`;
          $("#containerDetay").html(html);
        }
    });
});