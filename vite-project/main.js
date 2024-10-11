import './style.css';

const divBattles = document.querySelector('#battles');
const formLogin = document.querySelector('#formLogin');
const passwordInput = document.querySelector('#password');
const emailInput = document.querySelector('#email');
const userDiv = document.querySelector('#user');

formLogin.addEventListener('submit', (event) => {
	event.preventDefault();
	const password = passwordInput.value;
	const email = emailInput.value;

	const options = {
		method: 'POST',
		body: JSON.stringify({ password, email }),
		headers: {
			'Content-Type': 'application/json',
		},
	};

	fetch(
		'https://api.which-one-battle.julienpoirier-webdev.com/api/auth/signin',
		options
	).then((response) => {
		response.json().then((data) => {
			localStorage.setItem('token', data.token);
			userDiv.innerHTML = `<p>Bonjour ${data.user.name} !!</p>`;
			formLogin.classList.add('hidden');
		});
	});
});

const headers = localStorage.getItem('token')
	? { Authorization: `Bearer ${localStorage.getItem('token')}` }
	: {};

fetch('https://api.which-one-battle.julienpoirier-webdev.com/api/battles', {
	headers: headers,
})
	.then(function (response) {
		if (response.ok) {
			return response
				.json()
				.then(function (data) {
					data.forEach(function (battle) {
						let propositions = '';
						battle.propositions.forEach(function (proposition) {
							propositions += `<p><span>${proposition.name}</span><span>${proposition.value}</span></p>`;
						});

						divBattles.innerHTML += `<div class="battle">
                                      <p>${battle.question}</p>
                                      <p>${battle.texte}</p>
                                      <div>${propositions}</div>
                                  </div>`;
					});
				})
				.catch(function (error) {
					console.log(error);
				});
		} else {
			throw new Error('Erreur : Problème avec la requête');
		}
	})
	.catch(function (error) {
		console.log(error);
	});

const localToken = localStorage.getItem('token');

if (localToken) {
	formLogin.classList.toggle('hidden');
}