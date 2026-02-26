// Loader Injector - Automatically injects and manages the concrete pour loader on all pages
(function initLoaderInjector() {
    // Only inject if not already present
    if (document.getElementById('loader-wrapper')) {
        return;
    }

    // Fetch and inject the loader HTML
    fetch('/components/loader.html')
        .then(response => response.text())
        .then(html => {
            // Create a temporary container to parse the HTML
            const temp = document.createElement('div');
            temp.innerHTML = html;

            // Extract the loader wrapper and styles
            const loaderWrapper = temp.querySelector('#loader-wrapper');
            const styles = temp.querySelectorAll('style');

            if (loaderWrapper) {
                // Inject styles into head
                styles.forEach(style => {
                    document.head.appendChild(style.cloneNode(true));
                });

                // Inject loader into body
                document.body.insertAdjacentElement('afterbegin', loaderWrapper);

                // Extract and execute the script
                const scripts = temp.querySelectorAll('script');
                scripts.forEach(script => {
                    const newScript = document.createElement('script');
                    newScript.textContent = script.textContent;
                    document.body.appendChild(newScript);
                });
            }
        })
        .catch(err => console.warn('Loader injection failed:', err));
})();
