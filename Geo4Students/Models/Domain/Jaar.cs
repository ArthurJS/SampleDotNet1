using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Geo4Students.Models.Domain.Determinatietabellen;
using Geo4Students.Models.Domain.Klimatogrammen;

namespace Geo4Students.Models.Domain
{
    [Table("Jaar")]
    public class Jaar
    {
        public Jaar()
        {
        }

        public Jaar(int leerJaar)
        {
            Leerjaar = leerJaar;
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Leerjaar { get; set; }

        public virtual List<Continent> Continenten { get; set; }

        public virtual Determinatietabel Determinatietabel { get; set; }
    }
}