chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Получено сообщение в content script:", request);

    if (request.action === "logMessage") {
        getClipboardText();
        // copyToClipboard(request.message);
        // console.log(text);
    } else if (request.action === "logApiResponse") {
        console.log("Ответ от API:", request.data);
    } else if (request.action === "logApiError") {
        console.error("Ошибка при запросе к API:", request.error);
    }

    sendResponse({ status: "Сообщение получено" });
    return true;
});

console.log("Content script загружен и готов к приему сообщений");

// Работа с Clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Информация скопирована в буфер обмена');
    }).catch(err => {
        console.error('Ошибка при копировании: ', err);
    });
}

async function getClipboardText() {
    console.log("Получение текста из буфера обмена");
    const startTime = performance.now();

    try {
        const text = await navigator.clipboard.readText();
        const endTime = performance.now();
        const executionTime = endTime - startTime;

        console.log("Получен текст из буфера обмена:", text);
        return {
            data: text,
            executionTime: executionTime.toFixed(2) + " мс"
        };
    } catch (error) {
        const endTime = performance.now();
        const executionTime = endTime - startTime;

        console.error("Ошибка при получении текста из буфера обмена:", error);
        return {
            error: "Произошла ошибка при получении текста из буфера обмена: " + error.message,
            executionTime: executionTime.toFixed(2) + " мс"
        };
    }
}