console.log('Hello World');

/////////////////////////////
// Landing Page -->  (A) Search for Officials and (B) Save them to the DB
/////////////////////////////

// On form submit, grab the zip and pass it along
// $('#form').on('submit', grabZip);
const zipForm = document.getElementById('form');
zipForm.addEventListener('submit', grabZip);

function grabZip(e) {
	e.preventDefault();

	// Getting value from form input
	let zip = document.getElementById('form').elements[0].value;
	// Prepare form data as an object to pass to body
	let data = { zip };
	// Part (A) Make a fet request to our server, which will then query the API for
	// representative info.
	fetch('http://localhost:3000/api/rep-info/', {
		method: 'POST',
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify(data) // Stringify form data object for fetch
	})
		.then(res => res.json())
		// Part (B) Save rep info, AKA repData to our database for use on the Search Results page
		.then((data) => {
			// data.officials is an array of Representatives and their info
			let repData = { data: data.officials };
			console.log(repData)

			$.ajax({
				method: 'POST',
				url: 'http://localhost:3000/api/rep-details',
				data: repData,
				timeout: 1000,
				success: () => console.log("Success!"),
				error: () => console.log('Oh snap, things got weird!'),
				complete: (e) => {
					window.location = '/results'
				}
			})
		})
		// .then(res => res.redirect())
		.catch(err => console.log(err));
	// window.location.href = "/results";
}




//////////////////////////////////////////////////////
//Add -- Remove Items from cart
//////////////////////////////////////////////////////
var itemCount = 0;

$('.add').click(function (){
  itemCount ++;
  $('#letterCount').html(itemCount).css('display', 'block');
});

$('.clear').click(function() {
  itemCount = 0;
  $('#letterCount').html('').css('display', 'none');
  $('#letterItems').html('');
});
///////////////////////////////////////////////////////////
