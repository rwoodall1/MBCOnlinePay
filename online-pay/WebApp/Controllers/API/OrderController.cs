using Core;
using System;
using System.Threading.Tasks;
using System.Web.Http;
using System.Net.Http;
using System.Web;
using System.IO;
using System.Net;
using ApiBindingModels;
using Newtonsoft.Json;
using Utilities;
using System.Collections.Generic;
using System.Text;
using System.Xml;
using System.Configuration;
using System.Net.Http.Headers;
using Domain;
using Services;
using System.Data;
using System.Data.SqlClient;
using MySql.Data.MySqlClient;
using Exceptionless;
using System.Net.Http.Formatting;

namespace Webapp.Controllers.API {
    [RoutePrefix("api/order")]
    public class OrderController : BaseApiController {

        [HttpPost]
        [Route("checkout")]
        public async Task<IHttpActionResult> Checkout(CheckoutRequestBindingModel model) {
            var processingResult = new ServiceProcessingResult<int> { IsSuccessful = true };

            //GetOrderCode here
            var currentRow = 0;
            var OrderID = 0;

            //Get New Order Code Here
            var sqlText = @"
                SELECT value FROM sys
            ";

            var sqlQuery = new SQLQuery();
            var getOrderIDResult = await sqlQuery.ExecuteReaderAsync<GetOrderIDRequest>(CommandType.Text, sqlText);
            var orderidlist = (List<GetOrderIDRequest>)getOrderIDResult.Data;
            OrderID = Convert.ToInt32(orderidlist[0].value) + 1;

            MySqlParameter[] parameters = new MySqlParameter[] {
                new MySqlParameter("@value", OrderID),
            };
            sqlText = @"UPDATE sys SET value=@value";

            var updateOrderIDResult = await sqlQuery.ExecuteNonQueryAsync(CommandType.Text, sqlText, parameters);


            foreach (var row in model.Items) {
                currentRow += 1;
                try {
                    var pertext = "";
                    if (row.Data.PersonalizedText == "" || row.Data.PersonalizedText == null) {
                        pertext = "Not Available";
                    } else {
                        pertext = row.Data.PersonalizedText;
                    }

                    int? icon1 = null;
                    int? icon2 = null;
                    int? icon3 = null;
                    int? icon4 = null;

                    string josicon1 = null;
                    string josicon2 = null;
                    string josicon3 = null;
                    string josicon4 = null;

                    if (row.Data.Icon1 != null) { icon1 = Convert.ToInt32(row.Data.Icon1.Ivalue); josicon1 = row.Data.Icon1.Cvalue; }
                    if (row.Data.Icon2 != null) { icon2 = Convert.ToInt32(row.Data.Icon2.Ivalue); josicon2 = row.Data.Icon2.Cvalue; }
                    if (row.Data.Icon3 != null) { icon3 = Convert.ToInt32(row.Data.Icon3.Ivalue); josicon3 = row.Data.Icon3.Cvalue; }
                    if (row.Data.Icon4 != null) { icon4 = Convert.ToInt32(row.Data.Icon4.Ivalue); josicon4 = row.Data.Icon4.Cvalue; }

                    Decimal amount = 0;
                    Decimal total = 0;
                    try {
                        //switched
                        total = Convert.ToDecimal(row.Total) + Convert.ToDecimal(row.Data.IconAmt);
                        amount = Convert.ToDecimal(row.Price) + Convert.ToDecimal(row.Data.IconAmt);
                    } catch (Exception ex) { }


                    parameters = new MySqlParameter[] {
                    new MySqlParameter("@grade", row.Data.Grade),
                    new MySqlParameter("@booktype",row.Data.YearbookType),
                    new MySqlParameter("@teacher",row.Data.Teacher),
                    new MySqlParameter("@perstext",pertext),
                    new MySqlParameter("@studentfname",row.Data.StudentFirstName),
                    new MySqlParameter("@emailaddress",row.Data.Email),
                    new MySqlParameter("@schcode",row.Data.SchCode),
                    new MySqlParameter("@itemamount",amount),
                    new MySqlParameter("@itemqty",row.Quantity),
                    new MySqlParameter("@schinvoicenumber",row.Data.InvoiceNumber),
                    new MySqlParameter("@orderid",OrderID),
                    new MySqlParameter("@orddate",DateTime.Now),
                    new MySqlParameter("@paytype","CC"),
                    new MySqlParameter("@itemtotal",total),
                    new MySqlParameter("@studentlname",row.Data.StudentLastName),
                    new MySqlParameter("@schname",row.Data.SchoolName),
                    new MySqlParameter("@parentpayment",row.Data.ParentPayment),
                    new MySqlParameter("@yr",row.Data.Year.Substring(4-2)),
                    new MySqlParameter("@sname",row.Data.SchoolName),
                    new MySqlParameter {
                        ParameterName = "@icon1",
                        DbType = DbType.Int32,
                        Value = icon1
                    },
                    new MySqlParameter {
                        ParameterName = "@icon2",
                        DbType = DbType.Int32,
                        Value = icon2
                    },
                     new MySqlParameter {
                        ParameterName = "@icon3",
                        DbType = DbType.Int32,
                        Value = icon3
                    },
                    new MySqlParameter {
                        ParameterName = "@icon4",
                        DbType = DbType.Int32,
                        Value = icon4
                    },
                    new MySqlParameter {
                        ParameterName = "@josicon1",
                        Value = josicon1
                    },
                    new MySqlParameter {
                        ParameterName = "@josicon2",
                        Value = josicon2
                    },
                     new MySqlParameter {
                        ParameterName = "@josicon3",
                        Value = josicon3
                    },
                    new MySqlParameter {
                        ParameterName = "@josicon4",
                        Value = josicon4
                    }
                };

                    sqlText = @"
                    INSERT INTO TempOrders (
                        grade, booktype, teacher,
                        perstext1, studentfname,
                        emailaddress, schcode, itemamount,
                        itemqty, schinvoicenumber, orderid,
                        orddate, paytype, itemtotal,
                        studentlname, schname, parentpayment,
                        yr, sname,
                        icon1,icon2,icon3,icon4,
                        josicon1,josicon2,josicon3,josicon4
                    ) VALUES (
                        @grade, @booktype, @teacher,
                        @perstext, @studentfname,
                        @emailaddress, @schcode, @itemamount,
                        @itemqty, @schinvoicenumber, @orderid,
                        @orddate, @paytype, @itemtotal,
                        @studentlname, @schname, @parentpayment,
                        @yr, @sname,
                        @icon1,@icon2,@icon3,@icon4,
                        @josicon1,@josicon2,@josicon3,@josicon4
                    )
                ";

                    var saveOrderResult = await sqlQuery.ExecuteNonQueryAsync(CommandType.Text, sqlText, parameters);
                    if (!saveOrderResult.IsSuccessful) {
                        processingResult.IsSuccessful = false;
                        processingResult.Error = new ProcessingError("Error inserting temp order into database", "Error inserting temp order into database", false, false);

                        ExceptionlessClient.Default.SubmitLog("Error inserting row into temp orders table.", "Fatal");

                        return Ok(processingResult);
                    }

                } catch (Exception ex){

                }
               
            }

            processingResult.Data = OrderID;

            return Ok(processingResult);
        }
    }
}