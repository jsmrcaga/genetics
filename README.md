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
let Genetics = require('genetix'');

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

```

`fitness` takes as argument the genes of every `Genome` and expects a number as output.

## Concepts
