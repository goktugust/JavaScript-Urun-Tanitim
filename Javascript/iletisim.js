function getProductsForId(clicked_id) {
    sessionStorage.setItem("categoriId",clicked_id);
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
});