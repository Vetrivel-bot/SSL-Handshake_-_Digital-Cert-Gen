const forge = require("node-forge");
const fs = require("fs");

function writePem(filename, pem) {
  fs.writeFileSync(filename, pem);
  console.log(`Written: ${filename}`);
}

// Generate Root CA
const caKeys = forge.pki.rsa.generateKeyPair(2048);
const caCert = forge.pki.createCertificate();
caCert.publicKey = caKeys.publicKey;
caCert.serialNumber = "01";
caCert.validity.notBefore = new Date();
caCert.validity.notAfter = new Date();
caCert.validity.notAfter.setFullYear(
  caCert.validity.notBefore.getFullYear() + 10
);

const caAttrs = [
  { name: "commonName", value: "My Root CA" },
  { name: "countryName", value: "US" },
  { shortName: "ST", value: "California" },
  { name: "localityName", value: "San Francisco" },
  { name: "organizationName", value: "Example Corp" },
  { shortName: "OU", value: "Certificate Authority" },
];
caCert.setSubject(caAttrs);
caCert.setIssuer(caAttrs);
caCert.setExtensions([
  { name: "basicConstraints", cA: true },
  {
    name: "keyUsage",
    keyCertSign: true,
    digitalSignature: true,
    cRLSign: true,
  },
  { name: "subjectKeyIdentifier" },
]);
caCert.sign(caKeys.privateKey, forge.md.sha256.create());

// Write CA files
writePem("ca-key.pem", forge.pki.privateKeyToPem(caKeys.privateKey));
writePem("ca-cert.pem", forge.pki.certificateToPem(caCert)); // Corrected filename

// Generate Server key & CSR
const serverKeys = forge.pki.rsa.generateKeyPair(2048);
const csr = forge.pki.createCertificationRequest();
csr.publicKey = serverKeys.publicKey;
csr.setSubject([
  { name: "commonName", value: "localhost" },
  { name: "countryName", value: "US" },
  { shortName: "ST", value: "California" },
  { name: "organizationName", value: "Example Corp" },
]);
csr.setAttributes([
  {
    name: "extensionRequest",
    extensions: [
      {
        name: "subjectAltName",
        altNames: [
          { type: 2, value: "localhost" },
          { type: 7, ip: "127.0.0.1" },
        ],
      },
    ],
  },
]);
csr.sign(serverKeys.privateKey, forge.md.sha256.create());

// Issue server certificate signed by CA
if (!csr.verify()) throw new Error("CSR verification failed");
const serverCert = forge.pki.createCertificate();
serverCert.serialNumber = "02";
serverCert.validity.notBefore = new Date();
serverCert.validity.notAfter = new Date();
serverCert.validity.notAfter.setFullYear(
  serverCert.validity.notBefore.getFullYear() + 1
);
serverCert.publicKey = csr.publicKey;
serverCert.setSubject(csr.subject.attributes);
serverCert.setIssuer(caCert.subject.attributes);
serverCert.setExtensions([
  { name: "basicConstraints", cA: false },
  { name: "keyUsage", digitalSignature: true, keyEncipherment: true },
  { name: "extKeyUsage", serverAuth: true, clientAuth: true },
  {
    name: "subjectAltName",
    altNames: [
      { type: 2, value: "localhost" },
      { type: 7, ip: "127.0.0.1" },
    ],
  },
]);
serverCert.sign(caKeys.privateKey, forge.md.sha256.create());

// Write server key and cert
writePem("server-key.pem", forge.pki.privateKeyToPem(serverKeys.privateKey)); // Corrected filename
writePem("server-cert.pem", forge.pki.certificateToPem(serverCert)); // Corrected filename

console.log("Certificate generation complete.");
