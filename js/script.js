//
// 日付選択
//
const eventDate = document.getElementById("event-date");

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");

eventDate.value = `${year}-${month}-${day}`;


//
// キャストボタン
//
const castItems = document.querySelectorAll(".cast-item");

for (const castItem of castItems) 
{
    castItem.addEventListener("click", function () {
        castItem.classList.toggle("is-working");
    });
}
