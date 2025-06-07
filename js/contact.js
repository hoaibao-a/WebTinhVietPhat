document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form-element");

  // CHẮC CHẮN LUÔN ĐÚNG action
  form.action = "https://formsubmit.co/ngocthuydesign1012@gmail.com";

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        alert("Gửi thành công! Cảm ơn bạn đã liên hệ.");
        form.reset();
      } else {
        alert("Có lỗi xảy ra! Vui lòng thử lại sau.");
      }
    } catch (error) {
      alert("Có lỗi xảy ra! Vui lòng thử lại sau.");
    }
  });
});
