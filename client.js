const tlsClient = require("tls");
const fsClient = require("fs");

const clientOptions = {
  host: "127.0.0.1",
  port: 8000,
  servername: "localhost",
  ca: [fsClient.readFileSync("ca-cert.pem")], // Trust the CA
  ciphers: [
    "TLS_AES_128_GCM_SHA256",
    "TLS_AES_256_GCM_SHA384",
    "ECDHE-RSA-AES256-GCM-SHA384",
  ].join(":"),
  minVersion: "TLSv1.2",
  maxVersion: "TLSv1.3",
};

const client = tlsClient.connect(clientOptions, () => {
  console.log("Negotiated cipher:", client.getCipher());
  client.write("Hello from TLS client!");
});
client.setEncoding("utf8");
client.on("data", (data) => {
  console.log("Client received:", data);
  client.end();
});
client.on("error", (err) => console.error(err));
