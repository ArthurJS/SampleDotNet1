using System;
using System.ComponentModel.DataAnnotations.Schema;
using Geo4Students.Models.Domain.Klimatogrammen;

namespace Geo4Students.Models.Domain.Determinatietabellen
{
    [Serializable, Table("Determinatietabel")]
    public class Determinatietabel
    {
        public int DeterminatieTabelId { get; set; }
        public string Naam { get; set; }
        public virtual DeterminatieVoorwaarde Component { get; set; }

        public DeterminatieResultaat Determineer(Klimatogram klimatogram)
        {
            return Component.Determineer(klimatogram);
        }
    }
}