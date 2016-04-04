using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Geo4Students.Models.Domain.Klimatogrammen;

namespace Geo4Students.Models.Domain.Determinatietabellen
{
    [Serializable, Table("DeterminatieComponent")]
    public abstract class DeterminatieComponent
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int ComponentId { get; set; }

        public virtual DeterminatieComponent Parent { get; set; }
        public abstract DeterminatieResultaat Determineer(Klimatogram klimatogram);
    }
}