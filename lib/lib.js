let lib = {};

Array.prototype.last = function(){
	return this[this.length - 1];
};

lib.math = {};
lib.math.map = function(val, min, max, from, to){
	let a = (to-max)/(from-min);
	let b = to - (a*max);
	return val*a + b;
};

lib.genome = {};
lib.genome.crossover = function(genes1, genes2, generators, mutation=0.05){
	let new_genes = [];

	function rand(g1, g2){
		let r = Math.random();
		if(r >= 0.5){
			new_genes.push(g2);
		} else {
			new_genes.push(g1);
		}
	}

	for(let i = 0; i < genes1.length; i++){
		if(genes1[i].__type){
			if(genes1[i].__type === genes2[i].__type){
				rand(genes1[i]);
			} else if(genes1[i].__type === 'dominant'){
				new_genes.push(genes1[i]);
			} else if (genes2[i].__type === 'dominant'){
				new_genes.push(genes2[i]);
			} else {
				rand(genes1[i], genes2[i]);
			}

		} else {
			if(mutation > 0){
				let r = Math.random();
				if(r < mutation){
					new_genes.push(generators[i](new_genes));
				} else {
					rand(genes1[i], genes2[i]);	
				}
			} else {
				rand(genes1[i], genes2[i]);
			}
		}
	}

	return new_genes;
}

module.exports = lib;