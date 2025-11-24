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