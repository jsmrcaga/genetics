class Gene {
	constructor(value, type=null){
		if(type && type !== 'recessive' && type !== 'dominant'){
			type = 'recessive';
		}

		this.__value = value;
		this.__type = type;
	}

	value(){
		if(this.__value instanceof Function){
			return this.__value();
		}
		return this.__value;
	}
}

Gene.values = function(genes){
	return genes.map(e => {
		return e.value();
	});
};

module.exports = Gene;