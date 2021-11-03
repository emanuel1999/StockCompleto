const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const {promisify} = require('util')
const PDF =require('pdfkit-construct');


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
            conexion.query('SELECT * FROM users WHERE id = ?', [decodificada.id], (error, results)=>{
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
exports.save= (req,res)=>{
    const estado=req.body.estado;
    const libro=req.body.libro;
    const fechaentrega=req.body.fechaentrega;
    const fechapentrega=req.body.fechapentrega;
    const pliego=req.body.pliego;
    const tirajeCondemasia=req.body.tirajeCondemasia;
    const tirajecliente=req.body.tirajecliente;
    const tirajeosa=req.body.tirajeosa;
    const prioridad=req.body.prioridad;
    const cerrado=req.body.cerrado;
    const abierto=req.body.abierto;
    const paginatapa=req.body.paginatapa;
    const color=req.body.color;
    const up=req.body.up;
    const encuadernacion=req.body.encuadernacion;
    const solapa=req.body.solapa;
    const refile=req.body.refile;
    const embolsado=req.body.embolsado;
    const entrega=req.body.entrega;
    const palletizado=req.body.palletizado;
    const entregaarchivos=req.body.entregaarchivos;
    const cierrearchivo=req.body.cierrearchivo;
    const tirada=req.body.tirada;
    const despachofinal=req.body.despachofinal;
    const pliegoop=req.body.pliegoop;
    const numpliego=req.body.numpliego;
    const tipopapel=req.body.tipopapel;
    const hojas=req.body.hojas;
    const hojaskgcolores=req.body.hojaskgcolores;
    const pliegoop1=req.body.pliegoop1;
    const numpliego1=req.body.numpliego1;
    const tipopapel1=req.body.tipopapel1;
    const hojaskgcolores1=req.body.hojaskgcolores1;
    const hoja1=req.body.hoja1;
    const nip=req.body.nip;
    const acabadolibro=req.body.acabadolibro;
    const acabadotapa=req.body.acabadotapa;
    const descripcion=req.body.descripcion;
    const tiradaejemplares=req.body.tiradaejemplares;
    conexion.query('INSERT INTO libros SET ?',{prioridad:prioridad,estado:estado,libro:libro,fechaentrega:fechaentrega,fechapentrega:fechapentrega,
    pliego:pliego,tirajeCondemasia,tirajecliente:tirajecliente,tirajeosa:tirajeosa,cerrado:cerrado,abierto:abierto,paginatapa:paginatapa,color:color,
    up:up,encuadernacion:encuadernacion,solapa:solapa,refile:refile,embolsado:embolsado,entrega:entrega,palletizado:palletizado,entregaarchivos:entregaarchivos,
    cierrearchivo:cierrearchivo,tirada:tirada,despachofinal:despachofinal,pliegoop:pliegoop,numpliego:numpliego,tipopapel:tipopapel,hojas:hojas,hojaskgcolores:hojaskgcolores,
    pliegoop1:pliegoop1,numpliego1:numpliego1,tipopapel1:tipopapel1,hojaskgcolores1:hojaskgcolores1,hoja1:hoja1,nip:nip,acabadolibro:acabadolibro,acabadotapa:acabadotapa,descripcion:descripcion,tiradaejemplares:tiradaejemplares}, (error, results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/');
        }            
    });
}
exports.update=(req,res)=>{
    const id=req.body.id;
    const estado=req.body.estado;
    const libro=req.body.libro;
    const fechaentrega=req.body.fechaentrega;
    const fechapentrega=req.body.fechapentrega;
    const pliego=req.body.pliego;
    const tirajeCondemasia=req.body.tirajeCondemasia;
    const tirajecliente=req.body.tirajecliente;
    const tirajeosa=req.body.tirajeosa;
    const prioridad=req.body.prioridad;
    const cerrado=req.body.cerrado;
    const abierto=req.body.abierto;
    const paginatapa=req.body.paginatapa;
    const color=req.body.color;
    const up=req.body.up;
    const encuadernacion=req.body.encuadernacion;
    const solapa=req.body.solapa;
    const refile=req.body.refile;
    const embolsado=req.body.embolsado;
    const entrega=req.body.entrega;
    const palletizado=req.body.palletizado;
    const entregaarchivos=req.body.entregaarchivos;
    const cierrearchivo=req.body.cierrearchivo;
    const tirada=req.body.tirada;
    const despachofinal=req.body.despachofinal;
    const pliegoop=req.body.pliegoop;
    const numpliego=req.body.numpliego;
    const tipopapel=req.body.tipopapel;
    const hojas=req.body.hojas;
    const hojaskgcolores=req.body.hojaskgcolores;
    const pliegoop1=req.body.pliegoop1;
    const numpliego1=req.body.numpliego1;
    const tipopapel1=req.body.tipopapel1;
    const hojaskgcolores1=req.body.hojaskgcolores1;
    const hoja1=req.body.hoja1;
    const nip=req.body.nip;
    const acabadolibro=req.body.acabadolibro;
    const acabadotapa=req.body.acabadotapa;
    const descripcion=req.body.descripcion;
    const tiradaejemplares=req.body.tiradaejemplares;    
    conexion.query('UPDATE libros SET ? WHERE id= ?',[{prioridad:prioridad,estado:estado,libro:libro,fechaentrega:fechaentrega,fechapentrega:fechapentrega,
        pliego:pliego,tirajeCondemasia,tirajecliente:tirajecliente,tirajeosa:tirajeosa,cerrado:cerrado,abierto:abierto,paginatapa:paginatapa,color:color,
        up:up,encuadernacion:encuadernacion,solapa:solapa,refile:refile,embolsado:embolsado,entrega:entrega,palletizado:palletizado,entregaarchivos:entregaarchivos,
        cierrearchivo:cierrearchivo,tirada:tirada,despachofinal:despachofinal,pliegoop:pliegoop,numpliego:numpliego,tipopapel:tipopapel,hojas:hojas,hojaskgcolores:hojaskgcolores,
        pliegoop1:pliegoop1,numpliego1:numpliego1,tipopapel1:tipopapel1,hojaskgcolores1:hojaskgcolores1,hoja1:hoja1,nip:nip,acabadolibro:acabadolibro,acabadotapa:acabadotapa,descripcion:descripcion,tiradaejemplares:tiradaejemplares}, id],(error, results)=>{
            if(error){
                console.log(error);
            }else {
                res.redirect('/');
            }
        })
}
exports.logout = (req, res)=>{
    res.clearCookie('jwt')   
    return res.redirect('/')
}

const pedido={};
pedido.findLibro= async (id) =>{
    return await conexion.query('SELECT * FROM libros WHERE id =?',[id]);
}

exports.getFacturaPedido= async (req,res)=>{

    let libros=await pedido.findLibro(req.params.id);

        libros=libros[0];
         
    
    
    
    const doc = new PDF ({bufferPage:true});
    const filename= `Factura${Date.now()}.pdf `;
    

    const stream= res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-disposition': `attachament;filename=${filename}` 

    });
    doc.on('data', (data)=>{stream.write(data)});
    doc.on('end', ()=>{stream.end()});
    //doc.pipe(fs.createWriteStream('factura.pdf'));
    
    doc.fontSize(12);
    
    doc.text('NRO: 123456',{
        width:420,
        align:'left'
    });
    //agregando tablas
    const platos=[
        {
            nro:1,
            descripcion:'charque',
            precio: 13.5,
            cantidad:37.5
        }
    ]
    doc.text(`libros ${libros.libro}`);
    doc.addTable([
        {key: 'nro', label:'Nro', align: 'left'},
        {key: 'descripcion', label:'Nro', align: 'left'},
        {key: 'precio', label:'Precio Unit', align: 'left'},
        {key: 'cantidad', label:'Cantidad', align: 'left'},
        {key: 'subtotal', label:'Sub Total', align: 'right'},
    ],platos,{
        border: null,
        width: "fill_body",
        striped: true,
        stripedColors: ["#f6f6f6", "#d6c4dd"],
        cellsPadding: 10,
        marginLeft: 45,
        marginRight: 45,
        headAlign: 'center'
    });

    doc.render();

    doc.end();

}
