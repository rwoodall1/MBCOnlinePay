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
    [RoutePrefix("api/teacher")]
    public class TeacherController : BaseApiController {

        [HttpGet]
        [Route("getAllTeachers")]
        public async Task<IHttpActionResult> GetAllTeachers(string schcode) {
            var processingResult = new ServiceProcessingResult<List<TeacherData>> { IsSuccessful = true };

            var sqlQuery = new SQLQuery();
            var sqlText="Select Teacher,Grade,Schcode,Id from DropDownInfo Where Schcode=@Schcode Order By Teacher";
          MySqlParameter[] parameters = new MySqlParameter[] {
                new MySqlParameter("@Schcode",schcode),
            };
            var getTeacherResult = await sqlQuery.ExecuteReaderAsync<TeacherData>(CommandType.Text, sqlText,parameters);
            if (!getTeacherResult.IsSuccessful)
            {
                processingResult.IsSuccessful = false;
                processingResult.Error = new ProcessingError("Failed to retrieve teachers.", "Failed to retrieve teachers.", true, false);
                ExceptionlessClient.Default.CreateLog("Failed to retrieve teachers.", "Error").AddObject(schcode).Submit();
                return Ok(processingResult);
            }
            var teacherList = (List<TeacherData>)getTeacherResult.Data;
            processingResult.Data = teacherList;
            return Ok(processingResult);

        }
        [HttpPost]
        [Route("addTeacher")]
        public async Task<IHttpActionResult> AddTeacher(TeacherData model)
        {
            var processingResult = new ServiceProcessingResult<bool> { IsSuccessful = true };
            var parameters = new MySqlParameter[] {
                    new MySqlParameter("@Schcode",model.Schcode),
                     new MySqlParameter("@Teacher",model.Teacher),
                      new MySqlParameter("@Grade",model.Grade)
            };
            var sqlText = @"
               Insert Into DropDownInfo (Schcode,Teacher,Grade) VALUES(@Schcode,@Teacher,@Grade)
              ";

            var sqlQuery = new SQLQuery();
            var Result = await sqlQuery.ExecuteNonQueryAsync(CommandType.Text, sqlText,parameters);
            if (!Result.IsSuccessful)
            {
                processingResult.IsSuccessful = false;
                processingResult.Error = new ProcessingError("Error inserting teacher.", "Error inserting teacher.", true, false);
                return Ok(processingResult);
            }
            if (Result.Data < 1)
            {
                processingResult.IsSuccessful = false;
                processingResult.Error = new ProcessingError("Error inserting teacher.", "Error inserting teacher.", true, false);
                return Ok(processingResult);
            }
            
            processingResult.Data = true;
            return Ok(processingResult);

        }
        [HttpGet]
        [Route("deleteTeacher")]
        public async Task<IHttpActionResult> DeleteTeacher(string id)
        {
            var processingResult = new ServiceProcessingResult<bool> { IsSuccessful = true };
            var parameters = new MySqlParameter[] {
                    new MySqlParameter("@Id",id),
                       };
            var sqlText = @"
               Delete From DropDownInfo Where Id=@Id
              ";

            var sqlQuery = new SQLQuery();
            var Result = await sqlQuery.ExecuteNonQueryAsync(CommandType.Text, sqlText, parameters);
            if (!Result.IsSuccessful)
            {
                processingResult.IsSuccessful = false;
                processingResult.Error = new ProcessingError("Error deleting teacher.", "Error deleting teacher.", true, false);
                return Ok(processingResult);
            }
            if (Result.Data < 1)
            {
                processingResult.IsSuccessful = false;
                processingResult.Error = new ProcessingError("Error deleting teacher.", "Error deleting teacher.", true, false);
                return Ok(processingResult);
            }

            processingResult.Data = true;
            return Ok(processingResult);

        }
        //nothing below
    }
}