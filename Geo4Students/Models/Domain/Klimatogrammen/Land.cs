using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Geo4Students.Models.Domain.Klimatogrammen
{
    [Table("Land")]
    public class Land
    {
        public int LandId { get; set; }

        [StringLength(255)]
        public string Naam { get; set; }

        public virtual List<Klimatogram> Klimatogrammen { get; set; }
    }
}