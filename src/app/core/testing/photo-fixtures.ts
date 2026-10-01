/** Test-only: builds a minimal JPEG whose EXIF block carries the given date and position. */
export function jpegWithExif(
  opts: { date?: string; lat?: number; lng?: number } = {},
): ArrayBuffer {
  // Little-endian TIFF laid out as: header · IFD0 · Exif IFD · GPS IFD · date · lat · lng.
  const tiff = new DataView(new ArrayBuffer(178));
  const u16 = (at: number, v: number) => tiff.setUint16(at, v, true);
  const u32 = (at: number, v: number) => tiff.setUint32(at, v, true);
  const text = (at: number, s: string) =>
    [...s].forEach((c, i) => tiff.setUint8(at + i, c.charCodeAt(0)));
  const entry = (at: number, tag: number, type: number, count: number, value: number) => {
    u16(at, tag);
    u16(at + 2, type);
    u32(at + 4, count);
    u32(at + 8, value);
  };
  const dms = (at: number, deg: number) => {
    const abs = Math.abs(deg);
    const d = Math.floor(abs);
    const m = Math.floor((abs - d) * 60);
    const s = Math.round(((abs - d) * 60 - m) * 60 * 100);
    [d, 1, m, 1, s, 100].forEach((v, i) => u32(at + i * 4, v));
  };

  text(0, 'II');
  u16(2, 42);
  u32(4, 8);

  u16(8, 2);
  entry(10, 0x8769, 4, 1, 38);
  entry(22, 0x8825, 4, 1, 56);

  u16(38, opts.date ? 1 : 0);
  if (opts.date) {
    entry(40, 0x9003, 2, 20, 110);
    text(110, opts.date);
  }

  const hasGps = opts.lat !== undefined && opts.lng !== undefined;
  u16(56, hasGps ? 4 : 0);
  if (hasGps) {
    entry(58, 1, 2, 2, 0);
    text(66, opts.lat! < 0 ? 'S' : 'N');
    entry(70, 2, 5, 3, 130);
    entry(82, 3, 2, 2, 0);
    text(90, opts.lng! < 0 ? 'W' : 'E');
    entry(94, 4, 5, 3, 154);
    dms(130, opts.lat!);
    dms(154, opts.lng!);
  }

  // SOI · APP1 (Exif) · EOI
  const app1Size = 2 + 6 + tiff.byteLength;
  const out = new Uint8Array(2 + 2 + app1Size + 2);
  out.set([0xff, 0xd8, 0xff, 0xe1, app1Size >> 8, app1Size & 0xff], 0);
  out.set(
    [...'Exif\0\0'].map((c) => c.charCodeAt(0)),
    6,
  );
  out.set(new Uint8Array(tiff.buffer), 12);
  out.set([0xff, 0xd9], out.length - 2);
  return out.buffer;
}
