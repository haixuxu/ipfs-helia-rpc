import express from "express";
import busboy from 'connect-busboy';
import { createIpfsNode } from "./heliafs.js";

createIpfsNode().then((ipfsNode) => {
  var app = express();
  app.use(busboy());

  ipfsNode.fs.add
  // app.use(express.static(path.join(__dirname, "public")));

  /* ========================================================== 
Create a Route (/upload) to handle the Form submission 
(handle POST requests to /upload)
Express v4  Route definition
============================================================ */
  app.route("/api/v0/add").post(function (req, res, next) {
    req.pipe(req.busboy);
    req.busboy.on("file", function (fieldname, file, filename) {
      console.log("Uploading: " + filename);
      const chunks = [];
      file.on("data", (chunk) => {
        chunks.push(chunk);
      });

      file.on("end", () => {
        const fileBuffer = Buffer.concat(chunks);
        const uint8Array = new Uint8Array(fileBuffer);
        ipfsNode.addFile(uint8Array).then((cid) => {
            console.log('===cid==',cid);
          res.end({ Hash: cid, Name: cid, Size: chunks.length });
        }).catch(err=>{
            console.log("err==",err);
            res.status(500).end("err==="+err.message);
        })
      });
    });
  });

  var server = app.listen(4800, function () {
    console.log("Listening on port %d", server.address().port);
  });
});
