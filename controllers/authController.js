const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const {promisify} = require('util')
const PDF =require('pdfkit-construct');
const exp = require('constants');


//procedimiento para registrarnos
exports.register = async (req, res)=>{    
    try {
        const name = req.body.name
        const user = req.body.user
        const pass = req.body.pass
        let passHash = await bcryptjs.hash(pass, 8)    
        //console.log(passHash)   
        conexion.query('INSERT INTO users SET ?', {user:user, name: name, pass:passHash}, (error, results)=>{
            if(error){console.log(error)}
            res.redirect('/')
        })
    } catch (error) {
        console.log(error)
    }       
}

exports.login = async (req, res)=>{
    try {
        const user = req.body.user
        const pass = req.body.pass        

        if(!user || !pass ){
            res.render('login',{
                alert:true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y password",
                alertIcon:'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            })
        }else{
            conexion.query('SELECT * FROM users WHERE user = ?', [user], async (error, results)=>{
                if( results.length == 0 || ! (await bcryptjs.compare(pass, results[0].pass)) ){
                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o Password incorrectas",
                        alertIcon:'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'    
                    })
                }else{
                    //inicio de sesión OK
                    const id = results[0].id
                    const token = jwt.sign({id:id}, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    })
                    //generamos el token SIN fecha de expiracion
                   //const token = jwt.sign({id: id}, process.env.JWT_SECRETO)
                   console.log("TOKEN: "+token+" para el USUARIO : "+user)

                   const cookiesOptions = {
                        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                   }
                   res.cookie('jwt', token, cookiesOptions)
                   res.render('login', {
                        alert: true,
                        alertTitle: "Conexión exitosa",
                        alertMessage: "¡LOGIN CORRECTO!",
                        alertIcon:'success',
                        showConfirmButton: false,
                        timer: 800,
                        ruta: ''
                   })
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}

exports.isAuthenticated = async (req, res, next)=>{
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            await conexion.query('SELECT * FROM users WHERE id = ?', [decodificada.id], (error, results)=>{
                if(!results){return next()}
                req.user = results[0]
                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    }else{
        res.redirect('/login')        
    }
}
exports.isAdmin= async(req,res,next)=>{
    if(req.cookies.jwt){
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            await conexion.query('SELECT * FROM users WHERE id = ?', [decodificada.id],(error,results)=>{
                role=results[0].rol
                if(role=="admin"){
                    next()
                }else{
                    
                    res.redirect("/");
                }
                
            })
        }catch{
            res.redirect("/");
        }
    }

}


exports.save= async (req,res)=>{
    const estado=req.body.estado;
    const editorial=req.body.editorial;
    const libro=req.body.libro;
    const fechaentrega=req.body.fechaentrega;
    const fechapentrega=req.body.fechapentrega;
    const pliego=req.body.pliego;
    const tirajeCondemasia=req.body.tirajeCondemasia;
    const tirajecliente=req.body.tirajecliente;
    const tirajeosa=req.body.tirajeosa;
    const tacocorte=req.body.tacocorte;
    const tamañopdf=req.body.tamañopdf;
    const prioridad=req.body.prioridad;
    const cerrado=req.body.cerrado;
    const paginatapa=req.body.paginatapa;
    const color=req.body.color;
    const up=req.body.up;
    const encuadernacion=req.body.encuadernacion;
    const solapa=req.body.solapa;
    const entregaarchivos=req.body.entregaarchivos;
    const tirada=req.body.tirada;
    const despachofinal=req.body.despachofinal;
    const pliegoop=req.body.pliegoop;
    const tipopapel=req.body.tipopapel;
    const hojas=req.body.hojas;
    const hojaskgcolores=req.body.hojaskgcolores;
    const pliegoop1=req.body.pliegoop1;
    const tipopapel1=req.body.tipopapel1;
    const hojaskgcolores1=req.body.hojaskgcolores1;
    const hoja1=req.body.hoja1;
    const acabadolibro=req.body.acabadolibro;
    const acabadotapa=req.body.acabadotapa;
    const descripcion=req.body.descripcion;
    const provedortapa=req.body.provedortapa; 
    const provedorinterior= req.body.provedorinterior;
    const volumentaco=req.body.volumentaco;
    const tipoimpresiontaco=req.body.tipoimpresiontaco;
    const estadoimpresion=req.body.estadoimpresion;
    const estadocorte=req.body.estadocorte;
    const estadotapa=req.body.estadotapa;
    const estadoencuadernado=req.body.estadoencuadernado;
    await conexion.query('INSERT INTO libros SET ?',{prioridad:prioridad,estado:estado,libro:libro,fechaentrega:fechaentrega,fechapentrega:fechapentrega,
    pliego:pliego,tirajeCondemasia,tirajecliente:tirajecliente,tirajeosa:tirajeosa,cerrado:cerrado,paginatapa:paginatapa,color:color,
    up:up,encuadernacion:encuadernacion,solapa:solapa,entregaarchivos:entregaarchivos,tirada:tirada,despachofinal:despachofinal,pliegoop:pliegoop,
    tipopapel:tipopapel,hojas:hojas,hojaskgcolores:hojaskgcolores,pliegoop1:pliegoop1,tipopapel1:tipopapel1,hojaskgcolores1:hojaskgcolores1,hoja1:hoja1,
    acabadolibro:acabadolibro,acabadotapa:acabadotapa,descripcion:descripcion,editorial:editorial,tacocorte:tacocorte,tamañopdf:tamañopdf,
    provedortapa:provedortapa,provedorinterior:provedorinterior,volumentaco:volumentaco,tipoimpresiontaco:tipoimpresiontaco,estadoimpresion:estadoimpresion,
    estadocorte:estadocorte,estadotapa:estadotapa,estadoencuadernado:estadoencuadernado}, (error, results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/');
        }            
    });
}
exports.update= async(req,res)=>{
    const id=req.body.id;
    const estado=req.body.estado;
    const editorial=req.body.editorial;
    const libro=req.body.libro;
    const fechaentrega=req.body.fechaentrega;
    const fechapentrega=req.body.fechapentrega;
    const pliego=req.body.pliego;
    const tirajeCondemasia=req.body.tirajeCondemasia;
    const tirajecliente=req.body.tirajecliente;
    const tirajeosa=req.body.tirajeosa;
    const tacocorte=req.body.tacocorte;
    const tamañopdf=req.body.tamañopdf;
    const prioridad=req.body.prioridad;
    const cerrado=req.body.cerrado;
    const paginatapa=req.body.paginatapa;
    const color=req.body.color;
    const up=req.body.up;
    const encuadernacion=req.body.encuadernacion;
    const solapa=req.body.solapa;
    const entregaarchivos=req.body.entregaarchivos;
    const tirada=req.body.tirada;
    const despachofinal=req.body.despachofinal;
    const pliegoop=req.body.pliegoop;
    const tipopapel=req.body.tipopapel;
    const hojas=req.body.hojas;
    const hojaskgcolores=req.body.hojaskgcolores;
    const pliegoop1=req.body.pliegoop1;
    const tipopapel1=req.body.tipopapel1;
    const hojaskgcolores1=req.body.hojaskgcolores1;
    const hoja1=req.body.hoja1;
    const acabadolibro=req.body.acabadolibro;
    const acabadotapa=req.body.acabadotapa;
    const descripcion=req.body.descripcion;   
    const provedortapa=req.body.provedortapa; 
    const provedorinterior= req.body.provedorinterior;
    const volumentaco=req.body.volumentaco;
    const tipoimpresiontaco=req.body.tipoimpresiontaco;
    const estadoimpresion=req.body.estadoimpresion;
    const estadocorte=req.body.estadocorte;
    const estadotapa=req.body.estadotapa;
    const estadoencuadernado=req.body.estadoencuadernado;
    await conexion.query('UPDATE libros SET ? WHERE id= ?',[{prioridad:prioridad,estado:estado,libro:libro,fechaentrega:fechaentrega,fechapentrega:fechapentrega,
        pliego:pliego,tirajeCondemasia,tirajecliente:tirajecliente,tirajeosa:tirajeosa,cerrado:cerrado,paginatapa:paginatapa,color:color,
        up:up,encuadernacion:encuadernacion,solapa:solapa,entregaarchivos:entregaarchivos,tirada:tirada,despachofinal:despachofinal,pliegoop:pliegoop,
        tipopapel:tipopapel,hojas:hojas,hojaskgcolores:hojaskgcolores,pliegoop1:pliegoop1,tipopapel1:tipopapel1,hojaskgcolores1:hojaskgcolores1,hoja1:hoja1,
        acabadolibro:acabadolibro,acabadotapa:acabadotapa,descripcion:descripcion,editorial:editorial,tacocorte:tacocorte,tamañopdf:tamañopdf,provedortapa:provedortapa,
        provedorinterior:provedorinterior,volumentaco:volumentaco,tipoimpresiontaco:tipoimpresiontaco,estadoimpresion:estadoimpresion,estadocorte:estadocorte,
        estadotapa:estadotapa,estadoencuadernado:estadoencuadernado}, id],(error, results)=>{
            if(error){
                console.log(error);
            }else {
                res.redirect('/');
            }
        })
}
exports.updateEstadoIm=(req,res)=>{
    const id=req.body.id;
    const estadoimpresion=req.body.estadoimpresion;
    conexion.query('UPDATE libros SET ? WHERE id= ?',[{estadoimpresion:estadoimpresion}, id],(error, results)=>{
            if(error){
                console.log(error);
            }else {
                res.redirect('/impresion');
            }
        })
}
exports.updateEstadoCo=(req,res)=>{
    const id=req.body.id;
    const estadocorte=req.body.estadocorte;
    conexion.query('UPDATE libros SET ? WHERE id= ?',[{estadocorte:estadocorte}, id],(error, results)=>{
            if(error){
                console.log(error);
            }else {
                res.redirect('/corte');
            }
        })
}
exports.saveRep=async(req,res)=>{
    const fecha=req.body.fecha;
    const turno=req.body.turno;
    const libro=req.body.libro;
    const libro1=req.body.libro1;
    const libro2=req.body.libro2;
    const trilateral=req.body.trilateral;
    const laminado=req.body.laminado;
    const guillotinado=req.body.guillotinado;
    const encuadernado=req.body.encuadernado;
    const observaciones=req.body.observaciones;
    await conexion.query('INSERT INTO reportes SET ?',{fecha:fecha,turno:turno,libro:libro,trilateral:trilateral,
    laminado:laminado,guillotinado:guillotinado,encuadernado:encuadernado,observaciones:observaciones,libro1:libro1,libro2:libro2}, (error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/reportes');
        }  

    })

}


exports.updateEstadoTa=(req,res)=>{
    const id=req.body.id;
    const estadotapa=req.body.estadotapa;
    conexion.query('UPDATE libros SET ? WHERE id= ?',[{estadotapa:estadotapa}, id],(error, results)=>{
            if(error){
                console.log(error);
            }else {
                res.redirect('/tapa');
            }
        })
}
exports.updateEncuadernado=(req,res)=>{
    const id=req.body.id;
    const estadoencuadernado=req.body.estadoencuadernado;
    conexion.query('UPDATE libros SET ? WHERE id= ?',[{estadoencuadernado:estadoencuadernado}, id],(error, results)=>{
            if(error){
                console.log(error);
            }else {
                res.redirect('/tapa');
            }
        })
}
exports.logout = (req, res)=>{
    res.clearCookie('jwt')   
    return res.redirect('/')
}


exports.getFacturaPedido= async (req,res)=>{
    const id=req.params.id;
     conexion.query('SELECT * FROM libros WHERE id= ?', [id],(error,results)=>{
        if(error){
            console.log(error);
        }else{ 
     
        libro=results[0]['libro'];
        tirajeCondemasia=results[0]['tirajeCondemasia'];
        solapa=results[0]['solapa'];
        editorial=results[0]['editorial'];    
        hojas= results[0]['hojas'];   
        hoja1= results[0]['hoja1'];  
        tipopapel=results[0]['tipopapel'];
        tipopapel1=results[0]['tipopapel1'];
        tirajecliente=results[0]['tirajecliente'];  
        tirajeosa= results[0]['tirajeosa'];   
        acabadolibro= results[0]['acabadolibro'];
        acabadotapa= results[0]['acabadotapa']; 
        hojaskgcolores= results[0]['hojaskgcolores'];
        hojaskgcolores1= results[0]['hojaskgcolores1'];
        fechaentrega= results[0]['fechaentrega'];    
        provedortapa= results[0]['provedortapa']; 
        provedorinterior= results[0]['provedorinterior'];
        cerrado=results[0]['cerrado'];
        tacocorte=results[0]['tacocorte'];
        tamañopdf=results[0]['tamañopdf'];
             
    const doc = new PDF ({bufferPage:true});
    const filename= `Factura${Date.now()}.pdf `;
    

    const stream= res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-disposition': 'attachament;filename='+libro+'.pdf' 

    });
    doc.on('data', (data)=>{stream.write(data)});
    doc.on('end', ()=>{stream.end()});
    //doc.pipe(fs.createWriteStream('factura.pdf'));
    
    
    
    
   
    //agregando tablas
   
    const height = doc.currentLineHeight();

    doc.setDocumentHeader({}, ()=>{
        
    
    doc.fill("#FF0000")
    .fontSize(16)
    .moveDown(-2).text('RICOH Argentina')
    .moveDown(0).fontSize(6).text('by INGENIERIA DE PLANTA')
    .moveDown(1).fontSize(18).text('Tiraje Para EL Cliente: '+ tirajecliente + ''+'  Tiraje Para OSA: ' + tirajeosa)
    

    })
    
    const editorial1=[{
        
        libro:libro,
        tirajeCondemasia:tirajeCondemasia,
        solapa:solapa,
        cerrado:cerrado,
        fechaentrega:fechaentrega,
        editorial:editorial,
        hoja1:hoja1,
        tipopapel1:tipopapel1 ,
        hojaskgcolores1:hojaskgcolores1,
        acabadotapa:acabadotapa,
        hojas:hojas,
        acabadolibro:acabadolibro,
        tacocorte:tacocorte,
        tamañopdf:tamañopdf,
        tipopapel:tipopapel,
        provedortapa:provedortapa,
        provedorinterior:provedortapa,
        tirajecliente:tirajecliente,
        tirajeosa:tirajeosa
    }
    ]
    doc.addTable([
        {key: 'libro', label:'Orden de trabajo: Titulo ', align: 'center'},
        {key: 'editorial', label:'Editorial', align: 'center'},
        
        
    ],editorial1,{
        border: {size: 1, color: '#000000'},
        width: "fill_body",
        //striped: true,
        stripedColors: ["#cdcdcd"],
        cellsPadding: 12,
        cellsFontSize : 10,
        marginLeft: 12,
        marginRight: 12,
        headAlign: 'center'
    }); 
   
    doc.addTable([
        {key: 'tirajeCondemasia', label:'Tirada', align: 'center'},
        {key: 'solapa', label:'Solapa', align: 'center'},
        {key: 'cerrado', label:'Tamaño Final', align: 'center'},
        {key: 'fechaentrega', label:'Fecha de entrega', align: 'center'},
        
    ],editorial1,{
        border: {size: 1, color: '#000000'},
        width: "fill_body",
        //striped: true,
        stripedColors: ["#cdcdcd"],
        cellsPadding: 12,
        cellsFontSize : 10,
        marginLeft: 12,
        marginRight: 12,
        headAlign: 'center'
    }); 
    //tapa
    doc.addTable([
        
        {key: 'tirajeCondemasia', label:'Seccion Tapa', align: 'center'},
        {key: 'tipopapel1',label:'Tipo Papel ',align:'center'},
        {key: 'hoja1',label:'Tamaño De Resma y Gramaje',align:'center'},
        {key: 'acabadotapa',label:'Acabado De Laminado',align:'center'},
        
    ],editorial1,{
        border: {size: 1, color: '#000000'},
        width: "fill_body",
        //striped: true,
        stripedColors: ["#cdcdcd"],
        cellsPadding: 12,
        cellsFontSize : 10,
        marginLeft: 12,
        marginRight: 12,
        headAlign: 'center'
    });
    //interior
    doc.fontSize(20).addTable([
        
        {key: 't3', label:'Seccion Taco', align: 'center'},
        {key: 'tipopapel',label:'Tipo Papel ',align:'center'},
        {key: 'hojas',label:'Tamaño Bobina y Gramaje',align:'center'},
        {key: 'tamañopdf',label:'Tamaño PDF',align:'center'},
        {key: 'tacocorte',label:'Taco Corte ',align:'center'},
        
        
    ],editorial1,{
        border: {size: 1, color: '#000000'},
        width: "fill_body",
        //striped: true,
        stripedColors: ["#cdcdcd"],
        cellsPadding: 20,
        cellsFontSize : 12,
        marginLeft: 12,
        marginRight: 12,
        headAlign: 'center'
    });
//provedores y acabado 
doc.fontSize(20).addTable([
        
    
    {key: 'acabadolibro',label:'Acabado General',align:'center'},
    {key: 'provedortapa', label:'Provedor Tapa', align: 'center'},
    {key: 'provedorinterior',label:'Provedor Taco ',align:'center'},
    
    
],editorial1,{
    border: {size: 1, color: '#000000'},
    width: "fill_body",
    //striped: true,
    stripedColors: ["#cdcdcd"],
    cellsPadding: 20,
    cellsFontSize : 12,
    marginLeft: 12,
    marginRight: 12,
    headAlign: 'center'
});



    doc.render();

    doc.end();
}  
})
    

}
