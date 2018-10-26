const http = require('http'),
  fs = require('fs'),
  url = require('url'),
  {
    parse
  } = require('querystring');

mimeTypes = {
  "html": "text/html",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "png": "image/png",
  "js": "text/javascript",
  "css": "text/css"
};
/*¿Cuál es la principal función del módulo HTTP?*/
/*ermite realizar una petición de datos y recursos, como pueden ser documentos HTML. */

/*¿Cuál es la principal función del módulo FileSystem?|*/
/*permite trabajar con el sistema de archivos en su computadora.*/

/*Que son los mime type*/
/*son la manera standard de mandar contenido a través de la red. Los tipos MIME especifican tipos de datos, como por ejemplo texto, imagen, audio, etc. 
que los archivos contienen. */


http.createServer((req, res)=>{ 
      //Control code. 
    function collectRequestData(request, callback) {
        const FORM_URLENCODED = 'application/x-www-form-urlencoded';
        if (request.headers['content-type'] === FORM_URLENCODED) {
            let body = '';
             // Evento de acumulacion de data.
             request.on('data', chunk => {
                  body += chunk.toString();
                });
                // Data completamente recibida
                request.on('end', () => {
                  callback(null, parse(body));
                });
              } else {
                callback({
                  msg: `The content-type don't is equals to ${FORM_URLENCODED}`
                });
              }
            
            } 

    var pathname = url.parse(req.url).pathname; 
    if(pathname == "/"){
          pathname = "../index.html";
        }
    
        if(pathname == "../index.html"){
              fs.readFile(pathname, (err, data)=>{
            
                if (err) {
                  console.log(err);
                  // HTTP Status: 404 : NOT FOUND
                  // En caso no haberse encontrado el archivo
                  res.writeHead(404, {
                    'Content-Type': 'text/html'
                  });       return res.end("404 Not Found");     }
                // Pagina encontrada
                // HTTP Status: 200 : OK
            
                res.writeHead(200, {
                  'Content-Type': mimeTypes[pathname.split('.').pop()] || 'text/html'
                });
            
                // Escribe el contenido de data en el body de la respuesta.
                res.write(data.toString());
            
            
                // Envia la respuesta
                return res.end();
              });
            }
            
            if (req.method === 'POST' && pathname == "/cv") {
                  collectRequestData(req, (err, result) => {
                
                    if (err) {
                      res.writeHead(400, {
                        'content-type': 'text/html'
                      });
                      return res.end('Bad Request');
                    }
                
                    fs.readFile("../templates/plantilla.html", function (err, data) {
                      if (err) {
                        console.log(err);
                        // HTTP Status: 404 : NOT FOUND
                        // Content Type: text/plain
                        res.writeHead(404, {
                          'Content-Type': 'text/html'
                        });
                        return res.end("404 Not Found");
                      }
                
                      res.writeHead(200, {
                        'Content-Type': mimeTypes[pathname.split('.').pop()] || 'text/html'
                      });
                
                      //Variables de control.
                
                      let parsedData = data.toString().replace('${dui}', result.dui)
                        .replace("${lastname}", result.lastname)
                        .replace("${firstname}", result.firstname)
                        .replace("${gender}", result.gender)
                        .replace("${civilStatus}", result.civilStatus)
                        .replace("${birth}", result.birth)
                        .replace("${exp}", result.exp)
                        .replace("${tel}", result.tel)
                        .replace("${std}", result.std);
                
                      res.write(parsedData);
                      return res.end();
                    });
                
                  });
                } 
            
                if(pathname.split(".")[1] == "css"){
                      fs.readFile(".."+pathname, (err, data)=>{
                    
                        if (err) {
                          console.log(err);
                          res.writeHead(404, {
                            'Content-Type': 'text/html'
                          });       return res.end("404 Not Found");     }
                    
                        res.writeHead(200, {
                          'Content-Type': mimeTypes[pathname.split('.').pop()] || 'text/css'
                        });
                    
                        // Escribe el contenido de data en el body de la respuesta.
                        res.write(data.toString());
                    
                    
                        // Envia la respuesta
                        return res.end();
                      });
                    } 
             
                

    }).listen(8081);


/*¿Qué contienen las variables "req" y "res" en la creación del servidor?*/
/*la petición que se envia y el resultado*/

/*¿La instrucción .listen(number) puede fallar? Justifique.*/
/*Puede, si ese puerto esta siendo usado por otra aplicacion entonces fallaria*/

/*¿Por qué es útil la función "collectRequestData(...)"?*/
/*Pues esta función nos informa si el tipo de contenido es compatible o no, o lo contrario*/

/*¿Para qué, además de conocer la dirección de la petición, es útil la variable "pathname"?*/
/*Nos indica a que pagina es la que debe de mostrar segun la peticion*/

/*¿Qué contine el parametro "data"? */
/*Informacion*/

/*¿Cuál es la diferencia entre brindar una respuesta HTML y brindar una CSS? */
/*Que el tipo de texto cambia(dos tipos diferentes), entonces no se puede enviar ambos en una sola respuesta*/

/*¿Qué contiene la variable "result"?*/
/*Result viene a ser como el cambio que dio la respuesta, se colocara por ejemplo result(nuevo resultado).lastname, es decir el nuevo resultado en el lastname y asi para
las demas variables se ira reemplazando*/

/*¿Por qué con la variable "data" se debe aplicarse el metodo toString()? Justifique.*/
/*Se debe de convertir a toString para poder manipularlo*/


/*¿Se puede inciar el servidor (node main.js) en cualquier sitio del proyecto? Cualquier respuesta justifique. */
/*No porque el archivo se encuentra en la carpeta de app*/

/*Con sus palabras, ¿Por qué es importante aprender Node.js sin el uso de frameworks a pesar que estos facilitan el manejo de API's? */
/*Es lo mismo como cuando aprendimos css, primero se aprende a "pata" para que luego usando frameworks sea mucho más fácil y sepamos usar mejor las
nuevas herramientas que estos nos ofrecen*/

