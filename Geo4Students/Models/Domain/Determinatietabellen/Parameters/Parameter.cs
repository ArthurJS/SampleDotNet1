using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Geo4Students.Models.Domain.Klimatogrammen;

namespace Geo4Students.Models.Domain.Determinatietabellen.Parameters
{
    [NotMapped]
    public abstract class Parameter
    {
        public abstract string Omschrijving { get; }
        public abstract string Code { get; }
        public string Unit { get; set; }
        public abstract List<string> Execute(Klimatogram klimatogram);
        public abstract List<string> GeefMogelijkeAntwoorden(Klimatogram klimatogram);
    }
}