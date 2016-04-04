using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Geo4Students.Models.Domain.Determinatietabellen
{
    [Serializable, Table("Voorwaarde")]
    public class Voorwaarde
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public virtual int VoorwaardeId { get; set; }

        public virtual string BaseValue { get; set; }
        public virtual string ComparingValue { get; set; }
        public virtual string Operator { get; set; }
        public virtual string Unit { get; set; }

        public override string ToString()
        {
            return BaseValue + " " + Operator + " " + ComparingValue + Unit;
        }
    }
}