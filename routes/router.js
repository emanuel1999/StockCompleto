const express = require('express')
const router = express.Router()
const conexion = require('../database/db')
const authController = require('../controllers/authController')
const PDF =require('pdfkit-construct');
const {authPage}=require ('../middlewares/middlewares');
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
router.get('/create',authController.isAuthenticated, (req,res)=>{
    res.render('create');
})
router.post('/save',authController.save);
router.post('/update',authController.update);
//editar
router.get('/edit/:id',authController.isAuthenticated, (req,res)=>{
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
        res.render('orden',{libros:results[0]});
    }
    })
})
//eliminar 
router.get('/delete/:id',authController.isAuthenticated,(req,res)=>{
    const id=req.params.id;
            conexion.query('DELETE FROM libros WHERE id=?', [id],(error,results)=>{
                if(error){
                    console.log(error);
                }else{ res.redirect('/');
                }
            })
         
        
      });
   


router.get('/get-factura-pedido/:id',authController.getFacturaPedido);
//router.get('/permisos')

module.exports = router