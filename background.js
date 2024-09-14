chrome.runtime.onInstalled.addListener(() => {
    console.log("Расширение установлено/обновлено");
    chrome.contextMenus.create({
        id: "contextMenuParent",
        title: "Context",
        contexts: ["all"]
    });

    chrome.contextMenus.create({
        id: "techno",
        parentId: "contextMenuParent",
        title: "Techno",
        contexts: ["all"]
    });

    chrome.contextMenus.create({
        id: "politic",
        parentId: "contextMenuParent",
        title: "Politic",
        contexts: ["all"]
    });

    chrome.contextMenus.create({
        id: "clipboard",
        parentId: "contextMenuParent",
        title: "Clipboard",
        contexts: ["all"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "techno") {
        console.log("Выбрано Techno");

        fetch('https://openrouter.ai/api/v1/models')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log("Ответ от API:", data);
                // Отправляем данные в content script для вывода в консоль страницы
                chrome.tabs.sendMessage(tab.id, {
                    action: "logApiResponse",
                    data: data
                });
            })
            .catch(error => {
                console.error('Ошибка при запросе к API:', error);
                chrome.tabs.sendMessage(tab.id, {
                    action: "logApiError",
                    error: error.message
                });
            });
    } else if (info.menuItemId === "politic") {
        console.log("Выбрано Politic");
        chrome.tabs.sendMessage(tab.id, {
            action: "logMessage",
            message: "politic"
        });
    } else if (info.menuItemId === "clipboard") {
        console.log("Выбрано Clipboard");
        chrome.tabs.sendMessage(tab.id, {
            action: "logMessage",
            message: "clipboard"
        });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "logMessage") {
        console.log(request.message);
    } else if (request.action === "sendToWebhook") {
        sendDataToWebhook(request.data);
    }
});

function sendDataToWebhook(data) {
    fetch('https://webhook.site/dd09f263-09cd-42dc-85e2-3b3c664d0486', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: data }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); // Изменено с response.json() на response.text()
        })
        .then(result => {
            console.log('Успешно отправлено на webhook. Ответ:', result);
        })
        .catch(error => {
            console.error('Ошибка при отправке на webhook:', error);
        });
}

console.log("Context / Clipboard: Background.js загружен");