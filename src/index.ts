import express, { Request, Response } from 'express';
import pool from './database/db'
import authRouter from "./routers/auth";
import profileRouter from './routers/profile';
import studentRouter from './routers/student';

declare global {
    namespace Express {
        interface Request {
            id?: number;
        }
    }
}

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
});

app.get('/generate-secret-key', (req: Request, res: Response) => {
    const crypto = require('crypto')

    const secretKey = crypto.randomBytes(32).toString('hex');

    console.log('Generated HMAC-SHA256 secret key:', secretKey);
})

app.get('/test-db', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT NOW()'); // Test query to get the current timestamp
        res.status(200).json(
            {
                status_code: 200,
                message: 'Database connected successfully'
            });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json(
                {
                    status_code: 500,
                    message: 'Failed to connect to database',
                    error: err.message
                });
        } else {
            res.status(500).json(
                {
                    status_code: 500,
                    message: 'Failed to connect to database',
                });
        }
    }
});

app.use('/api', authRouter)
app.use('/api', studentRouter)
app.use('/api', profileRouter)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});