Core Concepts Explained
Digital Certificate Generator

Creates a chain of trust:

Root CA Certificate: Self-signed authority that vets all certificates

Server Certificate: Signed by the Root CA, identifies localhost

Implements X.509 standard with:

2048-bit RSA keys

SAN (Subject Alternative Names) for localhost + 127.0.0.1

1-year validity period

SSL/TLS Handshake Implementation

Secure Channel Establishment:

Client initiates connection with supported cipher list

Server selects strongest mutual cipher (TLS 1.3 preferred)

Certificate chain verification using ca-cert.pem

Key exchange (ECDHE) and session key derivation

Encrypted data exchange

Key Security Features

Modern Protocols: Enforces TLS 1.2+ (blocks legacy SSL)

AEAD Ciphers: Uses AES-GCM/CHACHA20 for encryption

Perfect Forward Secrecy: Ephemeral keys protect past sessions

Host Validation: Certificates strictly validate localhost

Instruction:

# 1. Install required package
npm install 

# 2. Generate certificates (run once)
node digital_cert.js

# 3. In separate terminals:
# -------------------------
# Terminal 1: Start server
node server.js

# Terminal 2: Connect client
node client.js
Expected Behavior
text
Server Terminal                                     Client Terminal
-------------------                                 ------------------
Server listening on 8000                            Negotiated cipher: TLS_AES_256_GCM_SHA384
Negotiated cipher: TLS_AES_256_GCM_SHA384           Client received: Hello from TLS server!
Server received: Hello from TLS client!                     
                                    
Why This Works
Trust Chain: Client trusts ca-cert.pem → Validates server certificate

Secure Negotiation: Server enforces modern ciphers while maintaining compatibility

Host Locking: Certificates only valid for localhost/127.0.0.1

Key Isolation: Separate CA/server keys prevent compromise propagation

This implementation demonstrates real-world PKI fundamentals while maintaining developer-friendly localhost security. 🔒
