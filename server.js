const tls = require("tls");
const fs = require("fs");

const options = {
  key: fs.readFileSync("server-key.pem"), // Use server key
  cert: fs.readFileSync("server-cert.pem"), // Use server cert
  minVersion: "TLSv1.2",
  maxVersion: "TLSv1.3",
  ciphers: [
    "TLS_AES_256_GCM_SHA384",
    "TLS_CHACHA20_POLY1305_SHA256",
    "TLS_AES_128_GCM_SHA256",
    "ECDHE-ECDSA-AES256-GCM-SHA384",
    "ECDHE-RSA-AES256-GCM-SHA384",
    "ECDHE-ECDSA-CHACHA20-POLY1305",
    "ECDHE-RSA-CHACHA20-POLY1305",
    "ECDHE-ECDSA-AES128-GCM-SHA256",
    "ECDHE-RSA-AES128-GCM-SHA256",
  ].join(":"),
  honorCipherOrder: true,
  requestCert: false,
  rejectUnauthorized: false,
};

const server = tls.createServer(options, (socket) => {
  console.log("Negotiated cipher:", socket.getCipher());
  socket.write("Hello from TLS server!");
  socket.on("data", (data) => {
    console.log("Server received:", data.toString());
    socket.end();
  });
});

server.listen(8000, () => {
  console.log("Server listening on 8000");
});
