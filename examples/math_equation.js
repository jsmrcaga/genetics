// Example taken from
// https://arxiv.org/ftp/arxiv/papers/1308/1308.4675.pdf
const join = require('path').join;
let Genetics = require(join(__dirname, '../index'));

let generator = function(){
	let int = Math.floor(Math.random() * 30) + 1;
	return new Genetics.Gene(int);
}

let generators = new Array(4).fill(generator);

let pop = new Genetics.Population(generators, function(genes){
	// retrieve gene values
	let vals = genes.map(e => e.value());

	// return inverse of 30 - function (so that fitness is an increasing curve)
	let inverse = 30 - (vals[0] + 2*vals[1] + 3*vals[2] + 4*vals[3]);
	return 1/inverse;
});


let last_gen = pop.auto(function(genes){
	let vals = genes.map(e => e.value());
	return (vals[0] + 2*vals[1] + 3*vals[2] + 4*vals[3]);
}, 30, 1000);

console.log('Generations needed to hit target', last_gen.generation);
console.log('In', last_gen.time, 'milliseconds');
console.log('Maximum fitness was', last_gen.max_fitness);
console.log('The phenotype was', last_gen.phenotype);
console.log('With a genome', last_gen.genome);