import express from "express";;
import UserController from "../controllers/userController.js";
import checkUserAuth from '../middlewares/auth.js';

const route = express.Router();

//Route level middelware - to protect route
route.use('/changepassword', checkUserAuth);
route.use('/loggeduser',checkUserAuth);

//public routes
route.post('/register', UserController.userRegistartion);
route.post('/login', UserController.userLogin);
route.post('/send-rest-password-email', UserController.sendUserPasswordRestEmail);
route.post('/rest-password/:id/:token', UserController.userPasswordRest);


//protected routes
route.post('/changepassword', UserController.changeUserPassword);
route.get('/loggeduser', UserController.loggedUser);



export default route;