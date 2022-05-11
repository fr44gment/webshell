import ExpressRouter from '../lib/ExpressRouter/ExpressRouter.js';
import { Log } from '../lib/Log/Log.js';
import fs from 'fs';

const router = ExpressRouter.route('post', async (request, response) => {
    const output = request.body.output;
    fs.readFile('./public/command.txt', (error, data) => {
        if (error) return Log.$('main').error(JSON.stringify(error));

        const block = `\n\n----------\nCommand: ${data}\n\n${output}`

        fs.appendFile(`./output/output.txt`, block, error => {
            if (error) Log.$('main').error(JSON.stringify(error));
    
            else {
                Log.$('main').info(`Command: ${data}`);
                console.log(`${output}`)

            }
        });
    })

    response.json({ });
});

export default router;