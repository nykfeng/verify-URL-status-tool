const modalMessage = function (message) {
  const html = `
    <div class="modal-popup-background">
        <div class="modal-popup-box flex-column">
          <div class="modal-popup-title">
            <span>Error encountered</span>
          </div>
          <div class="modal-popup-message">
            <span>${message}</span>
          </div>
          <div class="modal-popup_btn-box">
            <button class="confirm_button--ok">OK</button>
          </div>
        </div>
      </div>
      `;
  const errorModal = document.querySelector(".confirm_dialog-background");
  if (!errorModal) {
    document.querySelector("body").insertAdjacentHTML("beforeend", html);
  }
};

// To remove the modal popup box and its background
const removeModalBox = function () {
  document.querySelector("body").addEventListener("click", function (e) {
    if (
      e.target.classList.contains("modal-popup-background") ||
      e.target.classList.contains("confirm_button--ok")
    ) {
      if (document.querySelector(".modal-popup-background"))
        document.querySelector(".modal-popup-background").remove();
    }
  });
};

export default {
  modalMessage,
  removeModalBox,
};
