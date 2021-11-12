const express = require('express')
const router = express.Router()
const conexion = require('../database/db')
const authController = require('../controllers/authController')
const PDF =require('pdfkit-construct');

//router para las vistas
router.get('/', authController.isAuthenticated, (req, res)=>{    
    //res.render('index', {user:req.user});
    
    conexion.query('SELECT * FROM libros ORDER BY prioridad',(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.render('index',{results:results, user:req.user});
        }
    })
})

router.get('/login', (req, res)=>{
    res.render('login', {alert:false})
})
router.get('/register', (req, res)=>{
    res.render('register')
})


//router para los métodos del controller
router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/logout', authController.logout)

//editar borrar crear
router.get('/',authController.isAuthenticated, (req, res)=>{
    res.send('CONTACTO');
})

// creamos registros
router.get('/create',authController.isAuthenticated,authController.isAdmin, (req,res)=>{
    res.render('create');
})
router.post('/save',authController.isAuthenticated,authController.isAdmin,authController.save);
router.post('/update',authController.isAuthenticated,authController.isAdmin,authController.update);
router.post('/updateImpresion',authController.isAuthenticated,authController.updateEstadoIm);
router.post('/updateCorte',authController.isAuthenticated,authController.updateEstadoCo);
//editar
router.get('/edit/:id',authController.isAuthenticated,authController.isAdmin, (req,res)=>{
    const id= req.params.id;
    conexion.query('SELECT * FROM libros WHERE id=?',[id], (error,results)=>{
        if(error){
         throw error;
    }else{
        res.render('edit',{libros:results[0]});
    }
    })
})
router.get('/orden/:id',authController.isAuthenticated, (req,res)=>{
    const id= req.params.id;
    conexion.query('SELECT * FROM libros WHERE id=?',[id], (error,results)=>{
        if(error){
         throw error;
    }else{
        res.render('orden',{libros:results[0]});s
    }
    })
})
//eliminar 
router.get('/delete/:id',authController.isAuthenticated,authController.isAdmin,(req,res)=>{
    const id=req.params.id;
            conexion.query('DELETE FROM libros WHERE id=?', [id],(error,results)=>{
                if(error){
                    console.log(error);
                }else{ res.redirect('/');
                }
            })
         
        
      });
router.get('/impresion', authController.isAuthenticated, (req, res)=>{    
    //res.render('index', {user:req.user});
    
    conexion.query('SELECT * FROM libros ORDER BY prioridad',(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.render('impresion',{results:results, user:req.user});
        }
    })
})   
router.get('/editImpresion/:id',authController.isAuthenticated, (req,res)=>{
    const id= req.params.id;
    conexion.query('SELECT * FROM libros WHERE id=?',[id], (error,results)=>{
        if(error){
         throw error;
    }else{
        res.render('editImpresion',{libros:results[0]});
    }
    })
})

router.get('/corte', authController.isAuthenticated, (req, res)=>{    
    //res.render('index', {user:req.user});
    
    conexion.query('SELECT * FROM libros ORDER BY prioridad',(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.render('corte',{results:results, user:req.user});
        }
    })
})  
router.get('/editCorte/:id',authController.isAuthenticated, (req,res)=>{
    const id= req.params.id;
    conexion.query('SELECT * FROM libros WHERE id=?',[id], (error,results)=>{
        if(error){
         throw error;
    }else{
        res.render('editCorte',{libros:results[0]});
    }
    })
})
router.get('/get-factura-pedido/:id',authController.getFacturaPedido);


module.exports = router