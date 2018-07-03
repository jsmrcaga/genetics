// ******************
//	  DEFAULT 0.05
// ******************
function dflt(){
	let {Genome, Gene, Population} = require('../index');
	let generator = () => new Gene(Math.floor(Math.random() * 6) + 1);
	let generators = Array(5).fill(generator);
	let fitness = genes => {
		let sum = genes.reduce((p, v)=>p*v.value(), 1);
		return 1/(Math.abs(1024 - sum));
	};

	let pop = new Population(generators, fitness);
	let pheno = genes => {
		return genes.reduce((p, v) => p * v.value(), 1);
	};

	let new_pop = pop.auto(pheno, 1024, 100000);
	console.log('Generations needed to hit target', new_pop.generation);
	console.log('In', new_pop.time, 'milliseconds');
	console.log('Maximum fitness was', new_pop.max_fitness);
	console.log('The phenotype was', new_pop.phenotype);
	console.log('With a genome', new_pop.genome);
}

// ******************
//	  NEW ONE 0.2
// ******************
function mutation(){
	let {Genome, Gene, Population} = require('../index');
	let generator = () => new Gene(Math.floor(Math.random() * 6) + 1);
	let generators = Array(5).fill(generator);
	let fitness = genes => {
		let sum = genes.reduce((p, v)=>p*v.value(), 1);
		return 1/(Math.abs(1024 - sum));
	};

	let pop = new Population(generators, fitness, null, {mutation_rate:0.2});
	let pheno = genes => {
		return genes.reduce((p, v) => p * v.value(), 1);
	};

	let new_pop = pop.auto(pheno, 1024, 100000);
	console.log('Generations needed to hit target', new_pop.generation);
	console.log('In', new_pop.time, 'milliseconds');
	console.log('Maximum fitness was', new_pop.max_fitness);
	console.log('The phenotype was', new_pop.phenotype);
	console.log('With a genome', new_pop.genome);
}

console.log('************');
console.log('DEFAULT 0.05');
console.log('************');
dflt();

console.log('\n\n************');
console.log('MUTATION 0.2');
console.log('************');
mutation();