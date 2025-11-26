// MOST IMPORTANT OPTION!
// News API has limitation in request
import { fetchAPI } from '/assets/js/script.js';

let use_api = true;

export async function fetchAllNews(url, mock, loadingId, resultId) {
    let real_url;

    if (use_api) {
        real_url = url;
    } else {
        real_url = mock // Using mock data for testing
    }

    const data = await fetchAPI(real_url, loadingId, resultId);
    const resultDiv = document.getElementById(resultId);

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
    });
    resultDiv.innerHTML = html;
}