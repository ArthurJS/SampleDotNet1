using System.Collections.Generic;
using Geo4Students.Models.Domain.Klimatogrammen;

namespace Geo4Students.Models.Domain.Determinatietabellen.Parameters
{
    public class Nz : Parameter
    {
        public override string Omschrijving
        {
            get { return "Wat is de som van de neerslag in de zomer?"; }
        }

        public override string Code
        {
            get { return "Nz"; }
        }

        public override List<string> Execute(Klimatogram klimatogram)
        {
            List<string> list = new List<string>();
            list.Add(klimatogram.SomNeerslagZomer.ToString());
            return list;
        }

        public override List<string> GeefMogelijkeAntwoorden(Klimatogram klimatogram)
        {
            return new List<string> {klimatogram.SomNeerslagWinter.ToString(), klimatogram.SomNeerslagZomer.ToString()};
        }
    }
}