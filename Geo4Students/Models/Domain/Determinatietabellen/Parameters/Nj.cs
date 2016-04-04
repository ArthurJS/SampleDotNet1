using System;
using System.Collections.Generic;
using System.Linq;
using Geo4Students.Models.Domain.Klimatogrammen;

namespace Geo4Students.Models.Domain.Determinatietabellen.Parameters
{
    public class Nj : Parameter
    {
        public override string Omschrijving
        {
            get { return ""; }
        }

        public override string Code
        {
            get { return "Nj"; }
        }

        public override List<string> Execute(Klimatogram klimatogram)
        {
            List<string> list = new List<string>();
            list.Add(klimatogram.Metingen.Sum(m => m.Neerslag).ToString());
            return list;
        }

        public override List<string> GeefMogelijkeAntwoorden(Klimatogram klimatogram)
        {
            return null;
        }
    }
}