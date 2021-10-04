
let getParam = (params, property, valueDefault) =>{
    if(params.hasOwnProperty(property) &&  params[property] !== undefined)
        return params[property];
        return valueDefault;
}
module.exports ={
    getParam
}