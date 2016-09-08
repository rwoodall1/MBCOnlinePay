using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
namespace ApiBindingModels {

    

    public class GetOrderIDRequest {
        public string value { get; set; }
    }
    public class OrderData
    {
      public string Teacher { get; set; }
        public decimal ItemAmount { get; set; }
        public UInt32 Itemqty { get; set; }
        public UInt32 OrderId { get; set; }
        public DateTime OrdDate { get; set; }
        public string Grade { get; set; }
        public string Studentfname { get; set; }
        public string studentlname { get; set; }
        public decimal Itemtotal { get; set; }
        public string Booktype { get; set; }
        public string Emailaddress { get; set; }
        public string Perstext1 { get; set; }
        public string Paytype { get; set; }
        public string Schname { get; set; }
        public string Transid { get; set; }
        public string Icon1 { get; set; }
        public string Icon2 { get; set; }
        public string Icon3 { get; set; }
        public string Icon4 { get; set; }

    }
        public class CheckoutRequestBindingModel {
        public ICollection<CheckoutListRequestBindingModel> Items { get; set; }
        public string Shipping { get; set; }
        public string SubTotal { get; set; }
        public string Tax { get; set; }
        public string TaxRate { get; set; }
        public string TotalCost { get; set; }
    }

    public class CheckoutListRequestBindingModel {
        public CheckoutListData Data { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public string Price { get; set; }
        public string Quantity { get; set; }
        public string Total { get; set; }
    }
    public class Icon {
        public string Caption { get; set; }
        public string Csortorder { get; set; }
        public string Cvalue { get; set; }
        public string Id { get; set; }
        public string Isortorder { get; set; }
        public string Ivalue { get; set; }
    }
    public class CheckoutListData {
        public string Email { get; set; }
        public string Grade { get; set; }
        public Icon Icon1 { get; set; }
        public Icon Icon2 { get; set; }
        public Icon Icon3 { get; set; }
        public Icon Icon4 { get; set; }

        public string IconAmt { get; set; }

        public string SchCode { get; set; }
        [StringLength(29,ErrorMessage ="Maximum number of characters for personalized text is29.")]
        public string PersonalizedText { get; set; }
        public string InvoiceNumber { get; set; }
        public string SchoolName { get; set; }
        public bool ParentPayment { get; set; }
        public string Year { get; set; }

        public string StudentFirstName { get; set; }
        public string StudentLastName { get; set; }
        public string Teacher { get; set; }
        public string YearbookQuantity { get; set; }
        public string YearbookType { get; set; }
    }
}