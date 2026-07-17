let count = 0;
const countEl = document.getElementById("count");

document.getElementById("increment").addEventListener("click", () => {
  count += 1;
  countEl.textContent = count;
});

document.getElementById("reset").addEventListener("click", () => {
  count = 0;
  countEl.textContent = count;
});

document.getElementById("test-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const result = document.getElementById("form-result");
  result.textContent = name ? `${name}さん、送信されました。` : "名前を入力してください。";
});
