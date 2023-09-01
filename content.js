chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'highlightNofollow') {
      const links = document.querySelectorAll('a[rel~="nofollow"]');
      links.forEach(link => {
        link.style.border = '2px solid red';
      });
    } else if (request.action === 'highlightDofollow') {
      const links = document.querySelectorAll('a:not([rel~="nofollow"])');
      links.forEach(link => {
        link.style.border = '2px solid green';
      });
    }
  });
  