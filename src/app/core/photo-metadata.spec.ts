import { nearestCity } from './geo';
import { readPhotoMetadata } from './photo-metadata';
import { jpegWithExif } from './testing/photo-fixtures';

describe('readPhotoMetadata', () => {
  it('reads the capture date and a southern/western GPS position', () => {
    const meta = readPhotoMetadata(
      jpegWithExif({ date: '2026:03:14 10:22:05', lat: -0.2153, lng: -78.5036 }),
    );
    expect(meta.takenAt).toEqual(new Date(2026, 2, 14, 10, 22, 5));
    expect(meta.position!.lat).toBeCloseTo(-0.2153, 3);
    expect(meta.position!.lng).toBeCloseTo(-78.5036, 3);
  });

  it('reads a northern/eastern position', () => {
    const meta = readPhotoMetadata(jpegWithExif({ lat: 13.7465, lng: 100.4927 }));
    expect(meta.takenAt).toBeNull();
    expect(meta.position!.lat).toBeCloseTo(13.7465, 3);
    expect(meta.position!.lng).toBeCloseTo(100.4927, 3);
  });

  it('returns nulls for a photo without EXIF data', () => {
    expect(readPhotoMetadata(jpegWithExif())).toEqual({ takenAt: null, position: null });
  });

  it('returns nulls for files that are not JPEGs', () => {
    const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0]).buffer;
    expect(readPhotoMetadata(png)).toEqual({ takenAt: null, position: null });
    expect(readPhotoMetadata(new ArrayBuffer(0))).toEqual({ takenAt: null, position: null });
  });

  it('ignores a malformed date', () => {
    expect(readPhotoMetadata(jpegWithExif({ date: '0000:00:00 00:00:00' })).takenAt).toBeNull();
  });
});

describe('nearestCity', () => {
  it('matches a position to the closest city on file', () => {
    const match = nearestCity({ lat: -0.2153, lng: -78.5036 });
    expect(match).toMatchObject({ city: 'Quito', country: 'Ecuador' });
    expect(match!.km).toBeLessThan(10);
  });

  it('gives up when no city on file is close enough', () => {
    expect(nearestCity({ lat: 64.13, lng: -21.9 })).toBeNull();
  });
});
