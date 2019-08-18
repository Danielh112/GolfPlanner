/* Start and end of current day */
let clients;

$(document).ready(function() {
  initialise();
});

function initialise() {
  displayClients();
}

async function displayClients() {
  clients = await getClients();
  $.each( clients, function( key, client ) {
    $("#clients").append(client.title);
  });

}

function getClients() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '../api/clients',
      type: 'get',
      data: {
        limit: -1
      },
      dataType: 'json',
      success: function(response) {
        resolve(response);
      },
      error: function(err) {
        console.log(err);
        reject(err);
      }
    });
  });
}
