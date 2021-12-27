let filter= document.getElementById('papel');
let filter1= document.getElementById('provedor');
const baseUrl= 'http://localhost:3000/createConsumoSup/';
function filtrar(er, er1){

    filter.addEventListener('change',()=>{
    filter1.addEventListener('change',()=>{
         let fil=`${er.value}`;
           let filter1=`${er1.value}`;
         console.log (fil);
         location.href=baseUrl+fil+","+filter1
    
})    
})
}
filtrar(filter,filter1);


