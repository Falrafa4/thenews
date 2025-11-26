import { BASE_URL, API_KEY } from '/assets/js/config.js';
import { fetchAPI } from '/assets/js/script.js';

export async function searchNews(query) {
    let url = `${BASE_URL}everything?q=${encodeURIComponent(query)}&pageSize=9&apiKey=${API_KEY}`;

    const data = await fetchAPI(url, 'searchLoading', 'searchResult');
    const resultDiv = document.getElementById('searchResult');

    if (!data.articles || data.articles.length === 0) {
        resultDiv.innerHTML = '<p>No article data found.</p>';
        return;
    }

    let html = '';

    data.articles.forEach(article => {
        let proxiedImageUrl = `https://wsrv.nl/?url=${encodeURIComponent(article.urlToImage)}`;
        html += `
            <a href="${article.url}" class="world-container" target="_blank" rel="noopener noreferrer">
                <img src="${article.urlToImage ? proxiedImageUrl : '/assets/img/placeholder.jpg'}" alt="${article.title}" referrerpolicy="no-referrer" loading="lazy" onerror="this.onerror=null;this.src='/assets/img/placeholder.jpg';">
                <div class="world-content">
                    <h2>${article.title}</h2>
                    <p class="author-info">${article.source.name} — ${new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
            </a>
        `;
    })

    resultDiv.innerHTML = html;
}