import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import transporator from '../config/emailConfig.js';

class UserController {
    static userRegistartion = async (req, res) => {
        try {
            const { name, email, password, password_confirmation, tc } = req.body;
            const user = await User.findOne({ email: email });
            if (user) {
                res.status(500).json({
                    "message": "Email already exists!!"
                });
            } else {
                if (name && email && password && password_confirmation && tc) {
                    if (password === password_confirmation) {
                        const salt = await bcrypt.genSalt(10);
                        const hashPassowrd = await bcrypt.hash(password, salt);
                        const newUser = new User({
                            name: name,
                            email: email,
                            password: hashPassowrd,
                            tc: tc
                        });
                        await newUser.save();
                        const saved_user = await User.findOne({ email: email });
                        //generate token 
                        const token = jwt.sign({ userId: saved_user._id },
                            process.env.JWT_SECRET_KEY, {
                            expiresIn: '3h'
                        });

                        res.status(201).json({
                            data: newUser,
                            token: token,
                            "message": "User Insterd was success!"
                        })
                    } else {
                        res.status(500).json({
                            "message": "password and confirm password doesn't match"
                        });
                    }
                } else {
                    res.status(500).json({
                        "message": "All fields are required!!"
                    });
                }
            }

        } catch (err) {
            console.log(err);
        }
    };


    static userLogin = async (req, res) => {
        try {
            const { email, password } = req.body;
            if (email && password) {
                const user = await User.findOne({ email: email });
                if (user !== null) {
                    const isMatch = await bcrypt.compare(password, user.password);
                    if ((user.email === email) && isMatch) {
                        //gnarate token 
                        const token = jwt.sign({ userId: user._id },
                            process.env.JWT_SECRET_KEY, {
                            expiresIn: '3h'
                        });

                        res.status(200).json({
                            "message": "Login success!!",
                            "token": token
                        })
                    } else {
                        res.status(400).json({
                            "message": "email or password incorrect!!"
                        })
                    }

                } else {
                    res.status(404).json({
                        "message": "User not found!!"
                    })

                }
            } else {
                res.status(400).json({
                    "message": "All feild are required!!"
                })
            }

        } catch (err) {
            console.log(err);
            res.status(500).json({
                error: err,
                "message": "Server side error"
            })
        }
    };

    static changeUserPassword = async (req, res) => {
        try {
            const { password, confirm_password } = req.body;
            if (password && confirm_password) {
                if (password !== confirm_password) {
                    res.status(400).json({
                        "message": "New password and confirm password doesn't match!!"
                    })
                } else {
                    const salt = await bcrypt.genSalt(10);
                    const newHasPassword = await bcrypt.hash(password, salt);
                    await User.findByIdAndUpdate(req.user._id, {
                        $set: {
                            password: newHasPassword
                        }
                    })
                    res.status(200).json({
                        "message": "Success"
                    })
                }

            } else {
                res.status(400).json({
                    "message": "All field is required"
                })
            }
        } catch (err) {
            console.log(err);
        }
    };

    static loggedUser = async (req, res) => {
        res.json({ 'user': req.user })
    };

    static logoutUser = async (req, res) => {
        res.json({ 'user': req.user })
    };


    static sendUserPasswordRestEmail = async (req, res) => {
        const { email } = req.body;
        if (email) {
            const user = await User.findOne({ email: email });
            // console.log(user);
            if (user) {
                const secret = user._id + process.env.JWT_SECRET_KEY;
                let token = jwt.sign({ userId: user._id }, secret, {
                    expiresIn: '10m'
                });
                const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
                let info = await transporator.sendMail({
                    from: process.env.EMAIL_FROM,
                    to: user.email,
                    subject: "Password Reset Link",
                    html: `<a href=${link}>Click Here</a> to Reset Your Password`
                })

                res.status(200).json({
                    "status": "success!",
                    "messsage": "password rest email sent ....please check email",
                     "info": info
                })
            } else {
                res.status(500).json({
                    "message": "Email doesn't exists!"
                })
            }

        } else {
            res.status(500).json({
                "message": "Email field is required!"
            })
        }
    };


    static userPasswordRest = async (req, res) => {
        const { password, password_confirmation } = req.body;
        const { id, token } = req.params;
        const user = await User.findById(id);
        const new_secret = user._id + process.env.JWT_SECRET_KEY;
        try {
            jwt.verify(token, new_secret);
            if (password && password_confirmation) {
                if (password !== password_confirmation) {
                    res.status(500).json({
                        "message": "password and confirm password doesn't match"
                    });
                } else {
                    const salt = await bcrypt.genSalt(10);
                    const newHashPassowrd = await bcrypt.hash(password, salt);

                    await User.findByIdAndUpdate(user._id, {
                        $set: {
                            password: newHashPassowrd
                        }
                    });
                    res.status(500).json({
                        "message": "Password update successfully!!"
                    });
                }

            } else {
                res.status(500).json({
                    "message": "All field are required"
                });
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({
                "message": "Invalid token"
            })
        }

    }


}



export default UserController;