/**
 * Test Fixtures: QR Codes, Quishing Payloads, and Corrupted QR Buffers
 * Covering legitimate QR conversion, Quishing scams (fake QRIS, phishing portals),
 * and adversarial corrupted images.
 */

export interface QrCodeFixture {
  id: string;
  label: string;
  encodedPayload: string;
  isUrl: boolean;
  expectedThreatLevel?: "SAFE" | "WARNING" | "DANGEROUS" | "PHISHING";
  mimeType: string;
  simulatedBase64Image: string;
}

export const QR_CODE_FIXTURES: QrCodeFixture[] = [
  {
    id: "qr-clean-portal",
    label: "Legitimate Corporate Portal QR",
    encodedPayload: "https://www.bankmandiri.co.id",
    isUrl: true,
    expectedThreatLevel: "SAFE",
    mimeType: "image/png",
    // 1x1 transparent PNG header mock
    simulatedBase64Image:
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAA=",
  },
  {
    id: "qr-clean-text",
    label: "Non-URL Plain Text QR",
    encodedPayload: "WIFI:S:MyHomeNetwork;T:WPA;P:SecretPassword123;;",
    isUrl: false,
    expectedThreatLevel: "SAFE",
    mimeType: "image/png",
    simulatedBase64Image:
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAA=",
  },
  {
    id: "qr-quishing-fake-qris",
    label: "Quishing: Fake QRIS Masjid / Merchant Phishing",
    encodedPayload: "https://qris-dana-kaget-pemberdayaan.xyz/bayar?merchant=MASJID_AL_IKHLAS",
    isUrl: true,
    expectedThreatLevel: "PHISHING",
    mimeType: "image/png",
    simulatedBase64Image:
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAA=",
  },
  {
    id: "qr-quishing-parking-ticket",
    label: "Quishing: Fraudulent Parking Fine Payment",
    encodedPayload: "https://dishub-parkir-denda-online.buzz/checkout?plat=B1234XYZ",
    isUrl: true,
    expectedThreatLevel: "PHISHING",
    mimeType: "image/jpeg",
    simulatedBase64Image:
      "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=",
  },
];

export const BOUNDARY_QR_FIXTURES = {
  emptyBuffer: new Uint8Array(0),
  randomNoiseBytes: new Uint8Array([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0xff, 0x00, 0xfe,
  ]),
  nonImageTextFile: new TextEncoder().encode("This is a plain text file, not an image."),
  oversizedQrBuffer: new Uint8Array(20 * 1024 * 1024), // 20MB oversized image
  invalidMimeType: "application/x-msdownload",
};
