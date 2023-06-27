let all_rows;
///it's try//
var lastPage = 1;

function getPagination(table, pageNumber) {
console.log('table', table);

var tableBodyElement = $(table);
console.log('tableBodyElement', tableBodyElement);

var currentPage = pageNumber;
console.log("getPaging function called!!!!");

initializePagination(tableBodyElement);
}

function fetchTableData(currentPage, maxRows, tableBodyElement) {
//var apiUrl = ;
// Send a request  to the API to fetch the data for the specified page and page size

$.ajax({
    url: "http://localhost:3000/audit_child",
    method: "POST",
    data: {
      page_number: currentPage,
      page_size: maxRows//$('#maxRows')[0].options[$('#maxRows')[0].selectedIndex].value //pageSize
    },
    success: function(response) {
      var data = response.answer.answer; // Assuming the API response contains the data in the 'data' property
      var message=response.answer.allPages  // total number of page 
      console.log("response pagination", data);

      console.log(message.total_rows);
      all_rows=message.total_rows
      console.log(all_rows)
      // Update the table with the fetched data
      
      $(tableBodyElement).html(""); // Clear the table body

      for (var i = 0; i < data.length; i++) {
        var row = data[i];
        var html = "<tr>";
        html += "<td>" + row.asset_reg_id + "</td>";
                html += "<td>" + row.asset_code + "</td>";
                html += "<td>" + row.system_details + "</td>";
                html += "<td>" + row.physical_quantity + "</td>";
                html += "<td>" + row.remarks + "</td>";
        html += "</tr>";
        $(tableBodyElement).append(html);
      }
    },
    error: function(error) {
      console.error("Error fetching table data:", error);
    }
  });
}(currentPage);

function initializePagination(tableBodyElement) {
$('#maxRows').on('change', function(evt) {
  lastPage = 1;
  $('.pagination')
    .find('li')
    .slice(1, -1)
    .remove();
  var trnum = 0; // reset tr counter
  var maxRows = parseInt($('#maxRows')[0].options[$('#maxRows')[0].selectedIndex].value);
  console.log("maxRows", maxRows);
  if (maxRows == 500) {
    $('.pagination').hide();
    console.log('pagination hide!!!');
  } else {
    $('.pagination').show();
    console.log('pagination show!!!');
  }


  console.log("Total row", all_rows);

  $(tableBodyElement)
    .find('tr')
    .each(function() {
      trnum++;
      if (trnum > maxRows) {
        $(this).hide();
      }
      if (trnum <= maxRows) {
        $(this).show();
      }
    });

  if (all_rows > maxRows) {
    var pagenum = Math.ceil(all_rows / maxRows);
    console.log("No of page", pagenum)
    for (var i = 1; i <= pagenum; ) {
      $('.pagination #prev')
        .before(
          '<li data-page="' +
            i + 
            '">\
            <span>' +
            i +
            '</span>\
          </li>'
        )
        .show();
      i++;
    }
  }
      
  fetchTableData(1, parseInt($('#maxRows')[0].options[$('#maxRows')[0].selectedIndex].value), tableBodyElement); // Fetch initial table data for the first page and page size of 50

  $('.pagination [data-page="1"]').addClass('active');
  $('.pagination li').on('click', function(evt) {
    evt.stopImmediatePropagation();
    evt.preventDefault();
    var pageNum = $(this).attr('data-page');
    var maxRows = parseInt($('#maxRows').val());

    if (pageNum == 'prev') {
      if (lastPage == 1) {
        return;
      }
      pageNum = --lastPage;
    }
    if (pageNum == 'next') {
      if (lastPage == $('.pagination li').length - 2) {
        return;
      }
      pageNum = ++lastPage;
    }

    lastPage = pageNum;
    var trIndex = 0;
    $('.pagination li').removeClass('active');
    $('.pagination [data-page="' + lastPage + '"]').addClass('active');
    limitPagging();

    fetchTableData(lastPage, maxRows, tableBodyElement);
  });
  limitPagging();
})
.val(parseInt($('#maxRows')[0].options[$('#maxRows')[0].selectedIndex].value))
// .val(50)
.change();
}


function limitPagging() {
if ($('.pagination li').length > 7) {
  if ($('.pagination li.active').attr('data-page') <= 3) {
    $('.pagination li:gt(5)').hide();
    $('.pagination li:lt(5)').show();
    $('.pagination [data-page="next"]').show();
  }
  if ($('.pagination li.active').attr('data-page') > 3) {
    $('.pagination li').hide();
    $('.pagination [data-page="next"]').show();
    var currentPage = parseInt($('.pagination li.active').attr('data-page'));
    for (var i = currentPage - 2; i <= currentPage + 2; i++) {
      $('.pagination [data-page="' + i + '"]').show();
    }
  }
}
}

$('.pagination-container').on('click', 'li[data-page]', function(evt) {
evt.stopImmediatePropagation();
evt.preventDefault();
var pageNum = $(this).attr('data-page');
var maxRows = parseInt($('#maxRows').val());

if (pageNum == 'prev') {
  if (lastPage == 1) {
    return;
  }
  pageNum = --lastPage;
}
if (pageNum == 'next') {
  if (lastPage == $('.pagination li').length - 2) {
    return;
  }
  pageNum = ++lastPage;
}

lastPage = pageNum;
var trIndex = 0;
$('.pagination li').removeClass('active');
$('.pagination [data-page="' + lastPage + '"]').addClass('active');
limitPagging();

fetchTableData(lastPage, maxRows, tableBodyElement);
})









pp.post('/Advancesearch',(req,res)=>{
  let total_rows;
let page_size = req.body.page_size;
let answer;

let page_number = req.body.page_number;
let c = 1;
  const {
      asset_id,
      asset_type,
      asset_name,
      dept_name,
      emp_name,
      emp_no,
      location_name,
    } = req.query;
  
    // Construct the WHERE condition dynamically based on the provided options
    const whereCondition = [];
    const parameters = [];
  
    // Check each option and add it to the WHERE condition if it is provided
    if (asset_id) {
      whereCondition.push('asset_id = ?');
      parameters.push(asset_id);
    }
    if (asset_type) {
      whereCondition.push('asset_type = ?');
      parameters.push(asset_type);
    }
    if (asset_name) {
      whereCondition.push('asset_name = ?');
      parameters.push(asset_name);
    }
    if (dept_name) {
      whereCondition.push('dept_name = ?');
      parameters.push(dept_name);
    }
    if (emp_name) {
      whereCondition.push('emp_name = ?');
      parameters.push(emp_name);
    }
    if (emp_no) {
      whereCondition.push('emp_no = ?');
      parameters.push(emp_no);
    }
    if (location_name) {
      whereCondition.push('location_name = ?');
      parameters.push(location_name);
    }
  
    // Execute the SQL query with the constructed WHERE condition
    const query = `
      SELECT *
      FROM (
        SELECT
          a.asset_id,
          a.asset_type,
          a.asset_name,
          d.dept_name,
          CONCAT(e.first_name, ' ', e.middle_name, ' ', e.last_name) AS emp_name,
          e.emp_no,
          l.location_name,
          ROW_NUMBER() OVER (ORDER BY a.asset_id) AS RowNum
        FROM
          asset.dbo.assets a
          INNER JOIN department d ON d.dept_id = a.dept_id
          INNER JOIN Employees e ON e.emp_no = a.emp_no
          INNER JOIN location l ON l.location_id = a.location_id 
        ${whereCondition.length > 0 ? 'WHERE ' + whereCondition.join(' AND ') : ''}
      ) AS SubQuery
      WHERE RowNum BETWEEN ((@page_number - 1) * @page_size + 1) AND (@page_number * @page_size)
      AND RowNum <= @total_rows;`
  
 const query1=  `SELECT COUNT(*) AS TotalRows
    FROM (
      SELECT
        a.asset_id,
        a.asset_type,
        a.asset_name,
        d.dept_name,
        CONCAT(e.first_name, ' ', e.middle_name, ' ', e.last_name) AS emp_name,
        e.emp_no,
        l.location_name
      FROM
        asset.dbo.assets a
        INNER JOIN department d ON d.dept_id = a.dept_id
        INNER JOIN Employees e ON e.emp_no = a.emp_no
        INNER JOIN location l ON l.location_id = a.location_id 
      ${whereCondition.length > 0 ? 'WHERE ' + whereCondition.join(' AND ') : ''}
    ) AS CountQuery;
    `

    mssql.query(query,(err,result)=>{ 

      if(err) throw err;

    

      mssql.query(query1,(err,result1)=>{ })
          if(err) throw err;
          
 })
res.send('done')    })
















// iujhgffkljdklj






