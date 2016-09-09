using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
namespace ApiBindingModels {

    public class TeacherData {
        public UInt32 Id { get; set; }
        [Required(ErrorMessage = "Teacher is required")]
        public string Teacher { get; set; }
        [Required(ErrorMessage = "Grade is required")]
        public string Grade { get; set; }
        [Required(ErrorMessage = "School Code is required")]
        public string Schcode { get; set; }
    }
    
}