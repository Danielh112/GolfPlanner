/* Start and end of current day */
let clients;

let selectedClient = {
    customerId: -1,
    clientName: '',
    clientCredit: -1,
    clientLastLessonDate: ''
};

$(document).ready(function() {
  initialise();

  $('#clients').on('click', '#updateClientBtn', function() {
    updateSelectedClient(this);
    updateClientModal();
    $('#updateClientModal').modal('show');
  });
});

function initialise() {
  displayClients();
}

async function displayClients() {
  clients = await getClients();

  $.each(clients, function(key, client) {
    /* TODO look at postgres doesn't support returning camel case charaters */
    $('#clients').append(`<tr id='${client.customer_id}'>
      <td> ${client.fullname} </td>
      <td> ${client.credit} </td>
      <td> ${client.lastLessonDate || '-'} </td>
      <td> <button type='button' id='updateClientBtn' class='btn btn-primary btn-sm btn-block'>+</button> </td>`);
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

function updateSelectedClient(client) {
  selectedClient.customerId = client.customerId;
  selectedClient.name = client.name;
  selectedClient.credit = client.credit;
  selectedClient.clientLastLessonDate = client.lastLessonDate;
}

/* look at moving to React or Vue framework to prevent having to do this */
function updateClientModal() {
  $("#clientNameValue").val(selectedClient.name);
  $("#clientCreditValue").val(selectedClient.credit);
  $("#clientLastLessonDateValue").val(selectedClient.lastLessonDate);
}
