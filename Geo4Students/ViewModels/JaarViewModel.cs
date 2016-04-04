using System.Collections.Generic;
using System.ComponentModel;

namespace Geo4Students.ViewModels
{
    public class JaarViewModel
    {
        public JaarViewModel()
        {
            SubjectList = new List<string>();
        }

        [DisplayName("Jaren")]
        public List<string> SubjectList { get; set; }

        public string SelectedJaar { get; set; }
    }
}