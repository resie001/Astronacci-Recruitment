import express from 'express';
import { Request, Response } from 'express';
import pool from '../database/db'
import { verifyToken } from '../middlewares/middleware';

const profileRouter = express.Router();

profileRouter.route('/change-avatar')
    .get((req: Request, res: Response) => {
        res.status(405).json(
            {
                status_code: 405,
                message: 'Method GET not allowed'
            }
        );
    })
    .post(verifyToken, async (req: Request, res: Response) => {
        const userId = req.id;
        const { avatar } = req.body

        try {
            const result = await pool.query(
                'UPDATE users SET avatar = $1 WHERE id = $2',
                [avatar, userId]
            )

            if (result.rowCount == 1) {
                res.status(200).json({
                    status_code: 200,
                    data: result.rows[0],
                    message: "Update Avatar success"
                });
            } else {
                res.status(400).json({
                    status_code: 400,
                    data: result.rows[0],
                    message: "Update Avatar failed"
                });
            }
        } catch (err) {
            if (err instanceof Error) {
                res.status(500).json(
                    {
                        status_code: 500,
                        message: 'Failed to update Avatar',
                        error: err.message
                    });
            } else {
                res.status(500).json(
                    {
                        status_code: 500,
                        message: 'Failed to update Avatar',
                    });
            }
        }
    })
    .put((req: Request, res: Response) => {
        res.status(405).json(
            {
                status_code: 405,
                message: 'Method PUT not allowed'
            }
        );
    })
    .delete((req: Request, res: Response) => {
        res.status(405).json(
            {
                status_code: 405,
                message: 'Method DELETE not allowed'
            }
        );
    })


profileRouter.route('/profile')
    .get(verifyToken, async (req: Request, res: Response) => {
        const userId = req.id
        try {
            const result = await pool.query(
                'SELECT * FROM users WHERE id = $1',
                [userId]
            )

            res.status(200).json({
                status_code: 200,
                data: result.rows[0],
                message: "Get Profile success"
            });
        } catch (err) {
            if (err instanceof Error) {
                res.status(500).json(
                    {
                        status_code: 500,
                        message: 'Failed to get profile',
                        error: err.message
                    });
            } else {
                res.status(500).json(
                    {
                        status_code: 500,
                        message: 'Failed to get profile',
                    });
            }
        }
    })
    .post(async (req: Request, res: Response) => {
        res.status(405).json(
            {
                status_code: 405,
                message: 'Method POST not allowed'
            }
        );
    })
    .put(async (req: Request, res: Response) => {
        const userId = req.id;
        const { email } = req.body

        try {
            const result = await pool.query(
                'UPDATE users SET email = $1 WHERE id = $2',
                [email, userId]
            )

            if (result.rowCount == 1) {
                res.status(200).json({
                    status_code: 200,
                    data: result.rows[0],
                    message: "Update Profile success"
                });
            } else {
                res.status(400).json({
                    status_code: 400,
                    data: result.rows[0],
                    message: "Update Profile failed"
                });
            }
        } catch (err) {
            if (err instanceof Error) {
                res.status(500).json(
                    {
                        status_code: 500,
                        message: 'Failed to update profile',
                        error: err.message
                    });
            } else {
                res.status(500).json(
                    {
                        status_code: 500,
                        message: 'Failed to update profile',
                    });
            }
        }
    })
    .delete(async (req: Request, res: Response) => {
        res.status(405).json(
            {
                status_code: 405,
                message: 'Method DELETE not allowed'
            }
        );
    })

export default profileRouter;