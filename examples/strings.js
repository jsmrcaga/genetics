const join = require('path').join;
let Genetics = require(join(__dirname, '../index'));

// gene generator
let generator = function(){
	let r = Math.random() * (122-97) + 97;
	let st = String.fromCharCode(r);
	return new Genetics.Gene(st);
};

let target ='thisisthetarget';

let generators = new Array(target.length).fill(generator);

let pop = new Genetics.Population(generators, function(genes){
	let correct = 0;
	for(let i = 0; i < target.length; i++){
		if(genes[i].value() === target[i]){
			correct++;
		}
	}

	return correct / target.length;
});

let last_gen = pop.auto(function(genes){
	return genes.map(e=>{return e.value()}).join('');
}, target, 1000);

console.log('Generations needed to hit target', last_gen.generation);
console.log('In', last_gen.time, 'milliseconds');
console.log('Maximum fitness was', last_gen.max_fitness);
console.log('The phenotype was', last_gen.phenotype);
console.log('With a genome', last_gen.genome);