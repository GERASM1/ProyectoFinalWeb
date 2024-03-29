urlBase = "/convocatorias";
cardList = [];

function loadPosts() {
    $("#searchInput").val("");
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
      if(admin){
        cardList.forEach(post =>{
          let title = $(`<h4 class="card-title"> ${post.title}</h4><hr>`);
          let description = $(`<p class="card-text"> ${post.description}</p>`);
          let date = $(`<li class="list-inline-item pr-2 white-text"><i class="far fa-clock pr-1"></i>${post.date}</li>`);
          let img = $(`<img class="card-img-top" src="${post.img}" alt="Card image cap"></img>`);
          let link = $(`<a href="${post.link}">Más detalles</a>`)
          let cardFooterButtons = 
          $(`<li class="list-inline-item pr-2">
          <button type="button" class="buttonClose" data-id="${post.id}"><i class="material-icons">delete</i></button>
          </li>  `);
          let cardImg = $(`<div class="view overlay">`).append(img);
          let cardBody = $(`<div class="card-body">`).append(title,description,link);
          let cardFooter = $(`<div class="rounded-bottom text-center pt-3 cardFooter">
          <ul class="list-unstyled list-inline font-small">`).append(date,cardFooterButtons);
          let card = $(`<div class="card" style="width: 22rem;">`).append(cardImg,cardBody,cardFooter);
          $("#list").append(card);
        })
      }
      else{
        cardList.forEach(post =>{
          let title = $(`<h4 class="card-title"> ${post.title}</h4><hr>`);
          let description = $(`<p class="card-text"> ${post.description}</p>`);
          let date = $(`<li class="list-inline-item pr-2 white-text"><i class="far fa-clock pr-1"></i>${post.date}</li>`);
          let img = $(`<img class="card-img-top" src="${post.img}" alt="Card image cap"></img>`);
          let link = $(`<a href="${post.link}">Más detalles</a>`)
          let cardImg = $(`<div class="view overlay">`).append(img);
          let cardBody = $(`<div class="card-body">`).append(title,description,link);
          let cardFooter = $(`<div class="rounded-bottom text-center pt-3 cardFooter">
          <ul class="list-unstyled list-inline font-small">`).append(date);
          let card = $(`<div class="card" style="width: 22rem;">`).append(cardImg,cardBody,cardFooter);
          $("#list").append(card);
        })
      }
      
    });
  }

  $("#todoButton").click(function(){
      $(this).hide();
      loadPosts();
  });
  
$("#searchButton").click(function(){
    let searchString = $("#searchInput").val();
    if(!searchString){
        alert("No hay nada que buscar");
        return;
    }
    console.log(searchString);
    $("#todoButton").show();
    let obj ={
        searchString: searchString
    };
    console.log(obj.searchString);
    $.ajax({
        url: urlBase + "/name",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(obj),
        success: function(response){
          cardList = [];
          $(".dashboard > .card").remove();
          response.map(post => cardList.push(post));
        },
        error: function(error){
          console.log(error);
        }
      }).done(function() {
        cardList.forEach(post =>{
          let title = $(`<h4 class="card-title"> ${post.title}</h4><hr>`);
          let description = $(`<p class="card-text"> ${post.description}</p>`);
          let date = $(`<li class="list-inline-item pr-2 white-text"><i class="far fa-clock pr-1"></i>${post.date}</li>`);
          let img = $(`<img class="card-img-top" src="${post.img}" alt="Card image cap"></img>`);
          let link = $(`<a href="${post.link}">Más detalles</a>`)
          let cardFooterButtons = 
          $(`<li class="list-inline-item pr-2">
          <button type="button" class="buttonClose" data-id="${post.id}"><i class="material-icons">delete</i></button>
          </li>  `);
          let cardImg = $(`<div class="view overlay">`).append(img);
          let cardBody = $(`<div class="card-body">`).append(title,description,link);
          let cardFooter = $(`<div class="rounded-bottom text-center pt-3 cardFooter">
          <ul class="list-unstyled list-inline font-small">`).append(date,cardFooterButtons);
          let card = $(`<div class="card" style="width: 22rem;">`).append(cardImg,cardBody,cardFooter);
          $("#list").append(card);
        })
      });
});

  $("#newPostButton").click(function(){
    let title = $("#inputTitulo").val();
    let description = $("#inputDescripcion").val();
    let img = $("#inputImg").val();
    let link = $("#inputLink").val();
    let dateRaw = new Date($('#dateInput').val());
    let date;
    if (dateRaw){
    let day = dateRaw.getDate();
    let month = dateRaw.getMonth();
    let year = dateRaw.getFullYear();
    date = day + '/' + month + '/' + year;
    }
    
    let obj = {
      title : title,
      description : description,
      img : img,
      link: link,
      eventDate : date
    };
    $.ajax({
      url: urlBase,
      data: JSON.stringify(obj),
      method: "POST",
      contentType: "application/json",
      success: function(){
        loadPosts();
        cleanInputs();
      },
      error: function(err){
        alert(err.statusText);
      }
    });
  });
  
  $("#list").on('click', ".buttonClose", function(event){
    event.preventDefault();
    let id = $(this).data("id");
    console.log(id);
    if(!id){
      alert("No id provided");
      return;
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
        loadPosts();
      },
      error: function(err){
        alert(err.statusText);
      }
    });
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
      if(!admin){
        $("#myBtn").hide();
      }
    },
    error: function(error){
      console.log(error);
    }
  })
}

getVars();
loadPosts();