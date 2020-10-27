const axios = require('axios');

let getWeather = (latitude, longitude) => {
	let apiKey = process.env.WEATHER_TOKEN;
	let url = `https://api.darksky.net/forecast/4544352bfb44ab7c32aef5e06c868ac8/${latitude},${longitude}`
	return new Promise((resolve, reject) => {
		axios.get(url)
			.then(response => {
				if (response.data.error) {
					reject(response.data.error);
				} else {
					let weather = {
						 temperature:toCelsius(response.data.currently.temperature),
						 apparentTemperature: toCelsius(response.data.currently.apparentTemperature)
					}
				
					resolve(weather)
				}
				
			})
			.catch(error => {
				reject(error);
			})
	});
}
let toCelsius = (temperature) => {
	temperature = parseFloat(temperature);
	return ((temperature - 32) / 1.8).toFixed(2);
}
module.exports.getWeather = getWeather;
