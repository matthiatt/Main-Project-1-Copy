// Variable to enable saving of favorite foods
var favoriteFoods = JSON.parse(localStorage.getItem("favoriteFoods"));
if (favoriteFoods === null) {
  favoriteFoods = [];
  localStorage.setItem("favoriteFoods", JSON.stringify(favoriteFoods));
}

// Variable to enable saving of favorite foods
var favoriteDrinks = JSON.parse(localStorage.getItem("favoriteDrinks"));
if (favoriteDrinks === null) {
  favoriteDrinks = [];
  localStorage.setItem("favoriteDrinks", JSON.stringify(favoriteDrinks));
}

var currentFood;
var currentDrink;

// Function to turn on modal which will display recipes
function turnOnModal(e) {
  e.preventDefault();
  $("#my-modal").addClass("is-active");
}

// Function to turn off modal and return to normal view.
function turnOffModal(e) {
  e.preventDefault();
  $("#my-modal").removeClass("is-active");
}

// Turns on modal when a modal-on item is clicked and turns off modal when a modal-off button is clicked.
$(document).on("click", ".modal-on", turnOnModal);
$(document).on("click", ".modal-off", turnOffModal);

// Pulls a random meal and displays on the meal card in the home page and on the food page.
function randomMeal() {
  var queryURL = "https://www.themealdb.com/api/json/v1/1/random.php";

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    currentFood = response.meals[0];
    displayFoodCard();
  });
}

function displayFoodCard() {
  $("#food-img").attr("src", currentFood.strMealThumb);
  $("#food-thumb").attr("src", currentFood.strMealThumb);
  $("#food-title").text(currentFood.strMeal);
  $("#food-title").attr("data-number", currentFood.idMeal);

  if (isSavedFood()) {
    $("#food-heart-empty").attr("style", "display: none");
    $("#food-heart-full").attr("style", "display: block");
  } else {
    $("#food-heart-empty").attr("style", "display: block");
    $("#food-heart-full").attr("style", "display: none");
  }
}

randomMeal();

// Gets a random drink and displays on the home and the drink pages.
function randomDrink() {
  var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/random.php";

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    currentDrink = response.drinks[0];
    displayDrinkCard();
  });
}

// var imgIngLink = '#drink-thumb';

// $(imgIngLink).hide();

// $('a.mainButton').click(function (e) {
//   $(imgIngLink).fadeIn('slow');
//   e.stopPropagation();
// });
// $(document).click(function (e) {
//   $(imgIngLink).fadeOut('slow');
// });

function displayDrinkCard() {
  $("#drink-img").attr("src", currentDrink.strDrinkThumb);
  $("#drink-thumb").attr("src", currentDrink.strDrinkThumb);
  $("#drink-name").text(currentDrink.strDrink);
  $("#drink-name").attr("data-number", currentDrink.idDrink);
  if (isSavedDrink()) {
    $("#drink-heart-empty").attr("style", "display: none");
    $("#drink-heart-full").attr("style", "display: block");
  } else {
    $("#drink-heart-empty").attr("style", "display: block");
    $("#drink-heart-full").attr("style", "display: none");
  }
}

randomDrink();

// Allows the user to save a displayed item to their favorites.
$("#save-food").on("click", saveFavoriteFood);
$("#save-drink").on("click", saveFavoriteDrink);

// Gets the id of the displayed food, find the entry in the api and saves all the info into the favorites for later use.
function saveFavoriteFood() {
  var isSaved = false;
  var index = -1;

  for (var i = 0; i < favoriteFoods.length; i++) {
    if (favoriteFoods[i][0] == currentFood.idMeal) {
      isSaved = true;
      index = i;
    }
  }
  if (isSaved) {
    favoriteFoods.splice(index, 1);
    localStorage.setItem("favoriteFoods", JSON.stringify(favoriteFoods));
  }
  if (!isSaved) {
    favoriteFoods.push([currentFood.idMeal, currentFood.strMeal, currentFood]);
    localStorage.setItem("favoriteFoods", JSON.stringify(favoriteFoods));
  }
  displayFoodCard();
}

function isSavedFood() {
  var favoriteID = currentFood.idMeal;

  for (var i = 0; i < favoriteFoods.length; i++) {
    if (favoriteFoods[i][0] == favoriteID) {
      return true;
    }
  }
  return false;
}

function isSavedDrink() {
  var favoriteID = currentDrink.idDrink;

  for (var i = 0; i < favoriteDrinks.length; i++) {
    if (favoriteDrinks[i][0] == favoriteID) {
      return true;
    }
  }
  return false;
}

function saveFavoriteDrink() {
  var isSaved = false;
  var index = -1;

  for (var i = 0; i < favoriteDrinks.length; i++) {
    if (favoriteDrinks[i][0] == currentDrink.idDrink) {
      isSaved = true;
      index = i;
    }
  }
  if (isSaved) {
    favoriteDrinks.splice(index, 1);
    localStorage.setItem("favoriteDrinks", JSON.stringify(favoriteDrinks));
  }
  if (!isSaved) {
    favoriteDrinks.push([
      currentDrink.idDrink,
      currentDrink.strDrink,
      currentDrink,
    ]);
    localStorage.setItem("favoriteDrinks", JSON.stringify(favoriteDrinks));
  }
  displayDrinkCard();
}

$("#view-fav-food").on("click", viewFavoriteFood);
$("#view-fav-drink").on("click", viewFavoriteDrink);

//Opens the modal and displayed your saved favorite recipes.
function viewFavoriteFood() {
  $("#modal-title").text("Favorite Food Recipes");
  $("#modal-body").empty();

  var newUl = $("<ul>");

  for (var i = 0; i < favoriteFoods.length; i++) {
    var newLi = $("<li>");
    newLi.addClass("columns is-vcentered");
    var newText = $("<h3>");
    newText.text(favoriteFoods[i][1]);
    newText.addClass("column is-four-fifths is-tablet modal-off");
    newText.attr("data-foodli", i);
    var removeButton = $("<button>");
    removeButton.text("Remove");
    removeButton.addClass("column is-one-fifth is-tablet");
    removeButton.attr("data-removefood", i);
    newLi.append(newText);
    newLi.append(removeButton);
    newUl.append(newLi);
  }

  $("#modal-body").append(newUl);
}

function viewFavoriteDrink() {
  $("#modal-title").text("Favorite Drink Recipes");
  $("#modal-body").empty();

  var newUl = $("<ul>");

  for (var i = 0; i < favoriteDrinks.length; i++) {
    var newLi = $("<li>");
    newLi.addClass("columns is-vcentered");
    var newText = $("<h3>");
    newText.text(favoriteDrinks[i][1]);
    newText.addClass("column is-four-fifths is-tablet modal-off");
    newText.attr("data-drinkli", i);
    var removeButton = $("<button>");
    removeButton.text("Remove");
    removeButton.addClass("column is-one-fifth is-tablet");
    removeButton.attr("data-removedrink", i);
    newLi.append(newText);
    newLi.append(removeButton);
    newUl.append(newLi);
  }

  $("#modal-body").append(newUl);
}

//In the modal containing favorite recipes, allows the remove button to remove items from your favorites.
$("#my-modal").on("click", function (event) {
  var removeIndFood = event.target.dataset.removefood;
  var removeIndDrink = event.target.dataset.removedrink;
  var foodli = event.target.dataset.foodli;
  var drinkli = event.target.dataset.drinkli;
  if (removeIndFood != null) {
    favoriteFoods.splice(removeIndFood, 1);
    localStorage.setItem("favoriteFoods", JSON.stringify(favoriteFoods));
    viewFavoriteFood();
  }
  if (removeIndDrink != null) {
    favoriteDrinks.splice(removeIndDrink, 1);
    localStorage.setItem("favoriteDrinks", JSON.stringify(favoriteDrinks));
    viewFavoriteDrink();
  }
  if (foodli != null) {
    currentFood = favoriteFoods[foodli][2];
    displayFoodCard();
  }
  if (drinkli != null) {
    currentDrink = favoriteDrinks[drinkli][2];
    displayDrinkCard();
  }
});

$("#food-card").on("click", ".view-recipe", displayFoodRecipe);

function displayFoodRecipe() {
  $("#modal-title").empty();
  $("#modal-body").empty();

  var newDivCol = $("<div>");
  newDivCol.addClass("columns is-mobile");

  var newFigDiv = $("<div>");
  newFigDiv.addClass("column is-one-fifth");
  var newFigure = $("<figure>");
  newFigure.addClass("image is-64x64");
  var newImg = $("<img>");
  newImg.attr("src", currentFood.strMealThumb);

  newFigure.append(newImg);
  newFigDiv.append(newFigure);
  newDivCol.append(newFigDiv);

  var newTitle = $("<h1>");
  newTitle.text(currentFood.strMeal);
  newTitle.addClass("column");
  newDivCol.append(newTitle);

  $("#modal-title").append(newDivCol);

  var ingredients = [
    currentFood.strIngredient1,
    currentFood.strIngredient2,
    currentFood.strIngredient3,
    currentFood.strIngredient4,
    currentFood.strIngredient5,
    currentFood.strIngredient6,
    currentFood.strIngredient7,
    currentFood.strIngredient8,
    currentFood.strIngredient9,
    currentFood.strIngredient10,
    currentFood.strIngredient11,
    currentFood.strIngredient12,
    currentFood.strIngredient13,
    currentFood.strIngredient14,
    currentFood.strIngredient15,
    currentFood.strIngredient16,
    currentFood.strIngredient17,
    currentFood.strIngredient18,
    currentFood.strIngredient19,
    currentFood.strIngredient20,
  ];
  var measure = [
    currentFood.strMeasure1,
    currentFood.strMeasure2,
    currentFood.strMeasure3,
    currentFood.strMeasure4,
    currentFood.strMeasure5,
    currentFood.strMeasure6,
    currentFood.strMeasure7,
    currentFood.strMeasure8,
    currentFood.strMeasure9,
    currentFood.strMeasure10,
    currentFood.strMeasure11,
    currentFood.strMeasure12,
    currentFood.strMeasure13,
    currentFood.strMeasure14,
    currentFood.strMeasure15,
    currentFood.strMeasure16,
    currentFood.strMeasure17,
    currentFood.strMeasure18,
    currentFood.strMeasure19,
    currentFood.strMeasure20,
  ];

  var newUl = $("<ul>");
  newUl.text("Ingrediants");
  newUl.addClass("columns");

  for (var j = 0; j < 2; j++) {
    var newCol = $("<div>");
    newCol.addClass("column is-mobile");

    for (var i = 0; i < 10; i++) {
      var newLi = $("<li>");
      if (ingredients[10 * j + i] != null && ingredients[10 * j + i] != "") {
        newLi.text(ingredients[10 * j + i] + ": " + measure[10 * j + i]);
        newCol.append(newLi);
      }
    }

    newUl.append(newCol);
  }

  $("#modal-body").append(newUl);

  var newPara = $("<p>");
  newPara.text(currentFood.strInstructions);
  $("#modal-body").append(newPara);
}

$("#drink-card").on("click", ".view-recipe", displayDrinkRecipe);

function displayDrinkRecipe() {
  $("#modal-title").empty();
  $("#modal-body").empty();

  var newDivCol = $("<div>");
  newDivCol.addClass("columns is-mobile");

  var newFigDiv = $("<div>");
  newFigDiv.addClass("column is-one-fifth");
  var newFigure = $("<figure>");
  newFigure.addClass("image is-64x64");
  var newImg = $("<img>");
  newImg.attr("src", currentDrink.strDrinkThumb);

  newFigure.append(newImg);
  newFigDiv.append(newFigure);
  newDivCol.append(newFigDiv);

  var newTitle = $("<h1>");
  newTitle.text(currentDrink.strDrink);
  newTitle.addClass("column");
  newDivCol.append(newTitle);

  $("#modal-title").append(newDivCol);

  var ingredients = [
    currentDrink.strIngredient1,
    currentDrink.strIngredient2,
    currentDrink.strIngredient3,
    currentDrink.strIngredient4,
    currentDrink.strIngredient5,
    currentDrink.strIngredient6,
    currentDrink.strIngredient7,
    currentDrink.strIngredient8,
    currentDrink.strIngredient9,
    currentDrink.strIngredient10,
    currentDrink.strIngredient11,
    currentDrink.strIngredient12,
    currentDrink.strIngredient13,
    currentDrink.strIngredient14,
    currentDrink.strIngredient15,
    currentDrink.strIngredient16,
    currentDrink.strIngredient17,
    currentDrink.strIngredient18,
    currentDrink.strIngredient19,
    currentDrink.strIngredient20,
  ];
  var measure = [
    currentDrink.strMeasure1,
    currentDrink.strMeasure2,
    currentDrink.strMeasure3,
    currentDrink.strMeasure4,
    currentDrink.strMeasure5,
    currentDrink.strMeasure6,
    currentDrink.strMeasure7,
    currentDrink.strMeasure8,
    currentDrink.strMeasure9,
    currentDrink.strMeasure10,
    currentDrink.strMeasure11,
    currentDrink.strMeasure12,
    currentDrink.strMeasure13,
    currentDrink.strMeasure14,
    currentDrink.strMeasure15,
    currentDrink.strMeasure16,
    currentDrink.strMeasure17,
    currentDrink.strMeasure18,
    currentDrink.strMeasure19,
    currentDrink.strMeasure20,
  ];

  var newUl = $("<ul>");
  newUl.text("Ingrediants");
  newUl.addClass("columns");

  for (var j = 0; j < 2; j++) {
    var newCol = $("<div>");
    newCol.addClass("column is-mobile");

    for (var i = 0; i < 10; i++) {
      var newLi = $("<li>");
      if (ingredients[10 * j + i] != null && ingredients[10 * j + i] != "") {
        newLi.text(ingredients[10 * j + i] + ": " + measure[10 * j + i]);
        newCol.append(newLi);
      }
    }

    newUl.append(newCol);
  }

  $("#modal-body").append(newUl);

  var newPara = $("<p>");
  newPara.text(currentDrink.strInstructions);
  $("#modal-body").append(newPara);
}

// Search Bars
$("#name-food-search-submit").on("click", function (e) {
  e.preventDefault;
  searchByFoodName();
});
$("#ingredient-food-search-submit").on("click", function (e) {
  e.preventDefault;
  searchByFoodIng();
});
$("#origin-food-search-submit").on("click", function (e) {
  e.preventDefault;
  searchByFoodOrigin();
});
$("#name-drink-search-submit").on("click", function (e) {
  e.preventDefault;
  searchByDrinkName();
});
$("#ingredient-drink-search-submit").on("click", function (e) {
  e.preventDefault;
  searchByDrinkIng();
});

function searchByFoodName() {
  var foodName = $("#name-food-search-input").val();
  var queryURL =
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + foodName;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    var number = Math.floor(Math.random() * response.meals.length);
    currentFood = response.meals[number];
    displayFoodCard();
  });
}

function searchByFoodIng() {
  var foodIng = $("#ingredient-food-search-input").val();
  var queryURL =
    "https://www.themealdb.com/api/json/v1/1/filter.php?i=" + foodIng;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    var number = Math.floor(Math.random() * response.meals.length);
    currentFood = response.meals[number];
    displayFoodCard();
  });
}

function searchByFoodOrigin() {
  var foodOrigin = $("#origin-food-search-input").val();
  var queryURL =
    "https://www.themealdb.com/api/json/v1/1/filter.php?a=" + foodOrigin;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    var number = Math.floor(Math.random() * response.meals.length);
    currentFood = response.meals[number];
    displayFoodCard();
  });
}

function searchByDrinkName() {
  var drinkName = $("#name-drink-search-input").val();
  var queryURL =
    "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + drinkName;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    var number = Math.floor(Math.random() * response.drinks.length);
    currentDrink = response.drinks[number];
    displayDrinkCard();
  });
}

function searchByDrinkIng() {
  var drinkIng = $("#ingredient-drink-search-input").val();
  var queryURL =
    "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + drinkIng;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    var number = Math.floor(Math.random() * response.drinks.length);
    currentDrink = response.drinks[number];
    displayDrinkCard();
  });
}

$("#drink-arrow").on("click", randomDrink);
$("#food-arrow").on("click", randomMeal);

function findByCategory(category) {
  // https://developers.zomato.com/api/v2.1/cities?q=chicago
  var queryUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
  $.ajax({
    url: queryUrl,
    method: "GET",
    accept: "application/json",
    // headers: {
    //     "user-key":"751583b89913088b443a8dd9ca80a1dc",
    //     "Content-Type":"application/x-www-form-urlencoded"
    // }
  }).then(function (response) {
    var output = "";
    if (!response.meals) {
      output = "no results found";
    } else {
      for (var i = 0; i < response.meals.length; i++) {
        output += "<p>" + response.meals[i].strMeal + "</p>";
        output +=
          "<p><img src='" +
          response.meals[i].strMealThumb +
          "' width='300'></p>";
      }
    }
    document.getElementById("result").innerHTML = output;
  });
}
$("#food-category").on("click", ".food-cat", function () {
  var category = this.dataset.cat;
  findByCategory(category);
});

function validation() {
  var valfirst = document.getElementById("name-drink-search-input").value;
  var valsecond = document.getElementById("ingredient-drink-search-input")
    .value;

  if (valfirst == null || valfirst == "") {
    document.getElementById("name-drink-search-input").value =
      "Name of drink is required";
    return false;
  } else if (valsecond == null || valsecond == "") {
    document.write("Name of alcohol is required");
    return false;
  }
}
// $('.control').on('#name-drink-search-submit', function (e) {
//   function loadValues() {
//     for (var i = 1; i <= 10; i++) {
//       var id = "name-drink-search-input" + i; //defining the ID to make it usable across the for loop.
//       var textError = localStorage.getItem(id);
//       document.getElementById(id).value = textError;
//     }
//   }
//   loadValues();
//   var focusSet = false;
//   if (!$("#name-drink-search-input").val()) {
//     if ($("#name-drink-search-input").parent().next(".validation")) // only add if not added
//     {
//       $("#name-drink-search-input").parent().after("<div class='validation' style='color:red;margin-bottom: 20px;'>Please type in a valid answer.</div>");
//     }
//     e.preventDefault(); // prevent form from POST to server
//     $("#name-drink-search-input").focus();
//     focusSet = true;
//   } else {
//     $("#name-drink-search-input").parent().next(".validation").remove(); // remove it
//   }
// curl -X GET --header "Accept: application/json" --header "user-key: 751583b89913088b443a8dd9ca80a1dc" "https://developers.zomato.com/api/v2.1/cities?q=chicago"
