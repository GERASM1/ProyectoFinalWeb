urlBase = "/contacto";
info = [];
let currentName = "";
let currentPhone = "";

function loadInfo() {
    $("#infoText > p").remove();
    $.ajax({
      url: urlBase,
      method: "GET",
      datatype: "json",
      success: function(response){
        cardList = [];
        currentName = response.title;
        currentPhone = response.tel;
        cardList.push(response);
        if(admin){
          $("#addButton").show();
        }
        else{
          $("#addButton").hide();
        }
      },
      error: function(error){
        console.log(error);
      }
    }).done(function() {
      cardList.forEach(post =>{
        let content = $(`<p class="font-weight-bold lead mb-2"><strong>${post.title}</strong></p>
        <p></p>
        <p class="font-weight-bold text-muted mb-0">Teléfono: ${post.tel}</p>`);
        $("#infoText").append(content);
      })
    });
  }

$("#addButton").click(function(){
    let title = $("#inputNombre").val();
    let tel = $("#inputTel").val();

    var regex = /^[0-9]+$/;
    if (tel.match(regex)){
        alert("El telefono debe ser numérico y con espacios");
        return;
    }
    
    let body = $.extend({}, {
        title: title != "" ? title : undefined,
        tel: tel != "" ? tel : undefined
    });
    $.ajax({
        url: urlBase,
        method: "PUT",
        data: JSON.stringify(body),
        contentType: "application/json",
        success: function() {
            loadInfo();
            cleanInputs();
            alert("Succesful update");
        },
        error: function(err) {
            alert(err.statusText);
        }
    });
});

$("#myBtn").click(function(){
    $("#inputNombre").val(currentName);
    $("#inputTel").val(currentPhone);
});


function cleanInputs(){
    $("#inputNombre").val("");
    $("#inputTel").val("");
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
loadInfo();