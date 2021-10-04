 

createFilterstatus =  async (currentStatus, collection) =>{
    const currentModel = require(__path_schemas + '/' + collection);
    statusFilter =[
        {name:'All' ,       value: 'All' ,      count: 0 ,  class:'default'},
        {name:'Active' ,    value: 'Active' ,   count: 0 ,   class:"default"},
        {name:'Inactive' ,  value: 'Inactive' , count: 0 ,   class:"default"} 
    ];
    // statusFilter.forEach( (data ,index) =>{ // async  await khong ap dung dc cho forEach
    //     let condition ={};
    //     if(data.value !=='All')
    //         condition ={status : data.value};
    //     itemsModel.countDocuments(condition)
    //             .then(data1 => {
    //             statusFilter[index].count = data1
    //     })           
    //     if(data.value ===currentStatus)
    //         statusFilter[index].class = 'success';
    // })
    // return statusFilter;

    for(let index = 0; index < statusFilter.length; index++) {
		let data = statusFilter[index];
		let condition = (data.value !== "All") ? {status: data.value} : {};
		if(data.value === currentStatus) statusFilter[index].class = 'success';

		await currentModel.countDocuments(condition).then( (data1) => {
			statusFilter[index].count = data1;
		});
	}


    return statusFilter;

}
module.exports ={
    createFilterstatus 
}