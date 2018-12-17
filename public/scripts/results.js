console.log('Hello World');

window.onload = function() {
	let reps = [];
	const repCards = $('.row');
	$.ajax ({
		method: 'GET',
		url: 'http://localhost:3000/api/rep-details',
		success: handleSuccess,
		error: handleError,
		complete: () => {console.log('Ajax GET complete!')}
	});

	function render () {
		//clears out HTML that contains representative cards
		repCards.empty();
		//create HTML code to be appended to representative cards
		let repCardsHtml = reps.map( (rep, i) => {
            //If line 2 doesn't exist, display empty string
            let line2 = rep.address[0].line2 === undefined ? '' : `${rep.address[0].line2} `
            //If part affiliation doesn't exist, display empty string
            let party = rep.party === undefined ? 'None' : `${rep.party}`
            return `
			<div class="card mb-4 shadow-sm">
              <div class="image-cropper">
              <img id="photo${i}" class="card-img-top smaller clip-circle" src="${rep.photoUrl[0]}" alt="Card image cap">
              </div>
              <div id="card${i}" class="card-body">
                  <h3 id="repName${i}"class="card-text">${rep.name}</h3>
                  <p id="party${i}">Party Affiliation: ${ party }</p>
                  <p>${rep.address[0].line1} ${ line2 }${rep.address[0].city}, ${rep.address[0].state}, ${rep.address[0].zip}</p>
                  <p>${rep.phones[0]}</p>
                  <p>${rep.urls[0]}</p>
                    <div class="social">
                      <i class="fab fa-twitter"></i>
                      <i class="fab fa-facebook"></i>
                      <i class="fab fa-instagram"></i>
                      <i class="fab fa-linkedin"></i>
                    </div>
                    <div class="form-profile reveal${i} hidden">
                        <h1>Check Your Rep- Send a letter...</h1>
                        <form id="messageData${i}">
                            <input id="messageName${i}" type="text" name="field1" placeholder="Your Name" />
                            <input id="messageEmail${i}" type="email" name="field2" placeholder="Email Address" />
                            <textarea  id="messageText${i}" name="field3" placeholder="Dear Representative..."></textarea>
                            <input type="submit" value="Send Letter" id="saveMessage" data-id="${i}" />
                        </form>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
	                    <div class="btn-group">
	                      <button id="hiddenFormReveal" type="button" class="btn btn-sm btn-outline-secondary" data-id="${i}">Message</button>
	                    </div>
                    </div>
              </div>
            </div>`
		}).join('');
		  repCards.append(repCardsHtml);

	}

	function handleSuccess (json) {
		reps = json;
		console.log(reps);
		render();
	}

	function handleError (err) {
		$('.container').text(`Failed to load reps, server is out to lunch.`);
		console.log(`Error during render of rep-details is: ${err}`);
	}
}

//////////////////////////////////////////////////////////////////////////////
// Vanilla JS Grab form on submit data
//////////////////////////////////////////////////////////////////////////////

// Global Variables
const baseURL = '/api/saved-messages';

document.addEventListener('click',function(e) {

  if(e.target && e.target.id === 'hiddenFormReveal') {
    e.preventDefault();
    console.log('click worked');
    let repNum = e.target.getAttribute('data-id');
    // document.getElementById(`card${repNum}`).classList.remove('hidden');
    $(`.reveal${repNum}`).removeClass(`hidden`);

  }
})

document.addEventListener('click',function(e) {


    if(e.target && e.target.id === 'saveMessage') {
        e.preventDefault();
				let repNum = e.target.getAttribute('data-id');
        //Ids: messageName, messageText, messageEmail, messageData
				// const repName = document.getElementById('messageData').getAttribute('data-id');
				const photo = document.getElementById(`photo${repNum}`).getAttribute('src');
				const repName = document.getElementById(`repName${repNum}`).innerText;
				const party = document.getElementById(`party${repNum}`).innerText;
        const messageName = document.getElementById(`messageName${repNum}`).value;
        const messageEmail = document.getElementById(`messageEmail${repNum}`).value;
        const messageText = document.getElementById(`messageText${repNum}`).value;
        const data = {photoUrl: photo, representative: repName, partyAffiliation: party, name: messageName, email: messageEmail, content: messageText};
        console.log(data);

        fetch(baseURL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(data),
            })
        .then(res => res.json(res))
        .then(alert('Thank you for your message!'))
        .catch(err => console.log(err));
    }
 })
