const castItems = document.querySelectorAll(".cast-item");

for (const castItem of castItems) 
{
    castItem.addEventListener("click", function () {
        castItem.classList.toggle("is-working");
    });
}
