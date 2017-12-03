const Gene = require('./gene');
const Genome = require('./genome');

class Population {
	constructor(generators, fitness, crossover, params={mutation_rate:0.05, maxpop:100}, pop){
		if(!generators || !fitness){
			throw new Error('Fitness and generators needed to create population');
		}
		
		this.__max_pop = params.maxpop || 1000;
		this.__gens = generators;
		this.__mutation = params.mutation_rate || 0.1;
		this.__fitness = fitness;
		this.__crossover = crossover;

		if(pop){
			this.population = pop;
		} else {
			this.population = [];
			this.init();
		}
	}

	fitness(fit){
		this.__fitness = fit;
	}

	init(){
		for(let i of new Array(this.__max_pop)){
			this.population.push(new Genome([], this.__fitness, this.__crossover, this.__mutation).init(this.__gens))
		}
	}

	fit(){
		for(let genome of this.population){
			let f = genome.fit().fitness;
		}
		return this.population;
	}

	breed(was_fit=false){
		if(!was_fit){
			this.fit();
		}

		this.population.sort((a,b) => {
			return a.fitness - b.fitness;
		});

		let sum = this.population.reduce((prev, val) => {return prev + val.fitness}, 0);

		let fitted = this.population.map(e => {
			let prob = e.fitness / sum;
			return {
				genome: e,
				prob: prob
			};
		});

		let mating_pool = fitted.filter(e => e.prob > 0);
		let newpop = [];

		function select(){
			let r = Math.random();
			let i = Math.floor(Math.random() * mating_pool.length);

			while(true){
				if(mating_pool[i].prob > r){
					return mating_pool[i].genome;
				}
				r = Math.random();
				i = Math.floor(Math.random() * mating_pool.length);
			}
		}

		for(let i of new Array(this.__max_pop)){
			let mate1 = select();
			let mate2 = select();

			let baby = mate1.crossover(mate2, this.__gens);
			newpop.push(baby);
		}

		let pop = new Population(this.__gens, this.__fitness, this.__crossover, {
			mutation_rate: this.__mutation,
			maxpop: this.__max_pop
		}, newpop);

		return pop;
	}

	auto(pheno=null, target, max_gens=1000, callback){
		let generation = -1;
		let max_fitness = 0;
		let best_fit = null;

		let current_pop = this;

		if(!callback){
			callback = function(){};
		}

		for(let i of new Array(max_gens)){
			generation++;
			let fitted = current_pop.fit().sort((a, b) => {
				return a.fitness - b.fitness;
			});

			if(fitted.last().fitness > max_fitness){
				 max_fitness = fitted.last().fitness;
				 best_fit = fitted.last();
			}
			let final_genome = current_pop.population.sort((a,b)=>a.fitness-b.fitness).last();

			if(!pheno){
				if(max_fitness >= target){
					return {
						phenotype: final_genome.pheno(function(){}),
						genome: final_genome,
						population: current_pop,
						max_fitness: max_fitness,
						generation: generation
					};
				}

			} else {
				for(let g of fitted){

					let gph = g.pheno(pheno || function(){});

					if(target instanceof Object){
						let comp = target.compare(gph);
						if(comp === true || comp === target.target){
							return {
								phenotype: final_genome.pheno(pheno || function(){}),
								genome: final_genome,
								population: current_pop,
								max_fitness: max_fitness,
								generation: generation,
								best_fit: best_fit
							};
						}

					} else {
						if(gph === target){
							return {
								phenotype: final_genome.pheno(pheno || function(){}),
								genome: final_genome,
								population: current_pop,
								max_fitness: max_fitness,
								generation: generation,
								best_fit: best_fit
							};
						}
					}
				}
			}

			current_pop = current_pop.breed();

			callback({
				current: current_pop,
				max_fitness: max_fitness,
				generation: generation
			});
		}

		current_pop.fit();
		let final = current_pop.population.sort((a,b)=>a.fitness-b.fitness).last();
		return {
			phenotype: final.pheno(pheno || function(){}),
			genome: final,
			population: current_pop,
			max_fitness: max_fitness,
			generation: generation,
			best_fit: best_fit
		};
	}
}

module.exports = Population;