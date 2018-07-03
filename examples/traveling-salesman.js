const join = require('path').join;
let Genetics = require(join(__dirname, '../index'));

// ************
//		UTILS
// ************

let random = function(from=0, to){
	if(!to){
		to = from;
		from = 0;
	}
	return Math.floor(Math.random() * (to-from) + from);
};

let pythagoras = function(x, y){
	let a = Math.abs(cities[x].x - cities[y].x);
	let b = Math.abs(cities[x].y - cities[y].y);
	return Math.sqrt(a**2 + b**2);
};

let distance = function(genes){
	let d = 0;
	for(let i = 0; i < genes.length-1; i++){
		d += pythagoras(genes[i].value(), genes[i+1].value());
	}
	return d;
};

// ************
//		ALGO
// ************

let cities = [];
for(let i = 0; i < 10; i++){
	cities.push({
		x: random(100),
		y: random(100)
	});
};


// Generator takes current genes to
// avoid generating already present val
let generator = function(current_genes){
	let r = random(cities.length);
	while(Genetics.Gene.values(current_genes).indexOf(r) > -1){
		r = random(cities.length);
	}
	return new Genetics.Gene(r);
}

let generators = new Array(cities.length).fill(generator);

let pop = new Genetics.Population(generators, function(genes){
	// Fitness function
	let d = distance(genes);
	return 1/d;
}, function(genes1, genes2, generators, mutation_rate){
	// Crossover function

	// we choose a random section of
	// the first parent and then
	// fill up with the other parent
	let start = random(genes1.length);
	let end = random(start, genes1.length);

	// slice() to duplicate array 
	// because same array will be used after
	// we have to keep it safe
	let new_genes = genes1.slice().splice(start, end);

	for(let i of genes2){
		let exists = new_genes.find(e => {
			return e.value() === i.value();
		});

		if(!exists){
			new_genes.push(i);
		}
	}

	// don't forget random mutations
	let r = Math.random();
	if(r < mutation_rate){
		let i = random(0, new_genes.length);
		let cp = new_genes.slice();
		cp.splice(i,1);
		new_genes.splice(i, 1, generators[0](cp));
	}

	return new_genes;
});


let last_gen = pop.auto(null, Infinity, 10000);
console.log('Cities', cities);
console.log('Generations needed to hit target', last_gen.generation);
console.log('In', last_gen.time, 'milliseconds');
console.log('Maximum fitness was', last_gen.max_fitness);
console.log('The phenotype was', last_gen.phenotype);
console.log('With a genome', last_gen.genome);
console.log('Best genome', last_gen.best_fit);