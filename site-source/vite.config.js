import { defineConfig } from 'vite';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export default defineConfig({
    plugins: [{name:'local-social-export',configureServer(server) {
        server.middlewares.use('/__export/', async (req,res) => {
            const name=req.url?.replace(/^\//,'');
            if(!['lisaj-full.webm','aujoulevol-full.webm'].includes(name)){res.statusCode=404;res.end();return;}
            if(req.method !== 'POST') {res.statusCode=405;res.end();return;}
            try {
                const chunks=[];let size=0;
                for await(const chunk of req) {size+=chunk.length;if(size>500*1024*1024)throw new Error('Export too large');chunks.push(chunk);}
                const folder=resolve(process.cwd(),'exports');await mkdir(folder,{recursive:true});
                await writeFile(resolve(folder,name),Buffer.concat(chunks));res.end('Saved');
            }catch(error){res.statusCode=500;res.end(error.message);}
        });
    }}],
    server: {
        watch: {
            ignored: ['**/.vs/**']
        }
    }
});

