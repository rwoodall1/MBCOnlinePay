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
using Exceptionless.Models;
namespace Webapp.Controllers.API {
    [RoutePrefix("api/invoice")]
    public class InvoiceController : BaseApiController {
        [HttpPost]
        [Route("login")]
        public async Task<IHttpActionResult> Login(Credentials cred)
        {
            var processingResult = new ServiceProcessingResult<LoginReturn> { IsSuccessful = true };
            

            try
            {
                var sqlQuery = "SELECT schcode,schname,invno FROM InvoiceInfo WHERE Schcode=@Schcode AND Invno=@Invno";
                MySqlParameter[] parameters = new MySqlParameter[] { new MySqlParameter("@Invno",cred.password), new MySqlParameter("@Schcode", cred.schcode)};
                var sqlQueryService = new SQLQuery();
                var getLoginResult = await sqlQueryService.ExecuteReaderAsync<LoginReturn>(CommandType.Text, sqlQuery, parameters);
                if (!getLoginResult.IsSuccessful)
                {
                    processingResult.IsSuccessful = false;
                    processingResult.Error = new ProcessingError("Failed to login.", "Failed to login.", true, false);
                    ExceptionlessClient.Default.CreateLog(typeof(InvoiceController).FullName, "Login failed", "Error").AddObject(cred).AddTags("Controller Error").Submit();
                    return Ok(processingResult);
                }
                var retval = (List<LoginReturn>)getLoginResult.Data;
                if (retval == null)
                {
                    processingResult.IsSuccessful = false;
                    processingResult.Error = new ProcessingError("Improper Credeintials.", "Improper Credentials.", true, false);
                    return Ok(processingResult);
                }
                if (retval.Count==1) {
                    processingResult.Data =retval[0]; }
                else {
                    processingResult.IsSuccessful = false;
                    processingResult.Error = new ProcessingError("Improper Credeintials.", "Improper Credentials.", true, false);
                }
                return Ok(processingResult);

            }
            catch (Exception ex)
            {
                processingResult.IsSuccessful = false;
                processingResult.Error = new ProcessingError("Failed to login.", "Failed to login.", true, false);
                ex.ToExceptionless()
                    .SetMessage("Login Failed")
                    .Submit();
                return Ok(processingResult);
            }

        }
        [HttpGet]
        [Route("invoiceCodeExist")]
        public async Task<IHttpActionResult> InvoiceCodeExist(string invNumber) {
            var processingResult = new ServiceProcessingResult<bool> { IsSuccessful = true };
            
            try {
                var sqlQuery = "SELECT Invno FROM InvoiceInfo WHERE Invno=@InvNumber";
                MySqlParameter[] parameters = new MySqlParameter[] { new MySqlParameter("@InvNumber", invNumber) };
                var sqlQueryService = new SQLQuery();
                var getInoviceCodeResult = await sqlQueryService.ExecuteReaderAsync(CommandType.Text, sqlQuery, parameters);
                if (!getInoviceCodeResult.IsSuccessful){
                    processingResult.IsSuccessful = false;
                    processingResult.Error = new ProcessingError("Error getting invoice code", "Error getting invoice code", true, false);
                    return Ok(processingResult);
                }

                if (getInoviceCodeResult.Data.Rows.Count > 0) { processingResult.Data = true; } else { processingResult.Data = false; }

            } catch (Exception ex) {
                ex.ToExceptionless().Submit();
            }
            return Ok(processingResult);
        }


        [HttpGet]
        [Route("invoiceInit")]
        public async Task<IHttpActionResult> InvoiceInit (string invNumber)
        {
            var processingResult = new ServiceProcessingResult<InvoiceInitBindingModel> { IsSuccessful = true };
            try
            {
                //var sqlQuery = @"SELECT I.schcode, I.invno, D.teacher, D.id FROM invoiceinfo I LEFT JOIN dropdowninfo D ON I.schcode=D.schcode  WHERE I.invno=@InvNumber ORDER BY D.teacher";
                var sqlQuery = @"SELECT I.schcode, I.invno, D.teacher, D.id FROM invoiceinfo I INNER JOIN dropdowninfo D ON I.schcode=D.schcode  WHERE I.invno=@InvNumber ORDER BY D.teacher";
                MySqlParameter[] parameters = new MySqlParameter[] { new MySqlParameter("@InvNumber", invNumber) };
                var sqlQueryService = new SQLQuery();
                var getInvoiceTeacherLookupResult = await sqlQueryService.ExecuteReaderAsync<InvoiceTeacherLookupBindingModel>(CommandType.Text, sqlQuery, parameters);
                if (!getInvoiceTeacherLookupResult.IsSuccessful)
                {
                    processingResult.IsSuccessful = false;
                    processingResult.Error = new ProcessingError("Error getting teachers", "Error getting teachers", true, false);
                    ExceptionlessClient.Default.SubmitLog("Error getting teachers");
                    return Ok(processingResult);
                }

                //sqlQuery = @"SELECT I.schcode, D.grade, D.id FROM invoiceinfo I LEFT JOIN dropdowninfo D ON I.schcode = D.schcode  WHERE I.invno=@InvNumber ORDER BY D.grade";
                sqlQuery = @"SELECT DISTINCT I.schcode, D.grade FROM invoiceinfo I INNER JOIN dropdowninfo D ON I.schcode = D.schcode  WHERE I.invno=@InvNumber ORDER BY D.grade";
                parameters = new MySqlParameter[] { new MySqlParameter("@InvNumber", invNumber) };
                var getInvoiceGradeLookupResult = await sqlQueryService.ExecuteReaderAsync<InvoiceGradeLookupBindingModel>(CommandType.Text, sqlQuery, parameters);
                if (!getInvoiceGradeLookupResult.IsSuccessful)
                {
                    processingResult.IsSuccessful = false;
                    processingResult.Error = new ProcessingError("Error getting grades", "Error getting grades", true, false);
                    ExceptionlessClient.Default.SubmitLog("Error getting grades");
                    return Ok(processingResult);
                }

                sqlQuery = @"SELECT id, cvalue, isortorder, caption, ivalue, csortorder FROM Lookup";
                var getInvoiceIconLookupResult = await sqlQueryService.ExecuteReaderAsync<InvoiceIconLookupBindingModel>(CommandType.Text, sqlQuery, parameters);
                if (!getInvoiceIconLookupResult.IsSuccessful)
                {
                    processingResult.IsSuccessful = false;
                    processingResult.Error = new ProcessingError("Error getting icons", "Error getting icons", true, false);
                    ExceptionlessClient.Default.SubmitLog("Error getting icons");
                    return Ok(processingResult);
                }

                sqlQuery = @"SELECT I.schname AS schoolname, I.* FROM invoiceinfo I WHERE I.invno=@InvNumber";
                parameters = new MySqlParameter[] { new MySqlParameter("@InvNumber", invNumber) };
                var getSchoolNameResult = await sqlQueryService.ExecuteReaderAsync<InvoiceSchoolNameBindingModel>(CommandType.Text, sqlQuery, parameters);
                if (!getSchoolNameResult.IsSuccessful)
                {
                    processingResult.IsSuccessful = false;
                    processingResult.Error = new ProcessingError("Error getting school name", "Error getting school name", true, false);
                    ExceptionlessClient.Default.SubmitLog("Error getting school name");
                    return Ok(processingResult);
                }


                processingResult.IsSuccessful = true;

                var invoiceInfoList = (List<InvoiceSchoolNameBindingModel>) getSchoolNameResult.Data;
                var invoiceInfo = invoiceInfoList[0];

                processingResult.Data = new InvoiceInitBindingModel();
                processingResult.Data.SchCode = invoiceInfo.schcode;
                processingResult.Data.Invno = invoiceInfo.invno;
                processingResult.Data.BasicOnly = invoiceInfo.basiconly;
                processingResult.Data.BasicInvAmt = Convert.ToDecimal(invoiceInfo.basicinvamt);
                processingResult.Data.InkPers = invoiceInfo.inkpers;
                processingResult.Data.InkPersAmt = Convert.ToDecimal(invoiceInfo.inkpersamt);
                processingResult.Data.FoilPers = invoiceInfo.foilpers;
                processingResult.Data.FoilPersAmt = Convert.ToDecimal(invoiceInfo.foilpersamt);
                processingResult.Data.IconAmt = invoiceInfo.iconamt;
                processingResult.Data.PicPers = invoiceInfo.picpers;
                processingResult.Data.PicPersAmt = Convert.ToDecimal(invoiceInfo.picpersamt);
                processingResult.Data.FoilTxtAmt = Convert.ToDecimal(invoiceInfo.foiltxtamt);
                processingResult.Data.FoilTxt = invoiceInfo.foiltxt;
                processingResult.Data.InkText = invoiceInfo.inktxt;
                processingResult.Data.InkTextAmt = Convert.ToDecimal(invoiceInfo.inktxtamt);
                processingResult.Data.LuvLines = invoiceInfo.luvlines;
                processingResult.Data.LuvLineAmt = Convert.ToDecimal(invoiceInfo.luvlineamt);
                processingResult.Data.AdLine = invoiceInfo.adline;
                processingResult.Data.FullAdlineAmt = Convert.ToDecimal(invoiceInfo.fulladlineamt);
                processingResult.Data.HalfAdlineAmt = Convert.ToDecimal(invoiceInfo.halfadlineamt);
                processingResult.Data.QuaterAdlineAmt = Convert.ToDecimal(invoiceInfo.quarteradlineamt);
                processingResult.Data.EightAdlineAmt = Convert.ToDecimal(invoiceInfo.eighthadlineamt);
                processingResult.Data.OnlineCuto = invoiceInfo.onlinecuto;
                processingResult.Data.schoolname = invoiceInfo.schoolname;


                processingResult.Data.Teachers = (List<InvoiceTeacherLookupBindingModel>) getInvoiceTeacherLookupResult.Data;
                processingResult.Data.Grades = (List<InvoiceGradeLookupBindingModel>) getInvoiceGradeLookupResult.Data;
                processingResult.Data.Icons = (List<InvoiceIconLookupBindingModel>) getInvoiceIconLookupResult.Data;

            }
            catch (Exception ex)
            {
                ex.ToExceptionless().Submit();
            }
            return Ok(processingResult);
        }

        [HttpGet]
        [Route("schoolExist")]
        public async Task<IHttpActionResult> SchoolExist(string schcode)
        {
            var processingResult = new ServiceProcessingResult<SchoolExist> { IsSuccessful = true };
            try
            {
                var sqlQuery = @"Select Schname,Schcode from Cust where Schcode=@Schcode";
                MySqlParameter[] parameters = new MySqlParameter[] { new MySqlParameter("@Schcode", schcode) };
                var sqlQueryService = new SQLQuery();
                var getSchoolResult = await sqlQueryService.ExecuteReaderAsync<SchoolExist>(CommandType.Text, sqlQuery, parameters);
                if (!getSchoolResult.IsSuccessful)
                {
                    processingResult.IsSuccessful = false;
                    processingResult.Error = new ProcessingError("Error looking up school.", "Error looking up school.", true, false);
                    ExceptionlessClient.Default.CreateLog("Error looking up school.")
                        .MarkAsCritical()
                        .AddObject(schcode);
                    return Ok(processingResult);
                }

                processingResult.IsSuccessful = true;

                var result = (List<SchoolExist>)getSchoolResult.Data;
                if (result == null)
                {
                    processingResult.Data = null;
                }
                else
                {
                    processingResult.Data = result[0];//only one record }

                }
            }
            catch (Exception ex)
            {
                ex.ToExceptionless()
                    .SetMessage("Error looing up school code.")
                    .Submit();
                processingResult.IsSuccessful = false;
                processingResult.Error = new ProcessingError("Error looking up school.", "Error looking up school.", true, false);
                return Ok(processingResult);

            }
            return Ok(processingResult);
        }
    }
    public class Credentials
    {
       public string password { get; set; }
      public string schcode { get; set; }
    }
    public class LoginReturn
    {
        public string schcode{ get; set; }
        public string schname { get; set; }
        public string invno { get; set; }
    }
}