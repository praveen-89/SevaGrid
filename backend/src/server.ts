import app from './app';
import { env } from './config/env';

/**
 * Executes boot procedures separating the express `app` construction 
 * from physical TCP port allocations yielding higher integration testability.
 */
const startServer = () => {
    app.listen(env.PORT, () => {
        console.log(`[🚀 System Bound] Backend online listening strictly on ${env.PORT}`);
        console.log(`[💻 Environment] Running explicitly in ${env.NODE_ENV} configuration`);
        console.log(`[🔗 Cloud Connection] Database target instance tied to: ${env.SUPABASE_URL}`);
    });
};

startServer();
