let bible = [];

// HTML의 select 태그 가져오기
const bookSelect = document.getElementById("bookSelect");
const chapterSelect = document.getElementById("chapterSelect");
const verseSelect = document.getElementById("verseSelect");

const chapterTitle = document.getElementById("chapterTitle");
const prevChapterBtn = document.getElementById("prevChapter");
const nextChapterBtn = document.getElementById("nextChapter");
const bibleContent = document.getElementById("bibleContent");

// 성경 데이터 읽기
async function loadBible() {

    const response = await fetch("data/bible.json");

    bible = await response.json();

    console.log(bible);

    console.log(bible[0]);

    createBookList();

}

// 책 목록 생성
function createBookList(){

    bookSelect.innerHTML = "";

    bible.forEach((book, index)=>{

        const option = document.createElement("option");

        option.value = index;

        option.textContent = book.korean;

        bookSelect.appendChild(option);

    });

    createChapterList(0);

    createVerseList(0,0);

    showChapter(0,0);

    }

function createVerseList(bookIndex, chapterIndex){

    verseSelect.innerHTML = "";

    const verses = bible[bookIndex].chapters[chapterIndex].verses;

    verses.forEach((verse, index)=>{

        const option = document.createElement("option");

        option.value = index;

        option.textContent = verse.verseNum + "절";

        verseSelect.appendChild(option);

    });

}

function showChapter(bookIndex, chapterIndex){

    const chapter = bible[bookIndex].chapters[chapterIndex];

    chapterTitle.textContent =
        bible[bookIndex].korean + " " +
        chapter.chapterNum + "장";

    bibleContent.innerHTML = "";

    chapter.verses.forEach((verse)=>{

        const div = document.createElement("div");

        div.className = "verse";

        div.id = "verse-" + verse.verseNum;

        div.innerHTML =
            "<span class='verse-number'>"
            + verse.verseNum +
            "</span> "
            + verse.verse;

        bibleContent.appendChild(div);

    });

}

function moveChapter(direction){

    console.log("moveChapter 실행!", direction);

    let bookIndex = Number(bookSelect.value);
    let chapterIndex = Number(chapterSelect.value);

    chapterIndex += direction;

    // 이전 장
    if(chapterIndex < 0){

        if(bookIndex > 0){

            bookIndex--;

            chapterIndex = bible[bookIndex].chapters.length - 1;

        }else{

            return;

        }

    }

    // 다음 장
    if(chapterIndex >= bible[bookIndex].chapters.length){

        if(bookIndex < bible.length - 1){

            bookIndex++;

            chapterIndex = 0;

        }else{

            return;

        }

    }

    bookSelect.value = bookIndex;

    createChapterList(bookIndex);

    chapterSelect.value = chapterIndex;

    createVerseList(bookIndex, chapterIndex);

    verseSelect.value = 0;

    showChapter(bookIndex, chapterIndex);

}

// 장 목록 생성
function createChapterList(bookIndex){

    chapterSelect.innerHTML = "";

    const chapters = bible[bookIndex].chapters;

    chapters.forEach((chapter, index)=>{

        const option = document.createElement("option");

        option.value = index;

        option.textContent = chapter.chapterNum + "장";

        chapterSelect.appendChild(option);

    });

}

bookSelect.addEventListener("change", ()=>{

    const selectedBook = bookSelect.value;

    createChapterList(selectedBook);

    createVerseList(selectedBook,0);

    showChapter(selectedBook,0);

});

loadBible();

chapterSelect.addEventListener("change", ()=>{

    createVerseList(

        bookSelect.value,

        chapterSelect.value

    );

    showChapter(

        bookSelect.value,

        chapterSelect.value

    );

});

verseSelect.addEventListener("change", ()=>{

    const verseNumber = Number(verseSelect.value) + 1;

    const verses = document.querySelectorAll(".verse");

    verses[verseNumber-1].scrollIntoView({

        behavior:"smooth",

        block:"start"

    });

});

prevChapterBtn.addEventListener("click", ()=>{

    moveChapter(-1);

});

nextChapterBtn.addEventListener("click", ()=>{

    moveChapter(1);

});
