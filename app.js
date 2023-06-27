const express = require('express');
const cors = require('cors');
const mssql = require('mssql');




const app = express();
const port = 3000;

app.use(express.urlencoded({extended : true}));
app.use(
    cors({
        origin : '*',
        methods : ['GET', 'POST', 'PUT', 'DELETE'],
        allowHeaders : ['Content-Type']
    })
)



const sqlConfig = {
    server : '10.0.2.18',
    user : 'SA',
    password : 'Soulsvciot01',
    database : 'asset',
    options : {
        encrypt : false,
        trustServerCertificate : false
    }
}


app.get('/audit_parent',(req,res)=>{
    
        let total_rows;
        let page_size = 1;
        let answer;
       
        let page_number = 2;
        let c = 1;
      
        let query1 =`select count(*) as TotalRows from asset.dbo.AuditDetails`;
      
        let query = `select * from(select Locationid,EmployeeNo ,StartDate ,EndDate ,AuditorName,CreatedOn,CreatedBy,LastUpdatedOn,LastUpdatedBy,LastDeletedOn,LastDeletedBy,ScheduledStartDate,ScheduledEndDate,ActualStartDate,ActualEndDate,ROW_NUMBER() OVER (ORDER BY ID) AS RowNum
         from asset.dbo.AuditDetails)AS SubQuery
        WHERE RowNum BETWEEN ((@page_number - 1) * @page_size + 1) AND (@page_number * @page_size)
        AND RowNum <= @total_rows;
    
        SELECT @total_rows AS TotalRows     
         
    `;
      
        let request1 = new mssql.Request();
      
        request1.query(query1, (err, result1) => {
          if (err) {
            console.log('Error in total rows of assets query:', err);
            res.sendStatus(500);
            return;
          }
          console.log(result1)
          total_rows = result1.recordset[0].TotalRows;
          console.log('Total Rows:', total_rows);
      
          let request2 = new  mssql.Request();
          request2.input('total_rows', mssql.Int, total_rows);
          request2.input('page_size',  mssql.Int, page_size);
          request2.input('page_number',  mssql.Int, page_number);
          request2.input('c',  mssql.Int, c);
      
          request2.query(query, (err, result) => {
            if (err) {
              console.log('Error in audit assets query:', err);
              res.sendStatus(500);
              return;
            }
            console.log(result)
            const data = result.recordset;
            // const totalPages = Math.ceil(total_rows / page_size)
            const allPages={total_rows}
            answer = {
              answer: data,
              allPages: allPages
            };
            res.send({ answer: answer });
          });
        });
     
})



app.get('/audit_child',(req,res)=>{
    
  let total_rows;
  let page_size = 1;
  let answer;
 
  let page_number = 2;
  let c = 1;

  let query1 =`select count(*) as TotalRows from asset.dbo.AssetAuditDetails`;

  let query = `select * from(select AuditId,AssetSerialId ,CreatedOn ,CreatedBy ,LastUpdatedBy,LastDeletedOn,LastDeletedBy,ROW_NUMBER() OVER (ORDER BY ID) AS RowNum
   from asset.dbo.AssetAuditDetails)AS SubQuery
  WHERE RowNum BETWEEN ((@page_number - 1) * @page_size + 1) AND (@page_number * @page_size)
  AND RowNum <= @total_rows;

  SELECT @total_rows AS TotalRows     
   
`;

  let request1 = new mssql.Request();

  request1.query(query1, (err, result1) => {
    if (err) {
      console.log('Error in total rows of assets query:', err);
      res.sendStatus(500);
      return;
    }
    console.log(result1)
    total_rows = result1.recordset[0].TotalRows;
    console.log('Total Rows:', total_rows);

    let request2 = new  mssql.Request();
    request2.input('total_rows', mssql.Int, total_rows);
    request2.input('page_size',  mssql.Int, page_size);
    request2.input('page_number',  mssql.Int, page_number);
    request2.input('c',  mssql.Int, c);

    request2.query(query, (err, result) => {
      if (err) {
        console.log('Error in audit assets query:', err);
        res.sendStatus(500);
        return;
      }
      console.log(result)
      const data = result.recordset;
      // const totalPages = Math.ceil(total_rows / page_size)
      const allPages={total_rows}
      answer = {
        answer: data,
        allPages: allPages
      };
      res.send({ answer: answer });
    });
  });

})






mssql.connect(sqlConfig, (err, result)=>{
    if(err) throw err
    else{
        console.log('Connected to DB');
    }
})

app.listen(port, ()=>{
    console.log('listening to port : ' + port);
}).on('error', (err)=>{
    console.log('Error occurred : ' + err.messsage);
})
