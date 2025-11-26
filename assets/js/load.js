// Load header and footer
fetch('/components/header.htmx')
    .then(response => response.text())
    .then(html => {
        const headerDiv = document.getElementById('header');

        // buat container sementara
        const temp = document.createElement('div');
        temp.innerHTML = html.trim();

        const newHeader = temp.firstElementChild;

        // console.log(temp.firstElementChild)
        headerDiv.replaceWith(newHeader);

        const date = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById("date").innerHTML = date.toLocaleDateString('en-US', options);

        // Cek path lalu tambahkan class active
        const path = window.location.pathname;
        const navlink = document.querySelectorAll('.nav-link');
        navlink.forEach(link => {
            if (link.getAttribute('href') === path) {
                link.classList.add('active');
            }
        });

        document.getElementById('searchIcon').addEventListener('click', () => {
            window.location.href = `/search.html?q=${encodeURIComponent(document.getElementById('searchInput').value)}`;
        });

        document.getElementById('searchInput').addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                const newKeyword = event.target.value.trim();
                if (newKeyword) {
                    window.location.href = `search.html?q=${encodeURIComponent(newKeyword)}`;
                }
            }
        });
    });

fetch('/components/footer.htmx')
    .then(response => response.text())
    .then(html => {
        const footerDiv = document.getElementById('footer');

        // buat container sementara
        const temp = document.createElement('div');
        temp.innerHTML = html.trim();

        const newFooter = temp.firstElementChild;

        // console.log(temp.firstElementChild)
        footerDiv.replaceWith(newFooter);
    });