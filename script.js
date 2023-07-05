const searchBox=document.querySelector('.searchBox');
const searchBtn=document.querySelector('.searchBtn');
const recipeContainer=document.querySelector('.recipe-container');
const recipeDetailsContent=document.querySelector('.recipe-details-content');
const recipeCloseBtn=document.querySelector('.recipe-closed-btn')

// for displaying ingredients
const fetchIngredients=(meal)=>{
    let ingredientsList="";
    for(let i=1;i<=20;++i){
        const ingredient=meal[`strIngredient${i}`];
        if(ingredient){
            const measure=meal[`strMeasure${i}`];
            ingredientsList+=`<li>${measure} ${ingredient}</li>`
        }
        else{
            break;
        }
    }
    return ingredientsList;
}


// funtion to get a popup
const openRecipePopUp=(meal)=>{
    recipeDetailsContent.innerHTML=`
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients : </h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>
        <div class="recipeInstructions">
            <h3>Instructions :</h3>
            <p>${meal.strInstructions}</p>
        </div>
    `
    // for blocking the display
    recipeDetailsContent.parentElement.style.display="block";
}

//FUNCTION TO GET RECIPES
const fetchRecipes=async(query)=>{
    recipeContainer.innerHTML="<h2>Fetching Recipes...</h2>";
    try {
        const data=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`); // to fetch the api
        const response=await data.json();
        // console.log(response.meals[0]);
    
        // emptying the inner html of main ie removing search your favourite recipe
        recipeContainer.innerHTML="";
        // as it is an array we apply for each loop to have all meals one by one
        response.meals.forEach(meal=>{
    
            // made a div
            const recipeDiv=document.createElement('div');
            //append the class in it
            recipeDiv.classList.add('recipe');
            // adding the inner html
            recipeDiv.innerHTML=`
                <img src="${meal.strMealThumb}">
                <h3>${meal.strMeal}</h3>
                <p><span>${meal.strArea}</span> Dish</p>
                <p>Belongs to <span>${meal.strCategory}</span> Category</p>
            `
    
            // making a button
            const button=document.createElement('button');
            button.textContent="View Recipe";
            recipeDiv.appendChild(button);
    
            //Addint event listener to recipe button
            button.addEventListener('click',()=>{
                openRecipePopUp(meal);
            })
    
            //appending the child
            recipeContainer.appendChild(recipeDiv);
        });
    } 
    catch (error) {
        recipeContainer.innerHTML="<h2>Error in Fetching Recipes</h2>"
    }
}

recipeCloseBtn.addEventListener('click',()=>{
    recipeDetailsContent.parentElement.style.display="none";
})

searchBtn.addEventListener('click',(e)=>{
    e.preventDefault(); // it is not auto submit now after this
    const searchInput=searchBox.value.trim(); // for trimming leading and starting spaces
    if(!searchInput){
        recipeContainer.innerHTML=`<h2>Type the meal in the search box</h2>`;
        return;
    }
    fetchRecipes(searchInput);
});
