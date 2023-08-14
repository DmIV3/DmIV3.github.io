export const Mth = {
    random: function(min, max){
		return Math.random()*(max - min)+min;
	},

	randomInt: function(min, max){
		return Math.floor(Math.random()*(max - min + 1) + min);
	}
}