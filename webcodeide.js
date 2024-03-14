// ==UserScript==
// @name         WebCodeIDE
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a Visual Studio Code style code editor to webpages for editing HTML, CSS, and JavaScript.
// @author       CE.OG
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    let codeEditorDiv;
    let codeEditor;
    let minimized = false;

    function loadAceEditor() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js';
            script.type = 'text/javascript';
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }

    async function createWindow() {
        await loadAceEditor();

        const windowDiv = document.createElement('div');
        windowDiv.id = 'code-window';
        windowDiv.style.position = 'fixed';
        windowDiv.style.top = '50px';
        windowDiv.style.left = '50px';
        windowDiv.style.width = '800px';
        windowDiv.style.height = '500px';
        windowDiv.style.backgroundColor = '#f1f1f1';
        windowDiv.style.border = '1px solid #ccc';
        windowDiv.style.borderRadius = '5px';
        windowDiv.style.zIndex = '9999';
        windowDiv.style.overflow = 'hidden';
        document.body.appendChild(windowDiv);

        // Title bar
        const titleBar = document.createElement('div');
        titleBar.style.backgroundColor = '#ddd';
        titleBar.style.padding = '5px';
        titleBar.style.cursor = 'move';
        titleBar.style.userSelect = 'none';
        titleBar.innerHTML = 'Code Editor';
        windowDiv.appendChild(titleBar);


        // Close button
        const closeButton = document.createElement('span');
        closeButton.innerHTML = '&#x2715;';
        closeButton.style.float = 'right';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = closeWindow;
        titleBar.appendChild(closeButton);
        // Minimize button
        const minimizeButton = document.createElement('span');
        minimizeButton.innerHTML = '&#x2500;';
        minimizeButton.style.float = 'right';
        minimizeButton.style.cursor = 'pointer';
        minimizeButton.onclick = toggleMinimize;
        titleBar.appendChild(minimizeButton);
        // Run button
        const runButton = document.createElement('button');
        runButton.textContent = 'Run';
        runButton.style.float = 'middle';
        runButton.onclick = runCode;
        titleBar.appendChild(runButton);

        // Code editor
        codeEditorDiv = document.createElement('div');
        codeEditorDiv.style.height = 'calc(100% - 30px)';
        windowDiv.appendChild(codeEditorDiv);

        codeEditor = ace.edit(codeEditorDiv);
        codeEditor.setTheme("ace/theme/chaos");
        codeEditor.getSession().setMode("ace/mode/javascript");
    }

    function toggleMinimize() {
        const windowDiv = document.getElementById('code-window');
        minimized = !minimized;
        if (minimized) {
            windowDiv.style.height = '30px';
            codeEditorDiv.style.display = 'none';
        } else {
            windowDiv.style.height = '500px';
            codeEditorDiv.style.display = 'block';
        }
    }

    function closeWindow() {
        const windowDiv = document.getElementById('code-window');
        windowDiv.parentNode.removeChild(windowDiv);
    }

    function runCode() {
        const code = codeEditor.getValue();
        try {
            new Function(code)();
        } catch (error) {
            console.error(error);
        }
    }

    createWindow();

    // Add CSS to style the title bar
    GM_addStyle(`
        #code-window > div {
            -webkit-app-region: drag;
        }
    `);

})();
