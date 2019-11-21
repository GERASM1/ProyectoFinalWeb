urlBase = "/eventos";
cardList = [];
currentEditID = "";
currentTitle = "";
currentDescription = "";
currentImg = "";
currentDate = "";

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
    if(admin){
      cardList.forEach(post =>{
        let title = $(`<h4 class="card-title"> ${post.title}</h4><hr>`);
        let description = $(`<p class="card-text"> ${post.description}</p>`);
        let date = $(`<li class="list-inline-item pr-2 white-text"><i class="far fa-clock pr-1"></i>${post.date}</li>`);
        let img = $(`<img class="card-img-top" src="${post.img}" alt="Card image cap"></img>`);
        let cardFooterButtons = 
        $(`<li class="list-inline-item pr-2">
        <button type="button" class="buttonEdit" data-id="${post.id}"
        data-title="${post.title}" data-description="${post.description}" 
        data-img="${post.img}" data-date="${post.date}" data-toggle="modal" data-target="#editModal">
        <i class="material-icons">edit</i></button>
        </li>
        <li class="list-inline-item pr-2">
        <button type="button" class="buttonClose" data-id="${post.id}"><i class="material-icons">delete</i></button>
        </li>  `);
        let cardImg = $(`<div class="view overlay">`).append(img);
        let cardBody = $(`<div class="card-body">`).append(title,description);
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
        let cardImg = $(`<div class="view overlay">`).append(img);
        let cardBody = $(`<div class="card-body">`).append(title,description);
        let cardFooter = $(`<div class="rounded-bottom text-center pt-3 cardFooter">
        <ul class="list-unstyled list-inline font-small">`).append(date);
        let card = $(`<div class="card" style="width: 22rem;">`).append(cardImg,cardBody,cardFooter);
        $("#list").append(card);
      })
    }
    
  });
}

$("#newPostButton").click(function(){
  let title = $("#inputTitulo").val();
  let description = $("#inputDescripcion").val();
  let img = $("#inputImg").val();
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

$("#list").on('click', ".buttonEdit", function(event){
  event.preventDefault();
  let idU = $(this).data("id");
  currentEditID = $(this).data("id");
  console.log(currentEditID);
  currentTitle = $(this).data("title");
  currentDescription = $(this).data("description");
  currentImg = $(this).data("img");
  currentDate = $(this).data("date");
  $("#inputTituloE").val(currentTitle);
  $("#inputDescripcionE").val(currentDescription);
  $("#inputImgE").val(currentImg);
  $('#dateInputE').val(currentDate);
  if(!idU){
    alert("No id provided");
    return;
  }
});

$("#editPostButton").click(function(){
  let title = $("#inputTituloE").val();
  let description = $("#inputDescripcionE").val();
  let img = $("#inputImgE").val();
  let dateRaw = new Date($('#dateInputE').val());
  let date;
  if (dateRaw){
    let day = dateRaw.getDate();
    let month = dateRaw.getMonth();
    let year = dateRaw.getFullYear();
    date = day + '/' + month + '/' + year;
  }
  let body = $.extend({}, {
      id: currentEditID,
      title: title != "" ? title : undefined,
      description: description != "" ? description : undefined,
      img: img != "" ? img : undefined,
      date: date
  });

  $.ajax({
      url: urlBase + '/' + currentEditID,
      method: "PUT",
      data: JSON.stringify(body),
      contentType: "application/json",
      success: function() {
          loadPosts();
          cleanInputs();
          alert("Succesful update");
      },
      error: function(err) {
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