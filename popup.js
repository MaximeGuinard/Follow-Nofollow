document.addEventListener('DOMContentLoaded', function() {
    const highlightNofollowButton = document.getElementById('highlightNofollow');
    const highlightDofollowButton = document.getElementById('highlightDofollow');
    const exportNofollowButton = document.getElementById('exportNofollow');
    const resetHighlightsButton = document.getElementById('resetHighlights');
    let nofollowHighlighted = false;
    let dofollowHighlighted = false;
  
    highlightNofollowButton.addEventListener('click', function() {
      if (nofollowHighlighted) {
        resetHighlights();
        nofollowHighlighted = false;
      } else {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: highlightNofollowLinks
          });
        });
        nofollowHighlighted = true;
      }
    });
  
    highlightDofollowButton.addEventListener('click', function() {
      if (dofollowHighlighted) {
        resetHighlights();
        dofollowHighlighted = false;
      } else {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: highlightDofollowLinks
          });
        });
        dofollowHighlighted = true;
      }
    });
  
    exportNofollowButton.addEventListener('click', function() {
      exportLinks('nofollow');
    });
  
    resetHighlightsButton.addEventListener('click', function() {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: resetHighlights
        });
      });
      nofollowHighlighted = false;
      dofollowHighlighted = false;
    });
  
    function highlightNofollowLinks() {
      const links = document.querySelectorAll('a[rel~="nofollow"]');
      links.forEach(link => {
        link.style.border = '2px solid red';
      });
    }
  
    function highlightDofollowLinks() {
      const links = document.querySelectorAll('a:not([rel~="nofollow"])');
      links.forEach(link => {
        link.style.border = '2px solid green';
      });
    }
  
    function resetHighlights() {
      const links = document.querySelectorAll('a');
      links.forEach(link => {
        link.style.border = 'none';
      });
    }
  
    function exportLinks(rel) {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: function(rel) {
            const links = Array.from(document.querySelectorAll(`a[rel~="${rel}"]`));
            const csvContent = links.map(link => `${link.href},${link.textContent}`).join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${rel}_links.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          },
          args: [rel]
        });
      });
    }
  });
  