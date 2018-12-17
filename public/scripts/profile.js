console.log('Go ahead panda!!!');
// Global Variables
const baseUrl = '/api/saved-messages';
const messageCards = $('.row');
let messages = [];
window.onload = function () {
// Display all messages
  $.ajax({
    method: 'GET',
    url: baseUrl,
    success: handleSuccess,
    error: handleError,
    complete: (e) => {console.log('AJAX GET request is complete')}
  });
// Combination of Delete and Update
  messageCards.on('click', '.changeBtn', function(event) {
    let messageId = $(this).attr('data-id');
    if ($(this).hasClass('deleteBtn')) {
      // if the delete message button was clicked, delete the message
      console.log('Clicked delete button to /api/saved-messages/' + messageId);
      $.ajax({
        method: 'DELETE',
        url: baseUrl + '/' + messageId,
        success: deleteMessageSuccess,
        error: deleteMessageFail,
        complete: () => { console.log('Delete Message AJAX request complete') }
      });
    } else if ($(this).hasClass('editBtn')) {
      console.log('Clicked edit button to /api/saved-messages/' + messageId);
      $(this).parent().append(`
        <form id="editRepMessage">
          <br>
          <textarea class="edit-message" name="content" placeholder="New Message Here"></textarea>
          <button class="edit-formBtn edit-submit" data-id="${messageId}">Submit</button>
          <button class="edit-formBtn edit-cancel">Cancel</button>
        </form>`);
      $('#editRepMessage').on('click', '.edit-formBtn', function (e) {
        if ($(this).hasClass('edit-cancel')) {
          e.preventDefault();
          const form = $('#editRepMessage');
          form.remove();
        } else if ($(this).hasClass('edit-submit')) {
          let data = $('form').serialize();
          console.log(data);

          $.ajax({
            method: 'PUT',
            data: data,
            url: baseUrl + '/' + messageId,
            success: () => {console.log('Updated message successfully!')},
            error: (err) => {console.log(`Error at update message is: ${err}`)},
            complete: () => {console.log('AJAX POST update completed!')}
          });
        }
      });
    }
  });

// Functions for rendering saved messages
  function render () {
    // Clear out HTML that contains any left over messages
    messageCards.empty();
    // create HTML to append
    let messageCardsHtml = messages.map( (message) => {
      console.log(message);
      return `
         <div class="card mb-4 shadow-sm">
         <div class="image-cropper">
           <img class="card-img-top smaller clip-circle" src="${message.photoUrl}" alt="Card image cap">
         </div>
           <div class="card-body">
               <h3 class="card-text">To: ${message.representative}</h3>
               <p class="center">${message.partyAffiliation}</p>
               <p class="center">From: ${message.name}</p>
               <p class="center">${message.content}</p>
               <div class="d-flex justify-content-between align-items-center">
                 <div class="btn-group">
                   <button type="button" class="btn btn-sm btn-outline-secondary changeBtn editBtn" data-id="${message._id}">Edit</button>
                   <button type="button" class="btn btn-sm btn-outline-secondary changeBtn deleteBtn" data-id="${message._id}">Delete</button>
                 </div>
               </div>
             </div>
           </div>
      `
    }).join('');
    messageCards.append(messageCardsHtml);
  }

  function handleSuccess (json) {
    messages = json;
    console.log(messages);
    render();
  }

  function handleError (err) {
    $('.row').text(`Failed to load messages, server is out to lunch`);
    console.log(`Error during render of saved messages is: ${err}`);
  }

// Functions for deleting saved messages
  function deleteMessageSuccess (json) {
    var message = json;
    // console.log(json + '!!!');
    var messageId = message._id;

    // find the message with the right ID and delete it
    for (var i = 0; i < messages.length; i++) {
      if (messages[i]._id === messageId) {
        messages.splice(i, 1);
        break; // we found the right message, get out of the loop
      }
    }
    render();
  }

  function deleteMessageFail () {
    console.log('Failed to delete message');
  }

 }
