import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function ListingForm({ initial = {}, onSubmit, busy }) {
    const [title, setTitle] = useState(initial.title || '');
    const [price, setPrice] = useState(initial.price || '');
    const [category, setCategory] = useState(initial.category || '');
    const [description, setDescription] = useState(initial.description || '');
    const [imageUrl, setImageUrl] = useState(initial.images?.[0]?.url || '');
    const [condition, setCondition] = useState(initial.condition || 'Good');
    const [location, setLocation] = useState(initial.location || '');
    const [cats, setCats] = useState([]);

    useEffect(() => { api.get('/api/categories').then(r => setCats(r.data)).catch(() => { }); }, []);

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit({ title, price: Number(price), category, description, images: imageUrl ? [{ url: imageUrl }] : undefined, condition, location });
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label>Title<input value={title} onChange={e => setTitle(e.target.value)} required /></label>
            <label>Price<input type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} required /></label>
            <label>Category<select value={category} onChange={e => setCategory(e.target.value)} required>
                <option value="">Select</option>
                {cats.map(c => <option key={c._id || c.key} value={c.name || c.key}>{c.name}</option>)}
            </select></label>
            <label>Description<textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} /></label>
            <label>Image URL<input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." /></label>
            <label>Condition<select value={condition} onChange={e => setCondition(e.target.value)}>
                {['New', 'Like New', 'Good', 'Fair', 'Poor'].map(o => <option key={o}>{o}</option>)}
            </select></label>
            <label>Location<input value={location} onChange={e => setLocation(e.target.value)} /></label>
            <button disabled={busy} type="submit">{busy ? 'Saving...' : 'Save Listing'}</button>
        </form>
    );
}
