export class EncryptionService {
  // eslint-disable-next-line class-methods-use-this
  private async getKey (): Promise<CryptoKey> {
    // Generate or retrieve encryption key
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode('your-secret-key'),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name      : 'PBKDF2',
        salt      : new TextEncoder().encode('salt'),
        iterations: 100000,
        hash      : 'SHA-256'
      },
      keyMaterial,
      {
        name  : 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  async encrypt (data: string): Promise<string> {
    const key = await this.getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(data);

    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      encoded
    );

    return JSON.stringify({
      iv  : Array.from(iv),
      data: Array.from(new Uint8Array(encrypted))
    });
  }

  async decrypt (encryptedData: string): Promise<string> {
    const key = await this.getKey();
    const { iv, data } = JSON.parse(encryptedData);

    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv  : new Uint8Array(iv)
      },
      key,
      new Uint8Array(data)
    );

    return new TextDecoder().decode(decrypted);
  }
}
