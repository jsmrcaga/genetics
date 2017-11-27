const join = require('path').join;
const Lib = require(join(__dirname,  '../lib/lib'));

class Genome {
	constructor(genes=[], fitness, crossover, mutation){
		this.genes = genes;
		this.__fit = fitness;
		this.__mutation = mutation;
		this.__crossover = crossover || Lib.genome.crossover;
	}

	init(gens){
		this.genes = [];
		for(let i of gens){
			this.genes.push(i());
		}
		return this;
	}

	fit(){
		this.fitness = this.__fit(this.genes);
		return this;
	}

	crossover(genome, generators){
		let baby_genes = this.__crossover(this.genes, genome.genes, generators, this.__mutation);
		let baby = new Genome(baby_genes, this.__fit, this.__crossover, this.__mutation);
		return baby;
	}

	pheno(fct){
		if(!(fct instanceof Function)){
			throw new Error('Pheno needs a function to apply transformation between genes and phenotype');
		}

		return fct(this.genes);
	}
}

module.exports = Genome;