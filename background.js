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

let isRequestInProgress = false;

function generateUniqueId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function sendDataToWebhook(data, tabId) {
    if (isRequestInProgress) {
        console.log("Запрос уже выполняется, пропускаем дублирующий вызов");
        return;
    }

    isRequestInProgress = true;
    const requestId = generateUniqueId();
    console.log(`Отправка запроса на webhook. ID запроса: ${requestId}`);

    fetch('https://webhook.site/dd09f263-09cd-42dc-85e2-3b3c664d0486', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: data, requestId: requestId }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(result => {
            console.log(`Успешно отправлено на webhook. ID запроса: ${requestId}. Ответ:`, result);
            if (tabId) {
                chrome.tabs.sendMessage(tabId, {
                    action: "webhookResponse",
                    status: "Успешно",
                    data: result,
                    requestId: requestId
                }).catch(error => console.error("Ошибка при отправке ответа в content script:", error));
            }
        })
        .catch(error => {
            console.error(`Ошибка при отправке на webhook. ID запроса: ${requestId}:`, error);
            if (tabId) {
                chrome.tabs.sendMessage(tabId, {
                    action: "webhookResponse",
                    status: "Ошибка",
                    error: error.message,
                    requestId: requestId
                }).catch(error => console.error("Ошибка при отправке сообщения об ошибке в content script:", error));
            }
        })
        .finally(() => {
            isRequestInProgress = false;
        });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "logMessage") {
        console.log(request.message);
        sendResponse({ status: "Сообщение залогировано" });
    } else if (request.action === "sendToWebhook") {
        const tabId = sender.tab ? sender.tab.id : null;
        if (tabId) {
            sendDataToWebhook(request.data, tabId);
            sendResponse({ status: "Запрос отправлен" });
        } else {
            console.error("Не удалось определить tabId");
            sendResponse({ status: "Ошибка: не удалось определить tabId" });
        }
    }
    return true; // Оставляем соединение открытым для асинхронного ответа
});

console.log("Context / Clipboard: Background.js загружен");