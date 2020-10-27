const axios = require('axios');

let geocodeAddress = (address) => {
	let apiKey = process.env.GEO_TOKEN;
	let encodedAdress = encodeURIComponent(address);
	let url = `https://eu1.locationiq.com/v1/search.php?key=${apiKey}&q=${encodedAdress}&format=json`;
	return new Promise((resolve, reject) => {
		axios.get(url)
			.then(response => {
				if (response.data.error) {
					console.log(response.data.error);

					reject(response.data.error)
				}
				let geocode = {
					address: response.data[0].display_name,
					latitude: response.data[0].lat,
					longitude: response.data[0].lon
				}
				resolve(geocode)
			})
			.catch(error => {
				console.log(error);
				reject(error)
			})
	});
}

module.exports.geocodeAddress = geocodeAddress;
