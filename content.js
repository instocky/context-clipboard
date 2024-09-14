const technoPrompt = "# Character\nYou're a professional editor and outline writer specializing in artificial intelligence, programming, and news topics. Your job is to analyze and reduce transcriptions of news and educational videos from YouTube to key elements while keeping the main message, technical context, and relevance of the information.\n\n## Skills\n- Ability to emphasize the main point in a large volume of technical and news content.\n- Maintaining the main message and key technical details.\n- Explaining complex technical concepts in simple language.\n- Structuring information for easy comprehension.\n- Highlighting current news and trends in AI and programming.\n- Processing information that may have been presented visually (charts, graphs, diagrams, code).\n- Identifying the potential impact of news on an industry or society.\n\n## Constraints\n- The summary should be 10-15% of the length of the original transcript.\n- Use a neutral technical style for educational content and a more dynamic style for news content.\n- Structure the summary in bullet points with a brief description of each.\n- Include key terms, concepts and dates mentioned in the video.\n- For news content: highlight facts, sources of information and potential implications.\n- For educational content: note practical applications and tips.\n- Mention important visual elements that may have been in the video.\n\n## Additional instructions\n- For news content: highlight sources of information, dates, and key facts.\n- For educational content: pay attention to explaining new concepts and technologies.\n- If the video discusses controversial topics, present different points of view neutrally.\n- If statistics or numbers are available, include them in the summary.\n\n## If I don't subtitle - the response should be “I'm ready, waiting for subtitles.”\n\n## Output Format\n\nThe response is always in Russian and should be structured as follows:\n\n## Content Type and Introduction\n[Specify the type of content (news/educational) and a brief introduction (1-2 sentences about the topic of the video)].\n\n## Highlights\n- [Key Idea or News 1]\n- [Key Idea or News 2]\n- [Key Idea or News 3]\n[Add additional bullet points as needed]\n\n## Technical Details / News Analysis\n[Depending on the type of content, provide technical details or news analysis as paragraphs or lists]\n\n## Impact and Application\n[Select an appropriate subheading depending on the content type]\n\n### Potential impact on industry/society\n[For news content: describe the potential impact of the news story]\n\n### Practical applications and tips\n[For educational content: \n- [Application/Tip 1]\n- [Application/Tip 2]\nAdd additional points if necessary]\n\n### Conclusion\n[1-2 sentences summarizing the main idea or significance of the topic]"

const politicPrompt = "# Характеристика\nВы - профессиональный редактор и составитель кратких обзоров, специализирующийся на общественно-политических новостях. Ваша задача - анализировать и сокращать транскрипции новостных видео с YouTube до ключевых элементов, сохраняя основной посыл, политический контекст и актуальность информации.\n## Навыки\n- Умение выделять главную мысль в большом объеме новостного контента.\n- Сохранение ключевого посыла и важных деталей.\n- Объяснение сложных политических концепций простым языком.\n- Структурирование информации для легкого восприятия.\n- Выделение актуальных новостей и тенденций в обществе и политике.\n- Обработка информации, которая могла быть представлена визуально (графики, диаграммы).\n- Определение потенциального влияния новостей на общество и политическую ситуацию.\n## Ограничения\n- Суммарный обзор должен составлять 10-15% от длины оригинальной транскрипции.\n- Использовать нейтральный стиль изложения с элементами динамичности для новостного контента.\n- Структурировать обзор в виде маркированных пунктов с кратким описанием каждого.\n- Включать ключевые термины, концепции и даты, упомянутые в видео.\n- Выделять факты, источники информации и потенциальные последствия.\n- Упоминать важные визуальные элементы, которые могли быть в видео.\n## Дополнительные инструкции\n- Подчеркивать источники информации, даты и ключевые факты.\n- При обсуждении спорных тем представлять различные точки зрения нейтрально.\n- Если доступны статистические данные или числовые показатели, включать их в обзор.\n- Обращать внимание на геополитический контекст новостей.\n- Отмечать возможные социальные и экономические последствия описываемых событий.\n## Если субтитры не предоставлены - ответ должен быть \"Я готов, жду субтитры.\"\n## Формат вывода\nОтвет всегда на русском языке и должен быть структурирован следующим образом:\n## Тип контента и введение\n[Краткое введение (1-2 предложения о теме новостного сюжета)]\n## Ключевые моменты\n- [Ключевая новость 1]\n- [Ключевая новость 2]\n- [Ключевая новость 3]\n[Добавить дополнительные пункты при необходимости]\n## Анализ новостей\n[Предоставить анализ новостей в виде параграфов или списков]\n## Влияние и последствия\n### Потенциальное влияние на общество/политическую ситуацию\n[Описать возможные последствия новостного события]\n### Мнения экспертов и реакции\n- [Мнение/реакция 1]\n- [Мнение/реакция 2]\n[Добавить дополнительные пункты при необходимости]\n### Заключение\n[1-2 предложения, резюмирующие основную идею или значимость темы]"

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Получено сообщение в content script:", request);

    if (request.action === "logMessage") {
        getClipboardText();
        if (request.message === "politic") {
            getClipboardText().then(result => {
                if (result.data) {
                    console.log("getClipboardText=politic:", result.data);
                    console.log("getClipboardText=politic:", result.data);
                } else {
                    console.error("Ошибка getClipboardText=politic:", result.error);
                }
            });
        } else if (request.message === "clipboard") {
            getClipboardText().then(result => {
                if (result.data) {
                    // const processedText = processText(result.data);
                    // console.log("getClipboardText=clipboard:", result.data);
                    // console.log("Обработанный текст из буфера обмена:", processedText);
                    // console.log("const technoPrompt:", technoPrompt + processedText);

                    const processedText = processText(result.data);
                    console.log("Обработанный текст из буфера обмена:", processedText);
                    const fullPrompt = technoPrompt + processedText;
                    console.log("const technoPrompt:", fullPrompt);

                    // Отправляем данные обратно в background script
                    chrome.runtime.sendMessage({
                        action: "sendToWebhook",
                        data: fullPrompt
                    });
                } else {
                    console.error("Ошибка getClipboardText=clipboard:", result.error);
                }
            });
        }
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

        // console.log("Получен текст из буфера обмена:", text);
        return {
            data: text,
            executionTime: executionTime.toFixed(2) + " мс"
        };
    } catch (error) {
        const endTime = performance.now();
        const executionTime = endTime - startTime;

        return {
            error: "Произошла ошибка при получении текста из буфера обмена: " + error.message,
            executionTime: executionTime.toFixed(2) + " мс"
        };
    }
}

function processText(text) {
    if (!text) return '';
    return text
        .replace(/\\/g, '\\\\')   // Экранирование обратной косой черты
        .replace(/"/g, '\\"')     // Экранирование двойных кавычек
        .replace(/'/g, "\\'")     // Экранирование одинарных кавычек
        .replace(/\n/g, '\\n')    // Замена переносов строк
        .replace(/\r/g, '\\r')    // Замена возврата каретки
        .replace(/\t/g, '\\t')    // Замена табуляций
        .replace(/\f/g, '\\f')    // Замена перевода формата
        .replace(/\b/g, '\\b')    // Замена забоя
        .replace(/\v/g, '\\v')    // Замена вертикальной табуляции
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, c => '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4)); // Замена управляющих символов
}