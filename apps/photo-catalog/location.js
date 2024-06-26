import fetch from 'node-fetch';

export async function getFriendlyLocationName(lat, lng) {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const data = await response.json();
    return data.display_name;
}
