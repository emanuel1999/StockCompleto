let filter= document.getElementById('filter');

const baseUrl= 'http://localhost:3000/dt/';
function filtrar(er){
filter.addEventListener('change',()=>{
   let fil=`${er.value}`;
   console.log (fil);
    location.href=baseUrl+fil
    
    
})
}
filtrar(filter);

$(document).ready( function () {
    $('#myTable').DataTable();
} );
