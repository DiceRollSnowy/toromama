const castItems = document.querySelectorAll(".cast-item");
const createButton = document.querySelector(".create-button");
const eventDate = document.getElementById("event-date");

const FONT_FAMILY = '"M PLUS Rounded 1c"';
const FONT_DATE = "bold 72px 'M PLUS Rounded 1c'";
const FONT_OYASUMI = "bold 42px 'M PLUS Rounded 1c'";

const BASE_FILE = "images/base/castlist_base.png";

const WEEK_NAMES = ["日", "月", "火", "水", "木", "金", "土"];

// ========================================
// 日付選択
// ========================================

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");

eventDate.value = `${year}-${month}-${day}`;


// ========================================
// キャスト選択
// ========================================
for (const castItem of castItems) 
{
    castItem.addEventListener("click", function () {
        castItem.classList.toggle("is-working");
    });
}

// ========================================
// 出勤表作成 (ボタン押下)
// ========================================

createButton.addEventListener("click", async function () {

    await document.fonts.load(`${FONT_DATE}`);

    createAttendanceImage();
});

// ========================================
// 出勤表画像を作成
// ========================================

function createAttendanceImage() 
{
    const image = new Image();

    image.onload = function () {

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = image.width;
        canvas.height = image.height;

        // テンプレート画像を描画
        context.drawImage(image, 0, 0);

        // 日付を描画
        drawEventDate(context, eventDate.value);

        // おやすみを描画
        drawRestingCast(context);

        // プレビューに表示
        showPreview(canvas);
    };

    image.src = `${BASE_FILE}`;
}

// ========================================
// 日付
// ========================================

function drawEventDate(context, dateValue) 
{
    if (dateValue === "") 
    {
        return;
    }

    const date = new Date(dateValue);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(1, "0");
    const day = String(date.getDate()).padStart(1, "0");
    const week = WEEK_NAMES[date.getDay()];

    const text = `${year}年${month}月${day}日(${week})`;

    const x = 100;
    const y = 120;

    //context.font = `bold 72px ${FONT_FAMILY}`;
    context.font = `${FONT_DATE}`;
    context.textAlign = "left";
    context.textBaseline = "middle";
    context.letterSpacing = "8px";

    // 境界線1
    context.lineWidth = 24;
    context.strokeStyle = "#ffffff";
    context.strokeText(text, x, y);
    
    // 境界線2
    context.lineWidth = 14;
    context.strokeStyle = "#8866ff";
    context.strokeText(text, x, y);

    // 文字色
    context.fillStyle = "#ffffff";
    context.fillText(text, x, y);
}

// ========================================
// おやすみキャスト
// ========================================

function drawRestingCast(context) 
{
    const castPositions = [
        { x: 235, y: 418 },
        { x: 553, y: 420 },
        { x: 876, y: 420 },
        { x: 1200, y: 420 },

        { x: 235, y: 815 },
        { x: 553, y: 817 },
        { x: 876, y: 817 },
        { x: 1200, y: 817 },

        { x: 235, y: 1216 },
        { x: 553, y: 1218 },
        { x: 876, y: 1218 },
        { x: 1200, y: 1218 },

        { x: 235, y: 1625 },
        { x: 553, y: 1627 },
        { x: 876, y: 1627 },
        { x: 1200, y: 1627 }
    ];

    for (let i = 0; i < castItems.length; i++) 
    {
        const castItem = castItems[i];

        // 出勤なら何もしない
        if (castItem.classList.contains("is-working"))
        {
            continue;
        }

        const position = castPositions[i];

        drawRestingOverlay(
            context,
            position.x,
            position.y
        );
    }
}

// ========================================
// おやすみ表示
// ========================================

function drawRestingOverlay(context, centerX, centerY)
{
    const width = 320;
    const height = 330;

    const left = centerX - width / 2;
    const top = centerY - height / 2;

    context.save();

    // 六角形
    context.beginPath();

    context.moveTo(
        centerX - width / 2,
        centerY
    );

    context.lineTo(
        centerX - width * 0.25,
        centerY - height / 2
    );

    context.lineTo(
        centerX + width * 0.25,
        centerY - height / 2
    );

    context.lineTo(
        centerX + width / 2,
        centerY
    );

    context.lineTo(
        centerX + width * 0.25,
        centerY + height / 2
    );

    context.lineTo(
        centerX - width * 0.25,
        centerY + height / 2
    );

    context.closePath();

    // 六角形の中だけに描画
    context.clip();

    // 黒い半透明
    context.fillStyle = "rgba(0, 0, 0, 0.50)";

    context.fillRect(
        left,
        top,
        width,
        height
    );

    // おやすみ
    context.fillStyle = "#ffffff";
    context.font = `${FONT_OYASUMI}`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.letterSpacing = "0px";

    context.fillText(
        "おやすみ",
        centerX,
        centerY + 100
    );

    context.restore();
}

// ========================================
// プレビュー
// ========================================

let createdCanvas = null;

function showPreview(canvas) 
{
    const preview = document.querySelector(".preview");
    preview.innerHTML = "";

    const image = document.createElement("img");
    image.src = canvas.toDataURL("image/png");
    image.alt = `CastList_${eventDate.value}`;

    preview.appendChild(image);

    createdCanvas = canvas;
}

// ========================================
// ダウンロード
// ========================================

const downloadButton = document.querySelector(".download-button");

downloadButton.addEventListener("click", function () {
    if (createdCanvas === null)
    {
        return;
    }

    const link = document.createElement("a");

    link.href = createdCanvas.toDataURL("image/png");
    link.download = `CastList_${eventDate.value}.png`;

    link.click();
});
