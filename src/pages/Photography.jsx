import React from 'react';
import '../global.css';
import { photographyPhotos } from '../data/photographyPhotos.js';

function Photography() {
    const photos = [...photographyPhotos].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return (
        <main className="photography-page">
            <header className="photography-page__header">
                <p className="photography-page__eyebrow">Gallery</p>
                <h1>Photography Portfolio</h1>
                <p className="photography-page__lead">
                    Selected work from my camera roll.
                </p>
            </header>

            <ul className="photography-grid">
                {photos.map((photo) => (
                    <li key={photo.id} className="photography-card">
                        <img
                            src={photo.src}
                            alt=""
                            loading="lazy"
                            decoding="async"
                        />
                    </li>
                ))}
            </ul>
        </main>
    );
}

export default Photography;
