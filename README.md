# Genetix
A simple library to test genetic algorithms

## Installation
`npm install -S genetix`

## Description

With Genetix you can create simple genetic algorithms. Its flexibility
opens a lot of doors, and lets you customize every aspect of the algorithm.

Keep in mind that this is a library meant for testing and not a library meant
for actual production/calculus code. It is SLOW and unoptimized.

Genetix uses 3 main classes `Gene`, `Genome` and `Population`. 

## tl;dr

To use Genetix you first initialize a `Population` object with a `fitness` function
and `generators`.
`generators` is a list of functions that return `Gene`s.

Example:

```javascript
let Genetics = require('genetix');

// Create generator function
let generator = function(){
	let int = Math.floor(Math.random() * 30) + 1;
	return new Genetics.Gene(int);
}

// All generators are the same
let generators = new Array(4).fill(generator);

// Create population with generators and fitness function
let pop = new Genetics.Population(generators, function(genes){
	// retrieve gene values
	let vals = genes.map(e => e.value());

	// return inverse of 30 - function (so that fitness is an increasing curve)
	let inverse = 30 - (vals[0] + 2*vals[1] + 3*vals[2] + 4*vals[3]);
	return 1/inverse;
});

// Evolve until a satisfying genome is found (30 is the target, 1000 max generation)
let last_gen = pop.auto(function(genes){
	let vals = genes.map(e => e.value());
	return (vals[0] + 2*vals[1] + 3*vals[2] + 4*vals[3]);
}, 30, 1000);

```

`fitness` takes as argument the genes of every `Genome` and expects a number as output.

## Concepts

### `Population`
A population is like a generation (actually, a generation in this case is composed of a population). It contains individuals, with a 
maximum number of them, capable of reproduction. 

These indiivuals reproduce to combine their genes and go towards a given goal, measured by the `fitness` function.

The population class is defined as

#### Constructor
`new Population(generators[], fitness(), [crossover()], [params], [population])`

| Param | Required | Type | Description |
|:-:|:-:|:-:|:-:|
|`generators` | true | Array of functions | Generators is an array of functions that return `new Gene(val)` | 
| `fitness` | true | Fitness function | Returns number, takes array of `Gene`s as only argument | 
| `crossover` | false | Crossover function  | Returns list of new `Gene`s, takes `(parent1_genes, parent2_genes, generators, mutation_rate)`|
| `params` | false | Params Object | Contains `{mutation_rate:0.05, maxpop:100}` |

#### Methods

##### `.fit()`
Executes fitting of all `Genome`s in population

##### `.breed(was_fit)`
Breeds and returns new pre-filled `Population`.
`was_fit` is a boolean that specifies if the `Population` was already fit, or needs fitting. Default is `false`;

##### `.auto(pheno(), target, [max_generations], [gen_callback)`
Automatically breeds populations until one reaches the given target.

| Param | Required | Type | Description |
|:-:|:-:|:-:|:-:|
|`pheno` | true | Phenotype function or `false` | Function that takes list of `Gene`s and returns some comparable/human-redable value  | 
| `target` | true | Comparable value (number/string) or Object | Used to compare population `Phenotypes` or object `{target: <VAL>, compare: function(phenotype){return <bool>}}` | 
| `max_generations` | false | Number  | Maximum number of generations before giving up. Default is 1000|
| `gen_callback` | false | Function | Called every time a new generation is bred. Takes `{current_population, max_fitness, generation_number}` as only argument |

### `Genome`

A `Genome` is practially the same thing as an Individual. It is composed of a list of `Genes`.

#### Constructor
`new Genome(genes=[], fitness, crossover, mutation)`

#### Methods

##### `.fit()`
Fits the `Genome` using fitness function given in constructor or `Population`.

##### `.crossover(genome2, generators)`
Crosses over curernt `Genome` with given `Genome` using given `crossover` in
constructor or `Population`. Using `mutation_rate` randomly decides to add 
a random mutation to genes using given `generators`.

##### `.pheno(fct)`
Renders phenotype using given `Pheno` function.

### `Gene`
A gene is the basic component of a `Genome`.

#### Constructor
`new Gene(value, type=null)`

| Param | Required | Type | Description |
|:-:|:-:|:-:|:-:|
|`value` | true | Value or Function| Value used by the gene or returned by the gene when needed | 
| `type` | false | String | 'dominant' or 'recessive' |

#### Methods

##### `.value()`
Returns value for gene. If function, executes and returns result.