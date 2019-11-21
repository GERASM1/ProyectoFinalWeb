urlBase = "/materiales";
cardList = [];
asig = "";
let currentType = "";

function loadPosts() {
  $(".dashboard > .card").remove();
  $.ajax({
    url: urlBase,
    method: "GET",
    datatype: "json",
    success: function(response){
      cardList = [];
      response.map(post => cardList.push(post));
    },
    error: function(error){
      console.log(error);
    }
  }).done(function() {
      cardList.forEach(post =>{
        if(admin || post.userID == userID){
            let title = $(`<h5 class="card-title">${post.title}</h5>`);
            let name = $(`<p class="card-text teacherName">${post.name}</p>`);
            let description = $(`<p class="card-text">${post.description}</p>`);
            let deleteButton =$(`<div class="buttonContainer">
            <button type="button" class="btn btn-danger"
            data-user="${post.userID}" data-id="${post.id}">Borrar</button>
            </div>`);
            let badge = $(`<span class="badge badge-info">${post.tipo}</span>`);
            let cardBody = $(`<div class="card-body">`).append(deleteButton,title,name,description,badge);
            let card = $(`<div class="card">`).append(cardBody);
            $("#list").append(card);
        }
        else{
            let title = $(`<h5 class="card-title">${post.title}</h5>`);
            let name = $(`<p class="card-text teacherName">${post.name}</p>`);
            let description = $(`<p class="card-text">${post.description}</p>`);
            let badge = $(`<span class="badge badge-info">${post.tipo}</span>`);
            let cardBody = $(`<div class="card-body">`).append(title,name,description,badge);
            let card = $(`<div class="card">`).append(cardBody);
            $("#list").append(card);
        }
      });
});
}

function loadPostsByType(){
    let obj ={
        type: currentType
    };
    $(".dashboard > .card").remove();
    $.ajax({
        url: urlBase + "/materia",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(obj),
        success: function(response){
          cardList = [];
          response.map(post => cardList.push(post));
        },
        error: function(error){
          console.log(error);
        }
      }).done(function() {
          cardList.forEach(post =>{
          if(admin || post.userID == userID){
              let title = $(`<h5 class="card-title">${post.title}</h5>`);
              let name = $(`<p class="card-text teacherName">${post.name}</p>`);
              let description = $(`<p class="card-text">${post.description}</p>`);
              let deleteButton =$(`<div class="buttonContainer">
              <button type="button" class="btn btn-danger"
              data-user="${post.userID}" data-id="${post.id}">Borrar</button>
              </div>`);
              let badge = $(`<span class="badge badge-info">${post.tipo}</span>`);
              let cardBody = $(`<div class="card-body">`).append(deleteButton,title,name,description,badge);
              let card = $(`<div class="card">`).append(cardBody);
              $("#list").append(card);
          }
          else{
              let title = $(`<h5 class="card-title">${post.title}</h5>`);
              let name = $(`<p class="card-text teacherName">${post.name}</p>`);
              let description = $(`<p class="card-text">${post.description}</p>`);
              let badge = $(`<span class="badge badge-info">${post.tipo}</span>`);
              let cardBody = $(`<div class="card-body">`).append(title,name,description,badge);
              let card = $(`<div class="card">`).append(cardBody);
              $("#list").append(card);
          }
      });
      });
}

$("#newPostButton").click(function(){
    let title = $("#inputTitulo").val();
    let description = $("#inputDescripcion").val();
    let tipo = asig;
    if(asig == ""){
        alert("No selecciono una Asignatura");
        return;
    }
    let obj = {
        title : title,
        name: userName,
        description : description,
        tipo: tipo,
        userID : userID
    };

    $.ajax({
        url: urlBase,
        data: JSON.stringify(obj),
        method: "POST",
        contentType: "application/json",
        success: function(){
        if(currentType == "")
          loadPosts();
        else
          loadPostsByType();
        cleanInputs();
        $("#dropdownTitle").html("Asignatura");
        },
        error: function(err){
        alert(err.statusText);
        }
    });
});

$("#todoButton").click(function(){
    currentType = "";
    $("#todoButton").hide();
    loadPosts();
});

$("#list").on('click', ".dropdown-item", function(event){
    event.preventDefault();
    let type = $(this).data("type");
    if(type) {
      currentType = type;
      $("#todoButton").show();
      loadPostsByType();
    }
});


$("#list").on('click', ".btn-danger", function(event){
    event.preventDefault();
    let id = $(this).data("id");
    let currentUserID = $(this).data("user");
    if(!id){
      alert("No id provided");
      return;
    }

    if(!admin){
      if(userID != currentUserID){
        alert("Para borrar este post debe ser suyo");
        return;
      }
    }
    
    let body = {
      id : id
    }
  
    $.ajax({
      url: urlBase + '/' + id,
      method: "DELETE",
      data: JSON.stringify(body),
      contentType: "application/json",
      success: function() {
        if(currentType != ""){
          loadPostsByType();
        }
        else{
          loadPosts();
        }
      },
      error: function(err){
        alert(err.statusText);
      }
    });
});

$("#dropInput").on('click', ".dropdown-item", function(event){
  event.preventDefault();
  asig =$(this).data("type");
  $("#dropdownTitle").html(asig);
});
  
function cleanInputs(){
    $("textarea").val("");
    $("input[type=text]").val("");
    $('input[type=date]').val("");
}

function getVars() {
  $(".dashboard > .card").remove();
  $.ajax({
    url: "/variables",
    method: "GET",
    datatype: "json",
    success: function(response){
      userName = response.userName;
      userID = response.userID;
      admin = response.admin;
    },
    error: function(error){
      console.log(error);
    }
  })
}
getVars();
loadPosts();