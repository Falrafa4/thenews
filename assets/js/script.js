const API_KEY = '58f5f6729c53404dacfad472b35ad500';
const BASE_URL = 'https://newsapi.org/v2/';

// MOST IMPORTANT OPTION!
// News API has limitation in request
let use_api = false;

async function fetchAPI(url, loadingDivId, resultDivId) {
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

async function fetchLatestNews() {
    let url;
    if (use_api) {
        url = `${BASE_URL}top-headlines?sources=bbc-news&pageSize=3&apiKey=${API_KEY}`;
    } else {
        url = `/mock/latest-news.json`;
    }

    const data = await fetchAPI(url, 'latestLoading', 'latestResult');

    if (data && data.articles) {
        displayNews('latestResult', data.articles);
    }
}

// fetch world news dan tampilkan langsung di dalam fungsi
async function fetchWorldNews() {
    let url;
    if (use_api) {
        url = `${BASE_URL}top-headlines?category=general&pageSize=4&apiKey=${API_KEY}`;
    } else {
        url = `/mock/world-news.json`;
    }

    const data = await fetchAPI(url, 'worldLoading', 'worldResult');
    const resultDiv = document.getElementById('worldResult');

    if (data && data.articles && data.articles.length > 0) {
        const articles = data.articles;
        const mainArticle = articles[0];
        const sideArticle = articles.slice(1, 4);

        const formatDate = (dateString) => new Date(mainArticle.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        // HTML main article (left)
        const mainHTML = `
            <div class="news-left-col">
                <div class="main-image-container">
                    <img src="${ mainArticle.urlToImage ? mainArticle.urlToImage : '/assets/img/placeholder.jpeg'}" alt="${mainArticle.title}" class="main-bg-img">
                </div>
                <a href="${mainArticle.url}" class="main-content-overlay" target="_blank" rel="noopener noreferrer">
                    <span class="date-badge">${formatDate(mainArticle.publishedAt)}</span>
                    <h3>${mainArticle.title}</h3>
                    <p class="author-info">by ${mainArticle.author || mainArticle.source.name}</p>
                </a>
            </div>
        `;

        let sideListHTML = '';
        sideArticle.forEach(article => {
            sideListHTML += `
                <a href="${article.url}" class="world-container" target="_blank" rel="noopener noreferrer">
                    <img src="${ article.urlToImage ? article.urlToImage : '/assets/img/placeholder.jpeg'}" alt="${article.title}">
                    <div class="world-content">
                        <h2>${article.title}</h2>
                        <p class="author-info">${article.source.name} — ${formatDate(article.publishedAt)}</p>
                    </div>
                </a>
            `;
        });

        resultDiv.innerHTML = mainHTML + sideListHTML;
    }
}

// fetch technology news dan tampilkan langsung di dalam fungsi
async function fetchTechNews() {
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
            html += `
            <a href="${article.url}" class="tech-container" target="_blank" rel="noopener noreferrer">
                <img src="${article.urlToImage ? article.urlToImage : '/assets/img/placeholder.jpeg'}" alt="tech News Image">
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

async function fetchPodcastNews() {
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
            html += `
            <a href="${article.url}" class="podcast-container" target="_blank" rel="noopener noreferrer">
                <img src="${article.urlToImage ? article.urlToImage : '/assets/img/placeholder.jpeg'}" alt="podcast News Image">
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

async function displayNews(resultDivId, articles) {
    const resultDiv = document.getElementById(resultDivId);
    if (!articles || articles.length === 0) {
        resultDiv.innerHTML = '<p>No article data found.</p>';
        return;
    }

    let html = '';

    articles.forEach(article => {
        html += `
            <a href="${article.url}" class="latest-container" target="_blank" rel="noopener noreferrer">
                <img src="${ article.urlToImage ? article.urlToImage : '/assets/img/placeholder.jpeg'}" alt="Latest News Image">
                <div class="latest-content">
                    <h2>${article.title}</h2>
                    <p class="author-info">${article.source.name} — ${new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
            </a>
        `;
    });
    // html += '</div>';
    resultDiv.innerHTML = html;
}