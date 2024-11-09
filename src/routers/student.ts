import express from 'express';
import { Request, Response } from 'express';
import pool from '../database/db'
import { verifyToken } from '../middlewares/middleware'

const studentRouter = express.Router();

studentRouter.route('/student/:id')
    .get(verifyToken, async (req: Request, res: Response) => {
        const studentId = parseInt(req.params.id)

        try {
            const result = await pool.query(
                'SELECT * FROM student WHERE id = $1',
                [studentId]
            )

            res.status(200).json({
                status_code: 200,
                data: result.rows[0],
                message: "Get Student success"
            });
        } catch (err) {
            if (err instanceof Error) {
                res.status(500).json(
                    {
                        status_code: 500,
                        message: 'Failed to get students',
                        error: err.message
                    });
            } else {
                res.status(500).json(
                    {
                        status_code: 500,
                        message: 'Failed to get students',
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
        res.status(405).json(
            {
                status_code: 405,
                message: 'Method PUT not allowed'
            }
        );
    })
    .delete(async (req: Request, res: Response) => {
        res.status(405).json(
            {
                status_code: 405,
                message: 'Method DELETE not allowed'
            }
        );
    })

studentRouter.route('/students')
    .get(verifyToken, async (req: Request, res: Response) => {
        if (!req.query.page) {
            res.status(400).json({
                status_code: 400,
                message: "parameter page is required!"
            })
        }

        if (!req.query.limit) {
            res.status(400).json({
                status_code: 400,
                message: "parameter limit is required!"
            })
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const offset = (page - 1) * limit;

        try {
            const result = await pool.query(
                'SELECT * FROM student ORDER BY id LIMIT $1 OFFSET $2',
                [limit, offset]
            )

            const countResult = await pool.query('SELECT COUNT(*) FROM student');
            const total = parseInt(countResult.rows[0].count);

            const totalPages = Math.ceil(total / limit);

            res.status(200).json({
                status_code: 200,
                data: result.rows,
                pagination: {
                    page,
                    limit,
                    total,
                    total_pages: totalPages,
                },
                message: "Get Student success"
            });
        } catch (err) {
            if (err instanceof Error) {
                res.status(500).json(
                    {
                        status_code: 500,
                        message: 'Failed to get students',
                        error: err.message
                    });
            } else {
                res.status(500).json(
                    {
                        status_code: 500,
                        message: 'Failed to get students',
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
        res.status(405).json(
            {
                status_code: 405,
                message: 'Method PUT not allowed'
            }
        );
    })
    .delete(async (req: Request, res: Response) => {
        res.status(405).json(
            {
                status_code: 405,
                message: 'Method DELETE not allowed'
            }
        );
    })

export default studentRouter;