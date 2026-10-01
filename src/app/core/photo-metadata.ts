import { GeoPosition } from './geo';

/** What a photo's EXIF block says about when and where it was taken. */
export interface PhotoMetadata {
  takenAt: Date | null;
  position: GeoPosition | null;
}

const EXIF_IFD = 0x8769;
const GPS_IFD = 0x8825;
const DATE_TIME_ORIGINAL = 0x9003;

/**
 * Reads the capture date and GPS position from a JPEG's EXIF block. Anything missing or
 * unreadable comes back as `null` — the photo still works, the user just fills in more by hand.
 */
export function readPhotoMetadata(buffer: ArrayBuffer): PhotoMetadata {
  const none: PhotoMetadata = { takenAt: null, position: null };
  const view = new DataView(buffer);
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return none;

  // Walk the JPEG segments looking for APP1 "Exif\0\0".
  let offset = 2;
  while (offset + 4 <= view.byteLength) {
    const marker = view.getUint16(offset);
    const size = view.getUint16(offset + 2);
    if (marker === 0xffe1 && ascii(view, offset + 4, 4) === 'Exif') {
      return readTiff(view, offset + 10) ?? none;
    }
    if ((marker & 0xff00) !== 0xff00 || marker === 0xffda) break;
    offset += 2 + size;
  }
  return none;
}

function readTiff(view: DataView, tiff: number): PhotoMetadata | null {
  if (tiff + 8 > view.byteLength) return null;
  const order = ascii(view, tiff, 2);
  if (order !== 'II' && order !== 'MM') return null;
  const le = order === 'II';
  const u16 = (at: number) => view.getUint16(tiff + at, le);
  const u32 = (at: number) => view.getUint32(tiff + at, le);
  const inBounds = (at: number, len: number) => tiff + at + len <= view.byteLength;

  /** Tag → offset of its value field, relative to the TIFF header. */
  const readIfd = (at: number): Map<number, number> => {
    const tags = new Map<number, number>();
    if (!inBounds(at, 2)) return tags;
    const count = u16(at);
    for (let i = 0; i < count; i++) {
      const entry = at + 2 + i * 12;
      if (!inBounds(entry, 12)) break;
      tags.set(u16(entry), entry + 8);
    }
    return tags;
  };
  const rational = (at: number) => (u32(at + 4) ? u32(at) / u32(at + 4) : 0);
  const dms = (valueField: number | undefined): number | null => {
    if (valueField === undefined) return null;
    const at = u32(valueField);
    if (!inBounds(at, 24)) return null;
    return rational(at) + rational(at + 8) / 60 + rational(at + 16) / 3600;
  };
  const ref = (valueField: number | undefined) =>
    valueField === undefined ? '' : String.fromCharCode(view.getUint8(tiff + valueField));

  const ifd0 = readIfd(u32(4));

  let takenAt: Date | null = null;
  const exifPointer = ifd0.get(EXIF_IFD);
  if (exifPointer !== undefined) {
    const dateField = readIfd(u32(exifPointer)).get(DATE_TIME_ORIGINAL);
    if (dateField !== undefined && inBounds(u32(dateField), 19)) {
      takenAt = parseExifDate(ascii(view, tiff + u32(dateField), 19));
    }
  }

  let position: GeoPosition | null = null;
  const gpsPointer = ifd0.get(GPS_IFD);
  if (gpsPointer !== undefined) {
    const gps = readIfd(u32(gpsPointer));
    const lat = dms(gps.get(2));
    const lng = dms(gps.get(4));
    if (lat !== null && lng !== null) {
      position = {
        lat: ref(gps.get(1)) === 'S' ? -lat : lat,
        lng: ref(gps.get(3)) === 'W' ? -lng : lng,
      };
    }
  }

  return { takenAt, position };
}

/** EXIF dates look like `2026:03:14 10:22:05`, in the camera's local time. */
function parseExifDate(raw: string): Date | null {
  const m = /^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/.exec(raw);
  if (!m) return null;
  const [, y, mo, d, h, mi, s] = m.map(Number);
  const date = new Date(y, mo - 1, d, h, mi, s);
  return y > 0 && !Number.isNaN(date.getTime()) ? date : null;
}

function ascii(view: DataView, at: number, len: number): string {
  let out = '';
  for (let i = 0; i < len && at + i < view.byteLength; i++) {
    out += String.fromCharCode(view.getUint8(at + i));
  }
  return out;
}
