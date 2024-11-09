import express from 'express';
import { Request, Response } from 'express';
import pool from '../database/db'

const authRouter = express.Router();

authRouter.get('/change-password', (req: Request, res: Response) => {
    res.sendFile(__dirname + "/html/change_password.html")
})

authRouter.post('/register', async (req: Request, res: Response) => {
    const { username, email, password, confirm_password } = req.body;

    if (!username) {
        res.status(400).json(
            {
                status_code: 400,
                message: 'username is required!'
            }
        );
        return
    }

    if (!email) {
        res.status(400).json(
            {
                status_code: 400,
                message: 'email is required!'
            }
        );
        return
    }

    if (!password) {
        res.status(400).json(
            {
                status_code: 400,
                message: 'password is required!'
            }
        );
        return
    }

    if (!confirm_password) {
        res.status(400).json(
            {
                status_code: 400,
                message: 'confirm_password is required!'
            }
        );
        return
    }

    if (password != confirm_password) {
        res.status(400).json(
            {
                status_code: 400,
                message: 'password and confirm password is not same!'
            }
        );
        return
    }

    const bcrypt = require("bcrypt");

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const emailResult = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        )

        if (emailResult.rowCount == 1) {
            res.status(400).json(
                {
                    status_code: 400,
                    message: 'Email already registered!',
                });
            return
        }

        const result = await pool.query(
            'INSERT INTO users (username, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, email, hashedPassword, 2]
        )

        if (result.rowCount != null) {
            res.status(200).json(
                {
                    status_code: 200,
                    message: 'Success to create user',
                });
        } else {
            res.status(500).json(
                {
                    status_code: 500,
                    message: 'Failed to create user',
                });
        }

    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json(
                {
                    status_code: 500,
                    message: 'Failed to create user',
                    error: err.message
                });
        } else {
            res.status(500).json(
                {
                    status_code: 500,
                    message: 'Failed to create user',
                });
        }
    }
})

authRouter.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username) {
        res.status(400).json(
            {
                status_code: 400,
                message: 'username is required!'
            }
        )
        return
    }

    if (!password) {
        res.status(400).json(
            {
                status_code: 400,
                message: 'password is required!'
            }
        )
        return
    }

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        )

        if (result.rowCount != 1) {
            res.status(404).json(
                {
                    status_code: 404,
                    message: 'username not found!'
                }
            )
            return
        }

        const bcrypt = require("bcrypt");

        const user = result.rows[0];
        const userPassword = user.password;
        const userId = user.id;

        const matched = await bcrypt.compare(password, userPassword);

        if (!matched) {
            res.status(404).json(
                {
                    status_code: 404,
                    message: 'password not match!'
                }
            )
            return
        }

        const email = user.email;
        const roleId = user.role_id;

        const jwt = require('jsonwebtoken');
        var token = jwt.sign({
            id: userId,
            username: username,
            email: email,
            role_id: roleId
        }, process.env.SECRET_KEY)

        res.status(200).json(
            {
                status_code: 200,
                message: 'Success to login!',
                data: {
                    token: token
                }
            });


    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json(
                {
                    status_code: 500,
                    message: 'Failed to login',
                    error: err.message
                });
        } else {
            res.status(500).json(
                {
                    status_code: 500,
                    message: 'Failed to login',
                });
        }
    }
})

export default authRouter;