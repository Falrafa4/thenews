// Import API configuration
import { API_KEY, BASE_URL } from '/assets/js/config.js';

// MOST IMPORTANT OPTION!
// News API has limitation in request
let use_api = true;

export async function fetchAPI(url, loadingDivId, resultDivId) {
    const loadingDiv = document.getElementById(loadingDivId);
    const resultDiv = document.getElementById(resultDivId);

    try {
        loadingDiv.style.display = 'block';
        resultDiv.innerHTML = '';

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching API:', error);
        resultDiv.innerHTML = `<p class="error">Error fetching data: ${error.message}</p>`;
    } finally {
        loadingDiv.style.display = 'none';
    }
}

export async function fetchLatestNews() {
    let url;
    if (use_api) {
        url = `${BASE_URL}top-headlines?sources=bbc-news&pageSize=3&apiKey=${API_KEY}`;
    } else {
        url = `/mock/latest-news.json`;
    }

    const data = await fetchAPI(url, 'latestLoading', 'latestResult');

    if (data && data.articles) {
        const resultDiv = document.getElementById('latestResult');
        if (!data.articles || data.articles.length === 0) {
            resultDiv.innerHTML = '<p>No article data found.</p>';
            return;
        }

        let html = '';

        data.articles.forEach(article => {
            let proxiedImageUrl = `https://wsrv.nl/?url=${encodeURIComponent(article.urlToImage)}`;
            html += `
            <a href="${article.url}" class="latest-container" target="_blank" rel="noopener noreferrer">
                <img src="${article.urlToImage ? proxiedImageUrl : '/assets/img/placeholder.jpg'}" alt="Latest News Image" referrerpolicy="no-referrer" loading="lazy" onerror="this.onerror=null;this.src='/assets/img/placeholder.jpg';">
                <div class="latest-content">
                    <h2>${article.title}</h2>
                    <p class="author-info">${article.source.name} — ${new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
            </a>
        `;
        });
        resultDiv.innerHTML = html;
    }
}

// fetch world news dan tampilkan langsung di dalam fungsi
export async function fetchWorldNews() {
    let url;
    if (use_api) {
        url = `${BASE_URL}top-headlines?category=general&apiKey=${API_KEY}`;
    } else {
        url = `/mock/world-news.json`;
    }

    const data = await fetchAPI(url, 'worldLoading', 'worldResult');
    const resultDiv = document.getElementById('worldResult');

    if (data && data.articles && data.articles.length > 0) {
        const articles = data.articles;
        const mainArticle = articles[0];
        const sideArticle = articles.slice(1, 3);

        const formatDate = (dateString) => new Date(mainArticle.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        // HTML main article (left)
        let mainProxiedImageUrl = `https://wsrv.nl/?url=${encodeURIComponent(mainArticle.urlToImage)}`;

        const mainHTML = `
            <div class="news-left-col">
                <div class="main-image-container">
                    <img src="${mainArticle.urlToImage ? mainProxiedImageUrl : '/assets/img/placeholder.jpg'}" alt="${mainArticle.title}" class="main-bg-img" referrerpolicy="no-referrer" loading="lazy" onerror="this.onerror=null;this.src='/assets/img/placeholder.jpg';">
                    <a href="${mainArticle.url}" class="main-content-overlay" target="_blank" rel="noopener noreferrer">
                        <span class="date-badge">${formatDate(mainArticle.publishedAt)}</span>
                        <h3>${mainArticle.title}</h3>
                        <p class="author-info">by ${mainArticle.author || mainArticle.source.name}</p>
                    </a>
                </div>
            </div>
        `;

        let sideListHTML = '';

        // console.log(sideArticle);
        sideArticle.forEach(article => {
            // console.log(article);
            let proxiedImageUrl = `https://wsrv.nl/?url=${encodeURIComponent(article.urlToImage)}`;

            sideListHTML += `
                <a href="${article.url}" class="world-container" target="_blank" rel="noopener noreferrer">
                    <img src="${article.urlToImage ? proxiedImageUrl : '/assets/img/placeholder.jpg'}" alt="${article.title}" referrerpolicy="no-referrer" loading="lazy" onerror="this.onerror=null;this.src='/assets/img/placeholder.jpg';">
                    <div class="world-content">
                        <h2>${article.title}</h2>
                        <p class="author-info">${article.source.name} — ${formatDate(article.publishedAt)}</p>
                    </div>
                </a>
            `;
        });

        // console.log(mainHTML + sideListHTML);

        resultDiv.innerHTML = mainHTML + sideListHTML;
    }
}

// fetch technology news dan tampilkan langsung di dalam fungsi
export async function fetchTechNews() {
    let url;
    if (use_api) {
        url = `${BASE_URL}top-headlines?category=technology&pageSize=4&apiKey=${API_KEY}`;
    } else {
        url = `/mock/tech-news.json`;
    }

    const data = await fetchAPI(url, 'techLoading', 'techResult');
    const resultDiv = document.getElementById('techResult');

    if (data && data.articles) {
        if (!data.articles || data.articles.length === 0) {
            resultDiv.innerHTML = '<p>No article data found.</p>';
            return;
        }

        let html = '';

        data.articles.forEach(article => {
            let proxiedImageUrl = `https://wsrv.nl/?url=${encodeURIComponent(article.urlToImage)}`;
            html += `
            <a href="${article.url}" class="tech-container" target="_blank" rel="noopener noreferrer">
                <img src="${article.urlToImage ? proxiedImageUrl : '/assets/img/placeholder.jpg'}" alt="tech News Image" referrerpolicy="no-referrer" loading="lazy" onerror="this.onerror=null;this.src='/assets/img/placeholder.jpg';">
                <div class="tech-content">
                    <p class="author-info">${article.source.name} — ${new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    <h2>${article.title}</h2>
                </div>
            </a>
        `;
        });
        // html += '</div>';
        resultDiv.innerHTML = html;
    }
}

export async function fetchPodcastNews() {
    let url;
    if (use_api) {
        url = `${BASE_URL}everything?q=podcast&sources=cnn,bbc-news&pageSize=6&apiKey=${API_KEY}`;
    } else {
        url = `/mock/podcasts.json`;
    }

    const data = await fetchAPI(url, 'podcastLoading', 'podcastResult');
    const resultDiv = document.getElementById('podcastResult');

    if (data && data.articles) {
        if (!data.articles || data.articles.length === 0) {
            resultDiv.innerHTML = '<p>No article data found.</p>';
            return;
        }

        let html = '';

        data.articles.forEach(article => {
            let proxiedImageUrl = `https://wsrv.nl/?url=${encodeURIComponent(article.urlToImage)}`;
            html += `
            <a href="${article.url}" class="podcast-container" target="_blank" rel="noopener noreferrer">
                <img src="${article.urlToImage ? proxiedImageUrl : '/assets/img/placeholder.jpg'}" alt="podcast News Image" referrerpolicy="no-referrer" loading="lazy" onerror="this.onerror=null;this.src='/assets/img/placeholder.jpg';">
                <div class="podcast-content">
                    <h2>${article.title}</h2>
                    <p class="author-info">${article.source.name} — ${new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
            </a>
        `;
        });
        // html += '</div>';
        resultDiv.innerHTML = html;
    }
}

export async function displayNews(resultDivId, articles) {

}