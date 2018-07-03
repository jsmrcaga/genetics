const expect = require('chai').expect;

const {Gene, Genome, Population} = require('../index');
const lib = require('../lib/lib');

describe('Gene Tests', () => {
	it('Should create a gene and retrieve its value', () => {
		let g = new Gene(5);
		expect(g.value()).to.be.eql(5);
	});

	it('Should create multiple genes and retrieve all values', () => {
		let vals = [1,2,6,3,6,8,3,123,45,1,23];
		let genes = [];
		for(let i of vals){
			genes.push(new Gene(i));
		}
		expect(Gene.values(genes)).to.be.eql(vals);
	});

	it('Should create some genes and randomly crossover them', () => {
		let g1 = [1,2,3,4,5,6];
		let g2 = [7,8,9,10,11,12];
		let genes1 = g1.map(e => new Gene(e));
		let genes2 = g2.map(e => new Gene(e));
		let generators = Array(6).fill(0).map(e => {return () => new Gene(Math.floor(Math.random() * 6) + 1)});
		let new_genes = lib.genome.crossover(genes1, genes2, generators);

		expect(new_genes).to.not.be.eql(g1);
		expect(new_genes).to.not.be.eql(g2);
	});
});

describe('Genome Tests', () => {
	it('Should create an empty genome and initialize with generators', ()=>{
		let generators = Array.from({length: 10}, (v, i) =>((index) => {return () => new Gene(index)})(i));
		let g = new Genome([]);
		g.init(generators);
		expect(Gene.values(g.genes)).to.be.eql([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
	});

	it('Should create a genome and fit to exact value', ()=>{
		let generators = Array.from({length: 10}, (v, i) =>((index) => {return () => new Gene(index)})(i));
		let g = new Genome([], genes => {
			return genes.reduce((p, v)=> p + v.value(), 0);
		});
		g.init(generators);
		g.fit();
		expect(g.fitness).to.be.eql(45);
	});

	it('Should create two genomes and crossover them', ()=>{
		let gens1 = Array.from({length: 5}, (v, i) =>((index) => {return () => new Gene(index)})(i));
		let g1 = new Genome();
		g1.init(gens1);

		let gens2 = Array.from({length: 5}, (v, i) =>((index) => {return () => new Gene(index + 5)})(i));
		let g2 = new Genome();
		g2.init(gens2);

		let baby = g1.crossover(g2, gens1);
		expect(Gene.values(baby.genes)).to.not.be.eql([0,1,2,3,4]);
		expect(Gene.values(baby.genes)).to.not.be.eql([5,6,7,8,9]);
	});

	it('Should create two genomes and crossover them with crossover function', ()=>{
		let gens1 = Array.from({length: 5}, (v, i) =>((index) => {return () => new Gene(index)})(i));
		let g1 = new Genome([], null, (g1, g2, gens, mut)=>{
			let g = g1.splice(0,3);
			let gg = g2.splice(0, 2);
			return g.concat(gg);
		});
		g1.init(gens1);

		let gens2 = Array.from({length: 5}, (v, i) =>((index) => {return () => new Gene(index + 5)})(i));
		let g2 = new Genome([], null);
		g2.init(gens2);

		let baby = g1.crossover(g2, gens1);
		expect(Gene.values(baby.genes)).to.be.eql([0,1,2,5,6]);
	});

	it('Should create a genome and get phenotype from function', ()=>{
		let gens1 = Array.from({length: 5}, (v, i) =>((index) => {return () => new Gene(index)})(i));
		let g1 = new Genome();
		g1.init(gens1);

		let pheno = g1.pheno(genes => {
			return genes.reduce((p,v) => p + v.value(), 0);
		});
		expect(pheno).to.be.eql(10);
	});
});

describe('Population Tests', () => {
	it('Should create a population and fill it with genomes', () => {
		let generators = Array(5).fill(0).map(e => {return () => new Gene(Math.floor(Math.random() * 6) + 1)});
		let fitness = genes => {
			return genes.reduce((p, v)=>p+v.value(), 0);
		};

		let pop = new Population(generators, fitness);
		expect(pop.__max_pop).to.be.eql(100);
		expect(pop.population).to.have.lengthOf(100);
		for(let genome of pop.population){
			expect(genome instanceof Genome).to.be.eql(true);
		}
	});

	it('Should create a population and breed a new one', () => {
		let generators = Array(5).fill(0).map(e => {return () => new Gene(Math.floor(Math.random() * 6) + 1)});
		let fitness = genes => {
			return genes.reduce((p, v)=>p+v.value(), 0);
		};

		let pop = new Population(generators, fitness);
		let new_pop = pop.breed();
		expect(new_pop.population).to.not.be.eql(pop.population);
		expect(new_pop.population[0]).to.not.be.eql(pop.population[0]);
	});

	it('Should create a population and auto breed until cap reached', function(){
		this.timeout(10000);
		let generators = Array(5).fill(0).map(e => {return () => new Gene(Math.floor(Math.random() * 6) + 1)});
		let fitness = genes => {
			let sum = genes.reduce((p, v)=>p*v.value(), 1);
			return 1/(Math.abs(1000-sum));
		};

		let pop = new Population(generators, fitness);
		let pheno = genes => {
			return genes.reduce((p, v) => p * v.value(), 1);
		};

		let new_pop = pop.auto(pheno, 1000, 5000);

		expect(new_pop).to.be.an('object');
		expect(new_pop).to.have.property('generation');
		expect(new_pop.generation).to.be.gt(-1);
	});
});