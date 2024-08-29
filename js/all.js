//ㄧ、先將json資料撈出並渲染
//撈取資料函式 //初始化
let newData = []; //1.宣告變數跟空陣列 
function getData() {
  //let newData = []; //1.宣告變數跟空陣列 //也可放這裡，但因為外層有別的函式需套用newData，所以將newData移到外層，亦不影響運作 
  axios.get('https://hexschool.github.io/js-filter-data/data.json', newData)
    .then(function (response) {
      newData = response.data; //2.往外層找newData，並載入json資料
      //console.log(newData); //3.檢查有沒有成功載入
      renderData(newData); //7.執行渲染函式
    })
    .catch(function (err) {
      console.log(err);
    })
}

getData() //8.執行撈取資料函式

//渲染函式
const showList = document.querySelector(".showList"); //4.選取showList
function renderData(showData) {
  let str = "";
  showData.forEach(function (item) { //5.將篩選出的每一個newData加入str
    str += `<tr>
        <td>${item.作物名稱}</td>
        <td>${item.市場名稱}</td>
        <td>${item.上價}</td>
        <td>${item.中價}</td>
        <td>${item.下價}</td>
        <td>${item.平均價}</td>
        <td>${item.交易量}</td>
        </tr>`
  });
  showList.innerHTML = str; //6.渲染到showList
}

//二、撰寫排順code
//點擊到符合條件的DOM元素所在位置，將執行排順
//適用於第一列點擊上下箭頭
const sortAdvanced = document.querySelector(".js-sort-advanced"); //選取第一列
sortAdvanced.addEventListener("click", function (e) {
  if (e.target.nodeName === "I") { //點擊上下箭頭的標籤位置<i>，執行排順
    const sortPrice = e.target.getAttribute("data-price");
    const sortCaret = e.target.getAttribute("data-sort");
    if (filterData.length > 0) { //排順篩選資料
      FilterSortData(sortPrice, sortCaret);
    }
    else { //排順所有資料
      GetSortData(sortPrice, sortCaret);
    }
  }

});

//綁定 Select 選單，並給一個 change 事件
//適用於選單選取
const select = document.querySelector("#js-select");
select.addEventListener("change", function (e) {
  // console.log(e.target.value);
  if (e.target.value !== "排序篩選") { //點擊「排序篩選」以外的選項，執行排順
    const sortPrice = this.options[this.selectedIndex].value;
    if (filterData.length > 0) { //排順篩選資料
      FilterSortData(sortPrice, "down");
    }
    else { //排順所有資料
      GetSortData(sortPrice, "down");
    }
  }
});

//排順函式 //點擊上下箭頭，即執行排順
//針對所有資料
function GetSortData(sortPrice, sortCaret) {
  if (sortCaret === "up") { //點擊「up」上箭頭屬性質，執行從小到大排序
    newData.sort(function (a, b) {
      return a[sortPrice] - b[sortPrice]; //從小到大排序
    });
  } else { //若點擊到「down」下箭頭，執行從大到小排序
    newData.sort(function (a, b) {
      return b[sortPrice] - a[sortPrice]; //從大到小排序
    });
  }
  renderData(newData); //排順後，重新初始化
}
//sort() 對一個陣列的所有元素進行排序，並回傳此陣列。

//針對篩選資料
function FilterSortData(sortPrice, sortCaret) {
  if (sortCaret === "up") { //點擊「up」上箭頭屬性質，執行從小到大排序
    filterData.sort(function (a, b) {
      return a[sortPrice] - b[sortPrice]; //從小到大排序
    });
  } else { //若點擊到「down」下箭頭，執行從大到小排序
    filterData.sort(function (a, b) {
      return b[sortPrice] - a[sortPrice]; //從大到小排序
    });
  }
  renderData(filterData); //排順後，重新初始化
}



//三、搜尋功能
const search = document.querySelector(".seach-group");
const searchText = document.querySelector("#crop");
search.addEventListener('keypress', function (e) {
  if (e.key == 'Enter') {
    searchData();

    //按下enter鍵後，篩選農產品種類active清除(背景清除)
    document.querySelectorAll(".btn").forEach(function (item, index) {
      item.classList.remove("active");
    });

    console.log('鍵盤enter鍵')
  }
})

search.addEventListener('click', function (e) {//監聽點擊事件
  if (e.target.getAttribute('type') == "button") {//點擊到button 搜尋按鈕
    searchData();

    //點擊搜尋按鈕後，篩選農產品種類active清除(背景清除)
    document.querySelectorAll(".btn").forEach(function (item, index) {
      item.classList.remove("active");
    });

    console.log('滑鼠點擊')
  }
})

//輸入欄位清空，重新渲染全部資料
searchText.addEventListener('keydown', function (e) {
  //需符合三個條件，才會執行
  if (e.key == 'Backspace' && searchText.value.length == 1 && filterData.length == 0) {
    filterData = '' //篩選資料也順便清空，若沒清空，篩選資料永遠在，將無法排順全部資料
    renderData(newData) //重新初始化
    console.log('鍵盤事件已執行')
    
    //重新初始化的同時，幫「全部」按鈕加上active（背景常亮）
    document.querySelectorAll(".allBtn").forEach(function (item, index) {
      item.classList.add("active");
    });

  }

});

//searchText.value.length <= 1

let filterData = []; //篩選出的資料放這裡
function searchData() {
  filterData = newData.filter((item) => { //搜尋符合一個字以上，跳出相對應的資料
    //filter() 根據你指定的測試函數，從一個陣列中篩選出符合條件的元素
    if (item.作物名稱 != null) {
      return item.作物名稱.match(searchText.value.trim());
      // match() 當輸入的文字有部分相符，會把該產品列出來
    }
    // console.log('執行1')
  })
  renderData(filterData);
  console.log(filterData.length)



  if (searchText.value == "") { //輸入欄位空白，跳出警告視窗
    alert("請輸入作物名稱！");
    // console.log('執行2')
    return;
  }
  else if (filterData.length == 0) { //filterData無資料，即查無資料，渲染抱歉文字訊息
    showList.innerHTML = '<tr><td colspan="7" class="text-center p-3">很抱歉！查無交易資訊！</td></tr>'
    // console.log('執行3')
  }
}



//四、篩選農產品種類
const buttonGroup = document.querySelector('.button-group')
buttonGroup.addEventListener('click', function (e) {
  if (e.target.nodeName == "BUTTON") { //點擊到按鈕的HTML標籤位置，執行以下code
    searchText.value = ''; //搜尋欄位清空

    //加屬性active，可使按鈕背景常亮
    document.querySelectorAll(".btn").forEach(function (item, index) {
      item.classList.remove("active");
    });
    e.target.classList.add("active");


    if (e.target.dataset.type !== "all") { //點擊「全部」之外的按鈕，篩選出相對應的種類資料
      let type = e.target.dataset.type;
      filterData = newData.filter((item) => { return item.種類代碼 === type });
      console.log(e.target.dataset.type)
      renderData(filterData)
    } else { //點擊「全部」按鈕，重新渲染全部資料
      console.log('全部種類')
      renderData(newData)
    }
  }
})


