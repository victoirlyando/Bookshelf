let books = [];
const LIST_BELUM_SELESAI = "listBelumSelesai";
const LIST_SELESAI = "listSelesai";
const ITEM_ID_BUKU = "itemId";
const STORAGE_KEY = "BOOK_APPS";

function hasilObjekBuku(title, author, year, isCompleted) {
  return {
    id: +new Date(),
    title,
    author,
    year,
    isCompleted,
  };
}

function temukanBuku(IDbuku) {
  for (book of books) {
    if (book.id === IDbuku) return book;
  }
  return null;
}

function temukanBukuIndex(IDbuku) {
  let index = 0;
  for (book of books) {
    if (book.id === IDbuku) return index;

    index++;
  }
  return -1;
}
function cekPenyimpanan() {
  if (typeof Storage === undefined) {
    alert("Browser anda tidak mendukung local storage");
    return false;
  }
  return true;
}

function simpanData() {
  const parsed = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, parsed);
  document.dispatchEvent(new Event("ondatasaved"));
}

function unduhDataStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  let data = JSON.parse(serializedData);

  if (data !== null) books = data;

  document.dispatchEvent(new Event("ondataloaded"));
}

function updateKeStorage() {
  if (cekPenyimpanan()) simpanData();
}

function masukanBuku() {
  const listBelumSelesai = document.getElementById(
    LIST_BELUM_SELESAI
  );
  const listSelesai = document.getElementById(
    LIST_SELESAI
  );

  const inputJudulBuku = document.getElementById("inputJudulBuku").value;
  const inputPenulisBuku = document.getElementById("inputPenulisBuku").value;
  const inputTahunBuku = document.getElementById("inputTahunBuku").value;
  const inputBukuSelesai = document.getElementById(
    "inputBukuSelesai"
  ).checked;

  const book = buatBuku(
    inputJudulBuku,
    inputPenulisBuku,
    inputTahunBuku,
    inputBukuSelesai
  );
  const bookObject = hasilObjekBuku(
    inputJudulBuku,
    inputPenulisBuku,
    inputTahunBuku,
    inputBukuSelesai
  );

  book[ITEM_ID_BUKU] = bookObject.id;
  books.push(bookObject);

  if (inputBukuSelesai == false) {
    listBelumSelesai.append(book);
  } else {
    listSelesai.append(book);
  }

  updateKeStorage();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitBuku = document.getElementById("inputBuku");
  submitBuku.addEventListener("submit", function (event) {
    event.preventDefault();
    masukanBuku();
  });

  const cariBukus = document.getElementById("cariBuku");
  cariBukus.addEventListener("submit", function (event) {
    event.preventDefault();
    cariBuku();
  });

  if (cekPenyimpanan()) {
    unduhDataStorage();
  }
});
function buatBuku(
  inputJudulBuku,
  inputPenulisBuku,
  inputTahunBuku,
  inputBukuSelesai
) {
  const JudulBuku = document.createElement("h3");
  JudulBuku.innerText = inputJudulBuku;
  JudulBuku.classList.add("move");

  const PenulisBuku = document.createElement("p");
  PenulisBuku.innerText = inputPenulisBuku;

  const TahunBukus = document.createElement("p");
  TahunBukus.classList.add("year");
  TahunBukus.innerText = inputTahunBuku;

  const BukuSelesai = buatTombolSelesai();

  const hapusBuku = buatTombolHapus();
  hapusBuku.innerText = "Hapus";

  const aksiBuku = document.createElement("div");
  aksiBuku.classList.add("action");
  if (inputBukuSelesai == true) {
    BukuSelesai.innerText = "Belum selesai";
  } else {
    BukuSelesai.innerText = "Sudah selesai";
  }
  aksiBuku.append(BukuSelesai, hapusBuku);
  const itemBuku = document.createElement("article");
  itemBuku.classList.add("item_buku");
  itemBuku.append(JudulBuku, PenulisBuku, TahunBukus, aksiBuku);

  return itemBuku;
}

function buatTombolSelesai() {
  return buatTombol("green", function (event) {
    const parent = event.target.parentElement;
    masukanBukuToCompleted(parent.parentElement);
  });
}
function buatTombol(buttonTypeClass, eventListener) {
  const button = document.createElement("button");
  button.classList.add(buttonTypeClass);
  button.addEventListener("click", function (event) {
    eventListener(event);
  });
  return button;
}

function buatTombolHapus() {
  return buatTombol("red", function (event) {
    const parent = event.target.parentElement;
    hapusBuku(parent.parentElement);
  });
}
function hapusBuku(bookElement) {
  const bookPosition = temukanBukuIndex(bookElement[ITEM_ID_BUKU]);
  if (window.confirm("Anda Yakin Ingin Menghapusnya?")) {
    books.splice(bookPosition, 1);
    bookElement.remove();
  }
  updateKeStorage();
}

function masukanBukuToCompleted(bookElement) {
  const JudulBukud = bookElement.querySelector(".item_buku > h3").innerText;
  const PenulisBukued = bookElement.querySelector(".item_buku > p").innerText;
  const TahunBukued = bookElement.querySelector(".year").innerText;
  const BukuSelesai = bookElement.querySelector(".green").innerText;

  if (BukuSelesai == "Sudah selesai") {
    const bukuBaru = buatBuku(JudulBukud, PenulisBukued, TahunBukued, true);

    const book = temukanBuku(bookElement[ITEM_ID_BUKU]);
    book.isCompleted = true;
    bukuBaru[ITEM_ID_BUKU] = book.id;

    const listSelesai = document.getElementById(
      LIST_SELESAI
    );
    listSelesai.append(bukuBaru);
  } else {
    const bukuBaru = buatBuku(JudulBukud, PenulisBukued, TahunBukued, false);

    const book = temukanBuku(bookElement[ITEM_ID_BUKU]);
    book.isCompleted = false;
    bukuBaru[ITEM_ID_BUKU] = book.id;

    const listBelumSelesai = document.getElementById(
      LIST_BELUM_SELESAI
    );
    listBelumSelesai.append(bukuBaru);
  }
  bookElement.remove();

  updateKeStorage();
}

function refreshDataKebukus() {
  const listBukuBelumSelesai = document.getElementById(LIST_BELUM_SELESAI);
  const listBukuSelesai = document.getElementById(LIST_SELESAI);

  for (book of books) {
    const bukuBaru = buatBuku(
      book.title,
      book.author,
      book.year,
      book.isCompleted
    );
    bukuBaru[ITEM_ID_BUKU] = book.id;

    if (book.isCompleted == false) {
      listBukuBelumSelesai.append(bukuBaru);
    } else {
      listBukuSelesai.append(bukuBaru);
    }
  }
}

function cariBuku() {
  const inputYangDicari = document.getElementById("cariJudulBuku").value;
  const pindahBuku = document.querySelectorAll(".move");

  for (move of pindahBuku) {
    if (inputYangDicari !== move.innerText) {
      console.log(move.innerText);
      move.parentElement.remove();
    }
  }
}
document.addEventListener("ondatasaved", () => {
  console.log("Data berhasil disimpan.");
});
document.addEventListener("ondataloaded", () => {
  refreshDataKebukus();
});

function gantiKata() {
  const checkbox = document.getElementById("inputBukuSelesai");
  const textSubmit = document.getElementById("textSubmit");

  if (checkbox.checked == true) {
    textSubmit.innerText = "Sudah selesai dibaca";
  } else {
    textSubmit.innerText = "Belum selesai dibaca";
  }
}
