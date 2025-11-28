const TENOR_API_KEY = 'AIzaSyCEn6u0awMZUPr_aP-QrsElF0mbxVG-Qds';
const TENOR_API_URL = 'https://tenor.googleapis.com/v2';

export const searchGifs = async (query, limit = 20) => {
    try {
        const response = await fetch(
            `${TENOR_API_URL}/search?q=${encodeURIComponent(query)}&key=${TENOR_API_KEY}&limit=${limit}&media_filter=gif`
        );
        const data = await response.json();
        return data.results.map(gif => ({
            id: gif.id,
            url: gif.media_formats.gif.url,
            preview: gif.media_formats.tinygif.url,
            title: gif.content_description
        }));
    } catch (error) {
        console.error('GIF search error:', error);
        return [];
    }
};

export const getTrendingGifs = async (limit = 20) => {
    try {
        const response = await fetch(
            `${TENOR_API_URL}/featured?key=${TENOR_API_KEY}&limit=${limit}&media_filter=gif`
        );
        const data = await response.json();
        return data.results.map(gif => ({
            id: gif.id,
            url: gif.media_formats.gif.url,
            preview: gif.media_formats.tinygif.url,
            title: gif.content_description
        }));
    } catch (error) {
        console.error('Trending GIFs error:', error);
        return [];
    }
};

export const getGifCategories = () => {
    return [
        'Trending',
        'Reactions',
        'Funny',
        'Love',
        'Happy',
        'Sad',
        'Excited',
        'Dance',
        'Anime',
        'Memes'
    ];
};
