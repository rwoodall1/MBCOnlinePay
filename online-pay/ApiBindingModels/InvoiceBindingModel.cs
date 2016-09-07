using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiBindingModels {
    public class InvoiceInitBindingModel
    {
        public List<InvoiceIconLookupBindingModel> Icons { get; set; }
        public List<InvoiceGradeLookupBindingModel> Grades { get; set; }
        public List<InvoiceTeacherLookupBindingModel> Teachers { get; set; }

        public string SchCode { get; set; }
        public string Invno { get; set; }
        public string BasicOnly { get; set; }
        public decimal BasicInvAmt { get; set; }
        public string InkPers { get; set; }
        public decimal InkPersAmt { get; set; }
        public string FoilPers { get; set; }
        public decimal FoilPersAmt { get; set; }
        public string IconAmt { get; set; }
        public string PicPers { get; set; }
        public decimal PicPersAmt { get; set; }
        public decimal FoilTxtAmt { get; set; }
        public string FoilTxt { get; set; }
        public string InkText { get; set; }
        public decimal InkTextAmt { get; set; }
        public string LuvLines { get; set; }
        public decimal LuvLineAmt { get; set; }
        public string AdLine { get; set; }
        public decimal FullAdlineAmt { get; set; }
        public decimal HalfAdlineAmt { get; set; }
        public decimal QuaterAdlineAmt { get; set; }
        public decimal EightAdlineAmt { get; set; }
        public string OnlineCuto { get; set; }
        public string schoolname { get; set; }
    }

    public class InvoiceGradeLookupBindingModel {
        public string schcode { get; set; }
        public string grade { get; set; }
        public string id { get; set; }
    }
    public class SchoolExist
    {
        public string Schname { get; set; }
        public string Schcode { get; set; }
    }
    public class InvoiceSchoolNameBindingModel
    {
         public string schcode { get; set; }
         public string invno { get; set; }
         public string basiconly { get; set; } 
         public string basicinvamt { get; set; }
         public string inkpers { get; set; }
         public string inkpersamt { get; set; } 
         public string foilpers { get; set; } 
         public string foilpersamt { get; set; }
         public string iconamt { get; set; } 
         public string picpers { get; set; } 
         public string picpersamt { get; set; }
         public string foiltxtamt { get; set; } 
         public string foiltxt { get; set; } 
         public string inktxt { get; set; }
         public string inktxtamt { get; set; } 
         public string luvlines { get; set; } 
         public string luvlineamt { get; set; } 
         public string adline { get; set; } 
         public string fulladlineamt { get; set; } 
         public string halfadlineamt { get; set; } 
         public string quarteradlineamt { get; set; } 
         public string eighthadlineamt { get; set; } 
         public string onlinecuto { get; set; }
         public string schoolname { get; set; }
    }

    public class InvoiceIconLookupBindingModel
    {
        public string id { get; set; }
        public string cvalue { get; set; }
        public string isortorder { get; set; }
        public string caption { get; set; }
        public string ivalue { get; set; }
        public string csortorder { get; set; }
    }

    public class InvoiceTeacherLookupBindingModel{
        public string schcode { get; set; }
        public string invno { get; set; }
        public string teacher { get; set; }
        public string id { get; set; }
    }
}
