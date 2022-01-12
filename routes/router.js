const express = require('express')
const router = express.Router()
const conexion = require('../database/db')
const authController = require('../controllers/authController')
const PDF =require('pdfkit-construct');
const { Router } = require('express');

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
router.post('/save',authController.isAuthenticated,authController.isAdmin,authController.sendMail,authController.save);
router.post('/saveRep',authController.isAuthenticated,authController.isAdmin,authController.saveRep);
router.post('/update',authController.isAuthenticated,authController.isAdmin,authController.update);
router.post('/updateImpresion',authController.isAuthenticated,authController.updateEstadoIm);
router.post('/updateCorte',authController.isAuthenticated,authController.updateEstadoCo);
router.post('/updateTapa',authController.isAuthenticated,authController.updateEstadoTa);
router.post('/updateEncuadernado',authController.isAuthenticated,authController.updateEncuadernado);
router.post('/savePapeles',authController.isAuthenticated, authController.savePapeles);
router.post('/updateConsumo',authController.isAuthenticated, authController.updateConsumo);
router.post('/saveConsumoSup',authController.isAuthenticated, authController.saveConsumoSup);
//editar
router.get('/edit/:id',authController.isAuthenticated,authController.isAdmin, async (req,res)=>{
    const id= req.params.id;
    await conexion.query('SELECT * FROM libros WHERE id=?',[id], (error,results)=>{
        if(error){
         throw error;
    }else{
        res.render('edit',{libros:results[0]});
    }
    })
})
router.get('/orden/:id',authController.isAuthenticated, async (req,res)=>{
    const id= req.params.id;
    await conexion.query('SELECT * FROM libros WHERE id=?',[id], (error,results)=>{
        if(error){
         throw error;
    }else{
       res.render('orden',{libros:results[0]});
    }
    })
})
//eliminar 
router.get('/delete/:id',authController.isAuthenticated,authController.isAdmin,async (req,res)=>{
    const id=req.params.id;
         await  conexion.query('DELETE FROM libros WHERE id=?', [id],(error,results)=>{
                if(error){
                    console.log(error);
                }else{ res.redirect('/');
                }
            })
         
        
      });
router.get('/impresion', authController.isAuthenticated, async (req, res)=>{    
    //res.render('index', {user:req.user});
    
    await conexion.query('SELECT * FROM libros ORDER BY prioridad',(error,results)=>{
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
router.get('/tapa', authController.isAuthenticated, (req, res)=>{    
    //res.render('index', {user:req.user});
    
    conexion.query('SELECT * FROM libros ORDER BY prioridad',(error,results)=>{
        if(error){
            console.log(error);
        }else{
            
            res.render('tapa',{results:results, user:req.user});
        }
    })
})  
router.get('/editTapa/:id',authController.isAuthenticated, (req,res)=>{
    const id= req.params.id;
    conexion.query('SELECT * FROM libros WHERE id=?',[id], (error,results)=>{
        if(error){
         throw error;
    }else{
        res.render('editTapa',{libros:results[0]});
    }
    })
})
router.get('/:edit,esta:,lib:', authController.isAuthenticated, (req,res,next)=>{
    const editorial=req.body.edi;
    const estado =req.body.esta;
    const libro=req.body.lib;
    
        conexion.query('SELECT * FROM libros WHERE editorial =?',[editorial],(error,results)=>{
            if(error){res.redirect('/')}
            else{
                res.render('index',{results:results,user:req.user})
                
            }
        })
    
     
})

router.get('/reportes',authController.isAuthenticated,(req,res)=>{

     conexion.query('SELECT * FROM reportes ORDER BY fecha',(error,results)=>{

        if(error){res.redirect('/')}
        else{
            res.render('reportes',{results:results, user:req.user});
        }
    })

})
router.get('/createReportes',authController.isAuthenticated,authController.isAdmin, (req,res)=>{

     conexion.query('SELECT pliegoop FROM libros ',(error,results)=>{

        if(error){res.redirect('/')}
        else{
            res.render('createReportes',{results:results, user:req.user});
        }
    })

})

router.get('/encuadernado',authController.isAuthenticated, (req,res)=>{

    conexion.query('SELECT * FROM libros ORDER BY prioridad',(error,results)=>{
        if(error){
            console.log(error);
        }else{
            
            res.render('encuadernado',{results:results, user:req.user});
        }
    })
})
router.get('/todos',authController.isAuthenticated, (req,res)=>{

    conexion.query('SELECT * FROM libros ORDER BY prioridad',(error,results)=>{
        if(error){
            console.log(error);
        }else{
            
            res.render('todos',{results:results, user:req.user});
        }
    })
})


router.get("/papeles",authController.isAuthenticated, async (req,res)=>{
    await conexion.query('SELECT * FROM papeles',(error,results)=>{
        if(error){console.log(error);}
        else {res.render('papeles',{results:results, user:req.user})} ;
    
    })

})
router.get("/createPapel",authController.isAuthenticated,authController.isAdmin, async (req,res)=>{
    
        res.render("createPapel",{user:req.user});
    
})

router.get('/createConsumo/:id',authController.isAuthenticated,authController.isAdmin, (req,res)=>{
    const id= req.params.id;
         conexion.query('SELECT * FROM papeles WHERE id=?',[id], (error,results)=>{
        if(error){
         console.log(error) ;
    }else{
        res.render('createConsumo',{libros:results[0]});
    }
    })
})
router.get('/createConsumoSup',authController.isAuthenticated,authController.isAdmin, (req,res)=>{
  
    conexion.query('SELECT DISTINCT papel FROM papeles',(error,results)=>{

        if(error){res.redirect('/')}
        else{
         res.render('createConsumoSup',{libros:results, user:req.user});
        }
    })    

})
router.get('/createConsumoSup/:papel,:provedor',authController.isAuthenticated,authController.isAdmin, (req,res)=>{
    const papel=req.params.papel;
    const provedor=req.params.provedor;

    conexion.query('SELECT * FROM papeles WHERE papel=? and provedor=?',[papel,provedor],(error,results)=>{

       if(error){res.redirect('/')}
       else{
        res.render('createConsumoSup1',{libros:results, user:req.user});
       }
   })
   

})
router.get("/reportePapeles",authController.isAuthenticated, async (req,res)=>{
    await conexion.query('SELECT * FROM consumoPapel',(error,results)=>{
        if(error){console.log(error);}
        else {res.render('reportePapeles',{results:results, user:req.user})} ;
    
    })

})
module.exports = router