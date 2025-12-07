// Конфигурация
const FORMCARRY_ENDPOINT = "https://formcarry.com/s/oEt644OkYLs";
const MODAL_ID = "feedbackModal";
const FORM_ID = "feedbackForm";
const STORAGE_KEY = "feedbackFormData";

// Элементы DOM
const feedbackBtn = document.getElementById("feedbackBtn");
const modal = document.getElementById(MODAL_ID);
const form = document.getElementById(FORM_ID);
const closeBtn = modal.querySelector(".modal-close");
const cancelBtn = modal.querySelector(".btn-cancel");
const messageDiv = document.getElementById("formMessage");

// Сохранение данных в LocalStorage
function saveFormData() {
    const formData = {
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        organization: document.getElementById("organization").value,
        message: document.getElementById("message").value,
        privacyPolicy: document.getElementById("privacyPolicy").checked
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
}

// Восстановление данных из LocalStorage
function loadFormData() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        const formData = JSON.parse(savedData);
        document.getElementById("fullName").value = formData.fullName || "";
        document.getElementById("email").value = formData.email || "";
        document.getElementById("phone").value = formData.phone || "";
        document.getElementById("organization").value = formData.organization || "";
        document.getElementById("message").value = formData.message || "";
        document.getElementById("privacyPolicy").checked = formData.privacyPolicy || false;
    }
}

// Очистка данных из LocalStorage
function clearFormData() {
    localStorage.removeItem(STORAGE_KEY);
    form.reset();
}

// Показать сообщение
function showMessage(text, type = "info") {
    messageDiv.textContent = text;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.display = "block";
    
    if (type === "success") {
        setTimeout(() => {
            messageDiv.style.display = "none";
        }, 5000);
    }
}

// Открыть модальное окно
function openModal() {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden"; // Блокируем прокрутку страницы
    
    // Добавляем в историю браузера
    history.pushState({ modalOpen: true }, "", "#feedback");
    
    // Загружаем сохраненные данные
    loadFormData();
    
    // Фокус на первое поле
    document.getElementById("fullName").focus();
}

// Закрыть модальное окно
function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = ""; // Восстанавливаем прокрутку
    
    // Убираем из истории браузера
    if (window.location.hash === "#feedback") {
        history.back();
    }
}

// Отправка формы через Fetch API
async function submitForm(formData) {
    try {
        showMessage("Отправка данных...", "info");
        
        const response = await fetch(FORMCARRY_ENDPOINT, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            showMessage("Сообщение успешно отправлено! Спасибо за обратную связь.", "success");
            clearFormData();
            setTimeout(closeModal, 2000);
        } else {
            throw new Error("Ошибка отправки");
        }
    } catch (error) {
        console.error("Ошибка отправки формы:", error);
        showMessage("Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.", "error");
    }
}

// Обработчики событий
feedbackBtn.addEventListener("click", openModal);

closeBtn.addEventListener("click", closeModal);

cancelBtn.addEventListener("click", closeModal);

// Закрытие по клику вне формы
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Обработка кнопки "Назад" в браузере
window.addEventListener("popstate", (e) => {
    if (!window.location.hash.includes("feedback")) {
        closeModal();
    }
});

// Сохранение данных при вводе
form.addEventListener("input", saveFormData);

// Отправка формы
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Собираем данные формы
    const formData = {
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        organization: document.getElementById("organization").value,
        message: document.getElementById("message").value,
        privacyPolicy: document.getElementById("privacyPolicy").checked
    };
    
    // Валидация
    if (!formData.privacyPolicy) {
        showMessage("Необходимо согласиться с политикой обработки данных", "error");
        return;
    }
    
    if (!formData.fullName || !formData.email || !formData.message) {
        showMessage("Пожалуйста, заполните обязательные поля", "error");
        return;
    }
    
    // Отправляем форму
    await submitForm(formData);
});

// Закрытие по ESC
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "flex") {
        closeModal();
    }
});

// Инициализация
console.log("Форма обратной связи загружена. Endpoint:", FORMCARRY_ENDPOINT);