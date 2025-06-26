// Service Worker Registration Script

// Register service worker if the browser supports it
// In production, we check for HTTPS, but in development we allow HTTP for testing
if ('serviceWorker' in navigator && 
    (window.location.protocol === 'https:' || 
     window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1')) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);

        // Check for updates to the Service Worker
        registration.addEventListener('updatefound', function() {
          // An updated Service Worker has appeared in registration.installing!
          const newWorker = registration.installing;

          newWorker.addEventListener('statechange', function() {
            // Has service worker state changed?
            if (newWorker.state === 'installed') {
              // There is a new service worker available, show the notification
              if (navigator.serviceWorker.controller) {
                console.log('New content is available; please refresh.');

                // Optional: Show a notification to the user
                if ('Notification' in window && Notification.permission === 'granted') {
                  navigator.serviceWorker.ready.then(function(registration) {
                    registration.showNotification('ARCANA Atualizado', {
                      body: 'Nova versão disponível. Atualize a página para ver as mudanças.',
                      icon: '/icon-192.png',
                      vibrate: [100, 50, 100],
                      requireInteraction: true
                    });
                  });
                }
              } else {
                // At this point, everything has been precached.
                console.log('Content is cached for offline use.');
              }
            }
          });
        });
      })
      .catch(function(error) {
        console.error('Service Worker registration failed:', error);
      });

    // Handle service worker updates
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', function() {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });

  // Request notification permission (optional)
  if ('Notification' in window && Notification.permission !== 'denied') {
    // Wait a moment before requesting permission to not overwhelm the user on first visit
    setTimeout(() => {
      Notification.requestPermission();
    }, 10000); // Wait 10 seconds
  }
}
