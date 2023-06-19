//loads the fav list everytime page reloades
window.onload = showFavMeals;

const search_box = document.getElementById("search-box");
const search_result_container = document.getElementById("search-result-container");
const fav_body = document.getElementById("fav-meals");

//Fetches meals from api and returns it 
async function fetchMeals(url,value){
    const response = await fetch(`${url+value}`);
    const meals = await response.json();
    return meals;
}

//Create favmeal array in local storage if not existed
if(localStorage.getItem("favMealArr") == null){
    localStorage.setItem("favMealArr",JSON.stringify([]));
}

//it shows all meals according to the search 
function showMeals(){
    let inputVal = search_box.value;
    let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    let arr = JSON.parse(localStorage.getItem("favMealArr"));
    let html = "";
    let meals = fetchMeals(url,inputVal);
    //console.log(meals);
    meals.then(data=>{
        if(data.meals){
            data.meals.forEach((element) => {
                let isfav = false;
                for(let i=0; i<arr.length;i++){
                    if(arr[i] == element.idMeal){
                        isfav = true;
                    }
                }
                if(isfav){
                    html += `
                    <div id="meal-card">
                        <div id="meal-img">
                            <img src="${element.strMealThumb}">
                        </div>
                        <div id="meal-name">
                            <h1>${element.strMeal}</h1>
                        </div>
                        <div id="button-div">
                            <button type="button" id="detail-btn" onclick="showMealDetails(${element.idMeal})">More Details</button>
                            <button type="button" id="${element.idMeal}" style="color: rgb(255, 133, 154);" class="fav-btn" onclick="addOrRemoveMeal(${element.idMeal})"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                    `;
                }else{
                    html += `
                    <div id="meal-card">
                            <div id="meal-img">
                                <img src="${element.strMealThumb}">
                            </div>
                            <div id="meal-name">
                                <h1>${element.strMeal}</h1>
                            </div>
                            <div id="button-div">
                                <button type="button" id="detail-btn" onclick="showMealDetails(${element.idMeal})">More Details</button>
                                <button type="button" id="${element.idMeal}"  class="fav-btn" onclick="addOrRemoveMeal(${element.idMeal})"><i class="fa-solid fa-heart"></i></button>
                            </div>
                    </div>
                    
                    `;

                }
            });
        }else{
            html += `
                <h1>The meal you are looking for is not found</h1>
            `;
        }
        search_result_container.innerHTML = html;
        
    });
}

search_box.addEventListener('keyup',showMeals);

//shows Meal's detail page
async function showMealDetails(id){
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";
    await fetchMeals(url,id).then((data)=>{
        html += `
        <div id="meal-detail-card">
            <div id="img-name-container">
                <div id="img-container">
                    <img src="${data.meals[0].strMealThumb}">
                </div>
                <div id="name-n-all">
                    <h1>${data.meals[0].strMeal}</h1>
                    <h4>Category: ${data.meals[0].strCategory}</h4>
                    <h4>Area: ${data.meals[0].strArea}</h4>
                </div>
            </div>
            <div id="instruction">
                <h4 style="text-align:center">Instruction :</h4>
                <p>
                    ${data.meals[0].strInstructions}
                </p>
            </div>
            <div id="footer">
                <button type="button" id="watch-yt"><a href="${data.meals[0].strYoutube}" target="_blank">Watch Video</a></button>
                <button type="button" id="close" onclick="closeDetails()"><i class="fa-regular fa-circle-xmark" style="color: red; font-size: 15px;"></i>Close</button>
            </div>
         </div>
        
        `;
    });
    search_result_container.innerHTML = html;
}

//to close the detail page of meal
function closeDetails(){
    search_result_container.innerHTML = "";
    search_box.value = "";
}

//to show fav meals in fav section
async function showFavMeals(){
    const arr = JSON.parse(localStorage.getItem("favMealArr"));
    //console.log(arr);
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";
    if(arr.length == 0){
        html += `
            <h2>No Favourites Added....</h2>
        `;
    }else{
        for(let i=0;i<arr.length;i++){
            await fetchMeals(url,arr[i]).then(data =>{
                html += `
                    <div id="fav-meal-card">
                            <div id="fav-meal-img">
                                <img src="${data.meals[0].strMealThumb}">
                            </div>
                            <div id="fav-meal-name">
                                <h2>${data.meals[0].strMeal}</h2>
                            </div>
                            <div id="btn-div">
                                <button type="button" id="det-btn" onclick="showMealDetails(${data.meals[0].idMeal})">More Details</button>
                                <button type="button" class="fav-btn" style="color: rgb(255, 133, 154);" onclick="addOrRemoveMeal(${data.meals[0].idMeal})"><i class="fa-solid fa-heart"></i></button>
                            </div>

                    </div>
                `;
            });
        }
        
    }
    fav_body.innerHTML = html;
}

//to add meals to fav array and list
function addOrRemoveMeal(id){
    console.log("id: ",id);
    let arr = JSON.parse(localStorage.getItem("favMealArr"));
    let contains = false;
    for(let i =0;i<arr.length;i++){
        if(arr[i] == id){
            contains = true;
        }
    }

    if(contains){
        let index = arr.indexOf(id);
        arr.splice(index,1);
        alert("Meal removed from favourites");
    }else{
        arr.push(id);
        alert("Meal added to your Favourites!!!!!");
    }
    console.log("fav arr :", arr);
    localStorage.setItem("favMealArr",JSON.stringify(arr));
    showMeals();
    
    showFavMeals();
}

