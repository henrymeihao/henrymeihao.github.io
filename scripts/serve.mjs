import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(fileURLToPath(new URL('../',import.meta.url)));
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
http.createServer(async(req,res)=>{
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let target = path.resolve(root,'.'+pathname);
    if ((target !== root && !target.startsWith(root + path.sep)) || pathname.split('/').some(p=>p.startsWith('.'))) throw new Error('Invalid path');
    if ((await stat(target)).isDirectory()) target=path.join(target,'index.html');
    const body=await readFile(target);
    res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});res.end(body);
  } catch {res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await readFile(path.join(root,'404.html')));}
}).listen(4173,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:4173'));
