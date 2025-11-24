// top-headlines?category=general&pageSize=4&apiKey=

async function fetchAllWorldNews() {
    const url = `/mock/world-news-all.json`; // Using mock data for testing
    const data = await fetchAPI(url, 'worldLoading', 'worldResult');
    const resultDiv = document.getElementById('worldResult');

    if (!data.articles || data.articles.length === 0) {
        resultDiv.innerHTML = '<p>No article data found.</p>';
        return;
    }

    let html = '';

    data.articles.forEach(article => {
        html += `
            <a href="${article.url}" class="world-container" target="_blank" rel="noopener noreferrer">
                <img src="${article.urlToImage}" alt="World News Image">
                <div class="world-content">
                    <h2>${article.title}</h2>
                    <p class="author-info">${article.source.name} — ${new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
            </a>
        `;
    });
    resultDiv.innerHTML = html;
}