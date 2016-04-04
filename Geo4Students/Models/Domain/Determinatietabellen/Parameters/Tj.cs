using System.Collections.Generic;
using System.Linq;
using Geo4Students.Models.Domain.Klimatogrammen;

namespace Geo4Students.Models.Domain.Determinatietabellen.Parameters
{
    public class Tj : Parameter
    {
        public override string Omschrijving
        {
            get { return ""; }
        }

        public override string Code
        {
            get { return "Tj"; }
        }

        public override List<string> Execute(Klimatogram klimatogram)
        {
            List<string> list = new List<string>();
            list.Add(klimatogram.Metingen.Average(m => m.Temperatuur).ToString());
            return list;
        }

        public override List<string> GeefMogelijkeAntwoorden(Klimatogram klimatogram)
        {
            return null;
        }
    }
} ;