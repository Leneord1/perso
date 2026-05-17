import edit1 from '../assets/Edit_1.jpg';
import dscn1815 from '../assets/DSCN1815_edit.JPG';
import dscn1917 from '../assets/DSCN1917-1.JPG';
import spring2024 from '../assets/20240504_154209 (1).jpeg';
import photo11 from '../assets/1.1.JPG';
import summer2025 from '../assets/20250806_204308.jpg';
import dscn1948 from '../assets/DSCN1948-2.JPG';
import photo1234 from '../assets/1234.jpg';

/**
 * Portfolio photos from src/assets. createdAt uses filename date when present,
 * otherwise the file last-modified time (closest available to capture date).
 */
export const photographyPhotos = [
    { id: 'edit-1', src: edit1, title: 'Edit 1', createdAt: '2023-11-03' },
    { id: 'dscn1815', src: dscn1815, title: 'DSCN1815', createdAt: '2024-02-04' },
    { id: 'dscn1917', src: dscn1917, title: 'DSCN1917', createdAt: '2024-04-09' },
    { id: '20240504', src: spring2024, title: 'Spring 2024', createdAt: '2024-05-04' },
    { id: '1-1', src: photo11, title: '1.1', createdAt: '2024-09-08' },
    { id: '20250806', src: summer2025, title: 'Summer 2025', createdAt: '2025-08-06' },
    { id: 'dscn1948', src: dscn1948, title: 'DSCN1948', createdAt: '2026-01-31' },
    { id: '1234', src: photo1234, title: '1234', createdAt: '2026-05-09' },
];

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});

export function formatPhotoDate(isoDate) {
    const [y, m, d] = isoDate.split('-').map(Number);
    return dateFormatter.format(new Date(y, m - 1, d));
}

/** Groups photos by createdAt, newest dates first. */
export function groupPhotosByDate(photos) {
    const byDate = new Map();

    for (const photo of photos) {
        if (!byDate.has(photo.createdAt)) {
            byDate.set(photo.createdAt, []);
        }
        byDate.get(photo.createdAt).push(photo);
    }

    return [...byDate.entries()]
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([date, items]) => ({
            date,
            label: formatPhotoDate(date),
            photos: items,
        }));
}
